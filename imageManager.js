const flipClipPath = function(path) {
    var ls = path.split("l").filter(s=>s.length>0);
    var fLs = ls.map(pair=>pair.trim().split(" ")
                     .map((x,i)=>(i===0?-1:1)*parseFloat(x)));
    return fLs.map(pair=>"l "+pair[0]+" "+pair[1]).join(" ");
}


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



const GET_HIT_CROUCH_OFFS = [{"pos":{"x":-38.375,"y":-178},"angle":0.0156,"spread":1.9628},{"pos":{"x":-38.125,"y":-178},"angle":0.0476,"spread":1.9058},{"pos":{"x":-40.875,"y":-176},"angle":0.0317,"spread":1.9034},{"pos":{"x":-39.625,"y":-178},"angle":0.0308,"spread":2.026}];
      
      //old = [{"pos":{"x":-40,"y":-140},"angle":0.4,"spread":0.4},{"pos":{"x":-41,"y":-136},"angle":0.4,"spread":0.4}];

const GET_HIT_CROUCH_CLIP_PATH_DATAS = ["l -15.375 -116 l -18 -41 l -6 -8 l -3 -8 l 3 -11 l 2 -4 l 10 -4 l 39 -79","l -1.125 -99 l -21 -31 l -7 -15 l -3 -11 l -4 -6 l -6 -9 l 3 -10 l 2 -7 l 9 -4 l 4 1 l 27 -73","l -1.274993896484375 -99 l -21 -32 l -8 -16 l -3 -8 l -8 -14 l 3 -13 l 9 -10 l 1 -1 l 35 -60","l -8.42498779296875 -107 l -18 -36 l -9 -15 l -7 -13 l 4 -10 l 4 -9 l 6 -4 l 26 -51"];
      
      //old = ["l -49 -113 l 0 -8 l 2 -10 l 4 -8 l 5 -8 l 6 -6 l 7 -7", "l -49 -113 l 0 -8 l 2 -10 l 4 -8 l 5 -8 l 6 -6 l 7 -7"];


const JERK_OFFS = [{"pos":{"x":-24.75,"y":-167},"angle":-0.2,"spread":0.4},{"pos":{"x":-26.25,"y":-169},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.75,"y":-167},"angle":-0.2,"spread":0.4},{"pos":{"x":-28.25,"y":-168},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.75,"y":-166},"angle":-0.2,"spread":0.4},{"pos":{"x":-23.25,"y":-163},"angle":-0.2,"spread":0.4}];

const JERK_CLIP_PATH_DATAS = ["l -14.75 -126 l -4 -21 l -3 -8 l -3 -4 l -2 -7 l 2 -8 l 3 -7 l 4 -7", "l -16.25 -139 l -1 -8 l -5 -7 l -3 -6 l -1 -5 l 1 -7 l 4 -9 l 4 -9", "l -15.75 -135 l 0 -7 l -1 -7 l -7 -8 l -3 -6 l 0 -8 l 3 -10 l 6 -8", "l -16.25 -138 l -3 -10 l -3 -7 l -5 -7 l 0 -9 l 6 -10 l 4 -6", "l -17.75 -136 l 0 -10 l -2 -6 l -3 -4 l -4 -7 l 1 -8 l 3 -8 l 4 -6 l 3 -4", "l -17.25 -136 l 0 -6 l -2 -7 l -5 -9 l -2 -6 l 1 -10 l 5 -10 l 7 -8"];

//standing
const SHOOTER_OFFS = [{"pos":{"x":-28.083333333333336,"y":-165},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.250000000000007,"y":-163},"angle":-0.2,"spread":0.4},{"pos":{"x":-24.41666666666668,"y":-164},"angle":-0.2,"spread":0.4},{"pos":{"x":-24.583333333333336,"y":-162},"angle":-0.2,"spread":0.4},{"pos":{"x":-26.75000000000002,"y":-163},"angle":-0.2,"spread":0.4},{"pos":{"x":-25.916666666666707,"y":-162},"angle":-0.2,"spread":0.4}];

