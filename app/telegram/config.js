'use strict';

const TelegramBot = require('node-telegram-bot-api');
const {telegram} = require('../../env');

module.exports = new TelegramBot(telegram.token, {polling: true});
