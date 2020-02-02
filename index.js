const Discord = require('discord.js');
const {prefix, token} = require ('./config.json');
//657399393577861153
// Create an instance of a Discord client
const client = new Discord.Client();
var lastThanks = new Date();
var hasThank;
//const thankChappyForHisService = bot.channels.get();
var pMap;
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
//Janine has 2
//I have 8
//Tanner has 5
client.on('ready', () => {
  console.log('I am ready!');
  //getAllUsers();
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
      console.log("test")
      console.log(hasThank);
      //client.message.channel.send("poop");
      //console.log("poop");
    }, dayMillseconds)
  }
  )
});

// Create an event listener for messages
client.on('message', message => {
  // If the message is "ping"
  const channel = message.guild.channels.find(ch => ch.name == 'thank-chappy-for-his-service');
  //getAllUsers();
  //createUserMap();
  //const test = message.guild.fetchMember();
  //console.log(test);
  //if (!channel) {return;}
  //getAllUsers();
  
  //console.log(message.createdAt.getHours())
  //console.log(pMap);
  if (message.content=="!chap") {
    // Send "pong" to the same channel
    channel.send('please thank Chappy for his service!');
    //console.log(message.content);
    
  } else if (message.content.toLocaleLowerCase().trim().includes("thank you")||message.content.toLocaleLowerCase().trim().includes("appreciate")||message.content.toLocaleLowerCase().trim().includes("grateful")){
    if (message.author.username == "ScampyChap"){
      channel.send("*Salutes* S-S-Sir.... There's no need for you t-t-to do that! Please, let the rest of us lowly civs do the thanking!");
    }
    else if(message.createdAt - lastThanks < 60000*30 && !hasThank.get(message.author.username)){ 
      var score = pMap.get(message.author.username);
      score++;
      pMap.set(message.author.username, score);
      hasThank.set(message.author.username, true);
      //console.log(pMap)
      console.log(hasThank)
    } 
    //console.log(score);
  } else if(message.content == "!points" && message.author.username !="ScampyChap"){
    var pointMessage = "You have " + pMap.get(message.author.username) + " patriot points, maggot! Keep thanking Chappy for his service!";
    channel.send(pointMessage);
  } else if(message.content == "!points all"){
    var leaderBoardMessage = "LEADER BOARD:" +'\n';
    //var index = pMap.array().length;
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
      
      //leaderBoardMessage = leaderBoardMessage + "~"+allUsers[i].username +': '+ pMap.get(allUsers[i].username) + '\n';
      leaderBoardMessage = leaderBoardMessage + "~"+userString[i] +': '+ userPoints[i] + '\n';
    }
    channel.send(leaderBoardMessage);
  } else if(message.content.toLocaleLowerCase().includes("communism") || message.content.toLocaleLowerCase().includes("socialism")){
      channel.send("YOU UNGRATEFUL MOTHER FUCKER! I CAN'T BELIEVE YOU WOULD EVEN DARE MENTION COMMUNISM IN THIS MILITARY-SERVICE-APPRECIATION SPACE, I CAN'T FUCKING BELIVE THIS SHIT YOU STUPID MOTHER FUCKING MOTHER FUCKER! YOU GET MINUS 5 PATRIOT POINS!!!!! FUUUCK!");
      score = pMap.get(message.author.username);
      pMap.set(message.author.username, score-5);
    }
});

function sendMessage(){
  var dt = new Date();
  var guild = client.guilds.get('602278153741664268');
  if(guild && guild.channels.get('657399393577861153')){
    guild.channels.get('657399393577861153').send("It's " + dt.getHours() + ":"+ dt.getMinutes() +". Time to thank Chappy for his fucking service!");
    lastThanks = dt;
    //console.log(lastThanks.getDate())
    //var time = guild.
    //console.log(time)
  }
}

function getAllUsers(){
  var users = client.users.filter(user => user.bot == false && user.username !="ScampyChap").array();
  //console.log(users[0].username)
  //var userArray = users.array();
  //console.log(users.size)
  return users
}

function createUserMap(){
  var users = getAllUsers();
  
  //console.log(users.length)
  
  var userMap = new Map();
  var pointArray = new Array(users.size);
  //console.log(users[0].username);
  for (i = 0; i < users.length; i++){
    pointArray[i]=0;
  }
  for (i=0; i < users.length; i++){
    userMap.set(users[i].username, pointArray[i]);
  }
  //console.log(userMap);
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

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(token);