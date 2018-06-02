var SlipBullet = function(type) {
    Bullet.call(this, type);
    this.onGround = false;
    
    this.beenOnGround = 0;
};

//inherit from Bullet
SlipBullet.prototype = Object.create(Bullet.prototype);

//override methods
SlipBullet.prototype.update = function(dT) {
    if (!this.onGround) {
        Bullet.prototype.update.call(this, dT); //super
    } else {
        //nothing
    }
    
    //first checks for when slinged
    if (!this.isHeld && this.velocity.y>=0 && this.position.y>=LAND_LEVEL_Y) {
        this.position.y = LAND_LEVEL_Y;
        this.onGround = true;
        this.rotation = 0;
        this.setVelocity(0, 0);
    }
    
    if (this.position.x<0) {
        this.setVelocity(Math.abs(this.velocity.x), this.velocity.y);
    } else if (this.position.x>TARGET_MAX_X) {
        this.setVelocity(-Math.abs(this.velocity.x), this.velocity.y);
    }
    
    if (this.onGround) {
        this.beenOnGround += dT;
    }
} 