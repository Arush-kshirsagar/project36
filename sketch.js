//Create variables here
var dog,happyDog,database,foodS,foodStock,addFood,fedTime,lastFed,foodObj,feed;
var bedroomimg,gardenimg,bathroomimg;
var readState,gameState,currentTime;

function preload()
{
  //load images here
  happyDog=loadImage("dogImg1.png");
  dogimg=loadImage("dogImg.png");
  bedroomimg=loadImage("Bed Room.png");
  gardenimg=loadImage("Garden.png");
  bathroomimg=loadImage("Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);

  fedTime=database.ref('FeedTime')
 fedTime.on("value",function(data){
   lastFed=data.val();
 })
  

  readState=database.ref('gameState');
  readState.on("value",function(data){
     gameState=data.val();
  })
  

  dog=createSprite(350,350,50,50);
  dog.addImage(dogimg);
  dog.scale=0.15;

  foodObj=new Food()
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);


  feed=createButton("Feed the Dog");
  feed.position(650,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(750,95);
  addFood.mousePressed(addFoods);

  
  

  
  
}


function draw() {  
currentTime=hour();
if(currentTime===(lastFed+1)){
  update("Playing")
  foodObj.garden();

}
else if(currentTime===(lastFed+2)){
  update("Sleeping")
  foodObj.bedroom();
}
else if(currentTime>(lastFed+2 )  && currentTime<=(lastFed+4)){
  update("Bathing")
  foodObj.washRoom();
}
else{
  update("Hungry")
  foodObj.display();
}

 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }
 else{
   feed.show();
   addFood.show();
   dog.addImage(dogimg);

 }
 
  
drawSprites();

}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  dog.addImage(happyDog);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"

  })

  
  

}
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })

}


function update(state){
  database.ref('/').update({
    gameState:state
  });
}