const SHOOTER_DICK_OFFS = [{"pos":{"x":46.916666666666664,"y":-193},"angle":-0.3,"spread":0.4},{"pos":{"x":46.74999999999999,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":46.58333333333332,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":47.416666666666664,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":47.24999999999998,"y":-192},"angle":-0.3,"spread":0.4},{"pos":{"x":48.08333333333329,"y":-194},"angle":-0.3,"spread":0.4}];

const SHOOTER_CLIP_PATH_DATAS = ["l -18.083333333333336 -125 l -2 -17 l -1 -6 l -3 -7 l -2 -4 l -2 -9 l 1 -6 l 2 -7 l 5 -6","l -20.25 -136 l -4 -2 l 3 -4 l 1 -7 l -2 -6 l -5 -7 l 0 -9 l 4 -11 l 5 -6","l -19.416666666666686 -141 l -14 -3 l 5 -6 l 8 -5 l -3 -5 l -2 -7 l 0 -12 l 7 -6","l -19.58333333333337 -136 l -2 -6 l 1 -12 l -7 -9 l 3 -13 l 2 -8 l 2 -2","l -19.75 -141 l -2 -11 l -4 -6 l -2 -7 l 1 -11 l 5 -10 l 4 -3","l -19.916666666666742 -139 l 0 -12 l -7 -8 l -1 -8 l 2 -11 l 3 -5 l 4 -5"];



const FALL_BACK_OFFS = [{"pos":{"x":-0.5,"y":-66},"angle":2.4429,"spread":1.7402},{"pos":{"x":-8.5,"y":-73},"angle":3.6739,"spread":1.302},{"pos":{"x":-35.5,"y":-107},"angle":-0.9447,"spread":1.167},{"pos":{"x":-40.5,"y":-128},"angle":-0.8215,"spread":0.6256},{"pos":{"x":-46.5,"y":-140},"angle":-0.8308,"spread":0.1759},{"pos":{"x":-54.5,"y":-159},"angle":-0.9179,"spread":0.0831}];



const FALLEN_BACK_OFFS = [{"pos":{"x":28,"y":-54},"angle":2.8035,"spread":2.2366},{"pos":{"x":29,"y":-39},"angle":3.3485,"spread":1.6465},{"pos":{"x":30,"y":-51},"angle":3.0114,"spread":1.7251},{"pos":{"x":30,"y":-49},"angle":2.9645,"spread":2.2388}];


const GET_UP_BACK_OFFS = [{"pos":{"x":-35.875,"y":-114},"angle":-0.6267,"spread":1.235},{"pos":{"x":-14.625,"y":-29},"angle":4.0869,"spread":0.4749},{"pos":{"x":-5.375,"y":-25},"angle":-1.4158,"spread":0.2526},{"pos":{"x":-2.125,"y":-32},"angle":-1.5708,"spread":0.0039}];

const GET_HIT_FALLEN_BACK_OFFS = [{"pos":{"x":52.5,"y":-55},"angle":2.8662,"spread":1.2503},{"pos":{"x":53.5,"y":-55},"angle":2.8327,"spread":1.3318},{"pos":{"x":55.5,"y":-56},"angle":2.6779,"spread":1.5759},{"pos":{"x":58.5,"y":-53},"angle":2.8135,"spread":1.3488}];

const GET_HIT_FALLEN_BACK_CLIP_PATH_DATAS = ["l 52.5 -22 l 10 -5 l 8 -5 l -11 -7 l 1 -14 l -4 -9 l -9 -6 l 1 -11 l -8 -9 l -10 -4 l -5 -18","l 55.5 -18 l 12 -7 l 0 -7 l -10 -2 l 4 -10 l -2 -12 l -4 -8 l -8 -4 l 0 -13 l -4 -7 l -13 1 l -9 -19","l 67.21429443359375 -9 l 2 -7 l -10 -8 l -21 -4 l 19 -5 l 4 -10 l -1 -7 l -1 -10 l -7 -6 l -6 -2 l 2 -15 l -13 -2 l -7 -3 l -9 -15","l 68.21429443359375 -20 l -5 -8 l -6 -1 l -9 6 l -20 -6 l 27 -6 l 5 -9 l 0 -13 l -5 -7 l -8 -4 l 4 -10 l -6 -6 l -6 -3 l -6 -2 l -1 -15"];

const JERK_FALLEN_BACK_OFFS = [{"pos":{"x":-3,"y":-14},"angle":4.0726,"spread":0.504},{"pos":{"x":-2,"y":-11},"angle":4.1558,"spread":0.4928},{"pos":{"x":-2,"y":-13},"angle":3.9411,"spread":0.4423},{"pos":{"x":-2,"y":-13},"angle":4.2199,"spread":0.3798},{"pos":{"x":-2,"y":-13},"angle":4.2585,"spread":0.3651},{"pos":{"x":-1,"y":-13},"angle":4.4551,"spread":0.2709}];

//first ones are moves, since base point is in the way
//const JERK_FALLEN_BACK_CLIP_PATH_DATAS = ["l -34 -1 l 1 -10 l 12 3 l 14 -1 l 10 -5 l 8 1 l 21 0 l 23 -5 l 14 -2 l 20 11 l 57 8 l 9 -73","l -48 -2 l 11 -9 l 17 3 l 15 -2 l 9 -4 l 15 -7 l 21 -3 l 14 -2 l 14 -9 l 13 13 l 49 20 l 41 -55","l -53 -1 l 16 -9 l 27 4 l 10 -6 l 5 -4 l 16 -10 l 35 -22 l 20 21 l 39 26 l 40 -51","l -49 -2 l 15.20001220703125 -11 l 11.79998779296875 4 l 19.60003662109375 0 l 7.5999755859375 -8 l 23.79998779296875 -4 l 31 -12 l 27 14 l 26 7 l 19 10 l 35 -67","l -54 -1 l 20 -8 l 4.2000732421875 -1 l 22 3 l 13 -8 l 6.7999267578125 1 l 23 0 l 34 -5 l 25 9 l 34 8 l 22 0 l 2 -79","l -56 -1 l 20 -12 l 10 3 l 12 2 l 13 -4 l 8 4 l 17 4 l 24 2 l 25 -4 l 75 5 l -2 -77"].map(s=>"m"+s.substring(1));

//need to move the base point away, map the generated with .map(s=>{var ps = s.split(" "); ps[2] = "100 l 0 -100"; return ps.join(" ");}))
const JERK_FALLEN_BACK_CLIP_PATH_DATAS = ["l -34 100 l 0 -100 l 1 -10 l 12 3 l 14 -1 l 10 -5 l 8 1 l 21 0 l 23 -5 l 14 -2 l 20 11 l 57 8 l 9 -73","l -48 100 l 0 -100 l 11 -9 l 17 3 l 15 -2 l 9 -4 l 15 -7 l 21 -3 l 14 -2 l 14 -9 l 13 13 l 49 20 l 41 -55","l -53 100 l 0 -100 l 16 -9 l 27 4 l 10 -6 l 5 -4 l 16 -10 l 35 -22 l 20 21 l 39 26 l 40 -51","l -49 100 l 0 -100 l 15.2 -11 l 11.8 4 l 19.6 0 l 7.6 -8 l 23.8 -4 l 31 -12 l 27 14 l 26 7 l 19 10 l 35 -67","l -54 100 l 0 -100 l 20 -8 l 4.2 -1 l 22 3 l 13 -8 l 6.8 1 l 23 0 l 34 -5 l 25 9 l 34 8 l 22 0 l 2 -79","l -56 100 l 0 -100 l 20 -12 l 10 3 l 12 2 l 13 -4 l 8 4 l 17 4 l 24 2 l 25 -4 l 75 5 l -2 -77"].map(s=>"m"+s.substring(1));

//now flipping this way, since flipClipPath doesn't handle "l"'s
const JERK_FALLEN_BACK_CLIP_PATH_FLIP_DATAS = ["l -34 100 l 0 -100 l 1 -10 l 12 3 l 14 -1 l 10 -5 l 8 1 l 21 0 l 23 -5 l 14 -2 l 20 11 l 57 8 l 9 -73","l -48 100 l 0 -100 l 11 -9 l 17 3 l 15 -2 l 9 -4 l 15 -7 l 21 -3 l 14 -2 l 14 -9 l 13 13 l 49 20 l 41 -55","l -53 100 l 0 -100 l 16 -9 l 27 4 l 10 -6 l 5 -4 l 16 -10 l 35 -22 l 20 21 l 39 26 l 40 -51","l -49 100 l 0 -100 l 15.2 -11 l 11.8 4 l 19.6 0 l 7.6 -8 l 23.8 -4 l 31 -12 l 27 14 l 26 7 l 19 10 l 35 -67","l -54 100 l 0 -100 l 20 -8 l 4.2 -1 l 22 3 l 13 -8 l 6.8 1 l 23 0 l 34 -5 l 25 9 l 34 8 l 22 0 l 2 -79","l -56 100 l 0 -100 l 20 -12 l 10 3 l 12 2 l 13 -4 l 8 4 l 17 4 l 24 2 l 25 -4 l 75 5 l -2 -77"].map(flipClipPath).map(s=>"m"+s.substring(1));


const CUM_FALLEN_BACK_OFFS = [{"pos":{"x":-20,"y":-14},"angle":-1.3102,"spread":0.3611},{"pos":{"x":-19,"y":-15},"angle":-1.4322,"spread":0.3138},{"pos":{"x":-13,"y":-14},"angle":4.3415,"spread":0.2484},{"pos":{"x":-15,"y":-11},"angle":4.4995,"spread":0.2386}];
      
      //old: [{"pos":{"x":-16,"y":-12},"angle":3.4871,"spread":0.4702},{"pos":{"x":-12,"y":-11},"angle":3.7572,"spread":0.4199},{"pos":{"x":-15,"y":-10},"angle":3.927,"spread":0.32},{"pos":{"x":-15,"y":-9},"angle":3.5752,"spread":0.5896}];



const CUM_FALLEN_BACK_DICK_OFFS = [{"pos":{"x":-33,"y":-92},"angle":4.515,"spread":0.0043},{"pos":{"x":-32,"y":-94},"angle":-1.5708,"spread":0.0015},{"pos":{"x":-33,"y":-91},"angle":4.0376,"spread":0.0068},{"pos":{"x":-35,"y":-89},"angle":3.7296,"spread":0.0346}];

const CUM_FALLEN_BACK_CLIP_PATH_DATAS = ["l -59 100 l 0 -100 l 16 -20 l 10 7 l 13 5 l 14 -3 l 6 -3 l 20 0 l 17 -3 l 26 -7 l 64 24 l 11 -92","l -66.25 100 l 0 -100 l 31 -19 l 9 6 l 8 3 l 9 0 l 8 -2 l 8 2 l 9 2 l 18 1 l 31 -4 l 40 7 l 29.75 5 l 5 -74","l -74 100 l 0 -100 l 32 -12 l 0 -9 l 10 7 l 8 4 l 10 1 l 7 -1 l 5 -4 l 20 -1 l 20 -3 l 12 -3 l 15 -5 l 55 25 l -6 -88","l -76.75 100 l 0 -100 l 22 -12 l 14 -6 l 6 5 l 9 5 l 8 1 l 6 -2 l 9 -6 l 32 -7 l 10 -6 l 21 -8 l 29 16 l 38.25 19 l 0 -88"].map(s=>"m"+s.substring(1));

const CUM_FALLEN_BACK_CLIP_PATH_FLIP_DATAS = ["l -59 100 l 0 -100 l 16 -20 l 10 7 l 13 5 l 14 -3 l 6 -3 l 20 0 l 17 -3 l 26 -7 l 64 24 l 11 -92","l -66.25 100 l 0 -100 l 31 -19 l 9 6 l 8 3 l 9 0 l 8 -2 l 8 2 l 9 2 l 18 1 l 31 -4 l 40 7 l 29.75 5 l 5 -74","l -74 100 l 0 -100 l 32 -12 l 0 -9 l 10 7 l 8 4 l 10 1 l 7 -1 l 5 -4 l 20 -1 l 20 -3 l 12 -3 l 15 -5 l 55 25 l -6 -88","l -76.75 100 l 0 -100 l 22 -12 l 14 -6 l 6 5 l 9 5 l 8 1 l 6 -2 l 9 -6 l 32 -7 l 10 -6 l 21 -8 l 29 16 l 38.25 19 l 0 -88"].map(flipClipPath).map(s=>"m"+s.substring(1));




const FALL_FRONT_OFFS = [{"pos":{"x":-27.25,"y":-120},"angle":0.8667,"spread":1.5421},{"pos":{"x":-34.75,"y":-139},"angle":0.4511,"spread":0.8502},{"pos":{"x":-27.25,"y":-149},"angle":-1.3633,"spread":0.0634},{"pos":{"x":-24.75,"y":-148},"angle":4.5705,"spread":0.0336},{"pos":{"x":-22.25,"y":-156},"angle":-1.4711,"spread":0.0679},{"pos":{"x":-22.75,"y":-163},"angle":4.2487,"spread":0.0134}];


const FALLEN_FRONT_OFFS = [{"pos":{"x":-18.125,"y":-104},"angle":0.7614,"spread":2.1312},{"pos":{"x":-19.375,"y":-102},"angle":0.6458,"spread":2.0353},{"pos":{"x":-18.625,"y":-104},"angle":0.588,"spread":2.2152},{"pos":{"x":-15.875,"y":-104},"angle":0.6125,"spread":2.2302}];

const GET_UP_FRONT_OFFS = [{"pos":{"x":-17.875,"y":-167},"angle":0.192,"spread":1.2564},{"pos":{"x":-15.625,"y":-156},"angle":0.2087,"spread":1.7629},{"pos":{"x":-22.375,"y":-140},"angle":0.0233,"spread":1.7281},{"pos":{"x":-25.125,"y":-105},"angle":0.5972,"spread":1.921}];


const GET_HIT_FALLEN_FRONT_OFFS = [{"pos":{"x":-21.375,"y":-113},"angle":0.4829,"spread":1.6597},{"pos":{"x":-23.125,"y":-114},"angle":0.4838,"spread":1.7435},{"pos":{"x":-22.875,"y":-111},"angle":0.4525,"spread":1.6777},{"pos":{"x":-17.625,"y":-110},"angle":0.4709,"spread":1.4718}];

//old: [{"pos":{"x":-21.375,"y":-99},"angle":0.6931,"spread":1.7675},{"pos":{"x":-23.125,"y":-101},"angle":0.7023,"spread":1.3943},{"pos":{"x":-20.875,"y":-101},"angle":0.4773,"spread":1.2813},{"pos":{"x":-17.625,"y":-99},"angle":0.326,"spread":1.6879}];


const GET_HIT_FALLEN_FRONT_CLIP_PATH_DATAS = ["l -28.375 -67 l -4 -19 l 4 -12 l 0 -15 l 10 -6 l 14 -1 l 15 -1","l -24.125 -63 l -4 -21 l -4 -18 l 5.333343505859375 -15 l 10 -3 l 15.666656494140625 -2","l -27.875 -71 l -0.666656494140625 -23 l -2.333343505859375 -10 l 9.333343505859375 -14 l 13 -2 l 9 0","l -32.625 -77 l 4.66668701171875 -19 l 3.33331298828125 -14 l 9 -8 l 12.3333740234375 -1 l 7 0"];


const JERK_FALLEN_FRONT_OFFS = [{"pos":{"x":-15.625,"y":-89},"angle":-0.0476,"spread":1.4178},{"pos":{"x":-11.875,"y":-90},"angle":-0.095,"spread":1.4275},{"pos":{"x":-15.125,"y":-88},"angle":-0.1526,"spread":1.2486},{"pos":{"x":-14.375,"y":-93},"angle":-0.0788,"spread":1.1652}];

//old: [{"pos":{"x":-13.625,"y":-88},"angle":-0.245,"spread":1.6496},{"pos":{"x":-13.875,"y":-86},"angle":-0.1651,"spread":1.4539},{"pos":{"x":-15.125,"y":-92},"angle":-0.0227,"spread":1.5534},{"pos":{"x":-14.375,"y":-93},"angle":0.0599,"spread":2.0121}];

const JERK_FALLEN_FRONT_CLIP_PATH_DATAS = ["l 8.375 -40 l -16 -31 l -10 -12 l 2 -11 l 6 -7 l 8 -8 l -3 -8 l -5 -4 l 1 -13 l 18 -22","l 11.125 -33 l -9 -20 l -9.399999618530273 -17 l -7.600000381469727 -10 l 2.6000003814697266 -16 l 12 -12 l -19.600000381469727 -19 l 13 -26","l 16.07500457763672 -29 l -18 -32 l -7 -8 l -4 -8 l -3 -8 l 3 -11 l 6 -8 l 8 -9 l -12 -9 l 18 -30","l 18.824996948242188 -29 l -21 -33 l -4 -11 l -8 -5 l -5 -10 l 5 -10 l 9 -11 l 4 -5 l -1 -16 l 19 -19"];


const CUM_FALLEN_FRONT_OFFS = [{"pos":{"x":-12.75,"y":-87},"angle":-0.3488,"spread":1.0435},{"pos":{"x":-19.25,"y":-81},"angle":-0.3311,"spread":0.969},{"pos":{"x":-14.75,"y":-87},"angle":-0.3218,"spread":1.024},{"pos":{"x":-6.25,"y":-95},"angle":-0.251,"spread":1.3718}];

//old: [{"pos":{"x":-10.75,"y":-89},"angle":-0.2573,"spread":1.3067},{"pos":{"x":-16.25,"y":-80},"angle":-0.5962,"spread":0.969},{"pos":{"x":-10.75,"y":-89},"angle":-0.3218,"spread":1.024},{"pos":{"x":-4.25,"y":-99},"angle":-0.1691,"spread":1.4641}];

const CUM_FALLEN_FRONT_DICK_OFFS = [{"pos":{"x":53.25,"y":-116},"angle":-0.7598,"spread":0.644},{"pos":{"x":42.75,"y":-120},"angle":-0.6511,"spread":0.5899},{"pos":{"x":51.25,"y":-117},"angle":-0.6311,"spread":0.8776},{"pos":{"x":61.75,"y":-113},"angle":-0.588,"spread":0.044}];

const CUM_FALLEN_FRONT_CLIP_PATH_DATAS = ["l 19.25 -28 l -17 -31 l -5 -7 l -12 -8 l -4 -10 l 2 -9 l 10 -10 l -7 -13 l 11 -37","l 15.75 -29 l -19 -31 l -8 -3 l -8 -10 l -3 -11 l 8 -12 l -13 -13 l 12 -41","l 18.25 -28 l -16 -33 l -6 -6 l -9 -9 l -3 -5 l 0 -11 l 7 -8 l 3 -3 l -8 -12 l 9 -34","l 22.25 -27 l -22 -46 l -2 -4 l -8 -10 l 2 -14 l 6 -6 l 6 -3 l -6 -16 l 14 -35"];



//flipped datas with function
const GET_HIT_CLIP_PATH_FLIP_DATAS = GET_HIT_CLIP_PATH_DATAS.map(flipClipPath);
const GET_HIT_CROUCH_CLIP_PATH_FLIP_DATAS = GET_HIT_CROUCH_CLIP_PATH_DATAS.map(flipClipPath);
const JERK_CLIP_PATH_FLIP_DATAS = JERK_CLIP_PATH_DATAS.map(flipClipPath);
const SHOOTER_CLIP_PATH_FLIP_DATAS = SHOOTER_CLIP_PATH_DATAS.map(flipClipPath);
const GET_HIT_FALLEN_BACK_CLIP_PATH_FLIP_DATAS = GET_HIT_FALLEN_BACK_CLIP_PATH_DATAS.map(flipClipPath);
const GET_HIT_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS = GET_HIT_FALLEN_FRONT_CLIP_PATH_DATAS.map(flipClipPath);
const JERK_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS = JERK_FALLEN_FRONT_CLIP_PATH_DATAS.map(flipClipPath);
const CUM_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS = CUM_FALLEN_FRONT_CLIP_PATH_DATAS.map(flipClipPath);

const imageManager = {};

imageManager.init = function() {
    imageManager.bulletImage = new BasedImage("pics/bullets/bulletSmall.png", 83, 13);
    imageManager.buzzImage = new BasedImage("pics/bullets/buzzBulletSmall.png", 44, 9);
    imageManager.plugImage = new BasedImage("pics/bullets/plugBulletSmall.png", 41, 11);
    imageManager.jellyImage = new BasedImage("pics/bullets/jellyBulletSmall.png", 87, 14);
    imageManager.moneyImage = new BasedImage("pics/bullets/moneySmall.png", 21, 8);
    imageManager.bananaImage = new BasedImage("pics/bullets/bananaSmall.png", 32, 32);
    //imageManager.slingImage = new BasedImage("pics/sling.png", 92, 15);
    
    
    imageManager.walkSheet = new BasedSpriteSheet("pics/anims/walkAnim.png", 8, WALK_OFFS);
    
    imageManager.gettingHitSheet = new BasedSpriteSheet("pics/anims/gettingHitAnim.png", 4, GET_HIT_OFFS);
    imageManager.gettingHitSheet.clipPathDatas = GET_HIT_CLIP_PATH_DATAS;
    imageManager.gettingHitSheet.clipPathFlippedDatas = GET_HIT_CLIP_PATH_FLIP_DATAS;
    
    imageManager.gettingHitCrouchedSheet = new BasedSpriteSheet("pics/anims/gettingHitCrouchAnim2.png", 4, GET_HIT_CROUCH_OFFS);
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
    imageManager.fallenBackSheet = new BasedSpriteSheet("pics/anims/fallenBackAnim.png", 4, FALLEN_BACK_OFFS);
    
    imageManager.getUpBackSheet = new BasedSpriteSheet("pics/anims/getUpBackAnim.png", 4, GET_UP_BACK_OFFS); 
    
    imageManager.gettingHitFallenBackSheet = new BasedSpriteSheet("pics/anims/gettingHitFallenBackAnim.png", 4, GET_HIT_FALLEN_BACK_OFFS);
    imageManager.gettingHitFallenBackSheet.clipPathDatas = GET_HIT_FALLEN_BACK_CLIP_PATH_DATAS;
    imageManager.gettingHitFallenBackSheet.clipPathFlippedDatas = GET_HIT_FALLEN_BACK_CLIP_PATH_FLIP_DATAS;
    
    
    imageManager.fallFrontSheet = new BasedSpriteSheet("pics/anims/fallFrontAnim.png", 6, FALL_FRONT_OFFS);
    imageManager.fallenFrontSheet = new BasedSpriteSheet("pics/anims/fallenFrontAnim.png", 4, FALLEN_FRONT_OFFS);
    
    imageManager.getUpFrontSheet = new BasedSpriteSheet("pics/anims/getUpFrontAnim.png", 4, GET_UP_BACK_OFFS);
    
    
    
    imageManager.gettingHitFallenFrontSheet  = new BasedSpriteSheet("pics/anims/gettingHitFallenFrontAnim.png", 4, GET_HIT_FALLEN_FRONT_OFFS);
    imageManager.gettingHitFallenFrontSheet.clipPathDatas = GET_HIT_FALLEN_FRONT_CLIP_PATH_DATAS;
    imageManager.gettingHitFallenFrontSheet.clipPatFlippedDatas = GET_HIT_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS;
    
    imageManager.jerkFallenBackSheet = new BasedSpriteSheet("pics/anims/jerkFallenBackAnim.png", 6, JERK_FALLEN_BACK_OFFS);
    imageManager.jerkFallenBackSheet.clipPathDatas = JERK_FALLEN_BACK_CLIP_PATH_DATAS;
    imageManager.jerkFallenBackSheet.clipPathFlippedDatas = JERK_FALLEN_BACK_CLIP_PATH_FLIP_DATAS;
    
    imageManager.cumFallenBackSheet = new BasedSpriteSheet("pics/anims/cummingFallenBackAnim.png", 4, CUM_FALLEN_BACK_OFFS);
    imageManager.cumFallenBackSheet.cumGoalDatas = CUM_FALLEN_BACK_DICK_OFFS;
    imageManager.cumFallenBackSheet.clipPathDatas = CUM_FALLEN_BACK_CLIP_PATH_DATAS;
    imageManager.cumFallenBackSheet.clipPathFlippedDatas = CUM_FALLEN_BACK_CLIP_PATH_FLIP_DATAS;
    
    imageManager.jerkFallenFrontSheet = new BasedSpriteSheet("pics/anims/jerkingFallenFrontAnim.png", 4, JERK_FALLEN_FRONT_OFFS);
    imageManager.jerkFallenFrontSheet.clipPathDatas = JERK_FALLEN_FRONT_CLIP_PATH_DATAS;
    imageManager.jerkFallenFrontSheet.clipPathFlippedDatas = JERK_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS;
    
    imageManager.cumFallenFrontSheet = new BasedSpriteSheet("pics/anims/cummingFallenFrontAnim.png", 4, CUM_FALLEN_FRONT_OFFS);
    imageManager.cumFallenFrontSheet.cumGoalDatas = CUM_FALLEN_FRONT_DICK_OFFS;
    imageManager.cumFallenFrontSheet.clipPathDatas = CUM_FALLEN_FRONT_CLIP_PATH_DATAS;
    imageManager.cumFallenFrontSheet.clipPathFlippedDatas = CUM_FALLEN_FRONT_CLIP_PATH_FLIP_DATAS;
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


