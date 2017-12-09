/* eslint-disable key-spacing, no-multi-spaces, indent */

const commands = [
    '/help - список всех доступных команд',
    '',
    '/stats - получает температуру и свободное место с RPi3'
];

const msg = {
    common: {
        deployed:   'I am deployed'
    },
    readme: {
        badges: [
                    '![Dependencies](https://david-dm.org/k03mad/raspi-tlgrm-bot.svg)'
        ],
        footer:     '(⌐■_■)',
        header:     'Бот для получения данных с Raspberry Pi 3',
        md:         'README.md generated',
        txt:        'commands.txt generated'
    },
    send: {
        mark:       (res, ex)       => `I can't send markdown message.\n${ex}\n${JSON.stringify(res)}`,
        norm:       (res, ex)       => `I can't send normal message.\n${ex}\n${JSON.stringify(res)}`
    }
};

module.exports = {commands, msg};
