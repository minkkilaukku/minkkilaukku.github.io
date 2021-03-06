var Target = function() {
    this.canHit = false;
    this.position = {x: 0, y: 0}; //directly below
    this.velocity = {x: 0, y: 0};
    
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.loseEnergyPerSecond = 0;
    
    this.maxCum = 400;
    this.cum = 0;
    this.gainCumPerSecond = 0;
    
    this.hitInPos = {x: 0, y: 0};
    this.hitOutPos = {x: 0, y: 0};
    
    
    this.shots = [];
    this.maxShootPow = 7.4;
    
    this.likings = this.getRandLikings();
    
    this.slurpSoundNumber = 1;
    this.timeForSlurpSound = 0;
    
    this.moanSound = null;
    this.moanProb = 0.02;
    
    this.jerkSound = null;
    this.jerkSoundNumber = 0;
    this.totalJerkSounds = 2;
    
    this.cumSound = null;
    this.cumSoundNumber = 0;
    this.totalCumSounds = 6;
    
    this.timeSinceLastCrouch = 0;
    this.timeSinceLastSlip = 0;
    
    /** percent to slow down walking */
    this.hindering = 0;
    /** speed to remove hindering per second */
    this.usualDiminishHinderingSpeed = 0.7;
    this.diminishHinderingSpeed = this.usualDiminishHinderingSpeed;
};

Target.STATES = {
    WALKING: 1,
    CROUCHING: 2,
    GETTING_HIT: 3,
    JERKING: 4,
    CUMMING: 5,
    
    FALLING: 6,
    FALLEN: 7,
    GETTING_HIT_FALLEN: 8,
    GETTING_UP: 9,
    JERKING_FALLEN: 10,
    CUMMING_FALLEN: 11
};


Target.prototype.init = function() {
    this.goal = new Goal();
    this.heading = 1;
};



Target.prototype.moveTo = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    if (this.animation) {
        var gD = this.animation.getGoalData();
        this.goal.moveTo(x + (this.heading<0 ? -gD.pos.x : gD.pos.x), y+gD.pos.y);
    }
};

Target.prototype.setVelocity = function(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
    if (x<0) this.heading = -1;
    if (x>0) this.heading = 1;
};


Target.prototype.getEnergyPercent = function() {
    return this.energy/this.maxEnergy;
}

/** Does the target want to and is able to pick up a given money bullet */
Target.prototype.willPickUp = function(m) {
    if (this.state !== Target.STATES.WALKING) {
        return false;
    }
    
    if (this.timeSinceLastCrouch < 2.0) return false;
    
    var diffX = this.heading*(m.position.x - this.position.x);
    if (diffX>0 && diffX<20) {
        return Math.random()<0.2; //TODO
    }
    return false;
};

/** Pick up a money(bullet) m
@param m: money bullet to pick up
@param callBackForPickUp: a function to be called after picking up. It gets a parameter object of the form
       {pickedUp: was the bulled picked up by the target,
       toReturn: the bullet to return if it wasn't picked up, null otherwise
       }.
*/
Target.prototype.pickUp = function(m, callBackForPickUp) {
    this.moneyToPickUp = m;
    this.callBackForMoneyPickUp = callBackForPickUp;
    this.setState(Target.STATES.CROUCHING);
};



/** Will the target slip to a slip bullet */
Target.prototype.willSlip = function(s) {
    if (this.state !== Target.STATES.WALKING) {
        return false;
    }
    
    if (this.timeSinceLastSlip < 2.0) return false;
    
    var diffX = this.heading*(s.position.x - this.position.x);
    if (Math.abs(diffX)<10) {
        return Math.random()<0.1; //TODO
    }
    return false;
};

Target.prototype.slip = function(s) {
    s.onGround = false;
    var back = this.heading<0;
    var velXForS = this.velocity.x * (back ? 0.05 : 0.1);
    s.setVelocity(velXForS, -3.7);
    this.timeSinceLastSlip = 0;
    this.endWalking();
    this.setState(Target.STATES.FALLING);
};



Target.prototype.canBeHit = function() {
    return this.canHit;
};

Target.prototype.bulletHits = function(bullet) {
    return this.canBeHit() && this.goal.bulletHits(bullet);
};


Target.prototype.onHit = function(bullet) {
    bullet.isHeld = true;
    this.bulletHeld = bullet;
    if (this.state === Target.STATES.FALLEN) {
        this.endFallen();
        this.setState(Target.STATES.GETTING_HIT_FALLEN);
        
    } else if (this.state === Target.STATES.CROUCHING) {
        this.endCrouch();
        this.setState(Target.STATES.GETTING_HIT);
        
    } else if (this.state === Target.STATES.WALKING) {
        this.endWalking();
        this.setState(Target.STATES.GETTING_HIT);
    }
    
};

/** Time in seconds the target gets hit */
Target.prototype.getTimeForGettingHit = function() {
    return randNum(5, 2);
};

/** Speed for getting hit (hits per second) */
Target.prototype.getHittingSpeed = function() {
    return randNum(1.5, 0.5);
};

Target.prototype.getCrouchTime = function() {
    return randNum(4, 2);
};

