const conf = require('../config.js');
const ms = require('ms');
module.exports = {
    name: 'current-config',
    description: 'list of the current config',
    aliases: ['cc'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        message.channel.send({
            embed: {
                color: 'BLUE',
                author: { name: `current config settings` },
                fields: [
                    { name: 'current websites', value: `1. ${conf.urls[0] || 'not set'}\n2. ${conf.urls[1] || 'not set'}\n3. ${conf.urls[2] || 'not set'}\n4. ${conf.urls[3] || 'not set'}` },
                    { name: 'current heartbeat interval', value: `${ms(conf.time)}` },
                ],
                //description: `>>> current heartbeat interval: ${ms(conf.time)}\ncurrent website's: ${conf.urls}`,
            }
        });
    },
};