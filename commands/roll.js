const { SlashCommandBuilder } = require('@discordjs/builders');

const Service = require('../utils/service.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls one or a number of die with a number of modifiers. Syntax: 1d6, d6, 2d6+1')
        .addStringOption(option =>
            option.setName('combination')
                .setDescription('Syntax: 1d6, d6, 2d6+1, 2d6 + 1d6 + 3 - 1')
                .setRequired(false)),

	async execute(interaction) {
        let embed = null;
        let mess = '';

        try {
            let res = Service.parse(interaction.options.getString('combination'));
            embed = Service.getQuote();
            mess = Service.generateMessage(res, interaction.user.username);
        } catch(error) {
            mess = 'Nope';
        }

        if (embed)
            await interaction.reply({ content: mess, embeds: [embed] });
        else
            await interaction.reply({ content: mess });

  	},
};