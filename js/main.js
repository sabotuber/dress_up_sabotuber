/*
必要となるレイヤー

hair_f
face
head
arm_l
body
arm_r
hair_b
bg

ラジオ1
ラジオ2
ラジオ3

ラジオ3の時は1も2も押せない
1と2はどちらかが押されている時、両方押されている必要がある

この辺を使って入力を制御

$('input[name=test2]').prop('disabled',true);
$('input[name=test2]').prop('checked',false);

$('input[name=test2]').prop('disabled',false);
$('input[name=test2][value=tex2_1]').prop('checked',true);

setStateの時にname属性で分岐処理作る
今の状態で分岐させないといけないので、フラグを持つ必要がありそう

両立できない組み合わせ、として考えればいい
flag1にa,b,cどれが入っているか、みたいな

*/

// 状態を管理するオブジェクト
const state = new Object();
// 初期設定(可変部分のみ)
state.hair$ = "01_normal";
state.arm_r = "01_normal";
state.body = "01_normal";
state.arm_l = "01_normal";
state.head = "01_normal";
state.eyebrows = "01_normal";
state.eyes = "01_normal";
state.mouth = "01_normal";
state.hair = "01_normal";

state.emote = "01_one_point_hoppe";

state.inner = "none";
state.inner_t = "02_drawers_ye";
state.inner_b = "02_drawers_ye";

state.accessory_head = "01_normal_cap";
state.accessory_neck = "01_normal_muffler";
state.accessory_neck$ = "01_normal_muffler";
state.shoes = "01_normal_boots";
state.shirt$ = "01_normal_wh";
state.shirt = "01_normal_wh";
state.jacket$ = "01_normal";
state.jacket = "01_normal";
state.gloves = "01_normal_gloves";

// 一部の服装管理用
let innerF = 0;

state.setState = function (name, val) {
  if (name in this) {
    if ((name == "inner_b" || name == "inner_t") && innerF != 0) {
      $('input[name="inner"][value="none"]').prop('checked', true);
      this.inner = "none";
      this.setStateTexture("inner", "none");
      if (name == "inner_b") {
        this.inner_t = "02_drawers_ye";
        this.setStateTexture("inner_t", "02_drawers_ye");
        $('input[name="inner_t"][value="02_drawers_ye"]').prop('checked', true);
      } else {
        this.inner_b = "02_drawers_ye";
        this.setStateTexture("inner_b", "02_drawers_ye");
        $('input[name="inner_b"][value="02_drawers_ye"]').prop('checked', true);
      }
      innerF = 0;
    }
    if (name == "inner" && innerF != 1) {
      $('input[name="inner_b"][value="none"]').prop('checked', true);
      $('input[name="inner_t"][value="none"]').prop('checked', true);
      this.inner_b = "none";
      this.inner_t = "none";
      this.setStateTexture("inner_b", "none");
      this.setStateTexture("inner_t", "none");
      innerF = 1;
    }

    if (name.endsWith("$")) {
      this[name.slice(0, -1)] = val;
      this.setStateTexture(name.slice(0, -1), val);
    }
    this[name] = val;
    this.setStateTexture(name, val);
  }
  //console.log(state);
  return;
}

state.setStateTexture = function (name, val) {
  if (val == "none") {
    spriteList[name].texture = textureList.none;
  } else {
    spriteList[name].texture = textureList[name + "_" + val];
  }
  return;
}

// 描画用canvasの設定
const app = new PIXI.Application({
  preserveDrawingBuffer: true,
  view: document.getElementById("dress_room"),
  width: 720,
  height: 1440,
  backgroundColor: 0x00ff00,
});

document.getElementById('canvas-wrap').appendChild(app.view)

// 親コンテナ設定
const container = new PIXI.Container();
container.width = 200;
container.height = 170;
container.x = 0;
container.y = 0;
container.sortableChildren = true;

app.stage.addChild(container);

// テクスチャリスト作成
const textureList = new Object();
textureList.none = PIXI.Texture.from('img/other/none.png');

