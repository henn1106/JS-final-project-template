// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyIng = document.createElement("img");
var towerbtnIng = document.createElement("img");
var towerIng = document.createElement("img");

// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyIng.src  = "images/slime.gif"
towerbtnIng.src  = "images/tower-btn.png"
towerIng.src  = "images/tower.png"
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");

// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	// 將背景圖片畫在 canvas 上的 (0,0) 位置
  ctx.drawImage(bgImg,0,0);
  ctx.drawImage(enemyIng,enemy.x,enemy.y)
  ctx.drawImage(towerbtnIng,640-64,480-68,64,68)
  ctx.drawImage(towerIng,mouse.x,mouse.y)
}

// 執行 draw 函式
setInterval(draw,16)

var enemy={
	x:96,
	y:480-32
};
$("game-canvas").on("mousemove",mousemove);
function mousemove(event){
	console.log("x:"+event.offsetX+"y:"+event.offsetY)
	mouse.x=event.offsetX
    mouse.y=event.offsetY
}
var mouse={
    x:offsetX,
    y:offsetY
	}