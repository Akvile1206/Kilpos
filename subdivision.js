import * as geometry from "./geometry.js";

function drawSubdivision(points, ctx) {
    var lines=[];
    var head = points.pop();
    geometry.DrawLine(ctx, points[points.length - 1], head);
    var headLine = new geometry.Line(points[points.length - 1], head);
    if(points.length < 4) {
        for(var i=0; i<points.length-1; i++) {
            lines.push(new geometry.Line(points[i], points[i+1]));
            geometry.DrawLine(ctx, points[i], points[i+1]);
        }
        return geometry.atLeastOneLineIntersect(lines, headLine);
    }
    // var kernel = [1/4, 3/4, 3/4, 1/4]; Chaikin
    var kernel = [1/8, 4/8, 6/8, 4/8, 1/8]; //Catmull-Clark
    var new_points = subdivide(points, kernel);
    new_points = subdivide(new_points, kernel);
    new_points = subdivide(new_points, kernel);

    for(var i=0; i<new_points.length-1; i++) {
        lines.push(new geometry.Line(new_points[i], new_points[i+1]));
        geometry.DrawLine(ctx, new_points[i], new_points[i+1]);
    }
    return geometry.atLeastOneLineIntersect(lines, headLine);
}

function subdivide(points, kernel) {
    var new_points = [];
    new_points.push(points[0]);
    var n = points.length - 1;
    for(var i=1; i<2*n; i++) {
        var point = new geometry.Point(0,0,0);
        var j;
        var s;
        if(i%2==0) {
            j = i / 2;
            s = kernel.length % 2 == 0 ? kernel.length/2 - 1 : (kernel.length-1)/2;
        } else {
            j = (i-1) / 2;
            s = kernel.length % 2 == 0 ? kernel.length/2 - 2 : (kernel.length-1)/2 - 1;
        }
        point = geometry.addScaled(point, kernel[s], points[j]);
        //go left
        var l = 1;
        for(var k=s-2; k>=0; k-=2) {
            if(j-l<0) {
                break;
            }
            point = geometry.addScaled(point, kernel[k], points[j - l]);
            l++;
        }
        //go right 
        l = 1;
        for(var k=s+2; k<kernel.length; k+=2) {
            if(j + l > n) {
                break;
            }
            point = geometry.addScaled(point, kernel[k], points[j + l]); 
            l++;
        }
        new_points.push(point);
    }
    new_points.push(points[n]);
    return new_points;
}

export{drawSubdivision}