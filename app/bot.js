const {sendText, sendMdText, q} = require('./lib/senders');
const {telegramToken, myChat} = require('./lib/env');
const {wl} = require('./lib/utils');
const c = require('require-all')(`${__dirname}/commands`);
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(telegramToken, {polling: {
    interval: 3000,
    params: {allowed_updates: ['message']}
}});

(async () => {
    bot.sendMessage(myChat, await c.updates());
})();

/* eslint-disable no-multi-spaces, func-call-spacing, space-in-parens, brace-style, max-statements-per-line, curly, no-underscore-dangle */

bot.onText( q('help|start'),        mes => {if (wl(mes))  sendText   (bot, mes,        c._help('bot')    );});

bot.onText( q('apt_update'),  async mes => {if (wl(mes))  sendText   (bot, mes,  await c.apt_update()    );});
bot.onText( q('apt_upgrade'), async mes => {if (wl(mes))  sendText   (bot, mes,  await c.apt_upgrade()   );});

bot.onText( q('pi_reboot'),   async mes => {if (wl(mes))  sendText   (bot, mes,  await c.pi_reboot()     );});
bot.onText( q('pi_shutdown'), async mes => {if (wl(mes))  sendText   (bot, mes,  await c.pi_shutdown()   );});
bot.onText( q('pi_stat'),     async mes => {if (wl(mes))  sendMdText (bot, mes,  await c.pi_stat()       );});

bot.onText( q('wifi_conn'),   async mes => {if (wl(mes))  sendText   (bot, mes,  await c.wifi_conn()     );});
bot.onText( q('wifi_reboot'), async mes => {if (wl(mes))  sendText   (bot, mes,  await c.wifi_reboot()   );});
bot.onText( q('wifi_scan'),   async mes => {if (wl(mes))  sendMdText (bot, mes,  await c.wifi_scan()     );});
