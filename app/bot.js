const {proxyPac, telegramToken} = require('../env');
const TelegramBot = require('node-telegram-bot-api');
const PacProxyAgent = require('pac-proxy-agent');

const bot = new TelegramBot(telegramToken, {polling: {
    interval: 3000,
    params: {allowed_updates: ['message']},
    request: {agent: new PacProxyAgent(proxyPac)}
}});

bot.on('polling_error', ex => console.log(ex.message));

require('./cmd')(bot);
require('./cron')(bot);
