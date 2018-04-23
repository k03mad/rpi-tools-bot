const {msg} = require('./lib/messages');
const {proxy, telegramToken} = require('../env');
const PacProxyAgent = require('pac-proxy-agent');
const TelegramBot = require('node-telegram-bot-api');
const {sendToCorlysis} = require('./lib/corlysis');

const agent = new PacProxyAgent(proxy);
const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']}
    },
    request: {agent}
});

bot.on('polling_error', err => {
    console.log(msg.common.polling(err));
    sendToCorlysis('bot=polling', 'pollErr=1i').catch(ex => console.log(msg.chart.cor(ex)));
});

require('./cmd')(bot);
require('./cron')(bot);
