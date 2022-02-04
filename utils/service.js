// External includes
const {
    tokenize,
    rollDice,
    tallyRolls,
    calculateFinalResult,
} = require('@airjp73/dice-notation');
const { MessageEmbed } = require('discord.js');

// Local includes
const quotes = require('./quotes.json');

module.exports = {
    generateMessage(res, username) {
        let mes = 'Rolling (*'+res.tokens+'*) ' + res.rollString +' for **'+username+'**, total is **'+(res.result)+'**';

        if (mes.length > 1000)
            mes = 'Rolling (*'+res.tokens+'*) [ ... ]  for **'+username+'**, total is **'+(res.result)+'**';

        return mes;
    },

    getQuote() {
        const min = 0;
        const max = quotes.length-1;
        let idx = Math.floor(Math.random() * (max - min + 1) + min)

        const quote = quotes[idx];

        let embed = null;

        if (quote.quote && Math.random() > 0.9) {
            embed = new MessageEmbed()
                .setColor('#AA0000')
                .setThumbnail('https://endpoints.truetime.se/inq.png')
                .setDescription('"'+quote.quote+'"')
                .setFooter({ text: '- '+quote.origin+'' });
        }

        return embed;
    },

    parse(str) {
        if (!str) {
            // Default diceroll
            str = '1d100';
        }

        // Gets the tokens from the lexer
        // Example: [DiceRollToken, OperatorToken, DiceRollToken]
        const tokens = tokenize(str);
        let diceRolls = '';

        tokens.forEach(t => {
            diceRolls += ' '+t.content;
        });

        diceRolls = diceRolls.trim();

        // Rolls any dice roll tokens and returns all the individual rolls.
        // rolls[i] contains all the rolls for the DiceRollToken at tokens[i]
        // Example: [[3, 1], null, [1, 3, 2]]

        const rolls = rollDice(tokens);

        let rollString = '';
        let tmp = [];

        rolls.forEach(r => {
            if (r !== null && Array.isArray(r) && r.length > 0)
            {
                tmp.push('['+r.join(', ')+']');
            }
        });

        if (tmp.length)
        {
            rollString = tmp.join(',');
        }

        // Takes the rolls and totals them
        // Example: [4, null, 6]
        const rollTotals = tallyRolls(tokens, rolls);

        // Get the final result of the roll
        // Example: 10
        const result = calculateFinalResult(tokens, rollTotals);

        return {
            rollString: rollString,
            tokens: diceRolls,
            result: result,
        };
    }
}