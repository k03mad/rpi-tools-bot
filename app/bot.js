const {msg} = require('./lib/messages');
const {telegramToken} = require('../env');
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(telegramToken, {polling: {
    interval: 3000,
    params: {allowed_updates: ['message']}
}});

bot.on('polling_error', ex => console.log(msg.common.polling(ex)));

require('./cmd')(bot);
require('./cron')(bot);
