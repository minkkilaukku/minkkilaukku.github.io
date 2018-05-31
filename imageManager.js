//constants for offsets and clip paths
const WALK_OFFS = [{"pos":{"x":-13.75,"y":-176},"angle":-0.2,"spread":0.4},{"pos":{"x":-13.25,"y":-173},"angle":-0.2,"spread":0.4},{"pos":{"x":-12.75,"y":-172},"angle":-0.2,"spread":0.4},{"pos":{"x":-14.25,"y":-172},"angle":-0.2,"spread":0.4},{"pos":{"x":-12.75,"y":-171},"angle":-0.2,"spread":0.4},{"pos":{"x":-12.25,"y":-175},"angle":-0.2,"spread":0.4},{"pos":{"x":-13.75,"y":-173},"angle":-0.2,"spread":0.4},{"pos":{"x":-13.25,"y":-174},"angle":-0.2,"spread":0.4}];



// old = [{"pos":{"x":-22.75,"y":-110},"angle":-0.2,"spread":0.4},{"pos":{"x":-13.25,"y":-120},"angle":-0.2,"spread":0.4},{"pos":{"x":-18.75,"y":-118},"angle":-0.2,"spread":0.4},{"pos":{"x":-4.25,"y":-115},"angle":-0.2,"spread":0.4},{"pos":{"x":-22.75,"y":-116},"angle":-0.2,"spread":0.4},{"pos":{"x":-17.25,"y":-119},"angle":-0.2,"spread":0.4},{"pos":{"x":-32.75,"y":-117},"angle":-0.2,"spread":0.4},{"pos":{"x":-13.25,"y":-118},"angle":-0.2,"spread":0.4}];
 


const GET_HIT_OFFS = [{"pos":{"x":-40.5,"y":-174},"angle":0.2,"spread":0.4},{"pos":{"x":-41.5,"y":-172},"angle":0.2,"spread":0.4},{"pos":{"x":-42.5,"y":-170},"angle":0.2,"spread":0.4},{"pos":{"x":-40.5,"y":-169},"angle":0.2,"spread":0.4}];

//old = [{"pos":{"x":-17.25,"y":-119},"angle":-0.2,"spread":0.4}];

/** relative path data, just add "M x y" to the beginning  */
const GET_HIT_CLIP_PATH_DATAS = ["l -39.5 -143 l -2 -10 l -4 -5 l -3 -7 l 1 -8 l 4 -10 l 3 -5 l -5 -2 l 3 -47 l 18 -56", "l -42.5 -153 l -6 -7 l 0 -10 l 2 -7 l 4 -8 l 3 -3 l 7 2 l 12 -95", "l -38.5 -133 l -5 -20 l -3 -6 l -1 -9 l 3 -9 l 3 -6 l 3 -7 l 12 -88", "l -38.5 -141 l -3 -11 l -6 -11 l -1 -9 l 3 -8 l 5 -7 l 3 -3 l 7 -80 l 5 -12"];

//old = "l 1 -95 l -10 -7 l -3 -6 l 1 -8 l 1 -8 l 4 -5 l 5 -5 l 2 1";


const CROUCH_OFFS = [{"pos":{"x":-42.375,"y":-183},"angle":0.2,"spread":1.1},{"pos":{"x":-41.125,"y":-178},"angle":0.2,"spread":1.1},{"pos":{"x":-42.875,"y":-171},"angle":0.2,"spread":1.1},{"pos":{"x":-33.625,"y":-169},"angle":0.2,"spread":1.1}];

//old = [{"pos":{"x":-16,"y":-114},"angle":0.2,"spread":0.4},{"pos":{"x":-27,"y":-117},"angle":0.3,"spread":0.6},{"pos":{"x":-28,"y":-135},"angle":0.4,"spread":1.1}];



const GET_HIT_CROUCH_OFFS = [{"pos":{"x":-43,"y":-186},"angle":0.2,"spread":0.4},{"pos":{"x":-41,"y":-186},"angle":0.2,"spread":0.4},{"pos":{"x":-39,"y":-185},"angle":0.2,"spread":0.4},{"pos":{"x":-41,"y":-185},"angle":0.2,"spread":0.4}];
      
      //old = [{"pos":{"x":-40,"y":-140},"angle":0.4,"spread":0.4},{"pos":{"x":-41,"y":-136},"angle":0.4,"spread":0.4}];

