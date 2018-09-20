const colors = require('colors/safe');
const fs = require('fs');
const commands = require('./commands');

const data = [
    '![Dependencies](https://david-dm.org/k03mad/raspberry-tools.svg)',
    'Telegram bot, crons, influx data writer, etc',
    '(⌐■_■)',
];

fs.writeFile('README.md', data.join('\n\n'), err => {
    console.log(colors.yellow(err || 'README.md generated'));
});

fs.writeFile('commands.txt', commands
    .filter(elem => elem)
    .map(elem => elem.replace('/', ''))
    .join('\n'), err => console.log(colors.magenta(err || 'commands.txt generated'))
);
