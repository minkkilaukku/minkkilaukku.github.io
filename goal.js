var Goal = function() {
    this.position = {x: 0, y: 0};
    this.velocity = {x: 0, y: 0};
    this.mass = 0.1; //kg
    this.radius = 15; // 1px = 1cm
    this.restitution = -0.7;
    
    this.angle = 0; //the angle for direct hit
    this.spread = Math.PI/8; //half the angle accepted for hitting arrows
    
    this.color = "red";
    
    this.isHeld = false;
};



Goal.prototype.moveTo = function(x, y) {
    this.position.x = x;
    this.position.y = y;
};

Goal.prototype.setAngle = function(ang) {
    this.angle = ang;
};

Goal.prototype.setSpread = function(spread) {
    this.spread = spread;
};



Goal.prototype.bulletHits = function(bullet) {
    var dx = this.position.x - bullet.position.x;
    var dy = this.position.y - bullet.position.y;
    var angDiff = ((bullet.getRotation() + this.angle)%TWO_PI + TWO_PI)%TWO_PI; // + since dirs opposite
    angDiff = Math.min( Math.abs( (angDiff-TWO_PI)%TWO_PI), Math.abs( (angDiff+TWO_PI)%TWO_PI) );
    //if (dx**2 + dy**2 <= (this.radius + bullet.radius)**2) debugger;
    return (   dx**2 + dy**2 <= (this.radius + bullet.radius)**2
            && angDiff <= 2*this.spread ); //TODO correct hitting angle?
};



Goal.prototype.update = function(dT) {
    if (!this.isHeld) {
        var A = Math.PI * this.radius**2 / (10000); // m^2

        // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * Cd * A * rho * this.velocity.x**3 / Math.abs(this.velocity.x);
        var Fy = -0.5 * Cd * A * rho * this.velocity.y**3 / Math.abs(this.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        // Calculate acceleration ( F = ma ), no gravity on the fixed goal
        var ax = Fx / this.mass; //gravity.x + 
        var ay = (Fy / this.mass); // gravity.y + 
        // Integrate to get velocity
        this.velocity.x += ax*dT;
        this.velocity.y += ay*dT;

        // Integrate to get position
        this.position.x += this.velocity.x*dT*100;
        this.position.y += this.velocity.y*dT*100;
    }
};


Goal.prototype.draw = function(ctx) {
    
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.translate(this.position.x, this.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    ctx.strokeStyle = "rgba(200, 0, 0, 0.7)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    var oppAng = Math.PI+this.angle;
    ctx.arc(0, 0, this.radius*2, oppAng-this.spread, oppAng+this.spread, false);
    ctx.stroke();
    
    ctx.restore();
};




