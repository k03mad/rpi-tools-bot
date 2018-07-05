const {proxy, telegramToken} = require('../env');
const PacProxyAgent = require('pac-proxy-agent');
const TelegramBot = require('node-telegram-bot-api');

const agent = new PacProxyAgent(proxy);
const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']},
    },
    request: {agent},
});

require('./lib/events/polling')(bot);
require('./lib/events/message')(bot);

require('./lib/reply')(bot);

module.exports = bot;
