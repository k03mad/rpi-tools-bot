const colors = require('colors/safe');
const fs = require('fs');
const {msg, commands} = require('../../messages');

const data = [
    msg.readme.badges.join(' '),
    msg.readme.header,
    msg.readme.footer,
];

fs.writeFile('README.md', data.join('\n\n'), err => {
    console.log(colors.yellow(err || msg.readme.md));
});

fs.writeFile('commands.txt', commands
    .filter(elem => elem)
    .map(elem => elem.replace('/', ''))
    .join('\n'), err => console.log(colors.magenta(err || msg.readme.txt))
);
