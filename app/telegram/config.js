'use strict';

const Agent = require('socks5-https-client/lib/Agent');
const TelegramBot = require('node-telegram-bot-api');
const {proxy, telegramToken} = require('../../env');

module.exports = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']},
    },
    request: {
        agentClass: Agent,
        agentOptions: proxy,
    },
});
