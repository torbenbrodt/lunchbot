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

var http = require('http');
var request = require('request');
var strtotime = require('strtotime');

var Botkit = require('../lib/Botkit.js');
var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

controller.hears(['create lunch'], 'direct_message,direct_mention,mention', function (bot, message) {

    bot.startConversation(message, function (err, convo) {
        if (!err) {
            convo.say('I will help you setting it up, say "abort" at any time to hold me back.');

            convo.ask('Who will be the chef?', function (response, convo) {
                convo.ask('When will it be', function (response, convo) {

                    var text = response.text;
                    if (text == 'tomorrow') {
                        text = '+1 day';
                    }
                    if (!text.match(/next/)) {
                        text = 'next ' + text;
                    }

                    var date = strtotime(text);
                    if (date == false) {
                        convo.say('I did not understand the date');
                        convo.repeat();
                        return;
                    }

                    convo.say('I understood that the date will be ' + date);

                    convo.ask('Is the lunch meat, vegan or vegetarian?', function (response, convo) {
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

                    var text = convo.extractResponse('date');
                    if (text == 'tomorrow') {
                        text = '+1 day';
                    }
                    if (!text.match(/next/)) {
                        text = 'next ' + text;
                    }

                    var data = {
                        chef: convo.extractResponse('chef'),
                        date: strtotime(text).toISOString(),
                        is_meat: convo.extractResponse('tags').search(/meat/) != 1,
                        is_vegan: convo.extractResponse('tags').search(/vegan/) != 1,
                        is_vegetarian: convo.extractResponse('tags').search(/vegetarian/) != 1,
                        text: convo.extractResponse('text'),
                        title: convo.extractResponse('title')
                    };

                    request.post('http://flask:5000/api/lunch', {json: data}, function (error, response, body) {
                            if (!error && response.statusCode == 201) {
                                bot.reply(message, 'That\'s all. I created the lunch ' + convo.extractResponse('title') + '. Is there anything else I can do for you?');
                            } else {
console.log(response);
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
    request.get('http://flask:5000/api/lunch', {}, function (error, response, body) {
        var parsed = JSON.parse(body);
        bot.reply(message, 'There is ' + parsed.num_results + ' lunches available. Do you want to register for any?');
    });
});

controller.hears(['register'], 'direct_message,direct_mention,mention', function (bot, message) {
    var json = {
        username: message.user + '_' + Math.random().toString(36).substring(3),
        lunch_id: 1
    };

    request.post('http://flask:5000/api/registration', {form: json}, function (error, response, body) {
            if (!error && response.statusCode == 201) {
                bot.reply(message, 'Thx for joining. I registered you for "%s. Is there anything else I can do for you?"');
            } else {
                bot.reply(message, 'Something failed. Is there anything else I can do for you?"');
            }
        }
    );

});

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function (bot, message) {
    bot.reply(message, 'Hello ' + message.user + '.');
});