textureList.hair$_01_normal = PIXI.Texture.from('img/hair$/01_normal.png');
textureList.arm_r_01_normal = PIXI.Texture.from('img/arm_r/01_normal.png');
textureList.body_01_normal = PIXI.Texture.from('img/body/01_normal.png');
textureList.arm_l_01_normal = PIXI.Texture.from('img/arm_l/01_normal.png');
textureList.head_01_normal = PIXI.Texture.from('img/head/01_normal.png');
textureList.eyebrows_01_normal = PIXI.Texture.from('img/eyebrows/01_normal.png');
textureList.eyes_01_normal = PIXI.Texture.from('img/eyes/01_normal.png');
textureList.mouth_01_normal = PIXI.Texture.from('img/mouth/01_normal.png');
textureList.emote_01_one_point_hoppe = PIXI.Texture.from('img/emote/01_one_point_hoppe.png');
textureList.hair_01_normal = PIXI.Texture.from('img/hair/01_normal.png');

textureList.hair$_01_normal_bk = PIXI.Texture.from('img/hair$/01_normal_bk.png');
textureList.hair_01_normal_bk = PIXI.Texture.from('img/hair/01_normal_bk.png');

textureList.inner_b_01_normal_gr = PIXI.Texture.from('img/inner_b/01_normal_gr.png');
textureList.inner_b_01_normal_bk = PIXI.Texture.from('img/inner_b/01_normal_bk.png');
textureList.inner_b_01_normal_ye = PIXI.Texture.from('img/inner_b/01_normal_gr.png');
textureList.inner_b_01_normal_ye = PIXI.Texture.from('img/inner_b/01_normal_ye.png');
textureList.inner_b_02_drawers_gr = PIXI.Texture.from('img/inner_b/02_drawers_gr.png');
textureList.inner_b_02_drawers_ye = PIXI.Texture.from('img/inner_b/02_drawers_ye.png');
textureList.inner_t_01_normal_gr = PIXI.Texture.from('img/inner_t/01_normal_gr.png');
textureList.inner_t_01_normal_bk = PIXI.Texture.from('img/inner_t/01_normal_bk.png');
textureList.inner_t_01_normal_ye = PIXI.Texture.from('img/inner_t/01_normal_ye.png');
textureList.inner_t_02_drawers_gr = PIXI.Texture.from('img/inner_t/02_drawers_gr.png');
textureList.inner_t_02_drawers_ye = PIXI.Texture.from('img/inner_t/02_drawers_ye.png');
textureList.inner_01_swimwear = PIXI.Texture.from('img/inner/01_swimwear.png');

textureList.shoes_01_normal_boots = PIXI.Texture.from('img/shoes/01_normal_boots.png');

textureList.shirt$_01_normal_wh = PIXI.Texture.from('img/shirt$/01_normal_wh.png');
textureList.shirt_01_normal_wh = PIXI.Texture.from('img/shirt/01_normal_wh.png');
textureList.shirt$_01_normal_wh_dasa01 = PIXI.Texture.from('img/shirt$/01_normal_wh_dasa01.png');
textureList.shirt_01_normal_wh_dasa01 = PIXI.Texture.from('img/shirt/01_normal_wh_dasa01.png');

textureList.jacket$_01_normal = PIXI.Texture.from('img/jacket$/01_normal.png');
textureList.jacket_01_normal = PIXI.Texture.from('img/jacket/01_normal.png');

textureList.jacket$_01_normal_open = PIXI.Texture.from('img/jacket$/01_normal_open.png');
textureList.jacket_01_normal_open = PIXI.Texture.from('img/jacket/01_normal_open.png');

textureList.jacket$_01_normal_fc = PIXI.Texture.from('img/jacket$/01_normal_fc.png');
textureList.jacket_01_normal_fc = PIXI.Texture.from('img/jacket/01_normal_fc.png');

textureList.jacket$_01_normal_fc_open = PIXI.Texture.from('img/jacket$/01_normal_fc_open.png');
textureList.jacket_01_normal_fc_open = PIXI.Texture.from('img/jacket/01_normal_fc_open.png');

textureList.accessory_head_01_normal_cap = PIXI.Texture.from('img/accessory_head/01_normal_cap.png');

textureList.accessory_neck$_01_normal_muffler = PIXI.Texture.from('img/accessory_neck$/01_normal_muffler.png');
textureList.accessory_neck_01_normal_muffler = PIXI.Texture.from('img/accessory_neck/01_normal_muffler.png');

textureList.gloves_01_normal = PIXI.Texture.from('img/gloves/01_normal.png');

// スプライトリスト作成ZZZ
const spriteList = new Object();
// アクセサリー(首後)
spriteList.accessory_neck$ = new PIXI.Sprite(textureList.accessory_neck$_01_normal_muffler);
spriteList.accessory_neck$.anchor.set(0);
spriteList.accessory_neck$.x = 0;
spriteList.accessory_neck$.y = 0;
container.addChild(spriteList.accessory_neck$);