const GET_HIT_CROUCH_CLIP_PATH_DATAS = ["l -33 -158 l -9 -18 l -4 -5 l 1 -10 l 3 -10 l 5 -7 l 5 -6", "l -35 -163 l -1 -5 l -7 -8 l -3 -8 l 1 -9 l 6 -15 l 8 -7", "l -33 -158 l -2 -8 l -6 -8 l -5 -9 l 1 -9 l 5 -12 l 7 -5", "l -31 -157 l -6 -11 l -4 -7 l -5 -7 l 1 -12 l 8 -11 l 5 -7"];
      
      //old = ["l -49 -113 l 0 -8 l 2 -10 l 4 -8 l 5 -8 l 6 -6 l 7 -7", "l -49 -113 l 0 -8 l 2 -10 l 4 -8 l 5 -8 l 6 -6 l 7 -7"];


const JERK_OFFS = [{"pos":{"x":-24.75,"y":-167},"angle":-0.2,"spread":0.4},{"pos":{"x":-26.25,"y":-169},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.75,"y":-167},"angle":-0.2,"spread":0.4},{"pos":{"x":-28.25,"y":-168},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.75,"y":-166},"angle":-0.2,"spread":0.4},{"pos":{"x":-23.25,"y":-163},"angle":-0.2,"spread":0.4}];

const JERK_CLIP_PATH_DATAS = ["l -14.75 -126 l -4 -21 l -3 -8 l -3 -4 l -2 -7 l 2 -8 l 3 -7 l 4 -7", "l -16.25 -139 l -1 -8 l -5 -7 l -3 -6 l -1 -5 l 1 -7 l 4 -9 l 4 -9", "l -15.75 -135 l 0 -7 l -1 -7 l -7 -8 l -3 -6 l 0 -8 l 3 -10 l 6 -8", "l -16.25 -138 l -3 -10 l -3 -7 l -5 -7 l 0 -9 l 6 -10 l 4 -6", "l -17.75 -136 l 0 -10 l -2 -6 l -3 -4 l -4 -7 l 1 -8 l 3 -8 l 4 -6 l 3 -4", "l -17.25 -136 l 0 -6 l -2 -7 l -5 -9 l -2 -6 l 1 -10 l 5 -10 l 7 -8"];

const SHOOTER_OFFS = [{"pos":{"x":-28.083333333333336,"y":-165},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.250000000000007,"y":-163},"angle":-0.2,"spread":0.4},{"pos":{"x":-24.41666666666668,"y":-164},"angle":-0.2,"spread":0.4},{"pos":{"x":-24.583333333333336,"y":-162},"angle":-0.2,"spread":0.4},{"pos":{"x":-26.75000000000002,"y":-163},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.916666666666707,"y":-162},"angle":-0.2,"spread":0.4}];

const SHOOTER_DICK_OFFS = [{"pos":{"x":46.916666666666664,"y":-193},"angle":-0.3,"spread":0.4},{"pos":{"x":46.74999999999999,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":46.58333333333332,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":47.416666666666664,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":47.24999999999998,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":48.08333333333329,"y":-194},"angle":-0.3,"spread":0.4}];

const SHOOTER_CLIP_PATH_DATAS = ["l -18.083333333333336 -125 l -2 -17 l -1 -6 l -3 -7 l -2 -4 l -2 -9 l 1 -6 l 2 -7 l 5 -6","l -20.25 -136 l -4 -2 l 3 -4 l 1 -7 l -2 -6 l -5 -7 l 0 -9 l 4 -11 l 5 -6","l -19.416666666666686 -141 l -14 -3 l 5 -6 l 8 -5 l -3 -5 l -2 -7 l 0 -12 l 7 -6","l -19.58333333333337 -136 l -2 -6 l 1 -12 l -7 -9 l 3 -13 l 2 -8 l 2 -2","l -19.75 -141 l -2 -11 l -4 -6 l -2 -7 l 1 -11 l 5 -10 l 4 -3","l -19.916666666666742 -139 l 0 -12 l -7 -8 l -1 -8 l 2 -11 l 3 -5 l 4 -5"];



const FALL_BACK_OFFS = [{"pos":{"x":-0.5,"y":-66},"angle":2.4429,"spread":1.7402},{"pos":{"x":-8.5,"y":-73},"angle":3.6739,"spread":1.302},{"pos":{"x":-35.5,"y":-107},"angle":-0.9447,"spread":1.167},{"pos":{"x":-40.5,"y":-128},"angle":-0.8215,"spread":0.6256},{"pos":{"x":-46.5,"y":-140},"angle":-0.8308,"spread":0.1759},{"pos":{"x":-54.5,"y":-159},"angle":-0.9179,"spread":0.0831}];









