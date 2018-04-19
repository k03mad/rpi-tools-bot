const {msg} = require('./lib/messages');
const {proxy, telegramToken} = require('../env');
const PacProxyAgent = require('pac-proxy-agent');
const TelegramBot = require('node-telegram-bot-api');

const agent = new PacProxyAgent(proxy);
const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']}
    },
    request: {agent}
});

bot.on('polling_error', ex => console.log(msg.common.polling(ex)));

require('./cmd')(bot);
require('./cron')(bot);
