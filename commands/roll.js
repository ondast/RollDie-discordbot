// External includes
const { SlashCommandBuilder } = require('@discordjs/builders');

// Local includes
const Service = require('../services/roll.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rolls one or a number of die with a number of modifiers. Syntax: 1d6, d6, 2d6+1')
        .addStringOption(option =>
            option.setName('combination')
                .setDescription('Syntax: 1d6, d6, 2d6+1, 2d6 + 1d6 + 3 - 1')
                .setRequired(false)),

    async execute(interaction) {
        let res = {
            embed: null,
            message: '',
        }

        try {
            res = Service.interpret(interaction.options.getString('combination'), interaction.user.username);
        } catch(error) {
            console.log(error);
            res.message = 'Nope';
        }

        if (res.embed)
            await interaction.reply({ content: res.message, embeds: [res.embed] });
        else
            await interaction.reply({ content: res.message });
    },
};