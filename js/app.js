// GLOBAL CONSTANTS
let ctx = null;
const tileW = 40, tileH = 40;
const mapW = 10, mapH = 10;
let currentSecond = 0, frameCount = 0, framesLastSecond = 0;
let lastFrameTime = 0;
let enemySpeed = null;
const tileMapSrc = "assets/tileset/PNG/32x32/open_tileset.png";
const characterSrc = "assets/sprites_transparent.png";
const chairIndex = {
    x: 320,
    y: 448,
    w: 31,
    h: 32,
}
const tableIndex = {
    x: 320,
    y: 416,
    w: 32,
    h: 32,
}
const barTopIndex = {
    x: 384,
    y: 416,
    w: 32,
    h: 32,
}
const barBotIndex = {
    x: 384,
    y: 64,
    w: 32,
    h: 32,
}
const barCornerIndex = {
    x: 352,
    y: 384,
    w: 64,
    h: 32,
}
const barRightIndex = {
    x: 64,
    y: 416,
    w: 32,
    h: 32,
}
const barFloorIndex = {
    x: 192,
    y: 0,
    w: 32,
    h: 32,
}
const barFloor2Index = {
    x: 160,
    y: 0,
    w: 32,
    h: 32,
}
const barWideIndex = {
    // Index of -2
    x: 353,
    y: 384,
    w: 32,
    h: 32,
}
const barLeftIndex = {
    // Index of -1
    x: 0,
    y: 448,
    w: 32,
    h: 32,
}
const barLongIndex = {
    // Index of -3
    x: 96,
    y: 416,
    w: 32,
    h: 32,
}
const playerIndex = {
    // Index of -3
    x: 473,
    y: 8,
    w: 31,
    h: 31,
}
const playerCheerIndex = {
    // Index of -3
    x: 505,
    y: 44,
    w: 30,
    h: 30,
}
const barrelIndex = {
    // Index of -3
    x: 192,
    y: 384,
    w: 32,
    h: 32,
}
const enemyIndex = {
    // Index of -3
    x: 224,
    y: 13,
    w: 35,
    h: 35,
}
const chairs = [];

// SPRITE MAP
const tileMap = [
    1,1,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,1,1,
    -1,-2,1,1,1,1,1,1,1,1,
    1,-3,1,1,1,1,1,1,1,1,
    1,-3,1,1,1,1,1,1,1,1,
    1,-3,1,1,1,1,1,1,1,1,
    1,-3,1,1,1,1,1,1,1,1,
    1,-3,1,1,1,1,1,1,1,1,
    1,-2,-2,-3,1,1,1,1,1,1,
    1,1,1,-3,1,1,1,1,1,-4,
]

// COLLISION MAP
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
    0,0,0,0,1,1,1,1,1,0,
]

// CHAIR SPAWN AREAS
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

// MAKE CHARACTERS
const player = new Character();
const enemy = new Enemy();

window.onload = function(){
    // get canvas
    ctx = document.getElementById('game').getContext('2d');
    ctx.font = "bold 10pt sans-serif";
    // draw tilemap and enemy health
    drawLevel();
    $('#enemyHealth').text(`Enemy Health: ${enemy.health}`);
    // render characters and start enemy movement
    requestAnimationFrame(drawGame);
    enemy.updateDegFreedom();
    enemy.moveRandom();
    // spawn chairs
    spawnObstacles();
}

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

// DRAW INITIAL MAP
function drawLevel(){
    for (let y=0;y<mapH; y++){
        for (let x=0; x<mapW; x++){
            switch(tileMap[((y*mapH)+x)]){
                case -4:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, x*40, y*40, 40, 40);
                        ctx.drawImage(img,tableIndex.x,tableIndex.y,tableIndex.w, tableIndex.h, x*40, y*40, 40, 40);
                    };
                    break;
                case -3:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,barLongIndex.x,barLongIndex.y,barLongIndex.w, barLongIndex.h, x*40, y*40, 40, 40);
                    };
                    break;
                case -2:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,barWideIndex.x,barWideIndex.y,barWideIndex.w, barWideIndex.h, x*40, y*40, 40, 40);
                    };
                    break;
                case -1:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,barLeftIndex.x,barLeftIndex.y,barLeftIndex.w, barLeftIndex.h, x*40, y*40, 40, 40);
                    };
                    break;
                case 0:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,chairIndex.x,chairIndex.y,chairIndex.w, chairIndex.h, x*40, y*40, 40, 40);
                    };
                    break;
                default:
                    var img = new Image();
                    img.src = tileMapSrc;
                    img.onload = function(){
                        ctx.drawImage(img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, x*40, y*40, 40, 40);
                    };
            }
            ctx.fillRect(x*tileW, y*tileH, tileW, tileH);
        }
    }
}

