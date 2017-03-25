var FPS=60;
var clock=0
// 創造 img HTML 元素，並放入變數中
var bgImg = document.createElement("img");
var enemyImg = document.createElement("img");
var towerbtnImg = document.createElement("img");
var towerImg = document.createElement("img");
var crosshairImg = document.createElement("img");
// 設定這個元素的要顯示的圖片
bgImg.src = "images/map.png";
enemyImg.src  = "images/slime.gif"
towerbtnImg.src  = "images/tower-btn.png"
towerImg.src  = "images/tower.png"
crosshairImg.src = "images/crosshair.png"
// 找出網頁中的 canvas 元素
var canvas = document.getElementById("game-canvas");
//生命值
var  hp=100
var  score=0
var  money=100
// 取得 2D繪圖用的物件
var ctx = canvas.getContext("2d");

function draw(){
	clock++;
	if((clock%80)==0){
		var newEnemy=new Enemy();
		enemies.push(newEnemy);
	}

	// 將背景圖片畫在 canvas 上的 (0,0) 位置
    ctx.drawImage(bgImg,0,0);
    for(var i=0;i<enemies.length;i++){
        if(enemies[i].hp<=0){
           enemies.splice(i,1)
           score+=10
           money+=50
  	    }else{
			enemies[i].move();
			ctx.drawImage(enemyImg,enemies[i].x,enemies[i].y)
        }    
    }

	ctx.font="24px Arail"
	ctx.fillStyle="white"
	ctx.fillText("hp:"+hp,475,150)
	ctx.fillText("Score:"+score,0,32)
	ctx.fillText("Money:"+money,0,64)

	ctx.drawImage(towerbtnImg,640-64,480-64,64,64)

	if(isBuilding==true){
	    ctx.drawImage(towerImg,cursor.x-cursor.x%32,cursor.y-cursor.y%32)
	}
	for(var i=0;i<towers.length;i++){
	    ctx.drawImage(towerImg,towers[i].x,towers[i].y)
	    towers[i].searchEnemy();
	    if(towers[i].aimingEnemyId!=null){
		    var id=towers[i].aimingEnemyId;
		    ctx.drawImage(crosshairImg,enemies[id].x,enemies[id].y);
	    }
	}
	if(hp==0){
		clearInterval(intervalID);
		ctx.font="80px Arail"
	    ctx.fillStyle="red"
        ctx.fillText(score,250,300);
		ctx.fillText("game over",150,240);
	}
}

// 執行 draw 函式
var intervalID=setInterval(draw,1000/FPS)

var enemyPath=[
	{x:96,y:64},
	{x:384,y:64},
	{x:384,y:192},
	{x:224,y:192},
	{x:224,y:320},
	{x:544,y:320},
    {x:544,y:96}
];


function Enemy(){
	this.x=96;
	this.y=448;
	this.hp=10+(clock/20)
	this.speedX=0;
	this.speedY=-64;
	this.path=0;
	this.move=function(){
	    if(isCollided(enemyPath[this.path].x,enemyPath[this.path].y,this.x,this.y,64/FPS,64/FPS)){
	         //移動
	        this.x=enemyPath[this.path].x
	        this.y=enemyPath[this.path].y
	         //指定
	        this.path++;
	        if(this.path==enemyPath.length){
	         	this.hp=0;
	         	hp-=10;
	         	return
	        }
	         //方向
	         //上
	        if(enemyPath[this.path].y<this.y){
	         	 this.speedX=0;
	             this.speedY=-64;
	        }
	         //右
	        if(enemyPath[this.path].x>this.x){
	             this.speedX=64;
	             this.speedY=0;
	        }
	         //下
	        if(enemyPath[this.path].y>this.y){
	         	 this.speedX=0;
	         	 this.speedY=64;
	        }
	         //左
	        if(enemyPath[this.path].x<this.x){
	         	 this.speedX=-64;
	             this.speedY=0;
	        } 
        }
        //修改     
	    else{
            this.x=this.x+this.speedX/FPS;
		    this.y=this.y+this.speedY/FPS;
	    }
    }
}

var enemies =[];
 
var cursor={
	x:100,
	y:200
}

function Tower(){
	this.x=0;
    this.y=0;
    this.range=100;
    this.aimingEnemyId=null;
    this.searchEnemy= function(){
      	this.readyToShootTime-=1/FPS
		for(var i=0; i<enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x-enemies[i].x,2) + Math.pow(this.y-enemies[i].y,2));
			if (distance<=this.range) {
				this.aimingEnemyId = i;
				if(this.readyToShootTime<=0){
					this.shoot(i);
					this.readyToShootTime=this.fireRate;
				}
				return;
			}
		}
		// 如果都沒找到，會進到這行，清除鎖定的目標
		this.aimingEnemyId = null;
	};
	this.shoot=function(id){
        ctx.beginPath();
        ctx.moveTo(this.x+16,this.y+16);
        ctx.lineTo(enemies[id].x+16,enemies[id].y+16);
        ctx.strokeStyle='red';
        ctx.lineWidth=3;
        ctx.stroke();
        enemies[id].hp-=this.damage;
    };
    this.fireRate=1;
    this.readyToShootTime=1;
    this.damage=5;
}

var towers=[];



$("#game-canvas").on("mousemove",mousemove);
function mousemove(event){
	cursor.x=event.offsetX
    cursor.y=event.offsetY
}

var isBuilding=false

$("#game-canvas").on("click",mouseclick);
function mouseclick(){
	if (cursor.x>576 && cursor.y>416) {
		console.log(isBuilding)
        isBuilding=true
	} 
	else{
		if(isBuilding==true){
            if(money>=15){
	           var newTower=new Tower()
	           newTower.x=cursor.x-cursor.x%32
	           newTower.y=cursor.y-cursor.y%32
			   towers.push(newTower)
			   money-=15
			}
		}
        isBuilding=false
	}
}



function isCollided(pX,pY,tX,tY,tw,th){
	if(tX<=pX && pX<=tX+tw && tY<=pY && pY<=tY+th){
         return true;
 	}else{
         return false;
	}
}