const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env.TOKEN);

const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '!';

// let playerList = [];
let playerList = ['player01', 'player02', 'player04'];

function startGame(message) {
    let playerOne = Math.floor(Math.random() * playerList.length);
    let playerTwo;
    if (playerOne === playerList.length) {
        playerTwo = playerList[0];
    } else {
        playerTwo = playerOne + 1;
    }
    message.channel.send(`${playerList[playerOne]} and ${playerList[playerTwo]} are playing.`);
}

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

        // admin only commands
        if (message.member.roles.cache.find(r => r.name === 'Hutt')) { // Hutt = admin
            if (command === 'clear') {
                let deleted;
                do {
                    deleted = await message.channel.bulkDelete(99);
                } while (deleted.size != 0);
            }
            else if (command === 'acomms') {
                message.channel.send("```Admin Commands: \n\nclear ```");
            }
            else if (command === 'start') {
                startGame(message);
            }
        }
        else {
            message.reply('No permission')
                .then(() => console.log(`${message.author.tag} tried ${message.content}`))
                .catch(console.error);
        }

        // member commands
        if (command === 'players') {
            if (playerList.length != 0) {
                console.log(playerList.toString());
                message.channel.send(playerList.join(' '));
            }
            else {
                message.channel.send('No one is playing...');
            }
        }
        else if (command === 'join') {
            if (!playerList.includes(message.author.username)) {
                playerList.push(message.author.username);
                message.reply('You have been added to the game.');
            }
            else {
                console.log(`${message.author.tag} tried to join again.`);
                message.reply('Already added.');
            }
        }
        else if (command === 'commands') {
            message.channel.send("```Player Commands: \n\njoin \nplayers ```");
        }
    }
});





client.login(process.env.TOKEN);