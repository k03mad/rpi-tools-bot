'use strict';

const Agent = require('socks5-https-client/lib/Agent');
const b = require('require-all')(`${__dirname}/cmd`);
const TelegramBot = require('node-telegram-bot-api');
const {log} = require('utils-mad');
const {proxy, telegramToken} = require('./lib/env');
const {reply} = require('./lib/utils');

const bot = new TelegramBot(telegramToken, {
    polling: {
        interval: 3000,
        params: {allowed_updates: ['message']},
    },
    request: {
        agentClass: Agent,
        agentOptions: proxy,
    },
});

const replies = [
    'app_log',

    'apt_upgrade',

    'dns_check',
    'dns_query',
    'dns_update',

    'mus_dups',
    'mus_unavail',

    'pi_reboot',
    'pi_shutdown',
];

for (const command of replies) {
    const [section, name] = command.split('_');
    reply(bot, command, b[section][name]);
}

bot.on('polling_error', error => log.print(error));
