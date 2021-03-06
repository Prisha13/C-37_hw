var trex, trex_running, trex_collided;

var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score = 0;

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var gameOver, gameOver_image, restart, restart_image;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight);
  
  trex = createSprite(120, displayHeight-800, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,height-720,400,20);
  ground.addImage("ground",groundImage);
  ground.scale = 1.50;
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(displayHeight/2+250, displayHeight-800, 10, 10);
  gameOver.addImage(gameOver_image);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(displayHeight/2+250, displayHeight-750, 10, 10);
  restart.addImage(restart_image);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(255);
  
  if (gameState === PLAY) {
      score = score + Math.round(getFrameRate()/60);
    
      if(keyDown("space") && trex.y > 155) {
      trex.velocityY = -10;
      }
      
      trex.velocityY = trex.velocityY + 0.8
    
      ground.velocityX = -(6 + 3*score/100);
      
    
      if (ground.x < 0){
      ground.x = ground.width/2;
      }
    
      if (obstaclesGroup.isTouching(trex)) {
          gameState = END;
      }
    
      trex.collide(invisibleGround);
      spawnClouds();
      spawnObstacles();
    
  }
    else if (gameState === END) {
      ground.velocityX = 0;
      trex.velocityY = 0;
      trex.changeAnimation("trex_collided", trex_collided);
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      gameOver.visible = true;
      restart.visible = true;
      
      if (mousePressedOver(restart)) {
          reset();
      }
      
    }
  
  text("Score: "+ score, 500,50);
  
  drawSprites();
}

function reset() {
  gameState = PLAY;
  score = 0;
  trex.changeAnimation("running", trex_running);
  gameOver.visible = false;
  restart.visible = false;
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,displayHeight-790,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 700;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  } 
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(displayWidth,displayHeight-745,10,40);
    obstacle.velocityX = -(4 + score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}