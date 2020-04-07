import * as bezier from "./bezier.js";

var canvas = document.getElementById("canvas");
fitToContainer(canvas);
var ctx = canvas.getContext("2d");

var Points = [];

function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

var playerHead = new Point(300,300,3);
var velocity = 1.5;
var snakeLength = 4;
var collectedPoints = [];
collectedPoints.push(playerHead);

var start = true;

var mouseX = 0;
var mouseY = 0;
 
canvas.addEventListener("mousemove", setMousePosition, false);

var canvasPos = getPosition(canvas);
function setMousePosition(e) {
    mouseX = e.clientX - canvasPos.x;
    mouseY = e.clientY - canvasPos.y;
}

function intersect() {
    var new_Points = [];
    var hit_apple = false;
    for(var i = 0; i<Points.length; i++) {
        var playerToPoint = new Point(Points[i].x - playerHead.x, Points[i].y - playerHead.y);
        if(getLength(playerToPoint) <= Points[i].w + playerHead.w) {
            collectedPoints.push(Points[i]);
            if(Points[i].apple != undefined) {
                Points[i].apple = undefined;
                snakeLength++;
                hit_apple = true;
            } 
            if(collectedPoints.length > snakeLength) {
                new_Points.push(collectedPoints[0]);
                collectedPoints.shift();
            }
        } else {
            new_Points.push(Points[i]);
        }
    }
    if(hit_apple) {
        pickApple(new_Points);
    }
    Points = new_Points;
}

function pickApple(points) {
    var randomPoint = points[Math.floor(Math.random()*points.length)];
    if(randomPoint != undefined) {
        randomPoint.apple = true;
    }
}

function init() {
    //generate random points
    for(var i=0; i<64; i++) {
        Math.random();
        var P = new Point(Math.random()*canvas.width, Math.random()*canvas.height, 2);
        Points.push(P);
    }
    pickApple(Points);
    window.addEventListener("keypress", function (event){ 
        var key = event.key;
        if(key==='s'){ 
            start = !start;
            if(start) {
                window.requestAnimationFrame(draw);
            }
        }
      });
    if(start) {
        window.requestAnimationFrame(draw);
    }
    
}

function draw() {
    //move
    var playerToMouse = new Point(mouseX-playerHead.x, mouseY-playerHead.y);
    var length = getLength(playerToMouse);
    playerHead = new Point(playerHead.x + velocity*playerToMouse.x/length, playerHead.y + velocity*playerToMouse.y/length, playerHead.w);
    intersect();

    //draw
    ctx.fillStyle = '#FFFFFF';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    Points.forEach(point => DrawPoint(point));
    
    ctx.fillStyle = '#FF6A6A';
    DrawPoint(playerHead);

    ctx.fillStyle = '#006A6A';
    collectedPoints.forEach(point => DrawPoint(point));
    

    var points = [...collectedPoints];
    points.push(playerHead);
    var intersects = bezier.DrawBezier(points, ctx);
    if(intersects) {
        start = false;
        alert("You lose!");
    }
    if(start) {
        window.requestAnimationFrame(draw);
    }
}

function getLength(point) {
    return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
}

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

function DrawPoint(point) {
    if(point.apple != undefined) {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.w, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        return;
    } 
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.w, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function getPosition(el) {
    var xPosition = 0;
    var yPosition = 0;
   
    while (el) {
      xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return {
      x: xPosition,
      y: yPosition
    };
  } 

init();