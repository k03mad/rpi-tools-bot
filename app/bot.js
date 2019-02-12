'use strict';

const Agent = require('socks5-https-client/lib/Agent');
const b = require('require-all')(`${__dirname}/lib/cmd`);
const TelegramBot = require('node-telegram-bot-api');
const {log} = require('utils-mad');
const {proxy, telegramToken} = require('../env');
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

const replies = {
    app_log: b.app.log,

    apt_update: b.apt.update,
    apt_upgrade: b.apt.upgrade,

    dns_check: b.dns.check,
    dns_lastpush: b.dns.lastpush,
    dns_query: b.dns.query,
    dns_update: b.dns.update,

    mus_dups: b.mus.dups,
    mus_unavail: b.mus.unavail,

    pi_reboot: b.pi.reboot,
    pi_shutdown: b.pi.shutdown,

    wifi_reboot: b.wifi.reboot,
};

for (const [key, value] of Object.entries(replies)) {
    reply(bot, key, value);
}

bot.on('polling_error', error => log.print(error));
