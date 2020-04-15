function DrawLine(ctx, from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

function Point(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

function Line(A, B) {
    this.A = A;
    this.B = B;
}

function addScaled(original, scale, another) {
    return new Point(original.x + scale*another.x, original.y + scale*another.y, original.w + scale*another.w);
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

function reflect(A,B) {
    return new Point(2*A.x - B.x, 2*A.y - B.y, 2);
}

function linesIntersect (lineP, lineQ) {
    var PBminusPAT = new Point(lineP.A.y - lineP.B.y, lineP.B.x - lineP.A.x);
    var QAminusPA = new Point(lineQ.A.x - lineP.A.x, lineQ.A.y - lineP.A.y);
    var firstDot = PBminusPAT.x*QAminusPA.x + PBminusPAT.y*QAminusPA.y;
    var QBminusPA = new Point(lineQ.B.x - lineP.A.x, lineQ.B.y - lineP.A.y);
    var secondDot = PBminusPAT.x*QBminusPA.x + PBminusPAT.y*QBminusPA.y;
    if(firstDot*secondDot > 0 || firstDot*secondDot === 0) {
        return false;
    }
    var QBminusQAT = new Point(lineQ.A.y - lineQ.B.y, lineQ.B.x - lineQ.A.x);
    var PAminusQA = new Point(lineP.A.x - lineQ.A.x, lineP.A.y - lineQ.A.y);
    firstDot = QBminusQAT.x*PAminusQA.x + QBminusQAT.y*PAminusQA.y;
    var PBminusQA = new Point(lineP.B.x - lineQ.A.x, lineP.B.y - lineQ.A.y);
    secondDot = QBminusQAT.x*PBminusQA.x + QBminusQAT.y*PBminusQA.y;
    if(firstDot*secondDot >= 0 || firstDot*secondDot === 0) {
        return false;
    }
    return true;
}

function atLeastOneLineIntersect(lines, line) {
    for (var i = 0; i < lines.length; i++) {
        if(linesIntersect(lines[i], line)) {
            return true;
        }
    }
    return false;
}

export {DrawLine, Point, length, isClose, Line, atLeastOneLineIntersect, linesIntersect, addScaled, reflect}