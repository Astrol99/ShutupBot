require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log(`Discord Bot Ready\nLogged in as ${client.user.username}`)
});

client.on('message', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping'){
        const pongEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(':ping_pong: Pong')
        .setDescription(`${client.ws.ping} ws`)
        
        message.channel.send(pongEmbed);
    }
});