require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { compileFunction } = require('vm');
const { Stream } = require('stream');
const { triggerAsyncId } = require('async_hooks');
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
        .setDescription(`${client.ws.ping} ms`)
        
        message.channel.send(pongEmbed);
    }
    else if (command == 'listen'){
        if (!args.length)
            return message.channel.send(`No user supplied, ${message.author}`)
        if (!message.mentions.users.size)
            return message.reply('you need to mention a user to listen!')
        
        const taggedUser = message.mentions.users.first();
        const limit = parseInt(args[1]);
        
        const connection = await message.member.voice.channel.join();
        message.channel.send(`Now listening to ${taggedUser.username}`)

        const audio = connection.receiver.createStream(taggedUser, {mode: 'pcm', end: 'manual'});

        //audio.pipe(fs.createWriteStream('user_audio'));
        audio.on('data', (buffer) => {
            var rms = 0;
            
            for (var i = 0; i < buffer.length; i++){
                rms += buffer[i] * buffer[i];
            }
            
            rms /= buffer.length;
            rms = Math.sqrt(rms);
            console.log(rms);
        });
    }
    else if (command == 'leave'){
        message.member.voice.channel.leave();
    }
});