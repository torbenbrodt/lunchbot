/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
This is a sample Slack bot built with Botkit.

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Status"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it is running, and for how long.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('/app/lib/Botkit.js');
var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var http = require('http');
var request = require('request');

function apiget(callback) {
    request.get('http://flask:5000/api/lunch', {}, function (error, response, body) {
  	callback(JSON.parse(body));
    });
};

function apipost(callback) {
    // CHALLENGE: how to ask for the proper lunch?
    request.post('http://flask:5000/api/registration', {form:{
      username: Math.random().toString(36).substring(7),
      lunch_id: 1
    }}, function (error, response, body) {
  	if (!error && response.statusCode == 200) {
	      console.log(body);
	} else {
	      console.error('upload failed:', error);
        }
        callback(response);
      }
   );
};

controller.hears(['status'], 'direct_message,direct_mention,mention', function(bot, message) {
    apiget(function (parsed) {
      bot.reply(message, 'There is ' + parsed.num_results + ' lunches available. Do you want to register for any?');
    });
});

controller.hears(['register'], 'direct_message,direct_mention,mention', function(bot, message) {
    apipost(function (parsed) {
      bot.reply(message, 'Replay was ' + parsed);
    });
});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Hello.');
});