// 髪の毛(後)
spriteList.hair$ = new PIXI.Sprite(textureList.hair$_01_normal);
spriteList.hair$.anchor.set(0);
spriteList.hair$.x = 0;
spriteList.hair$.y = 0;
//spriteList.hair$.zIndex = 10;
container.addChild(spriteList.hair$);

// 右腕
spriteList.arm_r = new PIXI.Sprite(textureList.arm_r_01_normal);
spriteList.arm_r.anchor.set(0);
spriteList.arm_r.x = 0;
spriteList.arm_r.y = 0;
//spriteList.arm_r.zIndex = 20;
container.addChild(spriteList.arm_r);

// 胴体
spriteList.body = new PIXI.Sprite(textureList.body_01_normal);
spriteList.body.anchor.set(0);
spriteList.body.x = 0;
spriteList.body.y = 0;
//spriteList.body.zIndex = 30;
container.addChild(spriteList.body);

// インナー(下)
spriteList.inner_b = new PIXI.Sprite(textureList.inner_b_02_drawers_gr);
spriteList.inner_b.anchor.set(0);
spriteList.inner_b.x = 0;
spriteList.inner_b.y = 0;
container.addChild(spriteList.inner_b);

// インナー(上)
spriteList.inner_t = new PIXI.Sprite(textureList.inner_t_02_drawers_gr);
spriteList.inner_t.anchor.set(0);
spriteList.inner_t.x = 0;
spriteList.inner_t.y = 0;
container.addChild(spriteList.inner_t);

// インナー(上下)
spriteList.inner = new PIXI.Sprite(textureList.none);
spriteList.inner.anchor.set(0);
spriteList.inner.x = 0;
spriteList.inner.y = 0;
container.addChild(spriteList.inner);

// 靴
spriteList.shoes = new PIXI.Sprite(textureList.shoes_01_normal_boots);
spriteList.shoes.anchor.set(0);
spriteList.shoes.x = 0;
spriteList.shoes.y = 0;
container.addChild(spriteList.shoes);

// シャツ(後)
spriteList.shirt$ = new PIXI.Sprite(textureList.shirt$_01_normal_wh);
spriteList.shirt$.anchor.set(0);
spriteList.shirt$.x = 0;
spriteList.shirt$.y = 0;
container.addChild(spriteList.shirt$);

// 上着(後)
spriteList.jacket$ = new PIXI.Sprite(textureList.jacket$_01_normal);
spriteList.jacket$.anchor.set(0);
spriteList.jacket$.x = 0;
spriteList.jacket$.y = 0;
container.addChild(spriteList.jacket$);

// 左腕
spriteList.arm_l = new PIXI.Sprite(textureList.arm_l_01_normal);
spriteList.arm_l.anchor.set(0);
spriteList.arm_l.x = 0;
spriteList.arm_l.y = 0;
//spriteList.arm_l.zIndex = 40;
container.addChild(spriteList.arm_l);

// シャツ(前)
spriteList.shirt = new PIXI.Sprite(textureList.shirt_01_normal_wh);
spriteList.shirt.anchor.set(0);
spriteList.shirt.x = 0;
spriteList.shirt.y = 0;
container.addChild(spriteList.shirt);

// 上着(前)
spriteList.jacket = new PIXI.Sprite(textureList.jacket_01_normal);
spriteList.jacket.anchor.set(0);
spriteList.jacket.x = 0;
spriteList.jacket.y = 0;
container.addChild(spriteList.jacket);

// グローブ
spriteList.gloves = new PIXI.Sprite(textureList.gloves_01_normal);
spriteList.gloves.anchor.set(0);
spriteList.gloves.x = 0;
spriteList.gloves.y = 0;
container.addChild(spriteList.gloves);

// あたま
spriteList.head = new PIXI.Sprite(textureList.head_01_normal);
spriteList.head.anchor.set(0);
spriteList.head.x = 0;
spriteList.head.y = 0;
//spriteList.head.zIndex = 50;
container.addChild(spriteList.head);

// アクセサリー(首前)
spriteList.accessory_neck = new PIXI.Sprite(textureList.accessory_neck_01_normal_muffler);
spriteList.accessory_neck.anchor.set(0);
spriteList.accessory_neck.x = 0;
spriteList.accessory_neck.y = 0;
container.addChild(spriteList.accessory_neck);