const flipClipPath = function(path) {
    var ls = path.split("l").filter(s=>s.length>0);
    var fLs = ls.map(pair=>pair.trim().split(" ")
                     .map((x,i)=>(i===0?-1:1)*parseFloat(x)));
    return fLs.map(pair=>"l "+pair[0]+" "+pair[1]).join(" ");
}

//flipped datas with function
const GET_HIT_CLIP_PATH_FLIP_DATAS = GET_HIT_CLIP_PATH_DATAS.map(flipClipPath);
const GET_HIT_CROUCH_CLIP_PATH_FLIP_DATAS = GET_HIT_CROUCH_CLIP_PATH_DATAS.map(flipClipPath);
const JERK_CLIP_PATH_FLIP_DATAS = JERK_CLIP_PATH_DATAS.map(flipClipPath);
const SHOOTER_CLIP_PATH_FLIP_DATAS = SHOOTER_CLIP_PATH_DATAS.map(flipClipPath);





const imageManager = {};

imageManager.init = function() {
    imageManager.bulletImage = new BasedImage("pics/bullets/bulletSmall.png", 83, 13);
    imageManager.buzzImage = new BasedImage("pics/bullets/buzzBulletSmall.png", 44, 9);
    imageManager.plugImage = new BasedImage("pics/bullets/plugBulletSmall.png", 41, 11);
    imageManager.jellyImage = new BasedImage("pics/bullets/jellyBulletSmall.png", 87, 14);
    imageManager.moneyImage = new BasedImage("pics/bullets/moneySmall.png", 21, 8);
    //imageManager.slingImage = new BasedImage("pics/sling.png", 92, 15);
    
    
    imageManager.walkSheet = new BasedSpriteSheet("pics/anims/walkAnim.png", 8, WALK_OFFS);
    
    imageManager.gettingHitSheet = new BasedSpriteSheet("pics/anims/gettingHitAnim.png", 4, GET_HIT_OFFS);
    imageManager.gettingHitSheet.clipPathDatas = GET_HIT_CLIP_PATH_DATAS;
    imageManager.gettingHitSheet.clipPathFlippedDatas = GET_HIT_CLIP_PATH_FLIP_DATAS;
    
    imageManager.gettingHitCrouchedSheet = new BasedSpriteSheet("pics/anims/gettingHitCrouchAnim.png", 4, GET_HIT_CROUCH_OFFS);
    imageManager.gettingHitCrouchedSheet.clipPathDatas = GET_HIT_CROUCH_CLIP_PATH_DATAS;
    imageManager.gettingHitCrouchedSheet.clipPathFlippedDatas = GET_HIT_CROUCH_CLIP_PATH_FLIP_DATAS;
    
    imageManager.crouchSheet = new BasedSpriteSheet("pics/anims/crouchAnim.png", 4, CROUCH_OFFS);
    
    imageManager.jerkSheet = new BasedSpriteSheet("pics/anims/jerkAnim.png", 6, JERK_OFFS);
    imageManager.jerkSheet.clipPathDatas = JERK_CLIP_PATH_DATAS;
    imageManager.jerkSheet.clipPathFlippedDatas = JERK_CLIP_PATH_FLIP_DATAS;
    
    imageManager.cumSheet = new BasedSpriteSheet("pics/anims/cumAnim.png", 6, SHOOTER_OFFS);
    imageManager.cumSheet.cumGoalDatas = SHOOTER_DICK_OFFS;
    imageManager.cumSheet.clipPathDatas = SHOOTER_CLIP_PATH_DATAS;
    imageManager.cumSheet.clipPathFlippedDatas = SHOOTER_CLIP_PATH_FLIP_DATAS;
    
    
    imageManager.fallBackSheet = new BasedSpriteSheet("pics/anims/fallBackAnim.png", 6, FALL_BACK_OFFS);
    
};



imageManager.getPercentReady = function() {
    let total=0, ready=0;
    for (let prob in imageManager) {
        let x = imageManager[prob];
        if (x instanceof BasedSpriteSheet || x instanceof BasedImage ) {
            total += 1;
            ready += x.ready ? 1 : 0;
        }
    }
    if (total===0) return 1;
    return ready/total;
};