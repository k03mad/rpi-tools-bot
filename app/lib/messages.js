/* eslint-disable key-spacing, no-multi-spaces, indent */

const commands = [
    '/help - the list of all available commands',
    '',
    '/arp - get RPi local network device list',
    '/reboot - reboot RPi',
    '/run - run command in RPi terminal',
    '/stats - get RPi temperature and usage stats'
];

const msg = {
    common: {
        deployed:   'I am deployed',
        run:        'No output for the command'
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
