const {reply} = require('./chat');
const c = require('require-all')(`${__dirname}/commands`);

/**
 * Bot commands
 * @param {Object} bot telegram node api
 */
const replies = bot => {
    reply(bot, 'help', c.help, 'bot');
    reply(bot, 'log', c.log);

    reply(bot, 'apt_update', c.apt.update);
    reply(bot, 'apt_upgrade', c.apt.upgrade);

    reply(bot, 'dns_update', c.dns.update);

    reply(bot, 'pi_reboot', c.pi.reboot);
    reply(bot, 'pi_shutdown', c.pi.shutdown);
};

module.exports = replies;
