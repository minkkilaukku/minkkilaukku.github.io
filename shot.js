var Part = function() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.forceFromOthers = {x: 0, y: 0};
    this.visible = false;
    this.needsUpdate = false;
    this.onSurface = false;
};

/** distance to another particle */
Part.prototype.distTo = function(other) {
    return Math.sqrt((this.x - other.x)**2 + (this.y - other.y)**2);
};



var Shot = function(amount) {
    this.partSize = 1;
    this.partsLineWidth = 4;
    this.maxDistForPartsLine = 7;
    this.parts = new Array(amount).fill(null).map( _=> new Part());
    
    this.dampCoeff = 0.45;
    this.surfDampCoeff = 0.001;
    
    this.separRadius = 40;
    this.separCoeff = 2;
    this.closeRadius = 100;
    this.closeCoeff = 0.4;
    
    this.maxDelayGap = 1900/(this.parts.length+1);
    this.minDelayGap = 30/(this.parts.length+1);
};


Shot.prototype.shoot = function(start, velo, spreadX=0, spreadY=0) {
    
    var delayProb = 0.35;
    var delay = 0;
    for (let p of this.parts) {
        p.x = start.x;
        p.y = start.y;
        setTimeout( function() {
            p.vx = velo.x + (1-2*Math.random())*spreadX;
            p.vy = velo.y + (1-2*Math.random())*spreadY;
            p.visible = true;
            p.needsUpdate = true;
        }, delay);
        
        //to fire some parts simultaniously
        var delayW = this.maxDelayGap - this.minDelayGap;
        delay += Math.random()<delayProb ? (Math.random()*delayW + this.minDelayGap) : 0; 
    }
};

Shot.prototype.setBounds = function(left, top, width, height) {
    this.bounds = {left:left, right: left+width, top: top, bottom: top+height};
};

Shot.prototype.withinBounds = function(part) {
    if (!this.bounds) return true;
    return part.x>=this.bounds.left && part.x<=this.bonds.right
        && part.y>=this.bounds.top && part.y<=this.bounds.bottom;
};

/** Collect the parts that are within distance r to the point x, y.
 * They get removed from the parts of the shot
 * @return array of the collected parts;
*/
Shot.prototype.collectParts = function(x, y, r) {
    var rSqr = r*r;
    var hadDeletes = false;
    var collected = [];
    for (let i=0; i<this.parts.length; i++){
        let p = this.parts[i];
        if ((p.x-x)**2 + (p.y-y)**2 <= rSqr) {
            collected[collected.length] = p;
            delete this.parts[i];
            hadDeletes = true;
        }
    }
    
    if (hadDeletes) {
        this.parts = this.parts.filter(x=>x);
    }
    
    return collected;
};


/** Precalculate the force between two given particles.
It will be stored to the particle's forceFromOthers */
Shot.prototype.calculateForceBetween = function(p1, p2) {
    var dx = p2.x-p1.x;
    var dy = p2.y-p1.y;
    var distSqr = dx*dx+dy*dy;
    var sgnDx = dx>=0 ? 1 : -1;
    var sgnDy = dy>=0 ? 1 : -1;
    
    var fx = 0;
    var fy = 0;
    
    if (distSqr < this.separRadius) {
        var fSepX = this.separCoeff * dx/( Math.abs(dx)**3+0.1 );
        var fSepY = this.separCoeff * dy/( Math.abs(dy)**3+0.1 );
        fx += fSepX;
        fy += fSepY;
    } else if (distSqr < this.closeRadius) {
        var fPullX = this.closeCoeff * sgnDx*Math.min(10, Math.abs(dx));
        var fPullY = this.closeCoeff * sgnDy*Math.min(10, Math.abs(dy));
        fx -= fPullX;
        fy -= fPullY;
    }
    
    p1.forceFromOthers.x = -fx;
    p1.forceFromOthers.y = -fy;
    p2.forceFromOthers.x = fx;
    p2.forceFromOthers.y = fy;
    
};


Shot.prototype.updateForcesBetween = function() {
    var n = this.parts.length;
    for (let i=0; i<n; i++) {
       let p1 = this.parts[i];
        if (p1.needsUpdate) {
            for (let j=i+1; j<n; j++) {
                let p2 = this.parts[j];
                if (p2.needsUpdate) {
                    this.calculateForceBetween(p1, p2);
                }
                
            }
        }
    }
};


Shot.prototype.update = function(dT) {
    
    this.updateForcesBetween();
    
    for (let p of this.parts) {
        if (p.needsUpdate) {
            var ax = gravity.x + p.forceFromOthers.x;
            var ay = gravity.y + p.forceFromOthers.y;
            
            // Integrate to get velocity
            var dampC = p.onSurface ? this.surfDampCoeff**dT : this.dampCoeff**dT;
            p.vx += ax*dT;
            p.vx *= dampC; //dampen
            p.vy += ay*dT;
            p.vy *= dampC;

            // Integrate to get position
            p.x += p.vx*dT*100;
            p.y += p.vy*dT*100;
            
            p.onSurface = false;
            if (this.bounds) {
                if (p.x<this.bounds.left) { p.onSurface = true; p.x = this.bounds.left; }
                if (p.x>this.bounds.right) { p.onSurface = true; p.x = this.bounds.right; }
                if (p.y<this.bounds.top) { p.onSurface = true; p.y = this.bounds.top; }
                if (p.y>this.bounds.bottom) { p.onSurface = true; p.y = this.bounds.bottom; }
            }
        }
    }
    
    //TODO repel, attract?
};


Shot.prototype.draw = function(ctx) {
    ctx.fillStyle = "rgba(230, 230, 230, 0.8)";
    for (let p of this.parts) {
        if (p.visible) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.partSize, 0, 2*Math.PI);
            ctx.fill();
        }
    }
    
    ctx.strokeStyle = "rgba(230, 230, 230, 0.8)";
    ctx.lineWidth = this.partsLineWidth;
    
    var minDistForLine = this.maxDistForPartsLine + 2*this.partSize;
    var n = this.parts.length;
    for (let i=0; i<n; i++) {
        let p1 = this.parts[i];
        for (let j=i+1; j<n; j++) {
            let p2 = this.parts[j];
            if (p1.distTo(p2) < minDistForLine) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo (p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
};