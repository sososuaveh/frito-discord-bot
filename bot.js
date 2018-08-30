var Discord = require('discord.io');

var logger = require('winston');
var auth = require('./config/auth.json');
var botEvents = require('./bot-events.js');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: false
});

botEvents.wireEvents(bot);

bot.connect();
