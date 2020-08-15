const Discord = require('discord.js');
const {prefix, token} = require ('./config.json');
const client = new Discord.Client();
var lastThanks = new Date();
var hasThank;
var pMap;

client.on('ready', () => {
  console.log('I am ready!');
  pMap = createUserMap();
  
  
  //console.log(pMap)
  setTimeout(function() {
    sendMessage();
    var dayMillseconds = 1000*60*60*4;
    hasThank = createThankMap();
    console.log(hasThank);
    setInterval(function(){
      sendMessage();
      hasThank = createThankMap();
      console.log(hasThank);
    }, dayMillseconds)
  }
  )
});


client.on('message', message => {

  const channel = message.guild.channels.find(ch => ch.name == 'thank-chappy-for-his-service');

  if (message.content=="!chap") {
    channel.send('please thank Chappy for his service!');

    
  } else if (message.content.toLocaleLowerCase().trim().includes("thank you")||message.content.toLocaleLowerCase().trim().includes("appreciate")||message.content.toLocaleLowerCase().trim().includes("grateful")){
    if (message.author.username == "ScampyChap"){
      channel.send("No, THANK YOU!");
    }
    else if(message.createdAt - lastThanks < 60000*30 && !hasThank.get(message.author.username)){ 
      var score = pMap.get(message.author.username);
      score++;
      pMap.set(message.author.username, score);
      hasThank.set(message.author.username, true);
      //console.log(pMap)
      console.log(hasThank)
    } 
  } else if(message.content == "!points" && message.author.username !="ScampyChap"){
    var pointMessage = "You have " + pMap.get(message.author.username) + " points! Keep giving thanks!";
    channel.send(pointMessage);
  } else if(message.content == "!points all"){
    var leaderBoardMessage = "LEADER BOARD:" +'\n';
    var allUsers = getAllUsers();
    var userPoints = new Array(allUsers.length);
    var userString = new Array(allUsers.length);
    for(i=0; i < allUsers.length; i++){
      userPoints[i] = pMap.get(allUsers[i].username);
      userString[i] = allUsers[i].username;
    }
    tmp = 0;
    tmpS = "";
    for (i=0; i < allUsers.length; i++){
      for(x=i; x < allUsers.length-1; x++){
        if(userPoints[i] < userPoints[x+1]){
          tmp = userPoints[i];
          tmpS = userString[i];
          userPoints[i] = userPoints[x+1];
          userString[i] = userString[x+1];
          userPoints[i+1] = tmp;
          userString[i+1] = tmpS;
        }
      }
    }
    console.log(userPoints);
    console.log(userString);
    //console.log(userPoint);
    for (i = 0; i < allUsers.length; i++){
      
      leaderBoardMessage = leaderBoardMessage + "~"+userString[i] +': '+ userPoints[i] + '\n';
    }
    channel.send(leaderBoardMessage);
  } else if(message.content.toLocaleLowerCase().includes("test1") || message.content.toLocaleLowerCase().includes("test2")){
      channel.send("YOU GET MINUS 5 POINTS!!!!");
      score = pMap.get(message.author.username);
      pMap.set(message.author.username, score-5);
    }
});

function sendMessage(){
  var dt = new Date();
  var guild = client.guilds.get('602278153741664268');
  if(guild && guild.channels.get('657399393577861153')){
    guild.channels.get('657399393577861153').send("It's " + dt.getHours() + ":"+ dt.getMinutes() +". Time to thank Chappy");
    lastThanks = dt;
  }
}

function getAllUsers(){
  var users = client.users.filter(user => user.bot == false && user.username !="ScampyChap").array();
  return users
}

function createUserMap(){
  var users = getAllUsers();
  var userMap = new Map();
  var pointArray = new Array(users.size);
  for (i = 0; i < users.length; i++){
    pointArray[i]=0;
  }
  for (i=0; i < users.length; i++){
    userMap.set(users[i].username, pointArray[i]);
  }

  return userMap;
  
} 
function createThankMap(){
  var users = getAllUsers();
  var thankMap = new Map();
  var thankArray = new Array(users.size);
  for (i=0; i<users.length; i++){
    thankArray[i] = false;
  }
  for (i=0; i < users.length; i++){
    thankMap.set(users[i].username,thankArray[i]);
  }
  return thankMap;
}

client.login(token);
