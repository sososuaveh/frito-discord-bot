module.exports = {
    echo: function (args) {
        args.bot.sendMessage({
            to: args.channelID,
            message: args.message
        });
    },

    roll: function (args) {
        try {
            // Check for only whitespace
            if (args.message.trim().length === 0){
                return;
            }

            let rolls = rollDice(args);
            let lines = [];

            for (let spec in rolls) {
                let data = rolls[spec];
                let total = data.reduce(function (tot, num) {
                    return tot + num;
                });
                lines.push(spec + ": " + data.join(" + ") + " = " + total);
            }

            args.bot.sendMessage({
                to: args.channelID,
                message: lines.join("\n")
            });

        } catch (e) {
            let errorId = guid();
            args.bot.sendMessage({
                to: args.channelID,
                message: "I had a problem figuring out what to do. Ask a mod to check the logs with this error ID: " + errorId
            });
            console.log("ERROR: " + errorId);
            console.log(e);
        }
    },
};

function rollDice(args) {
    let rolls = {};
    let specs = args.message.split(/[ ,]+/);  // split by comma or whitespace

    if (args.message !== "") {
        // Loop through the dice specification
        for (let i = 0; i < specs.length; i++) {
            let total = 0;
            let internalRolls = [];
            let parts = specs[i].split(/[dD]+/);
            let numDie = parts[0] ? parts[0] : "1";
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
    }

    return rolls;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}
