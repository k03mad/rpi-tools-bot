'use strict';

const {shell} = require('utils-mad');

/**
 * @param {string} domains
 * @returns {Promise}
 **/
module.exports = async domains => {
    if (!domains) {
        return '/tools_domain {domain,...}';
    }

    const path = '~/git/Turbolist3r';
    const arrow = ' -->-- ';

    const status = await shell.run([
        `cd ${path}`,
        'git fetch origin',
        'git status',
    ]);

    const logs = [];

    for (let domain of domains.split(',')) {
        domain = domain.replace(/(http(s)?:\/\/(www\.)?)?/, '');

        logs.push(`*${domain}*`);

        const output = await shell.run([
            `cd ${path}`,
            `python turbolist3r.py -d ${domain} -q -a`,
        ]);

        const data = {};

        output
            .replace(/\u001B\[\d+m/g, '')
            .split(/\n/)
            .forEach(line => {
                if (line.match(`${domain}$`)) {
                    data[line] = [];
                }

                if (line.includes(arrow)) {
                    const [address, ...rest] = line
                        .split(arrow)
                        .map(elem => elem.replace(/.$/, ''));

                    if (data[address]) {
                        data[address].push(...rest);
                    } else {
                        data[address] = rest;
                    }
                }
            });

        logs.push(
            Object
                .entries(data)
                .map(([host, ip]) => [host.split('.').reverse(), ip])
                .sort()
                .map(([host, ip]) => `${host.reverse().join('.')} \`${ip.join(',')}\``)
                .join('\n'),
        );
    }

    return [status, ...logs.map(message => ({message, opts: {parse_mode: 'Markdown'}}))];
};
