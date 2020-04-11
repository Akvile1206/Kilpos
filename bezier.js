import * as geometry from "./geometry.js";

//Overhauser's cubic:
function createOverhauser(A, B, C, D) {
    var OPoints=[];
    var P3 = new geometry.Point(C.x, C.y, C.w);
    OPoints.push(P3);
    var P2 = new geometry.Point(C.x - (D.x - B.x)/6.0, C.y - (D.y - B.y)/6.0, D.w);
    OPoints.push(P2);
    var P1 = new geometry.Point(B.x + (C.x - A.x)/6.0, B.y + (C.y - A.y)/6.0, A.w);
    OPoints.push(P1);
    var P0 = new geometry.Point(B.x, B.y, B.w);
    OPoints.push(P0);
    return OPoints;
}

function evaluatePointFunction(Points, t) {
    if (Points.length < 4) {
        throw "Four points are required for a cubic bezier!";
    }
    if(t<0) {
        return Points[0];
    } if (t>1) {
        return Points[3];
    }
    return new geometry.Point(
        Math.pow(1-t, 3)*Points[0].x + 3*t*Math.pow(1-t,2)*Points[1].x + 3*(1-t)*Math.pow(t,2)*Points[2].x + Math.pow(t,3)*Points[3].x,
        Math.pow(1-t, 3)*Points[0].y + 3*t*Math.pow(1-t,2)*Points[1].y + 3*(1-t)*Math.pow(t,2)*Points[2].y + Math.pow(t,3)*Points[3].y,
        1 
    )
}

function subdivide(P) {
    var Q = [];
    Q[0] = new geometry.Point(P[0].x, P[0].y);
    Q[1] = new geometry.Point(P[0].x*0.5 + P[1].x*0.5, P[0].y*0.5 + P[1].y*0.5);
    Q[2] = new geometry.Point(P[0].x*0.25 + P[1].x*0.5 + P[2].x*0.25, P[0].y*0.25 + P[1].y*0.5 + P[2].y*0.25);
    Q[3] = new geometry.Point(P[0].x*0.125 + P[1].x*0.375 + P[2].x*0.375 + P[3].x*0.125, P[0].y*0.125 + P[1].y*0.375 + P[2].y*0.375 + P[3].y*0.125);

    var R = [];
    R[3] = new geometry.Point(P[0].x*0.125 + P[1].x*0.375 + P[2].x*0.375 + P[3].x*0.125, P[0].y*0.125 + P[1].y*0.375 + P[2].y*0.375 + P[3].y*0.125);
    R[2] = new geometry.Point(P[1].x*0.25 + P[2].x*0.5 + P[3].x*0.25, P[1].y*0.25 + P[2].y*0.5 + P[3].y*0.25);
    R[1] = new geometry.Point(P[2].x*0.5 + P[3].x*0.5, P[2].y*0.5 + P[3].y*0.5);
    R[0] = new geometry.Point(P[3].x, P[3].y);
    
    return {left: Q, right: R};
}

function DrawCurveAndReturnLineArray(Points, ctx) {
    if(geometry.isClose(Points[0], Points[3], Points[1], 0.5) && geometry.isClose(Points[0], Points[3], Points[2], 0.5)) {
        geometry.DrawLine(ctx, Points[0], Points[3]);
        return [new geometry.Line(Points[0], Points[3])];
    } else {
        var subdivision = subdivide(Points);
        var toReturn = [];
        toReturn.push(...DrawCurveAndReturnLineArray(subdivision.left, ctx));
        toReturn.push(...DrawCurveAndReturnLineArray(subdivision.right, ctx));
        return toReturn;
    }
}

