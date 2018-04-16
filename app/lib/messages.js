/* eslint-disable key-spacing, no-multi-spaces, indent */

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
        cor:        ex              => `I can't send data to corlysis chart\n${ex}`,
        corRem:     ex              => `I can't remove old data from corlysis\n${ex}`,
        err:        ex              => `I can't get data from sensor\n${ex}`,
        picErr:     ex              => `I can't get chart picture from corlysis\n${ex}`
    },
    common: {
        choose:     ()              => 'Choose network',
        emptyLog:                      'Log is empty',
        noDev:                         'No devices available',
        reboot:                        'Proceed to reboot',
        updates:                       'No updates available'
    },
    cron: {
        devErr:     ex              => `I can't get devices connected to the router:\n\n${ex}`,
        updErr:     ex              => `I can't get pi updates:\n\n${ex}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`
    },
    readme: {
        badges: [
                    '![Dependencies](https://david-dm.org/k03mad/raspi-tlgrm-bot.svg)'
        ],
        footer:     '(⌐■_■)',
        header:     'Get data from Raspberry Pi 3',
        md:         'README.md generated',
        txt:        'commands.txt generated'
    },
    send: {
        mark:       (res, ex)       => `I can't send markdown message\n${ex}\n${JSON.stringify(res)}`,
        norm:       (res, ex)       => `I can't send normal message\n${ex}\n${JSON.stringify(res)}`,
        photo:      (res, ex)       => `I can't send photo message\n${ex}\n${JSON.stringify(res)}`,
        typing:     (res, ex)       => `I can't send typing message\n${ex}\n${JSON.stringify(res)}`
    }
};

module.exports = {commands, msg};
