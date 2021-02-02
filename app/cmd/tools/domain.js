'use strict';

const {shell, hosts} = require('utils-mad');

const path = '~/git/Turbolist3r';

/**
 * @param {string} domain
 * @returns {Promise}
 **/
module.exports = async domain => {
    if (!domain) {
        return '/tools_domain {domain}';
    }

    const update = await shell.run([
        `cd ${path}`,
        'git reset --hard',
        'git pull',
    ]);

    const output = await shell.run([
        `cd ${path}`,
        `python turbolist3r.py -d ${domain} -q`,
    ]);

    const formatted = hosts.sort(
        output
            .replace(/\u001B\[92m|\u001B\[0m|Process[\S\s]+assignment/g, '')
            .split(/\s+/)
            .filter(Boolean),
    ).join('\n');

    return [update, formatted];
};
