
var Sling = function() {
    this.position = {x: 0, y: 0};
    this.cupPosition = {x: 0, y: 0};
    this.cupVelocity = {x: 0, y: 0};
    this.isHeld = false;
    this.color = "green";
    this.okToShoot = true;
    
    this.handleLen = 200;
    this.forkLen = 100;
};


/** Move the base point (where the cup is at rest) to the given point */
Sling.prototype.moveTo = function(x, y) {
    this.position.x = x;
    this.position.y = y;
};


/** Move the cup of the sling (the thing where the item to sling lies) to the given point*/
Sling.prototype.moveCupTo = function(x, y) {
    this.cupPosition.x = x;
    this.cupPosition.y = y;
};


/** Let go of the sling. The cup gets velocity according to its position wrt the base position */
Sling.prototype.takeHold = function() {
    this.isHeld = true;
};


/** Set whether it is ok to shoot the sling or not (will it fire a bullet when released) */
Sling.prototype.setOkToShoot = function(isOk) {
    this.okToShoot = isOk;
};


/** Let go of the sling. The cup gets velocity according to its position wrt the base position */
Sling.prototype.letGo = function(playSound) {
    this.isHeld = false;
    this.cupVelocity.x = (this.position.x - this.cupPosition.x)/10;
    this.cupVelocity.y = (this.position.y - this.cupPosition.y)/10;
    if (playSound) soundManager.shoot.play();
};


/** The angle of the displacement of the cup in radians */
Sling.prototype.getCupAngle = function() {
    var dx = this.position.x - this.cupPosition.x;
    var dy = this.position.y - this.cupPosition.y;
    return calcAngle(dx, dy); //-Math.atan2(dx, dy);
};

/** @depracated */
Sling.prototype.getSlingVelocity = function() {
    //var velX = (bullet.position.x - mouse.x) /10;
    //var velY = (bullet.position.y - mouse.y) /10;
    return {x: (this.cupPosition.x - this.position.x)/10,
            y: (this.cupPosition.y - this.position.y)/10 };
};



Sling.prototype.update = function(dT) {
    if (!this.isHeld) {
        
        /* 
        var A = Math.PI * this.radius**2 / (10000); // m^2
        // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * Cd * A * rho * this.velocity.x**3 / Math.abs(this.velocity.x);
        var Fy = -0.5 * Cd * A * rho * this.velocity.y**3 / Math.abs(this.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        // Calculate acceleration ( F = ma )
        var ax = Fx / this.mass;
        var ay = (Fy / this.mass);
        // Integrate to get velocity
        this.velocity.x += ax*dT;
        this.velocity.y += ay*dT;
        */
        
        this.cupVelocity.x = (this.position.x - this.cupPosition.x)/10;
        this.cupVelocity.y = (this.position.y - this.cupPosition.y)/10;
        
        this.cupPosition.x += this.cupVelocity.x*dT*100;
        this.cupPosition.y += this.cupVelocity.y*dT*100;
    }
};


Sling.prototype.drawFront = function(ctx) {
    ctx.save();
    
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(this.cupPosition.x, this.cupPosition.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 10, 0, 2*Math.PI);
    ctx.fill();
    
    ctx.fillStyle = this.okToShoot ? "rgba(0, 200, 0, 0.5)" : "rgba(200, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(this.cupPosition.x, this.cupPosition.y, 30, 0, 2*Math.PI);
    ctx.fill();
    
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#966F33";
    var displace = this.forkLen*0.353553; //about *cos(PI/4)/2 for half way
    var junctionY = this.position.y + displace;
    
    ctx.beginPath();
    ctx.moveTo(this.position.x + displace, this.position.y - displace);
    ctx.lineTo(this.position.x, junctionY);
    ctx.lineTo(this.position.x, junctionY + this.handleLen);
    ctx.stroke();
    
    ctx.restore();
};

Sling.prototype.drawBack = function(ctx) {
    ctx.lineWidth = 16;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#502900";
    var displace = this.forkLen*0.353553; //about *cos(PI/4)/2 for half way
    var junctionY = this.position.y + displace;
    
    ctx.beginPath();
    ctx.moveTo(this.position.x - displace, this.position.y - displace);
    ctx.lineTo(this.position.x, junctionY);
    ctx.stroke();
};