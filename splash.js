var Splash = function() {
    
    this.area = document.getElementById("splashScreen");
    this.loadBarArea = document.getElementById("splashLoadBar");
    this.loadBarBorder = document.getElementById("splashLoadBarBorder");
    this.loadBar = document.getElementById("splashLoadBarInner");
    this.playButtonArea = document.getElementById("playButtonArea");
    this.playButton = document.getElementById("playButton");
    var self = this;
    this.playButton.onclick = function() {
        if (typeof self.playClickFunc === "function") {
            self.playClickFunc();
        }
    }
    this.loadingIntervalId = -1;
    
    this.setLoadBarBorderColor("#222");
    this.setLoadBarColor("rgba(200, 0, 0, 0.7)");
    
    
};


Splash.prototype.setOnPlayClick = function(func) {
    this.playClickFunc = func;
};

Splash.prototype.setLoadBarBorderColor = function(color) {
    this.loadBarBorder.style.borderColor = color;
};

Splash.prototype.setLoadBarColor = function(color) {
    this.loadBar.style.background = color;
};


Splash.prototype.start = function() {
    var self = this;
    var imageWeight = 0.8;
    var soundWeight = 0.2;
    this.loadingIntervalId = setInterval(function() {
        var imageReadyPercent = imageManager.getPercentReady();
        var soundReadyPercent = soundManager.getPercentReady();
        var readyPercent = imageWeight * imageReadyPercent + soundWeight * soundReadyPercent;
        self.loadBar.style.width = (readyPercent*100)+"%";
        var redVal = Math.floor((1-readyPercent)*255);
        var greenVal = Math.floor(readyPercent*255);
        
        self.setLoadBarColor("rgba("+redVal+", "+greenVal+", 0, 0.7)");
        if (Math.abs(readyPercent - 1) < 0.0001) {
            self.stop();
            self.loadBarArea.style.display = "none";
            self.playButtonArea.style.display = "block";
        }
        
    }, 100);
};


Splash.prototype.stop = function() {
    clearInterval(this.loadingIntervalId);
};



Splash.prototype.hide = function() {
    this.area.style.display = "none";
};


Splash.prototype.show = function() {
    this.area.style.display = "block";
};