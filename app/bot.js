const {msg} = require('./lib/messages');
const {proxy, telegramToken} = require('../env');
const {sendToCorlysis} = require('./lib/corlysis');
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

const POLLING_REPEAT_ALARM = {time: 60, unit: 'seconds'};
let pollingTimer = moment().subtract(POLLING_REPEAT_ALARM.time, POLLING_REPEAT_ALARM.unit);

bot.on('polling_error', err => {
    console.log(msg.common.polling(err));

    // send polling errors to corlysis every 1 minute
    if (moment().diff(pollingTimer, POLLING_REPEAT_ALARM.unit) > POLLING_REPEAT_ALARM.time) {
        pollingTimer = moment();
        sendToCorlysis('bot=polling', 'pollErr=1i').catch(ex => console.log(msg.chart.cor(ex)));
    }
});

require('./cmd')(bot);
require('./cron')(bot);
