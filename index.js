require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Discord Bot Ready')
});

client.login(process.env.TOKEN);