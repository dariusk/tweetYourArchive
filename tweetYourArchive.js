var Grailbird = {};
Grailbird.data = {};

var fs = require('fs');
var tweetIndexFile = './tweets/tweet_index.js';

try {
  var tweetIndexFileContent = fs.readFileSync(tweetIndexFile).toString();
}
catch (e) {
  console.log(e);
}

tweetIndexFileContent = tweetIndexFileContent.split(/.*=\s/)[1];
var tweetIndex = JSON.parse(tweetIndexFileContent);

var date = new Date();
var tweets = [];
var tc = 0;

for (var i=tweetIndex.length-1;i>=0;i--) {
  tweets.push(parseTweetFile(tweetIndex[i].file_name.replace('data/js','tweets')));
}

console.log(tweets.length);
//console.log(tweets[58][0]);


//var tweets = parseTweetFile(getTweetFile(year, month, day));
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

/*
for (var i=0;i<tweetsMassaged.length-1;i++) {
  var timeToNextTweet = tweetsMassaged[i].diff-tweetsMassaged[i+1].diff;
  if (timeToNextTweet < 60000) {
    console.log(i, tweetsMassaged[i].diff-tweetsMassaged[i+1].diff);
  }
}
*/

var tc = 24277;

console.log(tweetsMassaged[tc]);
var timeToNextTweet = tweetsMassaged[tc].diff-tweetsMassaged[tc+1].diff;
tc++;
setNextTweet(timeToNextTweet);

function setNextTweet(time) {
  setTimeout(function() {
    console.log(tweetsMassaged[tc]);
    var timeToNextTweet = tweetsMassaged[tc].diff-tweetsMassaged[tc+1].diff;
    tc++;
    setNextTweet(timeToNextTweet);
  }, time);
}

function getTweetFile(year, month, day) {
  var result = "";
  for (var i=0;i<tweetIndex.length;i++) {
    if (tweetIndex[i].year === year && tweetIndex[i].month === month) {
      result = tweetIndex[i].file_name;
    }
  }
  return result.replace('data/js','tweets');
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

