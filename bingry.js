/* some of code from: https://burakkanber.com/blog/modeling-physics-javascript-gravity-and-drag/ */

//online at minkkilaukku.github.io
const SAVE_STORAGE_NAME = "lankki_miukku_bungryArseTallenusData";

var W = 800;
var H = 600;
var FPS_DRAW = 60;
var FPS_UPDATE = 60;

const SLINGSTART = {x: 150, y: 370};
const SLING_RELEASE_MAX_X = 160;

var LAND_LEVEL_Y = 500;
var TARGET_MIN_X = 300;
var TARGET_MAX_X = 750;
var TARGET_SPEED_RIGHT = 50;
var TARGET_SPEED_LEFT = 150;

var PART_ON_GROUND_MAX_X = W-10;
var PART_ON_GROUND_R = 5;
var PART_ON_GROUND_COLOR = "rgba(190, 190, 190, 0.95)";
var PART_ON_GROUND_GATHER_COLOR = "rgba(190, 190, 190, 0.75)";
var GATHER_PART_MAX_LINE_LEN = 60;
var PART_ON_GROUND_GATHER_LOC = {x: 100, y:50}; //to where they move when gathered
var PART_ON_GROUND_GATHER_TIME = 1.2; //time it takes, in seconds

var MAX_TIME_PART_ON_GROUND = 45; //time in seconds until ungathered cum will be removed

var MAX_TIME_MONEY_ON_GROUND = 60; //time in seconds until ungathered money will be removed
var MAX_TIME_SLIP_ON_GROUND = 60; //time in seconds until ungathered money will be removed
var TIME_KEEP_USED_SLIP = 3;

var splashScreen;
var canvas;
var ctx;
var mouse = {x: 0, y: 0, isDown: false};

var sling = new Sling();
sling.forkLen = 120;
sling.handleLen = LAND_LEVEL_Y - SLINGSTART.y - 0.3535*120;
var bulletToShoot = new Bullet();
var bulletTypeInd = 0;
var bulletsInAir = [];
var moneyOnGround = [];
var slipBulletsOnGround = [];
var usedSlipBullets = [];
var target = new Target();
var energyMeter = new EnergyMeter();
energyMeter.setPosition(W-50, 20);
energyMeter.setSize(Math.min(20, W/10), H/4);
target.setEnergyMeter(energyMeter);
var cumMeter = new EnergyMeter();
cumMeter.setPosition(energyMeter.x-20, 20);
cumMeter.setSize(15, H/4);
cumMeter.setColor("rgba(190, 190, 190, 0.95)");
target.setCumMeter(cumMeter);

var cumOnGround = [];

target.setCumHandler(function(shot) {
    //don't need that many gatherable particles, increase the value of one instead
    var valForP = 1;
    var pushEveryIth = 1;
    var maxToHave = 8;
    let n = shot.parts.length;
    if (n >= maxToHave) {
        pushEveryIth = Math.max(1, Math.floor(n/maxToHave));
        valForP = pushEveryIth;
    }
    for (let i=0; i<shot.parts.length; i+=pushEveryIth){
        let p = shot.parts[i];
        p.value = valForP;
        p.beenOnGround = 0;
        cumOnGround.push(p);
    }
    
    //console.log("There were "+n+" particles in the shot");
    //console.log("Added every "+pushEveryIth+" one with the value "+valForP);
});

var gatheredCumParts = []; //where they are when moving towards the target and thus getting gathered
var gatheredCum = 0; //amount of gathered cum

/** The DOM-elements of the items with flags whether each is bought*/
var itemElements = []; //[ {item: <div>, bought: false}, ... ]



var lastDrawT = 0;
var lastT = Date.now();
var lastUpdateT = 0;
var paused = false;


var getMousePosition = function(e) {
    var bdd = canvas.getBoundingClientRect();
    mouse.x = e.clientX - bdd.left;
    mouse.y = e.clientY - bdd.top;
};

var mouseMove = function(e) {
    getMousePosition(e);
    
    if (mouse.isDown) {
        sling.moveCupTo(mouse.x, mouse.y);
        bulletToShoot.moveTo(mouse.x, mouse.y);
        bulletToShoot.rotation = sling.getCupAngle();
        sling.setOkToShoot(mouse.x <= SLING_RELEASE_MAX_X);
    }
};

var mouseDown = function(e) {
    if (e.which == 1) {
        getMousePosition(e);
        mouse.isDown = true;
        if (!bulletToShoot) {
            //bulletToShoot = new Bullet(Bullet.typeForInd(bulletTypeInd));
            setBullet(bulletTypeInd);
        }
        sling.moveCupTo(mouse.x, mouse.y);
        sling.setOkToShoot(mouse.x <= SLING_RELEASE_MAX_X);
        sling.takeHold();
        bulletToShoot.isHeld = true;
        bulletToShoot.moveTo(mouse.x, mouse.y);
        bulletToShoot.rotation = sling.getCupAngle();
    }
    canvas.focus();
    e.preventDefault();
};

