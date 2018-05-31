/** Meter having a level (a number between 0 and 1)  */
var EnergyMeter = function() {
    this.level = 0;
    this.x = 0;
    this.y = 0;
    this.w = 10;
    this.h = 100;
    this.color = "rgba(0, 0, 255, 0.5)";
    
    this.initBeziers();
    this.bezierTime = 0;
    this.bezierTotTime = 2.400; //time in seconds for one full bezier control point moving cycle
    //this.bezierTimeDir = 1;
};


EnergyMeter.prototype.setColor = function(color) {
    this.color= color
};

EnergyMeter.prototype.initBeziers = function() {
    var bezY = this.y + this.level*this.h
    this.bezierYGap = Math.min(this.h, 20);
    this.bezier1 = {x: this.x+this.w/2, y: bezY};
    this.bezier2 = {x: this.x+this.w/2, y: bezY};
};

EnergyMeter.prototype.updateBeziers = function() {
    
    
    this.bezierYGap = Math.min(this.w*this.level/2, 16);
    
    /*
    var bezYCenter = this.y + (1-this.level)*this.h;
    var bezXCenter = this.x + this.w/2;
    var cosOfFrac = Math.cos(bezFrac*2*Math.PI);
    var sinOfFrac = Math.sin(bezFrac*2*Math.PI);
    this.bezier1.x = bezXCenter + this.bezierYGap*cosOfFrac;//this.x + this.w/2;
    this.bezier1.y = bezYCenter + this.bezierYGap*sinOfFrac;//bezYBase + (1-2*bezFrac)*this.bezierYGap;
    this.bezier2.x = bezXCenter - this.bezierYGap*sinOfFrac;//this.x + this.w/2;
    this.bezier2.y = bezYCenter + this.bezierYGap*cosOfFrac;//bezYBase + (2*bezFrac - 1)*this.bezierYGap;
    */
    
    var bezYBase = this.y + (1-this.level)*this.h;
    var coeffOfGap = Math.cos(this.bezierTime/this.bezierTotTime * 2*Math.PI);
    
    this.bezier1.x = this.x + this.w/2;
    this.bezier1.y = bezYBase + coeffOfGap*this.bezierYGap;
    this.bezier2.x = this.x + this.w/2;
    this.bezier2.y = bezYBase - coeffOfGap*this.bezierYGap;
};





EnergyMeter.prototype.setSize = function(w, h) {
    this.w = w;
    this.h = h;
    this.updateBeziers();
};

EnergyMeter.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    this.updateBeziers();
};




EnergyMeter.prototype.setLevel = function(level) {
    this.level = level;
    this.updateBeziers();
};


EnergyMeter.prototype.update = function(dT) {
    //TODO
    var accel = 1 + this.level*2;
    this.bezierTime +=  accel*dT;//this.bezierTimeDir*dT;
    if (this.bezierTime > this.bezierTotTime || this.bezierTime<0) {
        //this.bezierTimeDir *= -1;
        //this.bezierTime = Math.min(this.bezierTotTime, this.bezierTime);
        //this.bezierTime = Math.max(0, this.bezierTime);
        this.bezierTime %= this.bezierTotTime;
    }
    this.updateBeziers();
};

EnergyMeter.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    
    var levH = this.level*this.h;
    var baseY = this.y + this.h;
    var levY = baseY - levH;
    
    ctx.beginPath();
    ctx.moveTo(this.x, levY);
    ctx.bezierCurveTo(this.bezier1.x, this.bezier1.y,
                      this.bezier2.x, this.bezier2.y,
                      this.x+this.w, levY);
    ctx.lineTo(this.x+this.w, baseY);
    ctx.lineTo(this.x, baseY);
    ctx.closePath();
    ctx.fill();
    
    
    //ctx.fillRect(this.x, levY, this.w, levH);
    
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);
};