function DrawCurveAndCheckIntersection(Points, ctx, lines) {
    if(geometry.isClose(Points[0], Points[3], Points[1], 0.5) && geometry.isClose(Points[0], Points[3], Points[2], 0.5)) {
        geometry.DrawLine(ctx, Points[0], Points[3]);
        return geometry.atLeastOneLineIntersect(lines, new geometry.Line(Points[0], Points[3]));
    } else {
        var subdivision = subdivide(Points);
        if (DrawCurveAndCheckIntersection(subdivision.left, ctx, lines)) {
            DrawCurve(subdivision.right, ctx);
            return true;
        } else if (DrawCurveAndCheckIntersection(subdivision.right, ctx, lines)) {
            return true;
        }
    }
}

function DrawCurve(Points, ctx) {
    if(geometry.isClose(Points[0], Points[3], Points[1], 0.5) && geometry.isClose(Points[0], Points[3], Points[2], 0.5)) {
        geometry.DrawLine(ctx, Points[0], Points[3]);
    } else {
        var subdivision = subdivide(Points);
        DrawCurve(subdivision.left, ctx);
        DrawCurve(subdivision.right, ctx);
    }
}

function DrawBezier(Points, ctx) {
    var length = Points.length;
    var lines = [];
    if (Points.length <= 4) {
        var headLine = new geometry.Line(Points[length-2], Points[length-1]);
        geometry.DrawLine(ctx, Points[length-2], Points[length-1]);
        for(var i=0; i<length-2; i++) {
            lines.push(new geometry.Line(Points[i],Points[i+1]));
            geometry.DrawLine(ctx, Points[i], Points[i+1]);
        }
        return geometry.atLeastOneLineIntersect(lines, headLine);
    }
    if(length%2 == 1) {
        var headLine = new geometry.Line(Points[length-2], Points[length-1]);
        geometry.DrawLine(ctx, Points[length-2], Points[length-1]);
        lines = [headLine];
    } else {
        var lastBezierPoints = [Points[length - 3], geometry.reflect(Points[length - 3],Points[length - 4]), Points[length - 2], Points[length - 1]];
        lines = DrawCurveAndReturnLineArray(lastBezierPoints, ctx);
        length--;
    }
    var OPoints = [Points[0], Points[1], Points[2], Points[3]];
    var intersects = DrawCurveAndCheckIntersection(OPoints, ctx, lines)
    for(var i = 4; i < length - 1; i+=2) {
        var OPoints = [Points[i-1], geometry.reflect(Points[i-1],Points[i-2]), Points[i], Points[i+1]];
        if(DrawCurveAndCheckIntersection(OPoints, ctx, lines)) {
            intersects = true;
        }
    }
    return intersects;
}

function DrawBezierInterpolating(Points, ctx) {
    var length = Points.length;
    var lines = [];
    if (Points.length <= 4) {
        var headLine = new geometry.Line(Points[length-2], Points[length-1]);
        geometry.DrawLine(ctx, Points[length-2], Points[length-1]);
        for(var i=0; i<length-2; i++) {
            lines.push(new geometry.Line(Points[i],Points[i+1]));
            geometry.DrawLine(ctx, Points[i], Points[i+1]);
        }
        return geometry.atLeastOneLineIntersect(lines, headLine);
    }
    var tailLine = new geometry.Line(Points[0], Points[1]);
    geometry.DrawLine(ctx, Points[0], Points[1]);
    var headLine = new geometry.Line(Points[length-2], Points[length-1]);
    geometry.DrawLine(ctx, Points[length-2], Points[length-1]);
    
    var lastBezierPoints = createOverhauser(Points[length - 4], Points[length - 3], Points[length - 2], Points[length - 1]);
    lines = DrawCurveAndReturnLineArray(lastBezierPoints, ctx);
    var intersects = geometry.atLeastOneLineIntersect(lines, headLine);
    lines.push(headLine);
    intersects = intersects || geometry.atLeastOneLineIntersect(lines, tailLine);
    for(var i = 0; i < length - 4; i+=1) {
        var OPoints = createOverhauser(Points[i], Points[i+1], Points[i+2], Points[i+3]);
        if(DrawCurveAndCheckIntersection(OPoints, ctx, lines)) {
            intersects = true;
        }
    }
    return intersects;
}

export{DrawBezier, DrawBezierInterpolating};