var mouseUp = function(e) { 
    if (e.which == 1) {
        if (mouse.isDown) {
            if (mouse.x <= SLING_RELEASE_MAX_X && bulletToShoot) {
                sling.letGo(true);
                //var vel = sling.getSlingVelocity();
                bulletToShoot.setVelocity(sling.cupVelocity.x, sling.cupVelocity.y);
                bulletToShoot.isHeld = false;
                bulletsInAir.push(bulletToShoot);
                bulletToShoot = null;
            } else {
                sling.letGo(false);
                bulletToShoot = null; //don't shoot the bullet
            }
            sling.setOkToShoot(true);
        }
        mouse.isDown = false;
    }
};



function startGame() {
    target.init();
    sling.moveTo(SLINGSTART.x, SLINGSTART.y);
    sling.moveCupTo(SLINGSTART.x, SLINGSTART.y);
    setBullet(bulletTypeInd);
    //bulletToShoot.moveTo(SLINGSTART.x, SLINGSTART.y);
    target.moveTo(500, LAND_LEVEL_Y);
    target.setVelocity(TARGET_SPEED_RIGHT, 0);
    target.setState(Target.STATES.WALKING);
    lastT = Date.now();
    gameTick();
}


function setBullet(ind) {
    bulletToShoot = makeBullet(Bullet.typeForInd(ind));
    bulletToShoot.isHeld = true;
    bulletToShoot.moveTo(sling.cupPosition.x, sling.cupPosition.y);
}

/** Set the type of bullet to shoot. Also sets the current bullet to shoot to this type. */
function setBulletType(ind) {
    bulletTypeInd = ind;
    setBullet(ind);
    
    if (ind===3) {
        soundManager.buzzOut.play();
    }
}


function updateGatheredCum() {
    document.getElementById("cumAmount").textContent = gatheredCum;
}






function getItems() {
    var items = document.getElementsByClassName("inventoryItem");
    var res = Array.from(items).map(el=>{
        return {item: el,
                bought: el.getAttribute("bought") === "true",
                price: parseInt(el.getAttribute("price"))
               };
    });
    return res;
    
}

function updateItems() {
    for (let item of itemElements) {
        /*
        item.item.classList.remove("notBoughtInventoryItem");
        item.item.classList.remove("boughtInventoryItem");
        
        item.item.classList.add(item.bought ? "boughtInventoryItem" : "notBoughtInventoryItem");
        */
        
        item.item.setAttribute("canAfford", gatheredCum >= item.price);
        item.item.setAttribute("bought", item.bought);
        
        var hider = item.item.getElementsByClassName("itemHider")[0];
        if (hider) {
            hider.textContent = item.price;
            hider.style.display = item.bought ? "none" : "block";
        }
    }
};


function inventoryItemClicked(ind) {
    var item = itemElements[ind];
    if (item.bought) {
        setBulletType(ind);
    } else {
        if (gatheredCum >= item.price) {
            buyItem(ind);
        }
    }
    updateItems();
}

function buyItem(ind) {
    gatheredCum -= itemElements[ind].price;
    itemElements[ind].bought = true;
    updateGatheredCum();
    updateItems();
    
    saveData();
}


function saveData() {
    var save = {gatheredCum: gatheredCum,
               items: []
               };
    for (let i=0; i<itemElements.length; i++) {
        save.items[i] = {};
        save.items[i].bought = itemElements[i].bought;
    }
    localStorage.setItem(SAVE_STORAGE_NAME, JSON.stringify(save));
}

function getSavedData() {
    var save = JSON.parse(localStorage.getItem(SAVE_STORAGE_NAME));
    
    if (!save) return false;
    
    for (let i=0; i<itemElements.length; i++) {
        itemElements[i].bought = save.items[i].bought;
    }
    gatheredCum = save.gatheredCum;
    updateItems();
    updateGatheredCum();
    
    return true;
}


function mouseOnDisk(x, y, r) {
    return (mouse.x-x)**2 + (mouse.y-y)**2 <= r**2;
}

function updateCumPartsOnGround(dT) {
    
    
    for (let p of cumOnGround) {
        if (p.y<LAND_LEVEL_Y && p.x<PART_ON_GROUND_MAX_X-1) {
            p.y = LAND_LEVEL_Y;
        }
        p.beenOnGround += dT;
    }
    
    var hadDeletes = false;
    for (let i=0; i<cumOnGround.length; i++) {
        let p=cumOnGround[i];
        if (mouseOnDisk(p.x, p.y, PART_ON_GROUND_R)) {
            addGatheredCumPart(cumOnGround[i]);
            delete cumOnGround[i];
            hadDeletes = true;
        } else if (p.beenOnGround>MAX_TIME_PART_ON_GROUND) {
            delete cumOnGround[i];
            hadDeletes = true;
        }
    }
    if (hadDeletes) {
        cumOnGround = cumOnGround.filter(x=>x);
    }
    
};


