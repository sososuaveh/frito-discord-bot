let logger = require("winston");
let handlers = require("./bot-command-handlers.js");

module.exports = {
    wireEvents: function(bot) {
        bot.on("ready", function (evt) {
            logger.info("Connected");
            logger.info("Logged in as: " + bot.username);
            logger.debug(bot.username + " - (" + bot.id + ")");
        });

        bot.on("message", function (user, userID, channelID, message, evt) {
            // Our bot needs to know if it needs to execute a command
            // for this script it will listen for messages that will start with `!`
            if (message.substring(0, 1) === "!") {
                let args = message.substring(1).split(" ");
                let cmd = args[0];

                args = args.splice(1);
                let helperArgs = {
                    bot: bot,
                    user: user,
                    userID: userID,
                    channelID: channelID,
                    message: args.join(" ")
                };

                switch (cmd) {
                case "ping":
                    bot.sendMessage({to: channelID, message: "Pong!"});
                    break;
                case "echo":
                    handlers.echo(helperArgs);
                    break;
                case "roll":
                    handlers.roll(helperArgs);
                    break;
                default:
                    /* bot.sendMessage({to: channelID, message: "Unknown command."}); */
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
            bot.connect(); //Auto reconnect
        });
    }
};