// RENDER FUNCTION
function drawGame(){

    // PUT PLAYER ON SCREEN
    if (player.alive && enemy.health <= 0){
        let img = new Image();
        img.src = characterSrc;
        let img2 = new Image();
        img2.src = tileMapSrc;
        img.onload = function(){
            ctx.drawImage(img2,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, player.positionX*tileW, player.positionY*tileH, 40, 40);
            ctx.drawImage(img,playerCheerIndex.x,playerCheerIndex.y,playerCheerIndex.w, playerCheerIndex.h, player.positionX*tileW+5, player.positionY*tileH+6, 30, 30);
        };
    } else if (player.alive){
        let img = new Image();
        img.src = characterSrc;
        img.onload = function(){
            ctx.drawImage(img,playerIndex.x,playerIndex.y,playerIndex.w-1, playerIndex.h, player.positionX*tileW+1, player.positionY*tileH+6, 30, 30);
        };
    }

    // PUT ENEMY ON SCREEN
    if (enemy.health > 0){
        let img = new Image();
        img.src = characterSrc;
        img.onload = function(){
            ctx.drawImage(img,enemyIndex.x,enemyIndex.y,enemyIndex.w, enemyIndex.h, enemy.positionX*tileW-5, enemy.positionY*tileH, 40, 40);
        };
    }

    // UPDATE CHAIR POSITIONS AND COLLISIONS
        // iterate through array of chairs
    for (let i=0; i<chairs.length; i++){
        if (!chairs[i].destroyed){
            var img = new Image();
            img.src = tileMapSrc;
            img.onload = function(){
                ctx.drawImage(img,chairIndex.x,chairIndex.y,chairIndex.w, chairIndex.h, chairs[i].positionX*tileW+5, chairs[i].positionY*tileH+5, 30, 30);
            };
        }
    }

    requestAnimationFrame(drawGame);
}

