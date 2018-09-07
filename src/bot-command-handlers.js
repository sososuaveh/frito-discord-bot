module.exports = {
    echo: function (args) {
        args.bot.sendMessage({
            to: args.channelID,
            message: args.message
        });
    },

    roll: function (args) {
        try {

            let messages = createRollMessages(args);

            args.bot.sendMessage({
                to: args.channelID,
                message: messages.join("\n")
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


function createRollMessages(args){

    let messages = [];

    let separateDieRolls = args.message.split(/[ ,]+/); // split by comma or whitespace

    // create a default specification roll if nothing sent to us

    if (separateDieRolls.length === 0) {
        let spec = rollSpecification('');
        let rollResults = rollDice(spec['numDie'], spec['dieSize']);
        let message = rollResultMessage(spec, rolllResults);

        messages.push(message);
    }

    // loop through all the separate dice rolls
    for (let i = 0; i < separateDieRolls.length; i++) {
    
        let spec = rollSpecification(separateDieRolls[i]);
        let rollResults = rollDice(spec['numDie'], spec['dieSize']);
        let message = rollResultMessage(spec, rollResults); 

        messages.push(message);
    }

    return messages;
}

function rollResultMessage(spec, rolls){
  
    let message = spec['desc'] + ': ';
    // create the result of the roll on one line
    // outcomes can be total, best, worst with possibility of modifier  
    // spec['desc'] is the roll we are creating 

    // display messages:
    // w2d10+1: 5, 7 -> worst: 5  modified: 6
    // 2d6: 2 + 5 = 7
    // 2d10-1: 5 + 8 = 13 modified: 12
    // b2d6: 2, 5 -> best: 5


    let total = rolls.reduce(function(tot, num) {
        return tot + num;
    });

    let best = Math.max.apply(null, rolls);
    let worst = Math.min.apply(null, rolls);
    let basevalue = 0;

    if (spec['prefix'] === 'w' || spec['prefix'] === 'b') {
        message = message + rolls.join(', ') + ' -> ';
        if (spec['prefix'] === 'b'){
            message = message + 'best: ' + best;
            basevalue = best;
        }
        else {
            message = message + 'worst: ' + worst;
            basevalue = worst;
        }
    }
    else {  // total is the default
        message = message + rolls.join (' + ') + ' = ' + total;
        basevalue = total;
    }
   
    // create modified value if required

    if (spec['modAmount'] > 0) {
        let modifier = Number(spec['modifier'] + spec['modAmount']);
        let modified = 0;
        modified = basevalue + modifier;

        if (modified < 0 ){
            modified = 0;
        }

        message = message + ' modified: ' + modified;
    }

    return message;

}


function rollSpecification(roll) {

    //create a specification of the dice roll

    //a default die roll spec 1d6 with no modifier and no worst/best option
    
    let prefix = null;
    let numDie = 1;
    let dieSize = 6;
    let modifier = null;
    let modAmount = 0;

    let spec = {};
    spec['prefix'] = prefix;
    spec['numDie'] = numDie;
    spec['dieSize'] = dieSize;
    spec['modifier'] = modifier;
    spec['modAmount'] = modAmount;  
    spec['desc'] = "";

    // Pattern for getting a single roll information;
    // Default is 1d6
    // Can pick up a w or b as a prefix
    // can pick up or miss the first number(s) before  a "d" or "D" miss is default
    // can pick up or miss number(s) after a "d" or "D"  miss is default
    // can pick up a modifier + or - as well as the amount 0 through 9 
    
    let diePattern = /([wWbB])?(\d+)?[dD]+(\d+)?([+-])?(\d)?/;
    let rollInfo = [];

    // Create a default spec for just a blank roll
    
    if (roll !== '') {
       rollInfo = diePattern.exec(roll);
    }
   
    if (rollInfo.length > 1 ) {

        spec['prefix'] = (typeof rollInfo[1] != 'undefined') ? rollInfo[1].toLowerCase() : prefix;

        spec['numDie'] = (typeof rollInfo[2] != 'undefined') ? rollInfo[2] : numDie;

        spec['dieSize'] = (typeof rollInfo[3] != 'undefined') ? rollInfo[3] : dieSize;

        spec['modifier'] = (typeof rollInfo[4] != 'undefined') ? rollInfo[4] : modifier;

        spec['modAmount'] = (typeof rollInfo[5] != 'undefined') ? rollInfo[5] : modAmount;
    }


    // put the description of the roll together

    if (spec['prefix'] !== null) {
        spec['desc'] = spec['prefix'] + '[';
    }

    spec['desc'] = spec['desc'] + spec['numDie'] + 'd' + spec['dieSize'];

    if (spec['prefix'] !== null){
        spec['desc'] = spec['desc'] + ']';
    }

    if (spec['modAmount'] > 0 ) {
        spec['desc'] = spec['desc'] + spec['modifier'] + spec['modAmount'];
    }

    return spec;
}

function rollDice(numDie, dieSize) {
    // the number of dice to roll <numDie> that are of the same size <dieSize>
    
    let rolls = [];

    for (let j = 0; j < numDie; j++) {
        if (dieSize < 1) {
            rolls.push(0);
        } else if (dieSize < 2) {
            rolls.push(1);
        } else {
            let roll = Math.floor(Math.random() * dieSize) + 1;
            rolls.push(roll);
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
