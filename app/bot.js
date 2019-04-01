'use strict';

const bot = require('./telegram/config');
const {executeReplies} = require('./telegram/chat');
const {log} = require('utils-mad');

executeReplies(bot, [
    'app_log',

    'apt_update',
    'apt_upgrade',

    'dns_check',
    'dns_query',
    'dns_update',

    'mus_dups',
    'mus_unavail',

    'pi_reboot',
    'pi_shutdown',
]);

bot.on('polling_error', error => log.print(error));
