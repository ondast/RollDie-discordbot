// External includes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });

// Internal includes
const { token } = require('./config.json');
// const Service = require('./utils/service.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const services = {};
client.commands = new Collection();

// Parse commands and tally services
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
    services[command.data.name] =  require(`./services/${file}`)
}

// Triggered upon start
client.once('ready', () => {
	console.log('Discord bot waiting for input.');
});

// On message received (someone types in a channel)
client.on("messageCreate", async message => {
    // Remove first token, eg 'roll '
    let commands = message.content.split(' ');
    let commandName = commands.shift();

	const command = client.commands.get(commandName);

    if (!command)
        return;

    let remainder = commands.join(' ');
    let res = {
        message: '',
        embed: null,
    };

    try {
        res = services[commandName].interpret(remainder, message.author.username);
    } catch (error) {
        console.error(error);
        await message.reply({ content: 'Nope.. got error while trying to fulfill '+message.content, ephemeral: true });
    }

    if (res.embed)
        message.reply({ content: res.message, embeds: [res.embed] });
    else
        message.reply({ content: res.message });
});

// On interaction received (someone uses a slashcommand eg /roll in a channel)
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand())
        return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Nope.. got error while trying to fulfill your command', ephemeral: true });
	}
});

client.login(token);