Target.prototype.getJerkTime = function() {
    return randNum(5, 3);
};

Target.prototype.getShootTime = function() {
    return 7.5;
};

Target.prototype.getRestAfterShootTime = function() {
    var longer = this.cum>150 || this.totalShoots>150;
    return  longer ? 2 : 0.5; //rest period after big load ;)
};


//TODO, 
Target.prototype.calculateMoanProb = function(wasCrouched) {
    var liking = 0;
    
    if (this.bulletHeld) {
        liking = this.likings[this.bulletHeld.type.name].stand.energy;
        if (wasCrouched) liking = this.likings[this.bulletHeld.type.name].crouch.energy;
    }
    
    
    if (this.state === Target.STATES.JERKING) {
        if (this.bulletHeld) { //TODO if doesn't like the bullet, maybe different sound?
            return 1;
        } else {
            return 0.03;
        }
    } else if (this.state === Target.STATES.GETTING_HIT) {
        if (wasCrouched) {
            return Math.max(0, Math.min(0.01*liking, 1));
        } else {
            return Math.max(0, Math.min(0.01*liking, 1));
        }
    }
    
    return 0;
};



/** Get random likings of the bullets */
Target.prototype.getRandLikings = function() {
    
    var getRandLiking = function(midE, spreadE, midC, spreadC, factForCrouch=2) {
        var kForRandNum = 2;
        return {
            stand: { energy: randNum(midE, spreadE, kForRandNum),
                    cum: randNum(midC, spreadC, kForRandNum) },
            
            crouch: { energy: randNum(factForCrouch*midE, spreadE, kForRandNum),
                    cum: randNum(factForCrouch*midC, spreadC, kForRandNum) },
            
            jerk: { energy: 0, cum: randNum(1, 1.2, 1)*randNum(midC, spreadC) },
            
            fallen: { energy: randNum(1, 1.5, 1)*factForCrouch*randNum(midE, spreadE),
                     cum: randNum(1, 1.5, 1)*factForCrouch*randNum(midC, spreadC) }
        };
    };
    
    var likeForBuzz;
    if (randBool(0.6)) {
        likeForBuzz = getRandLiking(randBool(0.5)?-5:15, 5, randBool(0.2)?-10:35, 5);
    } else {
        likeForBuzz = getRandLiking(20, 5, 80, 10, randNum(2, 1));
    }
    return {
        default: getRandLiking(5, 1, 5, 1),
        plug: getRandLiking(10, 3, 15, 5, randNum(1.3, 0.7)),
        jelly: getRandLiking(15, 20, 30, 15),
        buzz: likeForBuzz
    };
};


Target.prototype.getFallenTime = function() {
    return randNum(8, 4);
};




Target.prototype.setState = function(state) {
    var wasCrouch = false;
    if (this.state === Target.STATES.CROUCHING) {
        //this.endCrouch(); //already done
        wasCrouch = true;
    }
    
    this.state = state;
    
    if (state !== Target.STATES.WALKING) { //allow hindering only for walking
        this.hindering = 0;
    }
    
    switch (this.state) {
        case Target.STATES.WALKING:
            this.setUpWalking();
            break;
        case Target.STATES.CROUCHING:
            this.setUpCrouch();
            break;
        case Target.STATES.GETTING_HIT:
            this.setUpGettingHitNotFallen(wasCrouch);
            break;
        case Target.STATES.JERKING:
            this.setUpJerkingNotFallen();
            break;
        case Target.STATES.CUMMING:
            this.setUpCummingNotFallen();
            break;
        case Target.STATES.FALLING:
            this.setUpFalling();
            break;
        case Target.STATES.FALLEN:
            this.setUpFallen();
            break;
        case Target.STATES.GETTING_HIT_FALLEN:
            this.setUpGettingHitFallen();
            break;
        case Target.STATES.GETTING_UP:
            this.setUpGettingUp();
            break;
        case Target.STATES.JERKING_FALLEN:
            this.setUpJerkingFallen();
            break;
        case Target.STATES.CUMMING_FALLEN:
            this.setUpCummingFallen();
            break;
    }
    
};

