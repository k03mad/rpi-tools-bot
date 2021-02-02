'use strict';

const {shell, hosts} = require('utils-mad');

const path = '~/git/Turbolist3r';

/**
 * @param {string} domains
 * @returns {Promise}
 **/
module.exports = async domains => {
    if (!domains) {
        return '/tools_domain {domain,...}';
    }

    const logs = [
        await shell.run([
            `cd ${path}`,
            'git reset --hard',
            'git pull',
        ]),
    ];

    for (const domain of domains.split(',')) {
        const output = await shell.run([
            `cd ${path}`,
            `python turbolist3r.py -d ${domain} -q`,
        ]);

        const parsed = output
            .replace(/\u001B\[92m|\u001B\[0m/g, '')
            .split(/\s+/)
            .filter(elem => elem.match(/(?:.+\.){2}.+$/));

        logs.push(hosts.sort(parsed).join('\n'));
    }

    return logs;
};
