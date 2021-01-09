const fetch = require('node-fetch');
const fs = require('fs');
const Discord = require('discord.js');
const conf = require('./config.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection(); 

client.on('ready', () => {
    console.log('Bot Online');
});
const Constants = require('./node_modules/discord.js/src/util/Constants.js');
Constants.DefaultOptions.ws.properties.$browser = `Discord Android` //or Discord iOS

client.on('message', message => {
const prefix = '!!';
    if(!message.content.startsWith(prefix) || message.author.bot) return;


    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;

        if (command.args && !args.length) {
            let reply = 'That command requires more details!';

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3 ) * 1000;

    if(!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`Whoa! You're sending commands too fast! Please wait ${timeLeft.toFixed(1)} more second(s) before running \`${command.name}\` again!`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }


    try {
        command.execute(message, args);
    } catch(error) {
        console.error(error);
        message.reply('Sorry! I ran into an error trying to do that!');
    }

});
console.log(`Next ping in ${conf.time / 60 / 1000} min(s)`);

let heartbeat = 0;
setInterval(() => {
  heartbeat++;
  for (const url of conf.urls)
    fetch(url).then(() => console.log(`[${heartbeat}] Pinged ${url}`));
}, conf.time);
client.login('your_bot_token_here');