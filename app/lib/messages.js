/* eslint-disable key-spacing, no-multi-spaces, indent */

const commands = [
    '/help - this list',
    '/user - current user info',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/pi_sensors - get current sensors data',
    '/pi_reboot - reboot pi after 1 minute',
    '/pi_shutdown - shutdown pi after 1 minute',
    '/pi_stat - some usage stats',
    '',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
    '/wifi_spots - wifi spots list'
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
        ts:         ex              => `I can't send CO₂ to thing speak chart\n${ex}`,
        cor:        ex              => `I can't send CO₂ to corlysis chart\n${ex}`,
        corRem:     ex              => `I can't remove old data from corlysis\n${ex}`,
        err:        ex              => `I can't get CO₂ from sensor\n${ex}`,
        picErr:     ex              => `I can't get chart picture from corlysis\n${ex}`
    },
    common: {
        reboot:                        'Proceed to reboot',
        updates:                       'No updates available',
        unknownDev: dev             => `Unknown device connected to the router:\n\n${dev}`
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
        mark:       (res, ex)       => `I can't send markdown message.\n${ex}\n${JSON.stringify(res)}`,
        norm:       (res, ex)       => `I can't send normal message.\n${ex}\n${JSON.stringify(res)}`,
        photo:      (res, ex)       => `I can't send photo message.\n${ex}\n${JSON.stringify(res)}`
    }
};

module.exports = {commands, msg};
