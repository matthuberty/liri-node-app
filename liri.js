// Include the npm packages
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
require("dotenv").config();
var keys = require("./keys.js");

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
    movieCall(paramPass);
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
        console.log(JSON.stringify(data));
    });
}
