const {msg} = require('../messages');
const {proxy, telegramToken} = require('../env');
const {sendToCorlysis} = require('../utils');
const moment = require('moment');
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

const POLLING_REPEAT_ALARM = 60000;
let pollingTimer = moment();

bot.on('polling_error', ex => {
    console.log(msg.common.polling(ex));

    // send polling errors to corlysis every POLLING_REPEAT_ALARM
    if (moment().diff(pollingTimer) > POLLING_REPEAT_ALARM) {
        pollingTimer = moment();
        const DB = 'bot=polling';
        sendToCorlysis(DB, 'pollErr=1i').catch(err => console.log(msg.chart.cor(DB, err)));
    }
});

require('./lib/reply')(bot);

module.exports = bot;
