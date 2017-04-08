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

var Botkit = require('../lib/Botkit.js');
var controller = Botkit.slackbot({
    debug: true
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
}

function apipost(json, callback) {
    request.post('http://flask:5000/api/registration', {
            form: json
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.error('upload failed:', error);
            }
            if (callback) {
                callback(response);
            }
        }
    );
}

controller.hears(['create lunch'], 'direct_message,direct_mention,mention', function (bot, message) {

    bot.startConversation(message, function (err, convo) {
        if (!err) {
            convo.say('I will help you setting it up, say "abort" at any time to hold me back.');

            convo.ask('Who will be the chef?', function (response, convo) {
                convo.ask('When will it be', function (response, convo) {
                    convo.ask('Is it meat, vegan or vegetarian?', function (response, convo) {
                        convo.ask('Give me some delightful description of the menu.', function (response, convo) {
                            convo.ask('Whats the title of the event?', function (response, convo) {
                                convo.next();

                            }, {'key': 'title'});
                            convo.next();
                        }, {'key': 'text'});
                        convo.next();
                    }, {'key': 'tags'});
                    convo.next();
                }, {'key': 'date'});
                convo.next();
            }, {'key': 'chef'});

            convo.on('end', function (convo) {
                if (convo.status == 'completed') {

                    var json = {
                        chef: convo.extractResponse('chef'),
                        date: convo.extractResponse('date'),
                        is_meat: convo.extractResponse('tags').match(/meat/),
                        is_vegan: convo.extractResponse('tags').match(/vegan/),
                        is_vegetarian: convo.extractResponse('tags').match(/vegetarian/),
                        text: convo.extractResponse('text'),
                        title: convo.extractResponse('title')
                    };

                    request.post('http://flask:5000/api/registration', {form: json}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                bot.reply(message, 'That\'s all. I created the lunch ' + convo.extractResponse('title') + '. Is there anything else I can do for you?');
                            } else {
                                bot.reply(message, 'Something failed. Is there anything else I can do for you?');
                            }
                        }
                    );

                } else {
                    // this happens if the conversation ended prematurely for some reason
                    bot.reply(message, 'OK, nevermind!');
                }
            });
        }
    });
});


controller.hears(['status'], 'direct_message,direct_mention,mention', function (bot, message) {
    apiget(function (parsed) {
        bot.reply(message, 'There is ' + parsed.num_results + ' lunches available. Do you want to register for any?');
    });
});

controller.hears(['register'], 'direct_message,direct_mention,mention', function (bot, message) {
    var json = {
        username: message.user + '_' + Math.random().toString(36).substring(3),
        lunch_id: 1
    };

    request.post('http://flask:5000/api/registration', {form: json}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                bot.reply(message, 'Thx for joining. I registered you for "%s. Is there anything else I can do for you?"');
            } else {
                bot.reply(message, 'Something failed. Is there anything else I can do for you?"');
            }
        }
    );

});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function (bot, message) {
    bot.reply(message, 'Hello.');
});

