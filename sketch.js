var poorman,sadPoorman,happyPoorman, database;
var foodS,foodStock;
var addFood;
var foodObj;

var chewingSound;

//create feed and lastFed variable here
var feed;
var lastFed;
var fedTime;


function preload(){

    sadPoorman=loadImage("images/poor.png");
    happyPoorman=loadImage("images/parcel.png");

    chewingSound = loadSound("sound/sound.mp3");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  poorman=createSprite(800,200,150,150);
  poorman.addImage(sadPoorman);
  poorman.scale=0.22;

  //create feed the dog button here

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  feed = createButton("Feed The poor man");
  feed.position(650,95);
  feed.mousePressed(feedPoorman);


}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  fedTime = database.ref('FeedTime')
  fedTime.on("value",function(data){
     lastFed = data.val();
  })
  
  //write code to display text lastFed time here
  fill("red");
  stroke("white");
  strokeWeight(5);
  textFont("algerian");
  textSize(18);
  if(lastFed>=12){
    text("Last Feed : " + lastFed % 12 + "PM",270,30);
  }else if(lastFed==0){
    text("Last Feed :  12 AM",270,30);
  }else{
    text("Last Feed : " + lastFed + "AM",270,30);
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedPoorman(){

  poorman.addImage(happyPoorman);
  poorman.scale = 0.14;

  chewingSound.play();

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if(food_stock_val <= 0){
       foodObj.updateFoodStock(food_stock_val *0);
  }else{
       foodObj.updateFoodStock(food_stock_val -1);
  }
  database.ref('/').update({
    'FeedTime': hour(),
    'Food': foodObj.getFoodStock()
  })

}

//function to add food in stock
function addFoods(){

  poorman.addImage(sadPoorman);
  poorman.scale = 0.22;

  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

