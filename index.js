require('dotenv').config();
const PREFIX = process.env.PREFIX;

const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.TOKEN);

client.once('ready', () => {
    console.log(`Discord Bot Ready\nLogged in as ${client.user.username}`)
});

client.on('message', async message => {
    if (message.content === `${PREFIX}ping`) {        
        
        message.channel.send(`Pong: ${client.ws.ping} ms`);

    } else if (message.content === `${PREFIX}join`) {
        
        if (message.member.voice.channel){
            const connection = await message.member.voice.channel.join();
            message.channel.send(`Joined channel \`${message.member.voice.channel}\``)
        } else {
            message.channel.send(`User is not in channel!`)
        }

    } else if (message.content === `${PREFIX}leave`){

        if (message.member.voice.channel){
            await message.member.voice.channel.leave();
            message.channel.send(`Left channel \`${message.member.voice.channel}\``)
        } else {
            message.channel.send(`User is not in channel!`)
        }

    }
});