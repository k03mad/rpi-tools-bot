'use strict';

const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const {print} = require('utils-mad');
const {telegram, mikrotik, pi} = require('../../env');

const bot = new TelegramBot(telegram.token, {
    webHook: {
        port: telegram.port,
        key: path.join(pi.cert, mikrotik.cloud, 'privkey.pem'),
        cert: path.join(pi.cert, mikrotik.cloud, 'fullchain.pem'),
    },
});

bot
    .setWebHook(`https://${mikrotik.cloud}:${telegram.port}/bot${telegram.token}`)
    .catch(err => print.ex(err, {
        before: 'setWebHookErr',
        exit: true,
    }));

module.exports = bot;
