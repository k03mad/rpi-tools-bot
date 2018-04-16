const {currentDate} = require('./utils');

const commands = [
    '/help - this list',
    '/log - forever log',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/pi_sensors - get current sensors data',
    '/pi_reboot - reboot pi',
    '/pi_shutdown - shutdown pi',
    '/pi_stat - some usage stats',
    '',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
    '/wifi_spots - scan wifi spots'
];

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces, indent */

    co2: {
        high:                          'dangerous',
        aboveMed:                      'high',
        medium:                        'above normal',
        belowMed:                      'slightly above normal',
        low:                           'normal',
        err:                           'Something goes wrong: can\'t get ppm, or too low level',
        warning:    ppm             => `Ventilate the room! Too high ppm: ${ppm}`
    },
    chart: {
        cor:        ex              => `${currentDate()} sending data to corlysis: ${ex.message}`,
        err:        ex              => `${currentDate()} get data from sensors: ${ex.message}`,
        picErr:     ex              => `I can't get chart picture from corlysis\n${ex}`
    },
    common: {
        choose:     ()              => 'Choose network',
        emptyLog:                      'Log is empty',
        noDev:                         'No devices available',
        polling:    ex              => `${currentDate()} polling: ${ex.message}`,
        reboot:                        'Proceed to reboot',
        updates:                       'No updates available'
    },
    cron: {
        devErr:     ex              => `${currentDate()} get devices from router: ${ex.message}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex.message}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`
    },
    readme: {
        badges: [
                                       '![Dependencies](https://david-dm.org/k03mad/raspi-tlgrm-bot.svg)'
        ],
        footer:                        '(⌐■_■)',
        header:                        'Get data from Raspberry Pi 3',
        md:                            'README.md generated',
        txt:                           'commands.txt generated'
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex.message}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex.message}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex.message}`
    }
};

module.exports = {commands, msg};
