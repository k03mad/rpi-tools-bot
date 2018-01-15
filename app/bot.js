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

/* eslint-disable no-multi-spaces, func-call-spacing, space-in-parens, brace-style, max-statements-per-line, curly */

bot.onText( q('arp'),         async mes => {if (wl(mes))  sendText   (bot, mes,  await c.arp()        );});
bot.onText( q('help|start'),        mes => {if (wl(mes))  sendText   (bot, mes,        c.help('bot')  );});
bot.onText( q('reboot'),      async mes => {if (wl(mes))  sendText   (bot, mes,  await c.reboot()     );});
bot.onText( q('shutdown'),    async mes => {if (wl(mes))  sendText   (bot, mes,  await c.shutdown()   );});
bot.onText( q('stats'),       async mes => {if (wl(mes))  sendMdText (bot, mes,  await c.stats()      );});
bot.onText( q('updates'),     async mes => {if (wl(mes))  sendMdText (bot, mes,  await c.updates()    );});
