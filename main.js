// External includes
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

// Internal includes
const { token } = require('./config.json');
const Service = require('./utils/service.js');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Parse commands
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// Triggered upon start
client.once('ready', () => {
	console.log('Discord bot waiting for input.');
});

// On message received (someone types in a channel)
client.on("messageCreate", message => {
    let prefix = 'roll ';

    if (!message.content.startsWith(prefix) && message.content !== prefix.trim())
    {
        // Filter away non-interesting commands.
        return;
    }

    // Remove first token, eg 'roll '
    let commands = message.content.split(' ');
    commands.shift();

    let remainder = commands.join(' ');

    let embed = null;
    let mess = '';

    try {
        let res = Service.parse(remainder);
        embed = Service.getQuote();
        mess = Service.generateMessage(res, message.author.username);
    } catch (error) {
       mess = 'Nope';
    }

    if (embed)
        message.reply({ content: mess, embeds: [embed] });
    else
        message.reply({ content: mess });
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
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);