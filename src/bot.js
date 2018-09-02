let Discord = require('discord.io');

let logger = require('winston');
let auth = require('./config/auth.json');
let botEvents = require('./bot-events.js');


// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
let bot = new Discord.Client({
    token: auth.token,
    autorun: false
});

botEvents.wireEvents(bot);

bot.connect();