Target.prototype.setUpWalking = function() {
    this.animation = new BasedAnimation(imageManager.walkSheet, 80/TARGET_SPEED_RIGHT);
    this.canHit = true;
    this.setVelocity( (this.heading<0 ? -TARGET_SPEED_LEFT : TARGET_SPEED_RIGHT), 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    
    if (this.moanSound) {
        this.moanSound.pause();
        this.moanSound.currentTime = 0;
    }
};

Target.prototype.endWalking = function() {
    this.diminishHinderingSpeed = this.usualDiminishHinderingSpeed;
};

Target.prototype.setUpCrouch = function() {
    this.timeForCrouch = this.getCrouchTime();
    this.timeSpentCrouch = 0;
    this.animation = new BasedAnimation(imageManager.crouchSheet, this.timeForCrouch/2);
    this.animation.repeatMode = "alternate";
    this.animation.setStartFromEnd(); //since the sheet came out that way
    
    this.canHit = true;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    this.timeSinceLastCrouch = 0;
};

Target.prototype.endCrouch = function() {
    if (typeof this.callBackForMoneyPickUp === "function") {
        this.callBackForMoneyPickUp({pickedUp: !this.moneyToPickUp, toReturn: this.moneyToPickUp});
        if (this.moneyToPickUp) this.moneyToPickUp = null;
    }
    this.timeSinceLastCrouch = 0;
};

Target.prototype.setUpGettingHitNotFallen = function(crouched=false) {
    var anim = crouched?imageManager.gettingHitCrouchedSheet:imageManager.gettingHitSheet;
    this.animation = new BasedAnimation(anim, 0.5);
    
    let bulletName = this.bulletHeld.type.name || "default";
    let liking = crouched ? this.likings[bulletName].crouch : this.likings[bulletName].stand;
    this.loseEnergyPerSecond = liking.energy;
    this.gainCumPerSecond = liking.cum;
    
    this.setUpHitting();
};

Target.prototype.setUpHitting = function() {
    
    this.canHit = false;
    this.setVelocity(0, 0);
    this.timeLeftHitting = this.getTimeForGettingHit();
    this.timeForHitTween = 0;
    var ux = Math.cos(this.goal.angle),
        uy = Math.sin(this.goal.angle),
        bw = this.bulletHeld.getWidth(),
        inPer = 0.45,
        outPer = 0.1;
    this.hitInPos = {x: this.goal.position.x + ux*bw*inPer, y: this.goal.position.y + uy*bw*inPer};
    this.hitOutPos = {x: this.goal.position.x - ux*bw*outPer, y: this.goal.position.y - uy*bw*outPer};
    
    
    this.timeForSlurpSound = 1; //start from 1s to play sound immediately
    this.slurpSoundNumber = 1;
    
    this.moanProb = this.calculateMoanProb();
    
    if (this.bulletHeld.type === Bullet.TYPES.BUZZ) {
        this.buzzSound = soundManager.buzzIn;
        this.buzzSound.loop = true;
        this.buzzSound.play();
    }
};

Target.prototype.endGettingHit = function(crouched=false) {
    var soundToStop = soundManager["slurp"+this.slurpSoundNumber];
    soundToStop.pause();
    soundToStop.currentTime = 0;
}

Target.prototype.removeBulletHeld = function() {
    if (this.buzzSound) {
        this.buzzSound.loop = false;
        this.buzzSound.pause();
        this.buzzSound.currentTime = 0;
        this.buzzSound = null;
    }
    this.bulletHeld = null;
}


Target.prototype.setUpJerkingNotFallen = function() {
    this.animation = new BasedAnimation(imageManager.jerkSheet, 0.7);
    
    this.setUpJerking();
};

Target.prototype.setUpJerkingFallen = function() {
    var back = this.heading<0;
    this.animation = new BasedAnimation(back ? imageManager.jerkFallenBackSheet : imageManager.jerkFallenFrontSheet, 0.7);
    
    if (back) {
        //when falling back, goal will be headed to opp dir
        this.headingForHittingBullet = -this.heading;
    } else {
        //works alright when falling front, heading is the same as usual
        this.headingForHittingBullet = 0;
    }
    
    this.setUpJerking();
};

Target.prototype.setUpJerking = function() {
    
    this.canHit = false;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    if (this.bulletHeld) {
        let jerkLikeData = this.likings[this.bulletHeld.type.name].jerk;
        if (jerkLikeData) {
            this.gainCumPerSecond = jerkLikeData.cum || 0;
        }
    }
    this.timeLeftJerking = this.getJerkTime();
    
    this.jerkSoundNumber = 1;
    this.jerkSound = soundManager.jerk1;
    this.jerkSound.play();
};

Target.prototype.endJerking = function() {
    
    if (this.jerkSound) {
        this.jerkSound.pause();
        this.jerkSound.currentTime = 0;
    }
    
    if (this.moanSound) {
        this.moanSound.pause();
        this.moanSound.currentTime = 0;
    }
};

/** info of shots to shoots in an array. time means at what time from the beginning the shot should
    be shot, pow means percentage of the max power of the target
    They are in reversed order, so only the last one in an update needs to handled. */
Target.prototype.getShotsData = function() {
    var sT = this.getShootTime();
    
    if (this.cum > 3*this.maxCum/4 && randBool(0.8)) {
        return [
            {amount: Math.round(0.06*this.cum), time: 0.95*sT, pow: 0.1},
            {amount: Math.round(0.12*this.cum), time: 0.78*sT, pow: 0.5},
            {amount: Math.round(0.17*this.cum), time: 0.57*sT, pow: 0.9},
            {amount: Math.round(0.20*this.cum), time: 0.45*sT, pow: 0.9},
            {amount: Math.round(0.27*this.cum), time: 0.3*sT, pow: 1},
            {amount: Math.round(0.18*this.cum), time: 0.14*sT, pow: 0.3} ];
    } else if (this.cum > this.maxCum/2 && randBool(0.8)) {
        return [
            {amount: Math.round(0.12*this.cum), time: 0.95*sT, pow: 0.1},
            {amount: Math.round(0.22*this.cum), time: 0.72*sT, pow: 0.5},
            {amount: Math.round(0.27*this.cum), time: 0.5*sT, pow: 0.9},
            {amount: Math.round(0.33*this.cum), time: 0.3*sT, pow: 1},
            {amount: Math.round(0.18*this.cum), time: 0.14*sT, pow: 1} ];
    } else {
        return [
            {amount: Math.round(0.12*this.cum), time: 0.72*sT, pow: 0.2},
            {amount: Math.round(0.27*this.cum), time: 0.5*sT, pow: 0.5},
            {amount: Math.round(0.43*this.cum), time: 0.3*sT, pow: 1},
            {amount: Math.round(0.18*this.cum), time: 0.14*sT, pow: 0.9} ];
    }
};

Target.prototype.setUpCummingNotFallen = function() {
    this.animation = new BasedAnimation(imageManager.cumSheet, 0.8);
    this.setUpCumming();
};

Target.prototype.setUpCummingFallen = function() {
    var back = this.heading<0;
    var sheet = back ? imageManager.cumFallenBackSheet : imageManager.cumFallenFrontSheet;
    this.animation = new BasedAnimation(sheet, 0.8);
    this.setUpCumming();
    
    if (back) {
        //when falling back, goal will be headed to opp dir
        this.headingForHittingBullet = -this.heading;
    } else {
        //works alright when falling front, heading is the same as usual
        this.headingForHittingBullet = 0;
    }
};

Target.prototype.setUpCumming = function() {
    
    this.canHit = false;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    this.timeLeftShooting = this.getShootTime();
    this.timeShot = 0;
    this.shotsData = this.getShotsData();
    this.totalShoots = sum(this.shotsData.map(({amount})=>amount));
    
    this.cumSoundNumber = 0; //initialize to no sound, so first one will get played at first shoot
    this.cumSound = null;
    this.afterCumSoundPlayed = false;
    
    this.restAfterShootTimeAdded = false;
    
};


Target.prototype.endCumming = function() {
    this.setEnergy(this.maxEnergy);
    this.setCum(0);
    if (typeof this.cumHandler === "function") {
        for (let s of this.shots) {
            this.cumHandler(s);
        }
    }
    this.shots = [];
    this.removeBulletHeld() //if had stuck
    
    this.likings = this.getRandLikings(); //renew likings each time he has finished
    
    if (this.cumSound) {
        this.cumSound.pause();
        this.cumSound.currentTime = 0;
    }
    this.totalShoots = 0; //initialize for next time
    
    this.diminishHinderingSpeed = 0.3; //for recovering slower
};



Target.prototype.setUpFalling = function() {
    var back = this.heading<0;
    
    this.timeLeftFalling = back ? 0.3 : 0.7; //faster, since running left (and falls on back then)
    //TODO fallFrontSheet
    this.animation = new BasedAnimation(back ? imageManager.fallBackSheet : imageManager.fallFrontSheet,
                                        this.timeLeftFalling);
    this.animation.repeatMode = "alternate";
    this.animation.setStartFromEnd(); //since the sheet came out that way
    
    this.canHit = false;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    
    
    if (back) {
        //when falling back, goal will be headed to opp dir
        this.headingForHittingBullet = -this.heading;
    } else {
        //works alright when falling front, heading is the same as usual
        this.headingForHittingBullet = 0;
    }
};

Target.prototype.endFalling = function() {
    
};

Target.prototype.setUpFallen = function() {
    var back = this.heading<0;
    
    this.timeLeftFallen = this.getFallenTime();
    
    this.animation = new BasedAnimation(back ? imageManager.fallenBackSheet : imageManager.fallenFrontSheet,
                                        2.5);
    this.canHit = true;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
    
    
};

Target.prototype.endFallen = function() {
    this.headingForHittingBullet = 0;
};

//TODO
Target.prototype.setUpGettingHitFallen = function() {
    var back = this.heading<0;
    
    var anim = back?imageManager.gettingHitFallenBackSheet : imageManager.gettingHitFallenFrontSheet;
    this.animation = new BasedAnimation(anim, 0.5);
    
    let bulletName = this.bulletHeld.type.name || "default";
    let hasFallen = typeof this.likings[bulletName].fallen === "number";
    let liking = hasFallen ? this.likings[bulletName].fallen : this.likings[bulletName].crouch;
    this.loseEnergyPerSecond = liking.energy;
    this.gainCumPerSecond = liking.cum;
    
    if (back) {
        //when falling back, goal will be headed to opp dir
        this.headingForHittingBullet = -this.heading;
    } else {
        //works alright when falling front, heading is the same as usual
        this.headingForHittingBullet = 0;
    }
    
    this.setUpHitting();
};
Target.prototype.endGettingHitFallen = function() {
    this.endGettingHit();
};


Target.prototype.setUpGettingUp = function() {
    var back = this.heading<0;
    
    this.timeLeftGettingUp = 0.9;
    this.animation = new BasedAnimation(back ? imageManager.getUpBackSheet : imageManager.getUpFrontSheet,
                                        this.timeLeftGettingUp);
    this.animation.repeatMode = "alternate";
    this.animation.setStartFromEnd(); //since the sheet came out that way
    
    //disallow, since the heading will be messed up if start hitting and it's too special a case:
    this.canHit = false;
    this.setVelocity( 0, 0 );
    this.loseEnergyPerSecond = 0;
    this.gainCumPerSecond = 0;
};

Target.prototype.endGettingUp = function() {
    this.hindering = 0.99; //for accelarating walk slower
};



Target.prototype.update = function(dT) {
    
    var dTForMove = this.hindering ? (1-this.hindering)*dT : dT;
    this.moveTo(this.position.x + this.velocity.x*dTForMove, this.position.y + this.velocity.y*dTForMove);
    this.animation.update(dTForMove);
    
    var gD = this.animation.getGoalData();
    //this.goal.moveTo(this.position.x+gD.pos.x, this.position.y+gD.pos.y); //goal moved as target is moved
    this.goal.setAngle(this.heading<0 ? flipAngle(gD.angle) : gD.angle );
    this.goal.setSpread(gD.spread);
    this.goal.update(dT);
    
    
    switch (this.state) {
        case Target.STATES.WALKING:
            this.updateWalk(dT);
            break;
        case Target.STATES.CROUCHING:
            this.updateCrouch(dT);
            break;
        case Target.STATES.GETTING_HIT:
            this.updateGettingHit(dT);
            break;
        case Target.STATES.JERKING:
            this.updateJerking(dT);
            break;
        case Target.STATES.CUMMING:
            this.updateCumming(dT);
            break;
        case Target.STATES.FALLING:
            this.updateFalling(dT);
            break;
        case Target.STATES.FALLEN:
            this.updateFallen(dT);
            break;
        case Target.STATES.GETTING_HIT_FALLEN:
            this.updateGettingHitFallen(dT);
            break;
        case Target.STATES.GETTING_UP:
            this.updateGettingUp(dT);
            break;
         case Target.STATES.JERKING_FALLEN:
            this.updateJerking(dT, Target.STATES.CUMMING_FALLEN);
            break;
        case Target.STATES.CUMMING_FALLEN:
            this.updateCumming(dT, Target.STATES.GETTING_UP);
            break;
    }
    
    for (let s of this. shots) {
        s.update(dT);
    }
    
    
    this.addCum(dT*this.gainCumPerSecond);
    this.removeEnergy(dT*this.loseEnergyPerSecond);
};


Target.prototype.updateWalk = function(dT) {
    
    
    //soundManager.breath.play(); //TODO
    if (this.hindering) {
        this.hindering -= this.diminishHinderingSpeed*dT;
        if (this.hindering < 0) {
            this.hindering = 0;
        }
    }
    var dTForMove = this.hindering ? (1-this.hindering)*dT : dT;
    
    if (this.heading<0) { //correct animation for different walk speed left
        let corrDT = (TARGET_SPEED_LEFT-TARGET_SPEED_RIGHT)*0.05*dTForMove; //too fast, so slow down
        this.animation.update(corrDT);
    }
    
    if (this.position.x < TARGET_MIN_X) {
        this.setVelocity(TARGET_SPEED_RIGHT, 0);
        //set the position, because if update not called for long time, will go very far since dT large
        this.moveTo(TARGET_MIN_X, this.position.y);
    } else if (this.position.x>TARGET_MAX_X) {
        this.setVelocity(-TARGET_SPEED_LEFT, 0);
        this.moveTo(TARGET_MAX_X, this.position.y);
    }
    
    this.timeSinceLastCrouch += dT;
    this.timeSinceLastSlip += dT;
    
};



Target.prototype.updateCrouch = function(dT) {
    this.timeSpentCrouch += dT;
    
    if (this.moneyToPickUp && this.timeSpentCrouch >= this.timeForCrouch*0.5) { //TODO better timing
        this.moneyToPickUp = null; // pick up the money by making it null (not drawn anymore)
    }
    
    if (this.timeSpentCrouch >= this.timeForCrouch) {
        this.timeSpentCrouch = this.timeForCrouch;
        setTimeout(_=>{this.endCrouch(); this.setState(Target.STATES.WALKING);}, 100);
    }
    
};



/** Move the held bullet to a position and angle determined from the given time and tweenings.
 * Note: hit positions and goal must be set properly before calling this
*/
Target.prototype.moveBulletHeldToTime = function(time) {
    var flipBull = this.headingForHittingBullet ? this.headingForHittingBullet<0 : this.heading<0;
    this.bulletHeld.rotation = flipBull ? flipAngleBothAxis(this.goal.angle) : this.goal.angle;
    //it seems to be needed to flip also in y-axis, probably because flipping changes the rotation
    
    this.bulletHeld.moveTo( hitTween(this.hitOutPos.x, this.hitInPos.x, time),
                            hitTween(this.hitOutPos.y, this.hitInPos.y, time) );
    
    
    if (this.bulletHeld.type.tween) {
        let xFlipCoeff = flipBull ? -1 : 1;
        var dAng = this.bulletHeld.type.tween.dAngTween(time);
        //FIXME:
        //problem was here, don't flip the dAng, but change its sign
        this.bulletHeld.rotation += flipBull ? -dAng : dAng;
        let dXFromTween = xFlipCoeff * this.bulletHeld.type.tween.dXTween(time);
        let dYFromTween = this.bulletHeld.type.tween.dYTween(time);
        var cosAng = Math.cos(this.bulletHeld.rotation);
        var sinAng = Math.sin(this.bulletHeld.rotation);
        var addX = cosAng*dXFromTween - sinAng*dYFromTween; //maybe works in all cases?
        var addY = sinAng*dXFromTween + cosAng*dYFromTween;
        
        //TODO: debugging
        this.bulletTweenAddX = addX;
        this.bulletTweenAddY = addY;
        //
        
        this.bulletHeld.moveTo( this.bulletHeld.position.x + addX,
                                this.bulletHeld.position.y + addY );
    }
    
    if (this.timeForSlurpSound >= 1) {
        this.timeForSlurpSound = 0;
        var soundToStop = soundManager["slurp"+this.slurpSoundNumber];
        soundToStop.pause();
        soundToStop.currentTime = 0;
        
        this.slurpSoundNumber += 1;
        if (this.slurpSoundNumber>2) this.slurpSoundNumber = 1;
        
        var soundToPlay = soundManager["slurp"+this.slurpSoundNumber];
        soundToPlay.currentTime = 0;
        soundToPlay.play();
    }
};

Target.prototype.moveBulletHeldToFullyIn = function() {
    this.updateHitPos();
    this.moveBulletHeldToTime(1);
};


Target.prototype.updateMoanSound = function(dT) {
    if (!this.moanSound) {
        this.moanSound = soundManager.getRandomMoanSound();
    }
    if (this.moanSound.paused) {
        //console.log("Checking to start a moan sound");
        if (randBool(this.moanProb)) {
            //console.log("Started it!!", this.moanSound);
            this.moanSound = soundManager.getRandomMoanSound();
            this.moanSound.play();
        }
    }
};

Target.prototype.updateGettingHit = function(dT) {
    
    this.updateHitPos();
    this.moveBulletHeldToTime(this.timeForHitTween);
    
    
    this.updateMoanSound();
    
    this.timeLeftHitting -= dT;
    this.timeForHitTween += this.getHittingSpeed()*dT;
    if (this.timeLeftHitting<=0) {
        this.timeLeftHitting=0;
        this.removeBulletHeld();
        this.endGettingHit();
        this.setState(Target.STATES.WALKING);
        
    }
    
    if (this.energy<=0) { // can only start jerking from hitting, need otherwise???
        if (!this.bulletHeld.type.keepStuck) {
            this.removeBulletHeld();
        } else {
            this.moveBulletHeldToFullyIn();
        }
        this.endGettingHit();
        this.setState(Target.STATES.JERKING);
    }
    
    this.timeForSlurpSound += dT;
};

Target.prototype.updateHitPos = function() {
    var ux = Math.cos(this.goal.angle),
        uy = Math.sin(this.goal.angle),
        bw = this.bulletHeld.getWidth(),
        inPer = 0.45,
        outPer = 0.1;
    this.hitInPos.x = this.goal.position.x + ux*bw*inPer;
    this.hitInPos.y = this.goal.position.y + uy*bw*inPer;
    this.hitOutPos.x = this.goal.position.x - ux*bw*outPer;
    this.hitOutPos.y = this.goal.position.y - uy*bw*outPer;
    
};


Target.prototype.updateJerking = function(dT, stateAfter=Target.STATES.CUMMING) {
    
    this.updateMoanSound(dT);
    
    var addSpeedCoeff = 2/(1+this.timeLeftJerking);
    this.animation.update( addSpeedCoeff * dT); //accelerate towards end
    
    if (this.bulletHeld) {
        this.updateHitPos();
        this.moveBulletHeldToFullyIn();
    }
    
    if (this.jerkSound && this.jerkSound.paused) {
        this.jerkSoundNumber += 1;
        if (this.jerkSoundNumber > this.totalJerkSounds) {
            this.jerkSoundNumber = 1;
        }
        this. jerkSound = soundManager["jerk"+this.jerkSoundNumber];
        this.jerkSound.play();
    }
    
    this.timeLeftJerking -= dT;
    if (this.timeLeftJerking<=0) {
        this.timeLeftJerking = 0;
        this.endJerking();
        this.setState(stateAfter);
    }
    
};


Target.prototype.updateCumming = function(dT, stateAfter=Target.STATES.WALKING) {
    
    if (this.bulletHeld) {
        this.updateHitPos();
        this.moveBulletHeldToFullyIn();
    }
    
    
    if (this.shotsData && this.shotsData.length>0) {
        if (this.timeShot>=this.shotsData[this.shotsData.length-1].time) {
            var cumGD = this.animation.getCumGoalData();
            var shotD = this.shotsData.pop();
            var shotToAdd = new Shot(shotD.amount);
            shotToAdd.setBounds(0,0, PART_ON_GROUND_MAX_X, LAND_LEVEL_Y);
            var startForShot = {x: this.position.x + (this.heading<0 ? -cumGD.pos.x : cumGD.pos.x),
                                y: this.position.y + cumGD.pos.y};
            var dirAng = this.heading<0 ? flipAngle(cumGD.angle) : cumGD.angle;
            var fLen = shotD.pow*this.maxShootPow * (0.75 + Math.random()*0.25 ); //add little randomness
            var velForShot = {x: fLen*Math.cos(dirAng), y: fLen*Math.sin(dirAng)};
            shotToAdd.shoot(startForShot, velForShot, 0.3, 0.6);
            this.shots.push(shotToAdd);
            this.removeCum(shotD.amount);
            
            if (this.cumSound) {
                this.cumSound.pause();
                this.cumSound.currentTime = 0;
            }
            
            this.cumSoundNumber += 1;
            this.cumSound = soundManager["cum"+this.cumSoundNumber];
            
            if (this.cumSound) {
                this.cumSound.play();
            }
            
            if (!this.restAfterShootTimeAdded && this.shotsData.length===0) {
                this.timeLeftShooting += this.getRestAfterShootTime();
                this.restAfterShootTimeAdded = true;
                //console.log("added rest time shoot left now "+this.timeLeftShooting);
            }
        }
    }
    
    //correct the waiting shot particles' position (could have moved while waiting to be shot)
    if (this.shots.length>0) {
        var cumGD = this.animation.getCumGoalData();
        for (let p of this.shots[this.shots.length-1].parts) {
            if (!p.visible) {
                p.x = this.position.x + (this.heading<0 ? -cumGD.pos.x : cumGD.pos.x);
                p.y = this.position.y + cumGD.pos.y;
            }
        }
    }
    
    this.timeShot += dT;
    this.timeLeftShooting -= dT;
    
    
    if (!this.afterCumSoundPlayed && this.timeLeftShooting < 1
        && this.shotsData && this.shotsData.length===0) { //make sure all shot (and rest time added)
        if (this.totalShoots > 150) {
            soundManager.cum6.play();
        }
        this.afterCumSoundPlayed = true;
    }
    
    if (this.timeLeftShooting<=0) {
        this.timeLeftShooting = 0;
        this.endCumming();
        this.setState(stateAfter);
    }
};


Target.prototype.updateFalling = function(dT) {
    this.timeLeftFalling -= dT;
    
    if (this.timeLeftFalling<=0) {
        this.timeLeftFalling = 0;
        this.endFalling();
        this.setState(Target.STATES.FALLEN);
    }
};

Target.prototype.updateFallen = function(dT) {
    this.timeLeftFallen -= dT;
    
    if (this.timeLeftFallen<=0) {
        this.timeLeftFallen = 0;
        this.endFallen();
        this.setState(Target.STATES.GETTING_UP);
    }
};


Target.prototype.updateGettingHitFallen = function(dT) {
    this.updateHitPos();
    this.moveBulletHeldToTime(this.timeForHitTween);
    
    
    this.updateMoanSound();
    
    this.timeLeftHitting -= dT;
    this.timeForHitTween += this.getHittingSpeed()*dT;
    if (this.timeLeftHitting<=0) {
        this.timeLeftHitting=0;
        this.removeBulletHeld();
        this.endGettingHit();
        this.setState(Target.STATES.GETTING_UP);
        
    }
    
    if (this.energy<=0) { // can only start jerking from hitting, need otherwise???
        if (!this.bulletHeld.type.keepStuck) {
            this.removeBulletHeld();
        } else {
            this.moveBulletHeldToFullyIn();
        }
        this.endGettingHit();
        this.setState(Target.STATES.JERKING_FALLEN);
    }
    
    this.timeForSlurpSound += dT;
};

Target.prototype.updateGettingUp = function(dT) {
    this.timeLeftGettingUp -= dT;
    
    if (this.timeLeftGettingUp<=0) {
        this.timeLeftGettingUp = 0;
        this.endGettingUp();
        this.setState(Target.STATES.WALKING);
    }
};



/** Set energy meter to show the target's energy */
Target.prototype.setEnergyMeter = function(meter) {
    this.energyMeter = meter;
};

Target.prototype.removeEnergy = function(amount) {
    this.setEnergy(this.energy - amount);
    if (this.energy<0) this.setEnergy(0);
    if (this.energy>this.maxEnergy) this.setEnergy(this.maxEnergy);
    
};

Target.prototype.addEnergy = function(amount) {
    this.setEnergy(this.energy + amount);
    if (this.energy>this.maxEnergy) this.setEnergy(this.maxEnergy);
    if (this.energy<0) this.setEnergy(0); //check also this, since amount could be negative
};

Target.prototype.setEnergy = function(lev) {
    this.energy = lev;
    if (this.energyMeter) {
        this.energyMeter.setLevel(1-this.getEnergyPercent()); //inverted
    }
};


/** Set energy meter to show the target's energy */
Target.prototype.setCumMeter = function(meter) {
    this.cumMeter = meter;
};

Target.prototype.removeCum = function(amount) {
    this.setCum(this.cum - amount);
    if (this.cum<0) this.setCum(0);
    if (this.cum>this.maxCum) this.setCum(this.maxCum);
};

Target.prototype.addCum = function(amount) {
    this.setCum(this.cum + amount);
    if (this.cum>this.maxCum) this.setCum(this.maxCum);
    if (this.cum<0) this.setCum(0);
};

Target.prototype.setCum = function(amount) {
    this.cum = amount;
    if (this.cumMeter) {
        this.cumMeter.setLevel(this.cum/this.maxCum);
    }
};


/** Set a call back function for a shot that is removed from the target
 *  @param handler: the function to handle a Shot object discarded by the target
 */
Target.prototype.setCumHandler = function(handler) {
    this.cumHandler = handler;
};


Target.prototype.draw = function(ctx) {
    var flip = this.heading<0;
    this.animation.draw(ctx, this.position.x, this.position.y, 0, flip);
    
    if (this.bulletHeld) {
        //debugger;
        ctx.save();
        /*
        
        ctx.beginPath();
        //TODO use the clipPath
        //Store path like this: var p = new Path2D("M10 10 h 80 v 80 h -80 Z");
        //ctx.moveTo(this.goal.position.x, this.goal.position.y + this.goal.radius);
        var oppAng = Math.PI+this.goal.angle;
        ctx.arc(this.goal.position.x, this.goal.position.y, this.goal.radius*0.6,
                oppAng - Math.PI/2, oppAng + Math.PI/2, false );
        ctx.lineTo(this.position.x, flip?H:0);
        ctx.lineTo(flip?W:0, flip?H:0);
        ctx.lineTo(flip?W:0, flip?0:H);
        ctx.lineTo(this.position.x, flip?0:H);
        ctx.closePath();
        ctx.fillStyle = "rgba(0, 200, 200, 0.6)";
        ctx.fill(); //for testing to see the clip area
        ctx.clip();
        */
        //TODO making new path every update, can we store it? //TODO
        
        var flipBull = this.headingForHittingBullet ? this.headingForHittingBullet<0 : flip;
        var unusualSide = this.headingForHittingBullet && flipBull!==flip;
        //special cases, since turned out messy
        if (this.state === Target.STATES.JERKING_FALLEN && flip) {
            unusualSide = true;
        }
        var clipPath = this.animation.getClipPath(this.position.x, this.position.y, flip, unusualSide);
        if (clipPath) {
            ctx.fillStyle = "rgba(0, 200, 200, 0.6)";
            //ctx.fill(clipPath); //for debugging
            ctx.clip(clipPath);
        }
        this.bulletHeld.draw(ctx, flipBull);
        ctx.restore();
    }
    
    
    //----debugging stuff---------------
    /*
    ctx.globalAlpha = 0.3;
    this.goal.draw(ctx);
    
    
    ctx.fillStyle = "#909";
    ctx.beginPath();
    ctx.arc(this.hitInPos.x, this.hitInPos.y, 5, 0, TWO_PI);
    ctx.fill();
    ctx.fillStyle = "#abc";
    ctx.beginPath();
    ctx.arc(this.hitOutPos.x, this.hitOutPos.y, 5, 0, TWO_PI);
    ctx.fill();
    
    if (this.bulletHeld) {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "#222";
        ctx.strokeStyle = "#f00";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.bulletHeld.position.x, this.bulletHeld.position.y, 8, 0, TWO_PI);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.bulletHeld.position.x, this.bulletHeld.position.y);
        var lineEndX = this.bulletHeld.position.x + 70*Math.cos(this.bulletHeld.rotation);
        var lineEndY = this.bulletHeld.position.y + 70*Math.sin(this.bulletHeld.rotation);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();
        
        
        ctx.globalAlpha = 0.95;
        ctx.font = "16px Verdana";
        ctx.fillStyle = "green";
        ctx.fillText("Flipped: "+flipBull, 200, 150);
        ctx.fillText("Rotation: "+this.bulletHeld.rotation, 200, 200);
        
        ctx.fillText("Add x from tween: "+this.bulletTweenAddX, 200, 250);
        ctx.fillText("Add y from tween: "+this.bulletTweenAddY, 200, 270);
        
    }
    */
    
    ctx.globalAlpha = 1;
    //----------------------------------
    
    
    if (this.moneyToPickUp) {
        this.moneyToPickUp.draw(ctx);
    }
    
    
    for (let s of this.shots) {
        s.draw(ctx);
    }
    
    
    /*
    switch (this.state) {
        case Target.STATES.WALKING:
            this.drawWalk(ctx);
            break;
        case Target.STATES.CROUCHING:
            this.drawCrouch(ctx);
            break;
        case Target.STATES.GETTING_HIT:
            this.drawGettingHit(ctx);
            break;
    }
    */
}

/*
Target.prototype.drawWalk = function(ctx) {
    this.animation.draw(ctx, this.position.x, this.position.y, 0, this.heading<0);
    ctx.globalAlpha = 0.6;
    this.goal.draw(ctx);
    ctx.globalAlpha = 1;
};

Target.prototype.drawCrouch = function(ctx) {
    this.animation.draw(ctx, this.position.x, this.position.y, 0, this.heading<0);
    ctx.globalAlpha = 0.6;
    this.goal.draw(ctx);
    ctx.globalAlpha = 1;
};

Target.prototype.drawGettingHit = function(ctx) {
    this.animation.draw(ctx, this.position.x, this.position.y, 0, this.heading<0);
    ctx.globalAlpha = 0.6;
    this.goal.draw(ctx);
    ctx.globalAlpha = 1;
};
*/
