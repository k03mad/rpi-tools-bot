const {telegramToken} = require('./lib/env');
const TelegramBot = require('node-telegram-bot-api');
const cmd = require('./cmd');
const cron = require('./cron');

const bot = new TelegramBot(telegramToken, {polling: {
    interval: 3000,
    params: {allowed_updates: ['message']}
}});

cmd(bot);
cron(bot);
