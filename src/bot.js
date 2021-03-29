const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env.TOKEN);

const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '!';

let playerList = [];

class Player {
    constructor(username, money, currentCount, currentCards, roundWins) {
        this.name = username;
        this.money = money;
        this.currentCount = currentCount;
        this.currentCards = currentCards;
        this.roundWins = roundWins;
    }

    getTag() { return this.name; }
    setTag(username) { this.name = username; }
}

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

function checkForUsername(players, username) {
    for (let i = 0; i < players.length; i++) {
        if (players[i].getTag() === username) {
            return true;
        }
    }
    return false;
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

        // member commands
        if (command === 'players') {
            if (playerList.length != 0) {
                let names = [];
                for (let i = 0; i < playerList.length; i++) {
                    let current = playerList[i].getTag();
                    names.push(current);
                }
                message.channel.send('Players: ' + names.join(' '));
            }
            else {
                message.channel.send('No one is playing...');
            }
        }
        else if (command === 'join') {
            if (!checkForUsername(playerList, message.author.username)) {
                playerList.push(new Player(message.author.username, 0, 0, [], 0));
                console.log(`${playerList.length} player(s).`);
                message.reply(`${message.author.username} has been added.`)
                    .then(() => console.log(`${message.author.tag} tried ${message.content}`))
                    .catch(console.error);
            }
            else {
                console.log(`${message.author.tag} tried to join again.`);
                message.reply('Already added.')
                    .then(() => console.log(`${message.author.tag} tried ${message.content}`))
                    .catch(console.error);
            }
        }
        else if (command === 'remove') {
            for (let i = 0; i < playerList.length; i++) {
                if (playerList[i].getTag() === args[0]) {
                    playerList.splice(i, 1);
                    console.log(`${args[0]} has been removed.`);
                }
            }
        }
        else if (command === 'commands') {
            message.channel.send("```Player Commands: \n\njoin \nplayers\nremove ```");
        }

        // admin only commands
        if (message.member.roles.cache.find(r => r.name === 'Hutt')) { // Hutt = admin
            if (command === 'start') {
                startGame(message);
            }
            else if (command === 'clear') {
                let deleted;
                do {
                    deleted = await message.channel.bulkDelete(99);
                } while (deleted.size != 0);
            }
            else if (command === 'acommands') {
                message.channel.send("```Admin Commands: \n\nclear\nstart ```");
            }
        }
        // else {
        //     message.reply('No permission')
        //         .then(() => console.log(`${message.author.tag} tried ${message.content}`))
        //         .catch(console.error);
        // }
    }
});





client.login(process.env.TOKEN);