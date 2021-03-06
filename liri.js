// Include the npm packages
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var lineReader = require("line-reader");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Store all of the arguments in an array
var nodeArgs = process.argv;
var functionRun = process.argv[2];

// Create an empty variable for holding the movie name
var movieName = "";
var paramPass = '';

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        paramPass = paramPass + "+" + nodeArgs[i];
    }
    else {
        paramPass += nodeArgs[i];
    }
}

if (functionRun === "movie-this") {
    if (paramPass === ''){
        movieCall('Mr. Nobody');
    }
    else{
        movieCall(paramPass);
    }
}
if (functionRun === "my-tweets") {
    //Create an empty variable to pass a parameter to twitterCall().
    //The parameter is the screen name of Twitter
    var params = { screen_name: 'matt_huberty' }; //?? 'matt_huberty'
    twitterCall(params)
}

if (functionRun === "spotify-this-song") {
    if (paramPass === "") {
        spotifyCall("The Sign");
    }
    else {
        spotifyCall(paramPass);
    }
}

if (functionRun === "do-what-it-says") {
    doWhatItSays();
}
function movieCall(movieQuery) {
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=f0032c14";

    // This line is just to help us debug against the actual URL.
    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // * Title of the movie.
            console.log("The Title of the Movie:  " + JSON.parse(body).Title);
            // * Year the movie came out.
            console.log("Release Year: " + JSON.parse(body).Year);
            // * IMDB Rating of the movie.
            console.log("IMDB Rating of the movie:  " + JSON.parse(body).Ratings[0].Value);
            // * Rotten Tomatoes Rating of the movie.
            console.log("Rotten Tomatoes Rating of the movie:  " + JSON.parse(body).Ratings[1].Value);
            // * Country where the movie was produced.
            console.log("Country where the movie was produced:  " + JSON.parse(body).Country);
            // * Language of the movie.
            console.log("Language of the film: " + JSON.parse(body).Language);
            // * Plot of the movie.
            console.log("Movie Plot: " + JSON.parse(body).Plot);
            // * Actors in the movie.
            console.log("Movie Actors: " + JSON.parse(body).Actors);
        }
    });
}

function twitterCall(params) {
    //console.log("TwitterCall has been called  " + JSON.stringify(params));
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            //Still not working...
            return console.log('Error occurred:  ' + JSON.stringify(error));
        }
        if (!error) {
            for (var k = 0; k < 20; k++) {
                console.log(tweets[k].text);
            }
        }
    });
}

function spotifyCall(params) {
    //console.log("SpotifyCall has been called:  " + params);
    spotify.search({ type: 'track', query: params }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //console.log(JSON.parse(data).items[0].artists[0].name);
        console.log("The Artist:  " + (data).tracks.items[0].artists[0].name);
        console.log("The Song's name:  " + params);
        console.log("The Preview link of the song:  " + (data).tracks.items[0].artists[0].href);
        console.log("The Album:  " + (data).tracks.items[0].album.name);
    });
}   

function doWhatItSays() {
    //fs.readFile('random.txt', 'utf8', function(err, data){ //var ReadMe = ??
        // if (err){
        //     console.log('Error occurred:  ' + err);
        // }
        //console.log(data);
        //var command = data.substring(0, data.indexOf(','));
        //console.log(command);
        //var parameters = data.substring(data.indexOf(',') + 1, data.length);
        //console.log(parameters);

        lineReader.eachLine('random.txt', function(line, last) {
            //console.log(line);
            var command = line.substring(0, line.indexOf(','));
            //console.log(command);
            var parameters = line.substring(line.indexOf(',') + 1, line.length);
            //console.log(parameters);
            switch (command){
                case "movie-this":
                movieCall(parameters);
                break;
                case "my-tweets":
                twitterCall(parameters);
                break;
                case "spotify-this-song":
                spotifyCall(parameters);
                break;
                default:
                console.log("");
            }
        //   }).then(function (err) {
        //     if (err){
        //         console.log(err);
        //     }
            if(last){
                console.log("I'm done reading files!!");
            }
          });

        // switch (command){
        //     case "movie-this":
        //     movieCall(parameters);
        //     break;
        //     case "my-tweets":
        //     twitterCall(parameters);
        //     break;
        //     case "spotify-this-song":
        //     spotifyCall(parameters);
        //     break;
        //     default:
        //     console.log("No commands in the file");
        // }
        //console.log(fs.hasNextLine());

    //});
}