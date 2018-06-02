/** Animation from a based sprite sheet.
    @param sheet: the BasedSpriteSheet of the images for the animation
    @param timeForAnim: time for a full anim cycle in seconds
*/
var BasedAnimation = function(sheet, timeForAnim) {
    this.spriteSheet = sheet
    this.currentFrameInd = 0;
    this.timePerFrame = timeForAnim/this.spriteSheet.frameCount;
    this.timeCurrentShown = 0;
    this.fIndDir = 1;
};



BasedAnimation.prototype.setStartFromEnd = function() {
    this.currentFrameInd = this.spriteSheet.frameCount-1;
};


/** The position, angle and spread of the goal in a particular frame.
The position is given wrt the bottom-mid point of the frame.
*/
BasedAnimation.prototype.getGoalData = function(flipped) {
    if (this.spriteSheet.goalDatas) {
        var gD = this.spriteSheet.goalDatas[this.currentFrameInd];
        if (flipped) {
            ///TODO remove nonteoanjaänefäan
            var frameW = this.spriteSheet.frameW;
            return {pos: {x: -gD.pos.x, y: gD.pos.y}, ang: gD.ang, spread: gd.spread};
        } else {
            return gD;
        }
    } else {
        return null;
    }
};

/** The position where to shoot cum. Only present in animations that need it */
BasedAnimation.prototype.getCumGoalData = function() {
    if (this.spriteSheet.cumGoalDatas) {
        return this.spriteSheet.cumGoalDatas[this.currentFrameInd];
    } else {
        return null;
    }
};

/** TODO Path to use for the held bullet clipping when drawing it hitting */
BasedAnimation.prototype.getClipPath = function(x, y, flip, chooseNonUsualSide) {
    
    
    var start = "M "+x+" "+y +" ";
    
    var toRight = flip;
    if (chooseNonUsualSide) {
        toRight = !flip;
    }
    
    var end = toRight ? (" L "+x+" 0 L "+W+" 0 L "+W+" "+H+" L "+x+" "+H)
                        : (" L "+x+" 0 L 0 0 L 0 "+H+" L "+x+" "+H);
    
    if (flip) {
        if (!this.spriteSheet.clipPathFlippedDatas) return null;
        return new Path2D( start + this.spriteSheet.clipPathFlippedDatas[this.currentFrameInd] + end);
    } else {
        if (!this.spriteSheet.clipPathDatas) return null;
        return  new Path2D( start + this.spriteSheet.clipPathDatas[this.currentFrameInd] + end);
    }
};



BasedAnimation.prototype.update = function(dT) {
    
    if (dT>0) {
        this.timeCurrentShown += dT;
        while(this.timeCurrentShown > this.timePerFrame) {
            this.timeCurrentShown -= this.timePerFrame;
            this.changeFrame();

        }
    } else if (dT<0) {
        this.timeCurrentShown += dT;
        if (this.timeCurrentShown<0) {
            this.timeCurrentShown = 0;
        }
        /*TODO
        while(this.timeCurrentShown < -this.timePerFrame) {
            this.timeCurrentShown += this.timePerFrame;
            this.changeFrameBackWards();

        }
        */
    }
};

BasedAnimation.prototype.changeFrame = function() {
    if (this.repeatMode==="reverse") {
        this.fIndDir = -1;
    } else if (this.repeatMode!=="alternate") {
        this.fIndDir = 1;
    }
    
    this.currentFrameInd += this.fIndDir;
    
    if (this.currentFrameInd>=this.spriteSheet.frameCount) {
        if (this.repeatMode==="alternate") {
            this.currentFrameInd = this.spriteSheet.frameCount-1;
            this.fIndDir = -1;
        } else {
            this.currentFrameInd = 0;
        }
    } else if (this.currentFrameInd<0) {
        if (this.repeatMode==="alternate") {
            this.currentFrameInd = 0;
            this.fIndDir = 1;
        } else {
            this.currentFrameInd = this.spriteSheet.frameCount-1;
        }
    }
};


BasedAnimation.prototype.draw = function(ctx, x, y, rot, flipped) {
    this.spriteSheet.drawFrame(ctx, this.currentFrameInd, x, y, rot, flipped);
};



