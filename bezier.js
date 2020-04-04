function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

//Overhauser's cubic:
function createOverhauser(A, B, C, D) {
    var OPoints=[];
    var P3 = new Point(C.x, C.y, C.w);
    OPoints.push(P3);
    var P2 = new Point(C.x - (D.x - B.x)/6.0, C.y - (D.y - B.y)/6.0, D.w);
    OPoints.push(P2);
    var P1 = new Point(B.x + (C.x - A.x)/6.0, B.y + (C.y - A.y)/6.0, A.w);
    OPoints.push(P1);
    var P0 = new Point(B.x, B.y, B.w);
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
    return new Point(
        Math.pow(1-t, 3)*Points[0].x + 3*t*Math.pow(1-t,2)*Points[1].x + 3*(1-t)*Math.pow(t,2)*Points[2].x + Math.pow(t,3)*Points[3].x,
        Math.pow(1-t, 3)*Points[0].y + 3*t*Math.pow(1-t,2)*Points[1].y + 3*(1-t)*Math.pow(t,2)*Points[2].y + Math.pow(t,3)*Points[3].y,
        1 
    )
}

function subdivide(P) {
    var Q = [];
    Q[0] = new Point(P[0].x, P[0].y);
    Q[1] = new Point(P[0].x*0.5 + P[1].x*0.5, P[0].y*0.5 + P[1].y*0.5);
    Q[2] = new Point(P[0].x*0.25 + P[1].x*0.5 + P[2].x*0.25, P[0].y*0.25 + P[1].y*0.5 + P[2].y*0.25);
    Q[3] = new Point(P[0].x*0.125 + P[1].x*0.375 + P[2].x*0.375 + P[3].x*0.125, P[0].y*0.125 + P[1].y*0.375 + P[2].y*0.375 + P[3].y*0.125);

    var R = [];
    R[3] = new Point(P[0].x*0.125 + P[1].x*0.375 + P[2].x*0.375 + P[3].x*0.125, P[0].y*0.125 + P[1].y*0.375 + P[2].y*0.375 + P[3].y*0.125);
    R[2] = new Point(P[1].x*0.25 + P[2].x*0.5 + P[3].x*0.25, P[1].y*0.25 + P[2].y*0.5 + P[3].y*0.25);
    R[1] = new Point(P[2].x*0.5 + P[3].x*0.5, P[2].y*0.5 + P[3].y*0.5);
    R[0] = new Point(P[3].x, P[3].y);
    
    return {left: Q, right: R};
}

function DrawLine(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function length(A, B) {
    return Math.sqrt((B.x - A.x)*(B.x - A.x) + (B.y - A.y)*(B.y - A.y));
}

function isClose(A, B, C, epsilon) {
    var ABdotAC = (B.x - A.x)*(C.x - A.x) + (B.y - A.y)*(C.y - A.y);
    var t = ABdotAC/Math.pow(length(A,B),2);
    var point;
    if(t <= 0) {
        point = A;
    } else if (t >= 1) {
        point = B;
    } else {
        point = new Point((1-t)*A.x + t*B.x, (1-t)*A.y + t*B.y);
    }

    return (length(C, point) <= epsilon);
}

function DrawCurve(Points, ctx) {
    if(isClose(Points[0], Points[3], Points[1], 0.5) && isClose(Points[0], Points[3], Points[2], 0.5)) {
        DrawLine(ctx, Points[0], Points[3]);
    } else {
        var subdivision = subdivide(Points);
        DrawCurve(subdivision.left, ctx);
        DrawCurve(subdivision.right, ctx);
    }
}

function DrawBezier(Points, ctx) {
    var length = Points.length;
    if (Points.length < 4) {
        throw "Four points are required for a cubic bezier!";
    }
    for(var i = 0; i < length - 3; i++) {
        var OPoints = createOverhauser(Points[i], Points[i+1], Points[i+2], Points[i+3]);
        DrawCurve(OPoints, ctx);
    }
}

export{DrawBezier};