const TWO_PI = 2*Math.PI;

var randInt = function(a, b) {return a+Math.floor(Math.random()*(b-a+1));};
var randElem = function(arr) {return arr[randInt(0, arr.length-1)];};
var randBool = function(prob) {return Math.random()<prob;};

/** Get a random number with expectation m and support on the interval [m-s/2, m+s/2].
  * The integer k controls how much the middle is favored. For efficiency's sake, k shouldn't be too large. 
*/
var randNum = function(m, s, k=1) {
    var u = Math.random();
    var n=0;
    while (++n<k) u += Math.random(); //TODO: this might be inefficient if k large
    return m - s/2 + u*s/n;
};

var sum = function(arr) {return arr.reduce((acc, curr)=>acc+curr, 0);};


/** index of the maximal element in an array */
var argMax = function(arr) {
    var bestVal = -Infinity;
    var bestInd = -1;
    var n = arr.length;
    for (let i=0; i<n; i++) {
        let x = arr[i];
        if (x>bestVal) {
            bestInd = i;
            bestVal = x;
        }
    }
    return bestInd;
};
/** angle the coordinate vector (x, y) has. The zero angle is positive x-coordinate axis. */
const calcAngle = function(x, y) {
    return Math.PI/2  - Math.atan2(x, y);
}

/** The angle reflected over the y-axis */
const flipAngle = function(ang) {
    return Math.PI - ang;
};

/**
@param a: startPoint
@param b: endPoint
@param t: time in seconds, 1 second goes once between a and b.
*/
const hitTween = function(a, b, t) {
    var f = t%1; //frac part
    var flip = !!((t|0)%2); //is int part odd
    var x = flip ? b : a;
    var y = flip ? a : b;
    f = f*2;
    if (f<1) {
        return (y-x)*0.5 * f*f + x; 
    } else {
        f--;
        return (x-y)*0.5 * (f*(f-2)-1) + x;
    }
    
    /*
    return change / 2 * time * time + startValue;
     }

     time--;
     return -change / 2 * (time * (time - 2) - 1) + startValue;
     */
};


const gatherTween = function(a, b, t) {
    var f = t*2;
    if (f<1) {
        return (b-a)*0.5 * f*f + a;
    } else {
        f--;
        return (a-b)*0.5 * (f*(f-2)-1) + a;
    }
}
