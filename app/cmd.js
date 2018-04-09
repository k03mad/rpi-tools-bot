const {answer, q} = require('./lib/senders');
const {wl} = require('./lib/utils');
const c = require('require-all')(`${__dirname}/cmd`);

/**
 * Bot commands
 */
const cmd = bot => {
    /* eslint-disable no-multi-spaces, space-in-parens, brace-style, max-statements-per-line, curly */

    bot.onText(q('help'),                    mes => {if (wl(mes)) answer(bot, mes,       c.help('bot')                                            );});
    bot.onText(q('user'),                    mes =>               answer(bot, mes,       JSON.stringify(mes, null, 4)                               ));
    bot.onText(q('log'),               async mes => {if (wl(mes)) answer(bot, mes, await c.log()                                                  );});

    bot.onText(q('apt_update'),        async mes => {if (wl(mes)) answer(bot, mes, await c.apt.update()                                           );});
    bot.onText(q('apt_upgrade'),       async mes => {if (wl(mes)) answer(bot, mes, await c.apt.upgrade()                                          );});

    bot.onText(q('pi_sensors'),        async mes => {if (wl(mes)) answer(bot, mes, await c.pi.sensors()                                           );});
    bot.onText(q('pi_reboot'),         async mes => {if (wl(mes)) answer(bot, mes, await c.pi.reboot()                                            );});
    bot.onText(q('pi_shutdown'),       async mes => {if (wl(mes)) answer(bot, mes, await c.pi.shutdown()                                          );});
    bot.onText(q('pi_stat'),           async mes => {if (wl(mes)) answer(bot, mes, await c.pi.stat(),                    {parse_mode: 'Markdown'} );});

    bot.onText(q('wifi_home_devices'), async mes => {if (wl(mes)) answer(bot, mes, await c.wifi.devices()                                         );});
    bot.onText(q('wifi_home_reboot'),  async mes => {if (wl(mes)) answer(bot, mes, await c.wifi.reboot()                                          );});
    bot.onText(q('wifi_knpl_devices'), async mes => {if (wl(mes)) answer(bot, mes, await c.wifi.devices({place: 'knpl'})                          );});
    bot.onText(q('wifi_knpl_reboot'),  async mes => {if (wl(mes)) answer(bot, mes, await c.wifi.reboot({place: 'knpl'})                           );});
    bot.onText(q('wifi_spots'),        async mes => {if (wl(mes)) answer(bot, mes, await c.wifi.spots(),                 {parse_mode: 'Markdown'} );});

};

module.exports = cmd;
