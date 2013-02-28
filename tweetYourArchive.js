// We set up a web server on port 3000 using express.js because we're hosting on Nodejitsu. If you're
// just running this on a server, or perhaps some non-Nodejitsu service, you can omit
// all the code from here up to "-- End express"
var app = require('express').createServer();
app.get('/', function (req, res) {
  res.send('Hi.');
});
app.listen(3000);
// -- End express

var Twit = require('twit');
// Our twitter developer API info is in a file called 'config.js'
var T = new Twit(require('./config.js'));

var ent = require('ent');

// Read our list of available tweet source files
var fs = require('fs');
var tweetIndexFile = './tweets/tweet_index.js';
var lastTweetFile = './lastTweet.log';

try {
  var tweetIndexFileContent = fs.readFileSync(tweetIndexFile).toString();
}
catch (e) {
  console.log(e);
}
tweetIndexFileContent = tweetIndexFileContent.split(/.*=\s/)[1];
var tweetIndex = JSON.parse(tweetIndexFileContent);

// Get our last logged tweet, if it exists.
var lastTweet;
try {
  lastTweet = parseInt(fs.readFileSync(lastTweetFile));
}
catch (e) {
}
if (lastTweet !== undefined) {
  console.log("Found a last tweet, here's the number we're starting at:", lastTweet+1);
}

// Grab all of our tweets and put them in a big array
var tweets = [];
var tc = lastTweet+1 || 0;
console.log(tc);
for (var i=tweetIndex.length-1;i>=0;i--) {
  tweets.push(parseTweetFile(tweetIndex[i].file_name.replace('data/js','tweets')));
}

// traverse the array and put each tweet in a new array with just the info we need
// (milliseconds between now and the tweet, and the text of the tweet)
var tweetsMassaged = [];

for (var i=0;i<tweets.length;i++) {
  for (var j=tweets[i].length-1;j>=0;j--) {
    var date = new Date(Date.parse(tweets[i][j].created_at));
    tweetsMassaged.push({
      text: tweets[i][j].text,
      diff: Date.now()-date.getTime(),
    });
  }
}

// Tweet our first tweet
tweet(tweetsMassaged[tc].text);

// Figure out the delay to the next tweet
var timeToNextTweet = tweetsMassaged[tc].diff-tweetsMassaged[tc+1].diff;
tc++;

// Set up the next tweet to fire off with the appropriate delay
setNextTweet(timeToNextTweet);

// Function that tweets after `time` milliseconds and advances the global tweet counter,
// then calls itself so it goes forever.
function setNextTweet(time) {
  setTimeout(function() {
    tweet(tweetsMassaged[tc].text);
    var timeToNextTweet = tweetsMassaged[tc].diff-tweetsMassaged[tc+1].diff;
    tc++;
    setNextTweet(timeToNextTweet);
  }, time);
}

function parseTweetFile(fileName) {
  var result = {};

  try {
    var fileContent = fs.readFileSync(fileName).toString();
  }
  catch (e) {
    console.log(e);
  }

  // This will eval the tweetIndex.js file and expose the var "tweet_index"
  try {
    fileContentJSON = fileContent.replace(/.*=\s/,'');
    result = JSON.parse(fileContentJSON);
  }
  catch (e) {
    console.log(e);
  }

  return result;
}

// We don't want to spam twitter, so we replace @ with . and # with *.
function cleanTweet(text) {
  text = text.replace(/@/g,'.');
  text = text.replace(/#/g,'*');
  text = ent.decode(text);
  text = text.substr(0,140);
  return text;
}

function tweet(text) {
  T.post('statuses/update', {status: cleanTweet(text)}, function (err, reply) {
    console.log(err);
    if (err === null) {
      fs.writeFile(lastTweetFile, tc-1, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
      });
    }
  });
}

