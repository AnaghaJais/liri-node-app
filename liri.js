var data = require("./key.js");
var twitter=require("twitter");
var request = require("request");
var fs=require("fs");
var action=process.argv[2];
var nodeArgs = process.argv;
var songName="";
var movieName="";
var spotify = require('node-spotify-api');
var twitterKeys = data.twitterKeys;
var output;
var twitterUser = new twitter({
  consumer_key:twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key:twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

function movieInfoName()
{
	if(nodeArgs.length===3){
	 movieName="Mr+Nobody";
}

else{
 for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    movieName =  movieName + "+" + nodeArgs[i];

  }

  else {

     movieName += nodeArgs[i];

  }
}
}
return movieName;

}
function songInfoName(){
	if(nodeArgs.length===3){
	 songName='ace+of+base+sign';
}

else{
 for (var i = 3; i < nodeArgs.length; i++) {

  if (i > 3 && i < nodeArgs.length) {

    songName =  songName + "+" + nodeArgs[i];

  }

  else {

     songName += nodeArgs[i];

  }
}
}
return songName;
}
if(action==="my-tweets")
{
	tweet();
  writeToFile();
} 

else if(action==="spotify-this-song")
{
var song= songInfoName();
songInfo(song);
}	
else if(action==="movie-this")
{
	var movie=movieInfoName()
 movieInfo(movie);
}

else if(action==="do-what-it-says")
{
 fs.readFile("random.txt", "utf8", function(error, data){
var data1 = data.split(',');
        var name=data1[1];
        action=data1[0];

        if(action==="my-tweets")
{
	tweet();
} 

else if(action==="spotify-this-song")
{

 songName=name;
songInfo(songName);
}	
else if(action==="movie-this")
{
	movieName=name;
 movieInfo(movieName);
}       
});         
}

/*********Functions**************/

function tweet(){
 var params={screen_name:"Babu1Anagha",limit:20};
twitterUser.get('statuses/user_timeline',params, function(error, tweet, response) {
        if(error){
            console.log(error);
        }else{
            //console.log(tweet);
            for (var i = 0; i < tweet.length; i++) {

                console.log("_____________________________________________");
                console.log("Tweeted on: " + tweet[i].created_at);
                console.log(tweet[i].text);
                output="Tweeted on: " + tweet[i].created_at+"\r\n"+tweet[i].text+"\r\n";
                
                writeToFile();
            }
        }
    });
}

function movieInfo(movie)
{	
var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";


request(queryUrl,function(error, response, body) {
  
if (!error && response.statusCode === 200) {
    
    var json = JSON.parse(body);
    console.log("Title of the Movie: "+json.Title);
    console.log("Year the movie came out: "+json.Year);
    console.log("IMDB Rating of the movie: "+json.imdbRating);
    console.log("Rotten Tomatoes Rating of the movie: "+json.Ratings[1].Value);
    console.log("Country where the movie was produced: "+json.Country);
    console.log("Language of the movie: "+json.Language);
    console.log("Plot of the Movie: "+json.Plot);
    console.log("Actors of the Movie: "+json.Actors);
    output="Title of the Movie: "+json.Title+"\r\nYear the movie came out: "+json.Year+
            "\r\nIMDB Rating of the movie "+json.imdbRating+"\r\nRotten Tomatoes Rating of the movie: "+json.Ratings[1].Value+
             "\r\nCountry where the movie was produced: "+json.Country+
             "\r\nLanguage of the movie: "+json.Language+"\r\nPlot of the Movie: "+json.Plot+
             "\r\nActors of the Movie: "+json.Actors+"\r\n";
             writeToFile();
  }
});
}


function songInfo(song){
	var spot = new spotify({
  id: "f7ce6d188a0e4269bdfb5e44481922ac",
  secret:"31256554a78a4950bda149a5d2bd0106"
});


spot.search({ type: 'track', query:  song }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
    console.log(data.tracks.items[0]);
	console.log("---------------------------------------------------");
                console.log(" ");                
                console.log(" ");
                console.log("Track Title: " + data.tracks.items[0].name);
                console.log(" ");
                console.log("Album Name: " + data.tracks.items[0].artists[0].name);
                console.log(" ");
                console.log("Preview URL: " + data.tracks.items[0].preview_url);
                console.log(" ");               
 
                console.log("---------------------------------------------------");
        output="Track Title: " + data.tracks.items[0].name+
                "\r\nAlbum Name: " + data.tracks.items[0].artists[0].name+
                "\r\nPreview URL: " + data.tracks.items[0].preview_url+"\r\n";
                writeToFile();
 
});
}

function writeToFile(){
  fs.appendFile("log.txt", output, function(err) {
  
  if (err) {
    console.log(err);
  }  

});

}