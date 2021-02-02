'use strict';

const {shell} = require('utils-mad');

const path = '~/git/Turbolist3r';

/**
 * @param {string} domain
 * @returns {Promise}
 **/
module.exports = async domain => {
    const logs = [
        await shell.run([
            `cd ${path}`,
            'git reset --hard',
            'git pull',
        ]),
    ];

    const output = await shell.run([
        `cd ${path}`,
        `python turbolist3r.py -d ${domain} -q`,
    ]);

    logs.push(output.replace(/Process[\S\s]+assignment/, '').trim());

    return logs;
};
