const dotenv = require('dotenv');
dotenv.config();
//console.log(process.env.TOKEN);
const Player = require('./player');
const Discord = require('discord.js');
const client = new Discord.Client();
const PREFIX = '!';

let playerList = [];

function startGame(message) {
    shuffle(playerList);
    //console.log(playerList);
    let playerOne = playerList[0];
    let playerTwo = playerList[1];
    console.log(playerOne.getTag(), playerTwo.getTag());
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
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
                message.reply(`You have been added.`)
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
                console.log(`${message.channel.name} channel has been cleared.`);
            }
            else if (command === 'acommands') {
                message.channel.send("```Admin Commands: \n\nclear\nstart ```");
            }
            else if (command === 'itt') { // testing command
                playerList.push(new Player('PAT', 0, 0, [], 0));
                playerList.push(new Player('m310logi', 0, 0, [], 0));
                playerList.push(new Player('Player3', 0, 0, [], 0));
                playerList.push(new Player('Player4', 0, 0, [], 0));
                message.channel.send('test add (4).');
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