function addGatheredCumPart(p) {
    p.origX = p.x;
    p.origY = p.y;
    p.time = 0;
    gatheredCumParts.push(p);
};


function updateGatheredCumParts(dT) {
    
    //move them
    for (let p of gatheredCumParts) {
        p.time += dT;
        if (p.time>=PART_ON_GROUND_GATHER_TIME) {
            p.time = PART_ON_GROUND_GATHER_TIME;
            p.finishedGathering = true;
        }
        var f = p.time/PART_ON_GROUND_GATHER_TIME;
        p.x = gatherTween(p.origX, PART_ON_GROUND_GATHER_LOC.x, f);
        p.y = gatherTween(p.origY, PART_ON_GROUND_GATHER_LOC.y, f);
    }
    
    //remove finished ones
    var hadDeletes = false;
    for (let i=0; i<gatheredCumParts.length; i++) {
        let p=gatheredCumParts[i];
        if (p.finishedGathering) {
            delete gatheredCumParts[i];
            gatheredCum += p.value || 1;
            hadDeletes = true;
        }
    }
    if (hadDeletes) {
        gatheredCumParts = gatheredCumParts.filter(x=>x);
        saveData();
    }
    
    if (hadDeletes) { //did increase the amount
        updateGatheredCum();
        updateItems();
    }
    
}

function drawCumPartsOnGround(p) {
    
    ctx.fillStyle = PART_ON_GROUND_COLOR;
    cumOnGround.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x, p.y, PART_ON_GROUND_R, 0, TWO_PI);
        ctx.fill();
    });
};

function drawGatheredCumParts() {
    let maxLineLenSqr = GATHER_PART_MAX_LINE_LEN**2;
    ctx.fillStyle = PART_ON_GROUND_GATHER_COLOR;
    ctx.strokeStyle = PART_ON_GROUND_GATHER_COLOR;
    ctx.lineWidth = 7;
    gatheredCumParts.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x, p.y, PART_ON_GROUND_R, 0, TWO_PI);
        ctx.fill();
        
        if (p.y > LAND_LEVEL_Y - GATHER_PART_MAX_LINE_LEN) { //make lines to close ground parts
            ctx.beginPath();
            for (let pG of cumOnGround) {
                if ((p.x-pG.x)**2 + (p.y-pG.y)**2 <= maxLineLenSqr) {
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pG.x, pG.y);
                }
            }
            ctx.stroke();
        }
        
    });
    
    //lines between gathered parts
    let n = gatheredCumParts.length;
    ctx.strokeStyle = PART_ON_GROUND_GATHER_COLOR;
    ctx.beginPath();
    for (let i=0; i<n; i++) {
        let p1 = gatheredCumParts[i];
        for (let j=i+1; j<n; j++) {
            let p2 = gatheredCumParts[j];
            if ((p1.x-p2.x)**2 + (p1.y-p2.y)**2 <= maxLineLenSqr) {
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
            }
        }
    }
    ctx.stroke();
    
};



function updateUsedSlipBullets(dT) {
    let hadUsedSlipBulletsDeletes = false;
    for (let i=usedSlipBullets.length-1; i>=0; i--) {
        let s = usedSlipBullets[i];
        s.update(dT);
        s.timeSinceUse += dT;
        if (s.timeSinceUse > TIME_KEEP_USED_SLIP) {
            delete usedSlipBullets[i];
            hadUsedSlipBulletsDeletes = true;
        }
    }
    if (hadUsedSlipBulletsDeletes) {
        usedSlipBullets = usedSlipBullets.filter(x=>x);
    }
}

function drawUsedSlipBullets() {
    var startAlphaTime = TIME_KEEP_USED_SLIP-1;
    var factForAlpha = 1/(TIME_KEEP_USED_SLIP - startAlphaTime);
    for (let s of usedSlipBullets) {
        if (s.timeSinceUse >= startAlphaTime) {
            ctx.globalAlpha = (TIME_KEEP_USED_SLIP - s.timeSinceUse) * factForAlpha;
        }
        s.draw(ctx);
        ctx.globalAlpha = 1;
    }
}


