'use strict';

const {shell} = require('utils-mad');

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
        logs.push(`___ ${domain} ___`);

        const output = await shell.run([
            `cd ${path}`,
            `python turbolist3r.py -d ${domain} -q -a`,
        ]);

        const parsed = output
            .replace(/\u001B\[\d+m/g, '')
            .split(/== (CNAME records|A records) ==/g)
            .filter(Boolean)
            .map(elem => elem.trim());

        logs.push(...parsed);
    }

    return logs;
};
