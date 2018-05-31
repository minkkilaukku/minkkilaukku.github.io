const SOUND_NAMES = ["shoot", "slurp1", "slurp2", "ooh1", "ooh2", "aah1", "aah2", "aah3",
                    "jerk1", "jerk2", "cum1", "cum2", "cum3", "cum4", "cum5", "cum6", "breath",
                     "buzzOut", "buzzIn", "buzzOutLong" ];

const soundManager = {};

soundManager.init = function() {
    
    for (let name of SOUND_NAMES) {
        let s = new Audio();
        s.ready = false;
        s.onloadeddata= function() {s.ready=true;};
            //setInterval(_=>{s.ready = true;}, Math.random()*5000);};
        s.src = "sounds/"+name+".mp3";
        soundManager[name] = s;
    }
    /*
    soundManager.shootSound = new Audio("sounds/shoot.mp3");
    
    soundManager.slurp1 = new Audio("sounds/slurp1.mp3");
    soundManager.slurp2 = new Audio("sounds/slurp2.mp3");
    
    soundManager.ooh1 = new Audio("sounds/ooh1.mp3");
    soundManager.ooh2 = new Audio("sounds/ooh2.mp3");
    
    soundManager.aah1 = new Audio("sounds/aah1.mp3");
    soundManager.aah2 = new Audio("sounds/aah2.mp3");
    soundManager.aah3 = new Audio("sounds/aah3.mp3");
    
    
    soundManager.jerk1 = new Audio("sounds/jerk1.mp3");
    soundManager.jerk2 = new Audio("sounds/jerk2.mp3");
    
    soundManager.cum1 = new Audio("sounds/cum1.mp3");
    soundManager.cum2 = new Audio("sounds/cum2.mp3");
    soundManager.cum3 = new Audio("sounds/cum3.mp3");
    soundManager.cum4 = new Audio("sounds/cum4.mp3");
    soundManager.cum5 = new Audio("sounds/cum5.mp3");
    soundManager.cum6 = new Audio("sounds/cum6.mp3");
    
    soundManager.breath = new Audio("sounds/breath.mp3");
    */
    
    
    
    
};

soundManager.getPercentReady = function() {
    let total=0, ready=0;
    for (let prob in this) {
        let x = this[prob];
        if (x instanceof Audio ) {
            total += 1;
            ready += x.ready ? 1 : 0;
        }
    }
    if (total===0) return 1;
    return ready/total;
};

soundManager.setSoundOn = function(flag) {
    var vol = flag ? 1 : 0;
    
    for (let prop in soundManager) {
        let x = soundManager[prop];
        if (x instanceof Audio) {
            x.volume = vol;
        }
    }
};



soundManager.getRandomMoanSound = function() {
    return randElem([this.aah1, this.aah2, this.aah3, this.ooh1, this.ooh2]);
}