const {proxy, telegramToken} = require('../env');
const Agent = require('socks5-https-client/lib/Agent');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']},
    },
    request: {
        agentClass: Agent,
        agentOptions: proxy,
    },
});

require('./lib/events/polling')(bot);
require('./lib/events/message')(bot);

require('./lib/reply')(bot);

module.exports = bot;
