require('dotenv').config();
const Discord = require('discord.js');
const { compileFunction } = require('vm');
const { Stream } = require('stream');
const { triggerAsyncId } = require('async_hooks');
const { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } = require('constants');

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
            return message.channel.send(`No user and dB limit given, ${message.author}`)
        if (!message.mentions.users.size)
            return message.reply('you need to mention a user to listen!')
        
        const taggedUser = message.mentions.users.first();
        const limit = parseInt(args[1]);
        
        const connection = await message.member.voice.channel.join();
        message.channel.send(`Now listening to ${taggedUser.username}`)

        const audio = connection.receiver.createStream(taggedUser, {mode: 'pcm', end: 'manual'});

        audio.on('data', (chunk) => {

            //Calculate energy using RMS average of squared samples
            let sampleTotal = 0;
            //iterate through stream every 16bits(2bytes)
            for (i = 0; i < chunk.length - 2; i += 2) {
                let sample = chunk.readInt16LE(i);
                sampleTotal += sample * sample;
            }
            let avg = Math.sqrt(sampleTotal / (chunk.length / 2));
            let decibels = 20 * Math.log10(avg);
            
            if (decibels > 0)
                console.log(decibels);

                if (decibels >= limit && !message.guild.members.cache.get(taggedUser.id).voice.mute){
                    message.channel.send(`Muted ${taggedUser}`);
                    console.log(`Muted ${taggedUser.username}`);
                    message.guild.members.cache.get(taggedUser.id).voice.setMute(true);
                    
                    // Unmute after 3 seconds
                    setTimeout(() => {
                        message.guild.members.cache.get(taggedUser.id).voice.setMute(false);
                    }, 3000);
                }
        });
    }
    else if (command == 'leave'){
        message.member.voice.channel.leave();
        console.log(`Left voice chat #${message.member.voice.channel.name}`)
    }
});