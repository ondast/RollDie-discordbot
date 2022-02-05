// External includes
const { SlashCommandBuilder } = require('@discordjs/builders');

// Local includes
const Service = require('../services/curse.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('curse')
        .setDescription('Randomly curses in imperial'),

    async execute(interaction) {
        let res = {
            embed: null,
            message: '',
        }
        try {
            res = Service.interpret();
        } catch(error) {
            res.message = 'Nope';
        }

        if (res.embed)
            await interaction.reply({ content: res.message, embeds: [res.embed] });
        else
            await interaction.reply({ content: res.message });
    },
};