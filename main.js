var myGamePiece;
var ground; 
var dead = false;
var doOnce1, doOnce2;
var myBackground;
var crashBox;
var start = false;
var userMessage = document.getElementById("user-message");
userMessage.textContent = "Get Ready";
var restartBtn = document.getElementById("restart");
restartBtn.style.left = window.innerWidth - window.innerWidth / 2 - 50 + "px";
var c = 0;
var a = 1;
var score = document.getElementById("score");
var myObstacles = [];

function startGame() {
    myGamePiece = new component(35, 30, "./images/bird.png", window.innerWidth/2 - 15, window.innerHeight/2 - 15, "rot");
    ground = new component(window.innerWidth, 70, "./images/base.jpg", 0, window.innerHeight-70, "image");
   myBackground = new component(window.innerWidth, window.innerHeight, "./images/background.png", 0, 0, "background");
   crashBox = new component(30, 30, "transparent", myGamePiece.x, myGamePiece.y);
    myGameArea.start();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;   
        this.interval = setInterval(updateGameArea, 14);        
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
   }   
   function everyinterval(n) {
     if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
     return false;
   }
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background" || type == "rot") {
      this.image = new Image();
      this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;  
    this.angle = 0;  
    this.speedX = 0;
    this.speedY = 0;       
    	this.gravity = 0.18;	         
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;                  
        if (type == "image" || type == "background") {
          ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);           
               
           if (type == "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }       
        }
        else if(type == "rot") {   
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image,
            this.width / -2,
            this.height / -2,
            this.width, this.height); 
            ctx.restore();    
        }
        else{
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }    
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type == "background") {
      if (this.x == -(this.width)) {
        this.x = 0;
      }
    }
        this.hitBottom();
    }    
    this.crashWith = function(otherobj) {
      var myleft = this.x+10;
      var myright = this.x + (this.width);
      var mytop = this.y+2;
      var mybottom = this.y + (this.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
        crash = false;
      }
      return crash;
    }    
    this.hitBottom = function() {
        var ceiling = myGameArea.canvas.height - myGameArea.canvas.height;        
         if(this.y < ceiling){
          this.y = ceiling;
          this.gravitySpeed = 0;
          this.speedY = 0;
        }        
        if (crashBox.y > ground.y - crashBox.height) {
          myGamePiece.y = ground.y-crashBox.height;
          myGamePiece.gravitySpeed = 0;
          myGamePiece.speedY = 0;
          dead = true;
          death();
          myGameArea.stop();
          var hit = new Audio("./audio/hit.ogg");        
          hit.play();	
  }
 }
}
var vy = 0;
function updateGameArea() {
    myGameArea.clear();  
    if(start == false) {    				         
    vy += 0.1;
    myGamePiece.y += Math.cos(vy);
    }
    if(start == true) {
    			myGamePiece.gravity = 0.18;
    		if(myGamePiece.angle <= 90 * Math.PI / 180) {
    			myGamePiece.angle += 1.5 * Math.PI / 180;
     } 
    }
    else{
    		myGamePiece.gravity = 0;	
    }
    doOnce1 = true; 
    if(doOnce2 == true) {
    		 doOnce1 = false;
    }        	   
    myBackground.newPos();
    if(dead == false) {
    			myBackground.speedX = -0.25;
    }
    myBackground.gravitySpeed = 0;
    myBackground.gravity = 0;    
    myBackground.update();
    myGameArea.frameNo += 1;    
    ground.gravitySpeed = 0;
    ground.gravity = 0;
    if(start == true) { 
     var pipeSpawnRate = 50 * window.innerWidth / 100;	   
      
     if (myGameArea.frameNo == 1 || everyinterval(pipeSpawnRate)) {    
     var MAX = 67 * window.innerHeight / 100;
     var MIN = 25 * window.innerHeight / 100;
     var H = window.innerHeight;
   var randomY = Math.floor(Math.random()*(MAX-MIN)+MIN);
   var gap = 120;   
   var W = 69;
    myObstacles.push(new component(W, H, "./images/pipe-down.png", window.innerWidth, window.innerHeight-window.innerHeight-randomY-gap, "image"));          
    myObstacles.push(new component(W, H, "./images/pipe-up.png", window.innerWidth, window.innerHeight-randomY, "image"));
     }
    for (var i = 0; i < myObstacles.length; i++) {    
       if (crashBox.crashWith(myObstacles[i])) { 
        death();		             
        dead = true;        
        myGamePiece.speedY = 0;
        myBackground.speedX = 0;
        a = 0; 
        if(doOnce1 == true) {        	
        	doOnce2 = true;
        	if(doOnce1 == true) {				
		      var hit = new Audio("./audio/hit.ogg");        
         hit.play();	
         var lose = new Audio("./audio/die.ogg");
         lose.play();
         doOnce2 = true;
         }
        }       
       }
       if(myGamePiece.x == myObstacles[i].x + myObstacles[i].width){
         c += 0.5;
         var point = new Audio("./audio/point.ogg");
         point.play();
         if(dead == false) {
         	score.textContent = c; 		
         }                 
       }
       if(myObstacles[i].x < -myObstacles[i].width) {
       		myObstacles.splice(i, 2);	
       }
       myObstacles[i].x -= a;
       myObstacles[i].update();
   }
  } 
      myGamePiece.newPos();
      myGamePiece.update();
      crashBox.y = myGamePiece.y-15;  
      crashBox.x = myGamePiece.x-15;         
      crashBox.update();
      ground.newPos();
      ground.update();    
 } 
window.addEventListener('touchstart', function() {
 accelerate();
 });
 window.addEventListener('mousedowm', function() {
 accelerate();
 });
 
function accelerate() {
if(dead == false) {		
   var flap = new Audio("./audio/wing.ogg");	
   flap.play()	;
   start = true;
   userMessage.style.display = "none";
   myGamePiece.angle = -45 * Math.PI / 180;
   myGamePiece.gravitySpeed = 0;
   myGamePiece.speedY = -5;
  }
}
function death() {		
userMessage.textContent = "Game Over";
userMessage.style.display = "block";
restartBtn.style.display = "block";
}
