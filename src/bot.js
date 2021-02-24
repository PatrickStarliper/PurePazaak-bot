const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env.TOKEN);

const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '!';

client.once('ready', () => {
    //console.log('Successfully logged into client.');
    console.log(`${client.user.username} logged into client.`);
});

client.on('message', async (message) => {
    if (message.author.bot) { return; }
    if (message.content.toLowerCase().startsWith(PREFIX)) {
        const [command, ...args] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/);

        if (message.member.roles.cache.find(r => r.name === 'Hutt')) {
            if (command === 'clear') {
                let deleted;
                do {
                    deleted = await message.channel.bulkDelete(99);
                } while (deleted.size != 0);
            }
        }
    }
});





client.login(process.env.TOKEN);