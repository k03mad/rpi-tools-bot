const TelegramBot = require('node-telegram-bot-api');
const c = require('require-all')(`${__dirname}/commands`);
const {telegramToken, myChat} = require('./lib/env');
const {msg} = require('./lib/messages');
const {search, sendText, sendMdText, q} = require('./lib/senders');

const bot = new TelegramBot(telegramToken, {polling: {
    interval: 3000,
    params: {allowed_updates: ['message']}
}});

bot.sendMessage(myChat, msg.common.deployed);

/* eslint-disable no-multi-spaces, func-call-spacing, space-in-parens */

bot.onText(  q('help|start'),         mes => sendText      (bot, mes,         c.help('bot')      ));
// bot.onText(  q('reboot'),             ()  =>                                  c.reboot()      );
bot.onText(  q('run', 'search'),      mes => sendText      (bot, mes,         c.run(search(mes)) ));
bot.onText(  q('stats'),        async mes => sendMdText    (bot, mes,   await c.stats()          ));
