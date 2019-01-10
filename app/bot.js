'use strict';

const Agent = require('socks5-https-client/lib/Agent');
const b = require('require-all')(`${__dirname}/cmd`);
const TelegramBot = require('node-telegram-bot-api');
const {printMsg} = require('./lib/utils');
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

reply(bot, 'app_log', b.app.log);

reply(bot, 'apt_update', b.apt.update);
reply(bot, 'apt_upgrade', b.apt.upgrade);

reply(bot, 'dns_check', b.dns.check);
reply(bot, 'dns_lastpush', b.dns.lastpush);
reply(bot, 'dns_query', b.dns.query);
reply(bot, 'dns_update', b.dns.update);

reply(bot, 'mus_dups', b.mus.dups);
reply(bot, 'mus_unavail', b.mus.unavail);

reply(bot, 'pi_reboot', b.pi.reboot);
reply(bot, 'pi_shutdown', b.pi.shutdown);
reply(bot, 'pi_usage', b.pi.usage);

reply(bot, 'wifi_reboot', b.wifi.reboot);

bot.on('polling_error', error => printMsg(error));
