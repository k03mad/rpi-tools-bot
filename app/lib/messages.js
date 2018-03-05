/* eslint-disable key-spacing, no-multi-spaces, indent */

const commands = [
    '/help - this list',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '/pi_reboot - reboot pi after 1 minute',
    '/pi_shutdown - shutdown pi after 1 minute',
    '/pi_stat - some usage stats',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
    '/wifi_spots - wifi spots list'
];

const msg = {
    common: {
        reboot: 'Proceed to reboot',
        updates: 'No updates available'
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
        norm:       (res, ex)       => `I can't send normal message.\n${ex}\n${JSON.stringify(res)}`
    }
};

module.exports = {commands, msg};
