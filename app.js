import * as bezier from "./bezier.js";

var canvas = document.getElementById("canvas");
fitToContainer(canvas);
var ctx = canvas.getContext("2d");

function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='100%';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

function DrawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.w, 0, 2 * Math.PI);
    ctx.stroke();
}

var Points = [];
var A = new Point(150, 400, 2);
Points.push(A);
var B = new Point(200, 200, 2);
Points.push(B);
var C = new Point(400, 200, 2);
Points.push(C);
var D = new Point(450, 400, 2);
Points.push(D);
var E = new Point(500, 450, 2);
Points.push(E);

Points.forEach(point => DrawPoint(point));
bezier.DrawBezier(Points, ctx);