// INSTRUCTIONS:
// ---------------------------------------------------------------------------------------------------------
// Level 1:
// Take any movie with a word title (ex: Cinderella) 
// as a Node argument and retrieve the year it was created

// Level 2 (More Challenging):
// Take a movie with multiple words (ex: Forrest Gump) 
// as a Node argument and retrieve the year it was created.
// ---------------------------------------------------------------------------------------------------------

// Include the request npm package (Don't forget to run 
// "npm install request" in this folder first!)
var request = require("request");

//var spotify = new Spotify(keys.spotify);
//var client = new Twitter(keys.twitter);

// Store all of the arguments in an array
var nodeArgs = process.argv;
var functionRun = process.argv[2];

// Create an empty variable for holding the movie name
var movieName = "";

// Loop through all the words in the node argument
// And do a little for-loop magic to handle the inclusion of "+"s
for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        movieName = movieName + "+" + nodeArgs[i];
    }
    else {
        movieName += nodeArgs[i];
    }
}

if (functionRun === "movie-this") {
    movieCall(movieName);
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