// 眉毛
spriteList.eyebrows = new PIXI.Sprite(textureList.eyebrows_01_normal);
spriteList.eyebrows.anchor.set(0);
spriteList.eyebrows.x = 0;
spriteList.eyebrows.y = 0;
container.addChild(spriteList.eyebrows);

// 眼
spriteList.eyes = new PIXI.Sprite(textureList.eyes_01_normal);
spriteList.eyes.anchor.set(0);
spriteList.eyes.x = 0;
spriteList.eyes.y = 0;
container.addChild(spriteList.eyes);

// 口
spriteList.mouth = new PIXI.Sprite(textureList.mouth_01_normal);
spriteList.mouth.anchor.set(0);
spriteList.mouth.x = 0;
spriteList.mouth.y = 0;
container.addChild(spriteList.mouth);

// 感情
spriteList.emote = new PIXI.Sprite(textureList.emote_01_one_point_hoppe);
spriteList.emote.anchor.set(0);
spriteList.emote.x = 0;
spriteList.emote.y = 0;
container.addChild(spriteList.emote);

// 髪の毛(前)
spriteList.hair = new PIXI.Sprite(textureList.hair_01_normal);
spriteList.hair.anchor.set(0);
spriteList.hair.x = 0;
spriteList.hair.y = 0;
//spriteList.hair.zIndex = 60;
container.addChild(spriteList.hair);

// アクセサリー(頭)
spriteList.accessory_head = new PIXI.Sprite(textureList.accessory_head_01_normal_cap);
spriteList.accessory_head.anchor.set(0);
spriteList.accessory_head.x = 0;
spriteList.accessory_head.y = 0;
container.addChild(spriteList.accessory_head);

// ソートする
container.sortChildren();

// 毎フレーム何かしら処理を行う場合はここに記述(アニメーション等)
app.ticker.add((delta) => {});

// 合成ボタン
$("#btn-concat").on('click', function () {
  let link = document.createElement("a");
  link.href = app.view.toDataURL("image/png");
  link.download = "result.png";
  link.click();
});

// ラジオボタン監視
$(function () {
  $('input:radio').change(function () {
    let val = $(this).val();
    let name = $(this).attr("name");
    state.setState(name, val);
  });
});

// 画像の透明変更処理
// @param (target)  対象のcanvasId
// @param (alpha)  透明度
// @return (void)
function alphaSlider(target, alpha) {
  document.getElementById(target + "_alpha").innerHTML = alpha;
  if (target.endsWith("$")) {
    spriteList[target.slice(0, -1)].alpha = alpha / 100;
  }
  spriteList[target].alpha = alpha / 100;
}

// 一括変更機能
$("#btn-test").on('click', function () {
  state.setState('inner', 'none');
  state.setState('inner_t', '02_drawers_gr');
  state.setState('inner_b', '02_drawers_gr');
  innerF = 0;
  $('input[name="inner"][value="none"]').prop('checked', true);
  $('input[name="inner_t"][value="02_drawers_gr"]').prop('checked', true);
  $('input[name="inner_b"][value="02_drawers_gr"]').prop('checked', true);

  state.setState('hair$', '01_normal');
  state.setState('arm_r', '01_normal');
  state.setState('body', '01_normal');
  state.setState('arm_l', '01_normal');
  state.setState('head', '01_normal');
  state.setState('eyebrows', '01_normal');
  state.setState('eyes', '01_normal');
  state.setState('mouth', '01_normal');
  state.setState('hair', '01_normal');
  $('input[name="hair$"][value="01_normal"]').prop('checked', true);

  state.setState('emote', '01_one_point_hoppe');
  $('input[name="emote"][value="01_one_point_hoppe"]').prop('checked', true);

  state.setState('shoes', '01_normal_boots');
  $('input[name="shoes"][value="01_normal_boots"]').prop('checked', true);

  state.setState('shirt$', '01_normal_wh');
  state.setState('shirt', '01_normal_wh');
  $('input[name="shirt$"][value="01_normal_wh"]').prop('checked', true);
  
  state.setState('jacket$', '01_normal');
  state.setState('jacket', '01_normal');
  $('input[name="jacket$"][value="01_normal"]').prop('checked', true);
  
  state.setState('gloves', '01_normal');
  $('input[name="gloves"][value="01_normal"]').prop('checked', true);
  
  state.setState('accessory_neck$', '01_normal_muffler');
  state.setState('accessory_neck', '01_normal_muffler');
  $('input[name="accessory_neck$"][value="01_normal_muffler"]').prop('checked', true);
});
