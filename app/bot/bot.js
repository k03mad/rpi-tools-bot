const {msg} = require('../messages');
const {proxy, telegramToken} = require('../env');
const {sendToInflux, checkTimer} = require('../utils');
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

let pollingTimer = moment();

bot.on('polling_error', ex => {
    console.log(msg.common.polling(ex));

    // send polling errors to database every N minute
    if (checkTimer(pollingTimer, 1)) {
        pollingTimer = moment();
        const TAG = 'bot=polling';
        sendToInflux(TAG, {pollErr: 1}).catch(err => console.log(msg.common.influx(TAG, err)));
    }
});

require('./lib/reply')(bot);

module.exports = bot;
