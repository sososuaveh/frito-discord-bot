var logger = require('winston');

module.exports = {
    wireEvents: function(bot) {
        bot.on('ready', function (evt) {
            logger.info('Connected');
            logger.info('Logged in as: ' + bot.username);
            logger.debug(bot.username + ' - (' + bot.id + ')');
        });

        bot.on('message', function (user, userID, channelID, message, evt) {
            // Our bot needs to know if it needs to execute a command
            // for this script it will listen for messages that will start with `!`
            if (message.substring(0, 1) === '!') {
                var args = message.substring(1).split(' ');
                var cmd = args[0];

                args = args.splice(1);
                var helperArgs = {
                    bot: bot,
                    user: user,
                    userID: userID,
                    channelID: channelID,
                    message: args.join(' ')
                };

                switch (cmd) {
                    case 'ping':
                        bot.sendMessage({to: channelID, message: 'Pong!'});
                        break;
                    case 'echo':
                        echo(helperArgs);
                        break;
                    case 'roll':
                        rollCommand(helperArgs);
                        break;
                    default:
                        /* bot.sendMessage({to: channelID, message: 'Unknown command.'}); */
                        break;
                }
            }
        });

        /*
        bot.on("presence", function (user, userID, status, game, event) {
            console.log(user + " is now: " + status);
        });
        */

        /*
        bot.on("any", function (event) {
            console.log(event) //Logs every event
        });
        */

        bot.on("disconnect", function () {
            console.log("Bot disconnected");
            bot.connect() //Auto reconnect
        });
    }
};

function echo(args){
    args.bot.sendMessage({
        to: args.channelID,
        message: args.message
    });
}

function rollCommand(args){
    try {
        let rolls = rollDice(args);
        let lines = [];

        for (let spec in rolls) {
            let data = rolls[spec];
            let total = data.reduce(function(tot, num){ return tot + num; });
            lines.push(spec + ': ' + data.join(' + ') + ' = ' + total);
        }

        args.bot.sendMessage({
            to: args.channelID,
            message: lines.join('\n')
        });

    } catch (e) {
        let errorId = guid();
        args.bot.sendMessage({
            to: args.channelID,
            message: 'I had a problem figuring out what to do. Ask a mod to check the logs with this error ID: ' + errorId
        });
        console.log("ERROR: " + errorId);
        console.log(e);
    }
}

function rollDice(args) {
    let rolls = {};
    let specs = args.message.split(/[ ,]+/);  // split by comma or whitespace

    // Loop through the dice specification
    for (let i = 0; i < specs.length; i++) {
        let total = 0;
        let internalRolls = [];
        let parts = specs[i].split(/[dD]+/);
        let numDie = parts[0];
        let dieSize = parts[1];

        for (let j = 0; j < numDie; j++) {
            if (dieSize < 1) {
                internalRolls.push(0);
            } else if (dieSize < 2) {
                internalRolls.push(1);
                total += 1;
            } else {
                let roll = Math.floor(Math.random() * dieSize) + 1;
                internalRolls.push(roll);
                total += roll;
            }
        }

        rolls[specs[i]] = internalRolls;
    }

    return rolls;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}