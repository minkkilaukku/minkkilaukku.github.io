var Bullet = function(type) {
    this.position = {x: 0, y: 0};
    this.velocity = {x: 0, y: 0};
    this.mass = 0.1; //kg
    this.radius = 15; // 1px = 1cm
    this.restitution = -0.7;
    this.rotation = 0; //positive x-axis direction
    
    this.color = "blue";
    
    this.isHeld = true;
    
    
    this.type = type||Bullet.TYPES.DEFAULT;
};

/** Type has getImage function for getting the image of the bullet
 *  It can have tween-object having tween-functions for angle, x, and y attributes
  * that give a displacement from the usual value when tweening hitting with the bullet.
 */
Bullet.TYPES = {
    DEFAULT: {
        getImage: _=>imageManager.bulletImage,
        name: "default"
    },
    PLUG: {
        getImage: _=>imageManager.plugImage,
        name: "plug",
        keepStuck: true,
        tween: {
            dAngTween: function(t) {
                return 0;
            },
            
            dXTween: function(t) {
                //debugger;
                var a = 5;
                var b = 10;
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
            },
            
            dYTween: function(t) {
                return 0;
            }
        }
    },
    BUZZ: {
        getImage: _=>imageManager.buzzImage,
        name: "buzz",
        keepStuck: true,
        tween: {
            dAngTween: function(t) {
                return 0;
            },
            
            dXTween: function(t) {
                //debugger;
                var a = 5;
                var b = 10;
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
            },
            
            dYTween: function(t) {
                return 0;
            }
        }
    },
    JELLY: {
        getImage: _=>imageManager.jellyImage,
        name: "jelly",
        tween: {
            dAngTween: function(t) {
                //return  0.2 + ((t|0)%2 ? -1 : 1) * (t%1)*0.3;
                var a = 0.2;
                var b = -0.2;
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
            },
            
            dXTween: function(t) {
                return 0;
            },
            
            dYTween: function(t) {
                //debugger;
                var a = 0;
                var b = -15;
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
            }
        }
    },
    MONEY: {
        getImage: _=>imageManager.moneyImage,
        name: "money"
    }
};

Bullet.ALL_TYPES_ARR = [Bullet.TYPES.DEFAULT, Bullet.TYPES.PLUG,
                        Bullet.TYPES.JELLY, Bullet.TYPES.BUZZ,
                       Bullet.TYPES.MONEY];

Bullet.typeForInd = function(ind) {
    return Bullet.ALL_TYPES_ARR[ind];
};



Bullet.prototype.moveTo = function(x, y) {
    this.position.x = x;
    this.position.y = y;
};

Bullet.prototype.setVelocity = function(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
};


Bullet.prototype.getRotation = function() {
    return this.rotation;
};


Bullet.prototype.getWidth = function() {
    return this.type.getImage().image.width;
};


Bullet.prototype.canHit = function() {
    return this.type!==Bullet.TYPES.MONEY;
};


Bullet.prototype.update = function(dT) {
    if (!this.isHeld) {
        var A = Math.PI * this.radius**2 / (10000); // m^2

        // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * Cd * A * rho * this.velocity.x**3 / Math.abs(this.velocity.x);
        var Fy = -0.5 * Cd * A * rho * this.velocity.y**3 / Math.abs(this.velocity.y);

        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);

        // Calculate acceleration ( F = ma )
        var ax = gravity.x + Fx / this.mass;
        var ay = gravity.y + (Fy / this.mass);
        // Integrate to get velocity
        this.velocity.x += ax*dT;
        this.velocity.y += ay*dT;

        // Integrate to get position
        this.position.x += this.velocity.x*dT*100;
        this.position.y += this.velocity.y*dT*100;
        
        this.rotation = calcAngle(this.velocity.x, this.velocity.y);//-Math.atan2(this.velocity.x, this.velocity.y);
    }
};


Bullet.prototype.draw = function(ctx, flipped) {
    
    
    this.type.getImage().draw(ctx, this.position.x, this.position.y, this.rotation, flipped);
    
    /*
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = this.color;
    
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(2*this.radius, 0);
    ctx.stroke();
    
    ctx.restore();
    */
    
};


/** Make a bullet of given type */
function makeBullet(type) {
    if (type===Bullet.TYPES.MONEY) {
        return new MoneyBullet(type);
    } else {
        return new Bullet(type);
    }
}

