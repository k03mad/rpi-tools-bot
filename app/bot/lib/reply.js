const {reply, keyboard} = require('./chat');
const c = require('require-all')(`${__dirname}/commands`);
const {msg} = require('../../messages');

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

    reply(bot, 'wifi_devices', msg.common.choose, null, keyboard(['/wifi_devices_home', '/wifi_devices_knpl']));
    reply(bot, 'wifi_devices_home', c.wifi.devices, 'mad');
    reply(bot, 'wifi_devices_knpl', c.wifi.devices, 'knpl');

    reply(bot, 'wifi_reboot', msg.common.choose, null, keyboard(['/wifi_reboot_home', '/wifi_reboot_knpl']));
    reply(bot, 'wifi_reboot_home', c.wifi.reboot, 'mad');
    reply(bot, 'wifi_reboot_knpl', c.wifi.reboot, 'knpl');
};

module.exports = replies;
