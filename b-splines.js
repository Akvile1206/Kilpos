import * as geometry from "./geometry.js";
var k = 4;

function drawSpline(points, ctx) {
    var n = points.length - 1;
    var intersects = false;
    var lines=[];
    var head = points.pop();
    geometry.DrawLine(ctx, points[points.length - 1], head);
    var headLine = new geometry.Line(points[points.length - 1], head);
    if(n < 4) {
        for(var i=0; i<points.length-1; i++) {
            lines.push(new geometry.Line(points[i], points[i+1]));
            geometry.DrawLine(ctx, points[i], points[i+1]);
        }
        return geometry.atLeastOneLineIntersect(lines, headLine);
    }
    var knots = createKnot(k, n);
    var from = getPoint(points,knots,n,knots[k-1]);
    var to;
    for(var t = knots[k-1] + 0.05; t<=knots[n]; t+=0.05) {
        to = getPoint(points,knots,n,t);
        lines.push(new geometry.Line(from, to));
        geometry.DrawLine(ctx, from, to);
        from = to;
    }
    var lastPoint = points.pop();
    lines.push(new geometry.Line(from, lastPoint));
    geometry.DrawLine(ctx, from, lastPoint);
    return geometry.atLeastOneLineIntersect(lines, headLine);
}

function getPoint(points, knots, n, t) {
    var point = new geometry.Point(0,0,0);
    for(var i = 0; i<n; i++) {
        var weight = N(i+1, k, knots, t);
        point.x += weight*points[i].x;
        point.y += weight*points[i].y;
    }
    return point;
}

function N(i, k, knots, t) {
    if(k == 1) { //base case
        if(knots[i-1] <= t && t< knots[i]){
            return 1;
        } else {
            return 0; 
        }
    }
    var n1 = N(i, k - 1, knots, t);
    var divisor = (knots[i + k - 2] - knots[i-1]);
    var first;
    if(divisor == 0) {
        first = 0;
    } else {
        first = (t - knots[i-1]) / divisor;
    }

    var n2 = N(i+1, k-1, knots,t);
    divisor = (knots[i+k-1] - knots[i]);
    var second;
    if(divisor == 0) {
        second = 0;
    } else {
        second = (knots[i+k-1] - t) / divisor;
    }

    return n1*first + n2*second;
}

function createKnot(k, n) {
    var knot = [];
    for(var j = 0; j<k; j++) {
        knot.push(0);
    }
    var i = 1;
    for(i=1; i <= k+n-8; i++) {
        knot.push(i);
    }
    for(var j = 0; j<k; j++) {
        knot.push(i);
    }
    return knot;
}

export{drawSpline};