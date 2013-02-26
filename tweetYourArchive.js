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

var year = date.getFullYear()-5;
var month = date.getMonth()+3;
var day = date.getDate();


console.log(getTweetFile(year, month, day));
var tweets = parseTweetFile(getTweetFile(year, month, day));

for (var i=0;i<tweets.length;i++) {
  var date = new Date(Date.parse(tweets[i].created_at));
  console.log(date.getDate());
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

