import * as bezier from "./bezier.js";

var canvas = document.getElementById("canvas");
fitToContainer(canvas);
var ctx = canvas.getContext("2d");
var scoreElement = document.getElementById("score");

function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

var Points = [];
var playerHead = new Point(300,300,3);
var playerDirection = new Point(1,0,1);
var score = 0;
var velocity = 0.7;
var snakeLength = 4;
var collectedPoints = [];
collectedPoints.push(playerHead);
var start = true;
var level = 1;

document.getElementById("restart").onclick = function() {
    restart();
} 

document.getElementById("level1").onclick = function() {
    if(level != 1) {
        level = 1;
        restart();
    }
} 

document.getElementById("level2").onclick = function() {
    if(level != 2) {
        level = 2;
        restart();
    }
} 

function intersect() {
    var new_Points = [];
    var hit_apple = false; 
    for(var i = 0; i<Points.length; i++) {
        //var playerToPoint = new Point(Points[i].x - playerHead.x, Points[i].y - playerHead.y);
        if(bezier.isClose(collectedPoints[collectedPoints.length-1], playerHead, Points[i], Points[i].w)) {
            collectedPoints.push(Points[i]);
            if(Points[i].apple != undefined) {
                Points[i].apple = undefined;
                snakeLength++;
                score++;
                hit_apple = true;
                scoreElement.innerHTML = "Score: "+score;
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

function rotatePLayerDir(angle) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    var x = cos*playerDirection.x - sin*playerDirection.y;
    var y = sin*playerDirection.x + cos*playerDirection.y; 
    playerDirection = new Point(x,y,1);
}

function restart() {
    Points = [];
    playerHead = new Point(300,300,3);
    playerDirection = new Point(1,0,1);
    score = 0;
    velocity = 0.7;
    snakeLength = 4;
    collectedPoints = [];
    collectedPoints.push(playerHead);
    for(var i=0; i<64; i++) {
        Math.random();
        var P = new Point(Math.random()*(canvas.width - 100) + 50, Math.random()*(canvas.height - 100) + 50, 2);
        Points.push(P);
    }
    pickApple(Points);
    if(!start) {
        start = true;
        window.requestAnimationFrame(draw);
    }
}

function init() {
    //generate random points
    for(var i=0; i<64; i++) {
        Math.random();
        var P = new Point(Math.random()*(canvas.width - 100) + 50, Math.random()*(canvas.height - 100) + 50, 2);
        Points.push(P);
    }
    pickApple(Points);
    window.addEventListener("keypress", function (event){ 
        var key = event.key;
        //console.log(key);
        if(key==='s' || key === 'S'){ 
            start = !start;
            if(start) {
                window.requestAnimationFrame(draw);
            }
        } else if (key === 'a' || key === 'A') { //left
            rotatePLayerDir(-Math.PI/25);
        } else if (key === 'd' || key === 'D') { //right
            rotatePLayerDir(Math.PI/25);
        }
      });
    window.requestAnimationFrame(draw);
}

function draw() {
    playerHead = new Point(playerHead.x + velocity*playerDirection.x, playerHead.y + velocity*playerDirection.y, playerHead.w);
    intersect();

    //draw
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#FFFFFF';
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    Points.forEach(point => DrawPoint(point));
    
    ctx.strokeStyle = '#00008b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playerHead.x, playerHead.y);
    ctx.lineTo(playerHead.x + 20*playerDirection.x, playerHead.y + 20*playerDirection.y);
    ctx.stroke();
    ctx.fillStyle = '#FF6A6A';
    DrawPoint(playerHead);

    ctx.fillStyle = '#006A6A';
    collectedPoints.forEach(point => DrawPoint(point));
    
    ctx.strokeStyle = '#000000';
    var points = [...collectedPoints];
    points.push(playerHead);
    ctx.lineWidth = 3;
    var intersects;
    switch (level) {
        case 1:
            intersects = bezier.DrawBezierInterpolating(points, ctx);
            break;
        case 2:
            intersects = bezier.DrawBezier(points,ctx);
            break;
    }
    if(intersects) {
        start = false;
        alert("self intersection!")
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