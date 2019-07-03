'use strict';

const bot = require('./telegram/config');
const {executeReplies} = require('./telegram/chat');
const {print} = require('utils-mad');

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

    'parse_films',
    'parse_shows',

    'pi_reboot',
    'pi_shutdown',
]);

bot.on('polling_error', err => print.ex(err));
