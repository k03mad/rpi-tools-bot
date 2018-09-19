const moment = require('moment');

const commands = [
    '/help - this list',
    '/log - print forever log',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/dns_update - update dns filter',
    '',
    '/pi_reboot - reboot pi',
    '/pi_shutdown - shutdown pi',
];

/**
 * Get current date
 */
const currentDate = () => `\n${moment().format('YYYY.MM.DD HH:mm:ss')}`;

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces */
    common: {
        emptyLog:                      'Log is empty',
        updates:                       'No updates available',
    },
    cron: {
        dns:        (log, ex)       => `${currentDate()} get dns queries: ${ex}, log: ${log}`,
        dnsClients: ex              => `${currentDate()} get pihole top clients: ${ex}`,
        dnsTop:     ex              => `${currentDate()} get pihole top hosts: ${ex}`,
        dnsVar:     ex              => `${currentDate()} get pihole password var: ${ex}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        usage:      ex              => `${currentDate()} get pi usage: ${ex}`,
    },
    influx: {
        send:       (tag, data, ex) => `${currentDate()} sending "${tag}" with "${data}" to influx: ${ex}`,
    },
    readme: {
        badges:                        ['![Dependencies](https://david-dm.org/k03mad/raspberry-tools.svg)'],
        footer:                        '(⌐■_■)',
        header:                        'Telegram bot, crons, influx data writer, etc',
        md:                            'README.md generated',
        txt:                           'commands.txt generated',
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex}`,
    },
};

module.exports = {commands, msg};
