var BasedImage = function(fileName, offX, offY) {
    this.image = document.createElement("img");
    this.ready = false;
    var self = this;
    this.image.onload = function() {
        self.ready = true;
        //setTimeout(_=>{self.ready = true;}, 10000*Math.random()); //TODO to simulate slower loading
    };
    this.image.src = fileName;
    this.offX = offX;
    this.offY = offY;
};



BasedImage.prototype.draw = function(ctx, x, y, rot, flipped=false) {
    ctx.save();
    ctx.translate(x, y);
    if (flipped) ctx.scale(-1, 1);
    ctx.rotate(rot);
    ctx.drawImage(this.image, -this.offX, -this.offY);
    ctx.restore();
    
    /* draw the base point for testing
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2, true);
    ctx.fill();
    ctx.closePath();
    */
};