// SET UP CLASSES
function Character() {
    this.speed = 10;
    this.img = new Image();
    this.img.src = tileMapSrc;
    this.positionX = 5;
    this.positionY = 9;
    this.alive = true;
    this.destroy = function() {
        // TO-DO
    }
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
        ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
        gameMap[(this.positionY*mapH)+this.positionX] = 1;
    }
    this.kick = function(){
        // CHECK ALL CHAIRS AROUND YOUR POSITION...
        for (let x=this.positionX-1; x<=this.positionX+1; x++){
            for (let y=this.positionY-1; y<=this.positionY+1; y++){
                // IF LOOK AROUND YOURSELF AT EACH 
                if (!gameMap[(y*mapH)+x] && !(y == this.positionY && x == this.positionX)){
                    // IS THIS LOCATION IS IN THE CHAIR ARRAY? GET THE INDEX.
                    function findChairPos(element){
                        return (element.positionX == x && element.positionY == y);
                    }
                    let chairIndex = chairs.findIndex(findChairPos);
                    let velX = 0, velY = 0;

                    // CHAIR INDEX IS -1 IF ONE WAS NOT FOUND
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
                    }

                    // NOW CHECK FOR THE CHAIR STACK (AND AN EMPTY CHAIR ARRAY?)
                    if (x == 9 && y==9){
                        for (let i=0; i<chairs.length;i++){
                            if (chairs[i].destroyed == false){
                                return;
                            } else if (i== chairs.length-1){
                                spawnObstacles();
                            };
                        }
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

function Enemy() {
    this.speed = 10;
    this.img = new Image();
    this.img.src = tileMapSrc;
    this.positionX = 1;
    this.positionY = 1;
    this.health = 5;
    this.degFreedom = []; //RIGHT/LEFT/DOWN/UP
    this.destroy = () => {
        // TO-DO
    }
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
        console.log(`Enemy can use move codes: ${this.degFreedom}`);
    }
    this.clearPrevPos = () => {
        // CLEARS PREVIOUS POSITION ON SCREEN AND UPDATES COLLISION MAP
        ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
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
            console.log(`Enemy is at : [${enemy.positionX},${enemy.positionY}]`)
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

class Chair {
    constructor(x,y){
        this.img = new Image();
        this.img.src = tileMapSrc;
        this.positionX = x
        this.positionY = y
        this.velocityX = 0
        this.velocityY = 0
        this.damage = 1;
        this.destroyed = false;
    }
    destroy(){
        // TO-DO
    }
    moveLeft(){
        // CHECK IF POSSIBLE
        if (this.positionX && gameMap[(this.positionY*mapH)+this.positionX-1]){
            // CURRENT POSITION BECOMES TRAVERSABLE AND CHAIR IS REMOVED
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 1;
            ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
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
            ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
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
            ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
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
            ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, this.positionX*tileW, this.positionY*tileH, 40, 40);
            // UPDATE THE NEW POSITION
            this.positionY ++;
            // NEW POSITION IS NON-TRAVERSABLE
            gameMap[((this.positionY)*mapH)+(this.positionX)] = 0;
        }
    }
    trajectory(chairIndex, velX, velY){
        console.log("THE CHAIR WAS KICKED!")

        // SET UP CHAIR OBJECT VARIABLE
        let chairObj = null;
        
        let interval = setInterval(() => {
            console.log(`Chair #${chairIndex} is at [${chairs[chairIndex].positionX},${chairs[chairIndex].positionY}]`)
            chairObj = chairs[chairIndex];
            chairObj.velocityX = velX;
            chairObj.velocityY = velY;

            // DESTROY THIS CHAIR IF NEXT POSITION IS OCCUPIED
            if (!gameMap[((chairObj.positionY+chairObj.velocityY)*mapH)+(chairObj.positionX+chairObj.velocityX)]){
                // CHECK IF SAID POSITION IS THE ENEMY
                if (chairObj.positionX+velX == enemy.positionX && chairObj.positionY+velY == enemy.positionY && !enemy.destroyed){
                    enemy.health --;
                    $('#enemyHealth').text(`Enemy Health: ${enemy.health}`);
                    if (!enemy.health){
                        ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, (chairObj.positionX+velX)*tileW, (chairObj.positionY+velY)*tileH, 40, 40);
                        gameMap[((enemy.positionY)*mapH)+(enemy.positionX)] = 1;
                    }
                }
                ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, (chairObj.positionX)*tileW, (chairObj.positionY)*tileH, 40, 40);
                clearInterval(interval);
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 1;
                chairs[chairIndex].destroyed = true;
            } 
            // MOVE CHAIR IF NOT DESTROYED AND UPDATE COLLSION
            else {
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 1;
                ctx.drawImage(this.img,barFloor2Index.x,barFloor2Index.y,barFloor2Index.w, barFloor2Index.h, (chairObj.positionX)*tileW, (chairObj.positionY)*tileH, 40, 40);
                this.positionX += velX;
                this.positionY += velY;
                gameMap[((chairObj.positionY)*mapH)+(chairObj.positionX)] = 0;
            }
        },100)
    }
}

// SPAWN CHAIRS
function spawnObstacles(){
    for (let i=0; i<3; i++){
        // CLEAR CHAIR ARRAY
        // RAND #s BASED ON OBSTACLE MAP TO AVOID EDGES
        let randX = Math.floor(Math.random()*6)+3;
        let randY = Math.floor(Math.random()*8)+1;
        while (!gameMap[(randY*mapH)+randX]){
            randX = Math.floor(Math.random()*6)+3;
            randY = Math.floor(Math.random()*8)+1;
        }
        let chair = new Chair(randX,randY);
        gameMap[(randY*mapH)+randX] = 0;
        chairs.push(chair);
    }
}

// EVERY TIME THE ENEMY AND PLAYER MOVE, CHECK FOR PLAYER DEATH
function playerEnemyContact() {
    let playerX = player.positionX, playerY = player.positionY, enemyX = enemy.positionX, enemyY = enemy.positionY;
    // IF THEY ARE WITHIN 1 SPACE (NOT DIAGONAL DIRECTION)
    if (((Math.abs(enemyX-playerX)==0 && Math.abs(enemyY-playerY)<2) || (Math.abs(enemyY-playerY)==0 && Math.abs(enemyX-playerX)<2)) && enemy.health){
        // KILL THE PLAYER
        player.clearPrevPos();
        player.alive = false;
        $('#deathScreen').css("visibility","visible");
    }
}
