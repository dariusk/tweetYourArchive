# TweetYourArchive

This will let you set up a bot that tweets your twitter archive, on a delay.

## Adding your tweets

Get your Twitter archive .zip file from Twitter, unzip it, and put the contents of the "data/js" directory in the `tweets` directory here. So that directory should look something like:

```
payload_details.js
tweet_index.js
tweets/
user_details.js
```

The `tweets/tweets/` folder should contain a bunch of .js files.

## Installation instructions

Requires [node](http://nodejs.org/) and [npm](http://npmjs.org/) (installing node installs npm too). You also need a Twitter App access token, consumer key, and associated secrets. [You can get those here](https://dev.twitter.com/apps/new). You'll probably also want a fresh twitter account for your bot, though you could have it post to one you already own, too!

Clone the repo, then in your project directory, install the dependencies:

`$ npm install`

Next, edit `config.js` to include your Twitter App access token, consumer key, and associated secrets. This is important! Without this you'll be unable to tweet.

`$ node tweetYourArchive.js`

This should get the tweeting started!
