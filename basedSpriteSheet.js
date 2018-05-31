/** Animation from a sprite sheet.
    @param frameCount: how many frames are in the sheet
    @param goalDatas: data on the goals, point locations {x, y} in the sheet (wrt to the upper left corner of the sheet), angle of the goal as {x, y} and spread (half the opening of the goal acceptance angle)
*/
var BasedSpriteSheet = function(sheetFileName, frameCount, goalDatas) {
    this.spriteSheet = document.createElement("img");
    this.frameCount = frameCount;
    this.frameW = 0;
    this.frameH = 0;
    
    this.ready = false;
    var self = this;
    this.spriteSheet.onload = function() {
        self.frameW = self.spriteSheet.width/self.frameCount;
        self.frameH = self.spriteSheet.height;
        self.ready = true;
    };
    this.spriteSheet.src = sheetFileName;
    
    if (goalDatas) {
    this.goalDatas = goalDatas.map(d=>{ return {pos: {x:d.pos.x, y:d.pos.y},
                                                angle: d.angle,
                                               spread: d.spread }; });
    } else {
        this.goalDatas = null;
    }
};


/** Draw the image at given frame to the point (x,y). This is where the base point (mid-bottom) will be. */
BasedSpriteSheet.prototype.drawFrame = function(ctx, frameInd, x, y, rot=0, flipped=false) {
    //debugger;
    ctx.save();
    ctx.translate(x + (flipped?1:-1)* this.frameW*0.5, y-this.frameH);
    ctx.rotate(rot);
    if (flipped) ctx.scale(-1, 1);
    ctx.drawImage(this.spriteSheet, this.frameW*frameInd, 0, this.frameW, this.frameH,
                0, 0,  this.frameW, this.frameH);
    
    ctx.restore();
    
    
    /* draw the base point for testing
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    */
};

