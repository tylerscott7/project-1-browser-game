// GLOBAL CONSTANTS
let ctx = null;
const tileW = 40, tileH = 40;
const mapW = 10, mapH = 10;
let currentSecond = 0, frameCount = 0, framesLastSecond = 0;
let lastFrameTime = 0;
let enemySpeed = null;

let keysDown = {
    37: false,
    38: false,
    39: false,
    40: false,
};

const gameMap = [
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,1,1,1,1,1,1,1,1,
    0,0,0,0,1,1,1,1,1,1,
    0,0,0,0,1,1,1,1,1,1,
]

const obstacleMap = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,1,1,1,1,1,1,0,
    0,0,0,0,0,1,1,1,1,0,
    0,0,0,0,0,1,1,1,1,0,
    0,0,0,0,0,0,0,0,0,0,
]

window.onload = function(){
    ctx = document.getElementById('game').getContext('2d');
    drawLevel();
    requestAnimationFrame(drawGame);
    ctx.font = "bold 10pt sans-serif";
    spawnObstacles();
}

// DRAW INITIAL MAP
function drawLevel(){
    for (let y=0;y<mapH; y++){
        for (let x=0; x<mapW; x++){
            switch(gameMap[((y*mapH)+x)]){
                case 0:
                    ctx.fillStyle = "#999999";
                    break;
                default:
                    ctx.fillStyle = "#eeeeee";
            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }
}

// GAME LOOP FUNCTION
function drawGame(){
    if (ctx == null){
        return;
    }
    let sec = Math.floor(Date.now()/1000);
    if (sec != currentSecond){
        currentSecond = sec;
        framesLastSecond = frameCount;
        frameCount = 1;
    }
    else {
        frameCount++;
    }

    ctx.fillStyle = "#ff0000";
    // ctx.fillText("FPS: " + framesLastSecond, 10, 20);

    // PUT PLAYER ON SCREEN
    if (player.alive){
        ctx.fillRect(player.positionX*tileW,player.positionY*tileH,tileW,tileH);
    }

    // PUT ENEMY ON SCREEN
    if (enemy.health){
        ctx.fillStyle = "#000000";
        ctx.fillRect(enemy.positionX*tileW,enemy.positionY*tileH,tileW,tileH);  
    }

    // UPDATE CHAIR POSITIONS AND COLLISIONS
    ctx.fillStyle = "#773D0C";
    // ITERATE THROUGH ARRAY OF CHAIRS
    for (let i=0; i<chairs.length; i++){
        if (!chairs[i].destroyed){
        ctx.fillRect(chairs[i].positionX*tileW,chairs[i].positionY*tileH,tileW,tileH);
        }
    }

    requestAnimationFrame(drawGame);
}

// EVERY TIME THE ENEMY AND PLAYER MOVE, CHECK FOR PLAYER DEATH
function playerEnemyContact() {
    let playerX = player.positionX, playerY = player.positionY, enemyX = enemy.positionX, enemyY = enemy.positionY;
    // IF X AND Y ARE WITHIN 1 SPACE
    if (((Math.abs(enemyX-playerX)==0 && Math.abs(enemyY-playerY)<2) || (Math.abs(enemyY-playerY)==0 && Math.abs(enemyX-playerX)<2)) && enemy.health){
        // KILL THE PLAYER!
        console.log("You should be dead...");
        player.clearPrevPos();
        player.alive = false;
    }
}


// SET UP PLAYER CLASS AND INSTANTIATE
function Character() {
    this.positionX = 5;
    this.positionY = 9;
    this.alive = true;
    this.moveWithChair = function(direction){

        let futurePosX = this.positionX, futurePosY = this.positionY;

        // DIRECTION: "RIGHT", "LEFT", "UP", "DOWN"
        if (direction == "left"){
            futurePosX --;
        } else if (direction == "right"){
            futurePosX ++;
        } else if (direction == "up"){
            futurePosY --;
        } else if (direction == "down"){
            futurePosY ++;
        }

        // SEARCH CHAIR ARRAY FUNCTION
        function findChairPos(element){
            return (element.positionX == futurePosX && element.positionY == futurePosY);
        }

        let chairIndex = chairs.findIndex(findChairPos);

        // FIND AN INDEX, IF NO INDEX, DO NOTHING. IF THERE IS, TRY MOVING IT.
        if (chairIndex >= 0){
            if (direction == "left"){
                chairs[chairIndex].moveLeft();
            } else if (direction == "right"){
                chairs[chairIndex].moveRight();
            } else if (direction == "up"){
                chairs[chairIndex].moveUp();
            } else if (direction == "down"){
                chairs[chairIndex].moveDown();
            }
        };

        // DID THE CHAIR MOVE? CHECK THE COLLISION MAP.
        if (gameMap[(futurePosY*mapH)+futurePosX]){
            this.clearPrevPos();
            player.positionX = futurePosX;
            player.positionY = futurePosY;
            gameMap[(player.positionY*mapH)+player.positionX] = 0;
        }

    }
    this.clearPrevPos = function(){
        // CLEARS PREVIOUS POSITION ON SCREEN AND UPDATES COLLISION MAP
        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
        gameMap[(this.positionY*mapH)+this.positionX] = 1;
    }
    this.kick = function(){
        // CHECK ALL CHAIRS AROUND YOUR POSITION...
        for (let x=this.positionX-1; x<=this.positionX+1; x++){
            for (let y=this.positionY-1; y<=this.positionY+1; y++){
                if (!gameMap[(y*mapH)+x] && !(y == this.positionY && x == this.positionX)){
                    // IS THIS LOCATION IS IN THE CHAIR ARRAY? GET THE INDEX.
                    function findChairPos(element){
                        return (element.positionX == x && element.positionY == y);
                    }
                    let chairIndex = chairs.findIndex(findChairPos);
                    console.log(`${chairIndex}`);
                    let velX = 0, velY = 0;

                    if (chairIndex >= 0){
                        if (x < this.positionX){
                            velX = -1;
                        } else if (x > this.positionX){
                            velX = 1;
                        }
                        if (y < this.positionY){
                            velY = -1;
                        } else if (y > this.positionY){
                            velY = 1;
                        }
                        // CALL TRAJECTORY ON SAID CHAIR TO MOVE
                        chairs[chairIndex].trajectory(chairIndex, velX, velY);
                        console.log("kicked!");
                    }

                }
            }
        }
    }
    this.moveLeft = function() {
        if (!this.alive){
            return
        }
        if (player.positionX && gameMap[(player.positionY*mapH)+player.positionX-1]){
            this.clearPrevPos();
            player.positionX --;
            gameMap[(player.positionY*mapH)+player.positionX] = 0;
        } else if (player.positionX) {
            // CHECK FOR A CHAIR LEFT AND MOVE WITH IT, IF POSSIBLE
            this.moveWithChair("left");
        }
        playerEnemyContact();
    };
    this.moveRight = function() {
        if (!this.alive){
            return
        }
        if (player.positionX < mapW-1  && gameMap[(player.positionY*mapH)+player.positionX+1]){
            this.clearPrevPos();
            player.positionX ++;
            gameMap[(player.positionY*mapH)+player.positionX] = 0;
        } else if (player.positionX < mapW-1){
            this.moveWithChair("right");
        }
        playerEnemyContact();
    }
    this.moveUp = function() {
        if (!this.alive){
            return
        }
        if (player.positionY && gameMap[((player.positionY-1)*mapH)+player.positionX]){
            this.clearPrevPos();
            player.positionY --;
            gameMap[(player.positionY*mapH)+player.positionX] = 0;
        } else {
            this.moveWithChair("up");
        }
        playerEnemyContact();
    }
    this.moveDown = function() {
        if (!this.alive){
            return
        }
        if (player.positionY < mapH-1  && gameMap[((player.positionY+1)*mapH)+player.positionX]){
            this.clearPrevPos();
            player.positionY ++;
            gameMap[(player.positionY*mapH)+player.positionX] = 0;
        } else {
            this.moveWithChair("down");
        }
        playerEnemyContact();
    }
}
let player = new Character();
function Enemy() {
    this.positionX = 1;
    this.positionY = 1;
    this.health = 2;
    this.degFreedom = []; //RIGHT/LEFT/DOWN/UP
    this.updateDegFreedom = () => {
        this.degFreedom = [];
        // CHECK BOTTOM. ADD DOWN CODE 2 IF ITS FREE.
        if (gameMap[((this.positionY+1)*mapH)+this.positionX] && this.positionY!=9) {
            this.degFreedom.push(2);
        }
        // CHECK TOP. ADD TOP CODE 3 IF ITS FREE.
        if (gameMap[((this.positionY-1)*mapH)+this.positionX] && this.positionY) {
            this.degFreedom.push(3);
        }
        // CHECK RIGHT. ADD RIGHT CODE 0 IF ITS FREE.
        if (gameMap[((this.positionY)*mapH)+this.positionX+1] && this.positionX!=9) {
            this.degFreedom.push(0);
        }
        // CHECK LEFT. ADD LEFT CODE 1 IF ITS FREE.
        if (gameMap[((this.positionY)*mapH)+this.positionX-1] && this.positionX) {
            console.log(((this.positionY)*mapH)+this.positionX-1);
            this.degFreedom.push(1);
        }
        console.log(`You can use these move codes: ${this.degFreedom}`);
    }
    this.clearPrevPos = () => {
        // CLEARS PREVIOUS POSITION ON SCREEN AND UPDATES COLLISION MAP
        ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
        gameMap[(this.positionY*mapH)+this.positionX] = 1;
    }
    this.moveRandom = () => {
        enemySpeed = setInterval(() => {
            if (this.health == 0){
                clearInterval(enemySpeed);
                gameMap[(this.positionY*mapH)+this.positionX] = 1;
            }
            // MOVEMENT VARIABLE BASED ON DEGREES OF FREEDOM
            const randDir = Math.floor(Math.random()*this.degFreedom.length);
            const moveDir = this.degFreedom[randDir];
            console.log(`X:${enemy.positionX} Y: ${enemy.positionY}`)
            ctx.fillStyle = "#eeeeee"
            switch (moveDir){
                case 0:
                    if (this.positionX < mapW-1  && gameMap[(this.positionY*mapH)+this.positionX+1]){
                        this.clearPrevPos();
                        this.positionX ++;
                        this.updateDegFreedom();
                        gameMap[(this.positionY*mapH)+this.positionX] = 0;
                    };
                    break;
                case 1:
                    if (this.positionX && gameMap[(this.positionY*mapH)+this.positionX-1]){
                        this.clearPrevPos();
                        this.positionX --;
                        this.updateDegFreedom();
                        gameMap[(this.positionY*mapH)+this.positionX] = 0;
                    };
                    break;
                case 2:
                    if (this.positionY < mapH-1  && gameMap[((this.positionY+1)*mapH)+this.positionX]){
                        this.clearPrevPos();
                        this.positionY ++;
                        this.updateDegFreedom();
                        gameMap[(this.positionY*mapH)+this.positionX] = 0;
                    };
                    break;
                case 3:
                    if (this.positionY && gameMap[((this.positionY-1)*mapH)+this.positionX]){
                        this.clearPrevPos();
                        this.positionY --;
                        this.updateDegFreedom();
                        gameMap[(this.positionY*mapH)+this.positionX] = 0;
                    };
                    break;
                default:
                    console.log("Default.")
                    break;
            }
            playerEnemyContact();
        },1000);
    }
}

let enemy = new Enemy();
enemy.updateDegFreedom();
enemy.moveRandom();
const chairs = [];

// SET UP USER INPUT
$('body').on('keydown', function(e) {
    ctx.fillStyle = "#eeeeee";
    if (e.which == 37){
        player.moveLeft();
    } else if (e.keyCode == 38){
        player.moveUp();
    } else if (e.keyCode == 39){
        player.moveRight();
    } else if (e.keyCode == 40){
        player.moveDown();
    } else if (e.keyCode == 32){
        player.kick();
    }
});

// SPAWN CHAIRS
function spawnObstacles(){
    ctx.fillStyle = "#773D0C";
    for (let i=0; i<3; i++){
        // RAND #s BASED ON OBSTACLE MAP TO AVOID EDGES
        let randX = Math.floor(Math.random()*6)+3;
        let randY = Math.floor(Math.random()*8)+1;
        while (!gameMap[(randY*mapH)+randX]){
            randX = Math.floor(Math.random()*6)+3;
            randY = Math.floor(Math.random()*8)+1;
        }
        let chair = new Chair(randX,randY);
        // ctx.fillRect(randX*tileW,randY*tileH,tileW,tileH);
        gameMap[(randY*mapH)+randX] = 0;
        chairs.push(chair);
    }
}

class Chair {
    constructor(x,y){
        this.positionX = x
        this.positionY = y
        this.velocityX = 0
        this.velocityY = 0
        this.damage = 1;
        this.destroyed = false;
    }
    moveLeft(){
        // CHECK IF POSSIBLE
        if (this.positionX && gameMap[(this.positionY*mapH)+this.positionX-1]){
            // CURRENT POSITION BECOMES TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 1;
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
            // UPDATE THE NEW POSITION
            this.positionX --;
            // NEW POSITION IS NON-TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 0;
        }
    }
    moveRight(){
        if (this.positionX < mapW-1 && gameMap[(this.positionY*mapH)+this.positionX+1]){
            // CURRENT POSITION BECOMES TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 1;
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
            // UPDATE THE NEW POSITION
            this.positionX ++;
            // NEW POSITION IS NON-TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 0;
        }
    }
    moveUp(){
        if (this.positionY && gameMap[((this.positionY-1)*mapH)+this.positionX]){
            // CURRENT POSITION BECOMES TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 1;
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
            // UPDATE THE NEW POSITION
            this.positionY --;
            // NEW POSITION IS NON-TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 0;
        }
    }
    moveDown(){
        if (this.positionY < mapH -1 && gameMap[((this.positionY+1)*mapH)+this.positionX]){
            // CURRENT POSITION BECOMES TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 1;
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(this.positionX*tileW,this.positionY*tileH,tileW,tileH);
            // UPDATE THE NEW POSITION
            this.positionY ++;
            // NEW POSITION IS NON-TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 0;
        }
    }
    trajectory(chairIndex, velX, velY){
        console.log("THE TRAJECTORY SHOULD BEGIN")

        // SET UP CHAIR OBJECT VARIABLE
        let chairObj = null;
        
        let interval = setInterval(() => {
            console.log(`Chair #${chairIndex} is at ${chairs[chairIndex].positionX},${chairs[chairIndex].positionY}`)
            chairObj = chairs[chairIndex];
            chairObj.velocityX = velX;
            chairObj.velocityY = velY;

            // DESTROY THIS CHAIR IF NEXT POSITION IS OCCUPIED
            if (!gameMap[((chairObj.positionY+chairObj.velocityY)*mapH)+(chairObj.positionX+chairObj.velocityX)]){
                // CHECK IF SAID POSITION IS THE ENEMY
                if (chairObj.positionX+velX == enemy.positionX && chairObj.positionY+velY == enemy.positionY ){
                    enemy.health --;
                    console.log(`The Enemy health is now: ${enemy.health}`);
                    if (!enemy.health){
                        ctx.fillStyle = "#eeeeee";
                        ctx.fillRect((chairObj.positionX+velX)*tileW,(chairObj.positionY+velY)*tileH,tileW,tileH);
                        gameMap[((enemy.positionY)*mapH)+(enemy.positionX)] = 1;
                    }
                }
                ctx.fillStyle = "#eeeeee";
                ctx.fillRect(chairObj.positionX*tileW,chairObj.positionY*tileH,tileW,tileH);
                clearInterval(interval);
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 1;
                chairs[chairIndex].destroyed = true;
            } 
            // MOVE CHAIR IF NOT DESTROYED AND UPDATE COLLSION
            else {
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 1;
                ctx.fillStyle = "#eeeeee";
                ctx.fillRect(chairObj.positionX*tileW,chairObj.positionY*tileH,tileW,tileH);
                this.positionX += velX;
                this.positionY += velY;
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 0;
            }
        },100)
    }
}

// SET UP TITLE SCREEN