function gameTick() {
    
    let tempT = Date.now();
    let dT = tempT - lastT;
    lastDrawT += dT;
    lastT = tempT;
    //console.log("dT = "+dT);
    //console.log("lastDrawT = "+lastDrawT);
    
    if (!paused) {
        lastUpdateT += dT;
        if (lastUpdateT>=1000/FPS_UPDATE) {
            update(lastUpdateT/1000);
            lastUpdateT = 0;
        }
    }
    
    if (lastDrawT>=1000/FPS_DRAW) {
        draw();
        lastDrawT = 0;
    }
    
    window.requestAnimationFrame(gameTick);
}


/** Update the game given the tick time dT in seconds. */
function update(dT) {
    //console.log("updating with dT = "+dT);
    sling.update(dT);
    if (bulletToShoot) bulletToShoot.update(dT);
    
    target.update(dT);
    
    
    let hadMoneyDeletes = false;
    let targetPickedUp = false;
    for (let i=moneyOnGround.length-1; i>=0; i--) {
        let m = moneyOnGround[i];
        m.update(dT);
        if (!targetPickedUp && target.willPickUp(m)) {
            target.pickUp(m, function(retD) {
                if (!retD.pickedUp) {
                    moneyOnGround.push(retD.toReturn);
                }
            });
            moneyOnGround.splice(i, 1);
            targetPickedUp = true;
        }
        if (m.beenOnGround > MAX_TIME_MONEY_ON_GROUND) {
            delete moneyOnGround[i];
            hadMoneyDeletes = true;
        }
    }
    if (hadMoneyDeletes) {
        moneyOnGround = moneyOnGround.filter(x=>x);
    }
    
    
    let hadSlipBulletDeletes = false;
    let targetSlipped = false;
    for (let i=slipBulletsOnGround.length-1; i>=0; i--) {
        let s = slipBulletsOnGround[i];
        s.update(dT);
        if (!targetSlipped && target.willSlip(s)) {
            target.slip(s);
            targetSlipped = true;
            usedSlipBullets.push(s);
            s.timeSinceUse = 0;
            slipBulletsOnGround.splice(i, 1);
        }
        if (s.beenOnGround > MAX_TIME_SLIP_ON_GROUND) {
            delete slipBulletsOnGround[i];
            hadSlipBulletDeletes = true;
        }
    }
    if (hadSlipBulletDeletes) {
        slipBulletsOnGround = slipBulletsOnGround.filter(x=>x);
    }
    
    
    updateUsedSlipBullets(dT);
    
    
    for (let b of bulletsInAir) {
        b.update(dT);
        if (b.canHit() && target.bulletHits(b)) {
            target.onHit(b);
            b.takenByTarget = true;
            break; //TODO if multiple targets, need to check for others
        }
    }
    
    //easier just make a new list of the ones to keep, might be too costly(?)
    var bulletsToKeep = [];
    bulletsInAir.forEach(b=>{
        if ( !(b.position.y > H + 100 || b.position.x > W+300 || b.takenByTarget) ) {
            if (b instanceof MoneyBullet && b.onGround) {
                moneyOnGround.push(b);
            } else if (b instanceof SlipBullet && b.onGround) {
                slipBulletsOnGround.push(b);
            } else{
                bulletsToKeep.push(b);
            }
        }
    });
    
    bulletsInAir = bulletsToKeep;
    
    
    //energyMeter.setLevel(1-target.getEnergyPercent()); //inverted (full energy means empty bar)
    energyMeter.update(dT);
    cumMeter.update(dT);
    
    updateCumPartsOnGround(dT);
    updateGatheredCumParts(dT);
}


function draw() {
    //console.log("Drawing");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sling.drawBack(ctx);
    if (bulletToShoot) bulletToShoot.draw(ctx);
    target.draw(ctx);
    moneyOnGround.forEach(m=>m.draw(ctx));
    slipBulletsOnGround.forEach(s=>s.draw(ctx));
    drawUsedSlipBullets();
    
    drawCumPartsOnGround();
    
    bulletsInAir.forEach(b=>b.draw(ctx));
    
    sling.drawFront(ctx);
    
    drawGatheredCumParts();
    
    energyMeter.draw(ctx);
    cumMeter.draw(ctx);
}


function showGame() {
    document.getElementById("gameDiv").style.display = "block";
}

function hideGame() {
    document.getElementById("gameDiv").style.display = "none";
}

function toggleMute() {
    var muteButt = document.getElementById("muteButton");
    var soundOn = muteButt.getAttribute("sound") === "on";
    muteButt.setAttribute("sound", soundOn ? "off" : "on");
    soundManager.setSoundOn(!soundOn);
};




window.onload = function() {
    imageManager.init();
    soundManager.init();
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    canvas.onmousemove = mouseMove; //getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    
    itemElements = getItems();
    updateItems();
    
    splashScreen = new Splash();
    
    splashScreen.setOnPlayClick(function() {
        startGame();
        splashScreen.stop();
        splashScreen.hide();
        showGame();
    });
    
    splashScreen.start();
    
    getSavedData();
    
}