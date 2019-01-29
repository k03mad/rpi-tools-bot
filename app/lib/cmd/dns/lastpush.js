'use strict';

const {log, shell} = require('utils-mad');

module.exports = async () => {
    const date = await shell.run([
        'cd ~/git/adblock-hosts-list',
        'git show -p origin/master | grep Date',
    ]).catch(err => log.print(err));

    return `adblock-hosts-list last push\n${date}`;
};
