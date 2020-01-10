'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {telegramToken} = require('../../env');

module.exports = new TelegramBot(telegramToken, {polling: true});
