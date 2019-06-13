'use strict';

const bot = require('./telegram/config');
const {date} = require('utils-mad');
const {executeReplies} = require('./telegram/chat');

executeReplies(bot, [
    'app_log',

    'apt_update',
    'apt_upgrade',

    'dns_check',
    'dns_query',
    'dns_update',

    'mik_dhcp_switch',
    'mik_nat_pi_switch',
    'mik_wlan1_switch',
    'mik_wlan2_switch',

    'mus_dups',
    'mus_unavail',

    'parse_update',

    'pi_reboot',
    'pi_shutdown',
]);

bot.on('polling_error', err => console.error(`${date.now()}\n${err}`));
