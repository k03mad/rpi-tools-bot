'use strict';

const hexyjs = require('hexyjs');
const pMap = require('p-map');
const {next, hosts, promise} = require('utils-mad');

const lists = {
    '-': 'denylist',
    '+': 'allowlist',
};

const getList = async (path) => {
    const list = await next.query({path});
    return list.map(({domain}) => domain);
};

/**
 * @param {list} list
 * @param {string} domain
 * @returns {Promise}
 */
module.exports = async (list, domain) => {
    const concurrency = 5;

    const currentDomains = await getList();

    await pMap(currentDomains, domain => next.query({
        method: 'DELETE',
        path: `allowlist/hex:${hexyjs.strToHex(domain)}`,
    }), {concurrency});

    let message = '';

    if (allowDomain?.match(/.+\..+/)) {
        const trimmed = allowDomain.trim();
        currentDomains.push(trimmed);
        message = `"${trimmed}" added to allowlist`;
    }

    for (const domain of hosts.sort(new Set(currentDomains)).reverse()) {
        await promise.delay();

        await next.query({
            method: 'PUT',
            path: `allowlist/hex:${hexyjs.strToHex(domain)}`,
        });
    }

    const afterDomains = await getList();

    return [
        `\nBefore sort: ${currentDomains.length} domains\n`,
        currentDomains.join('\n'),
        `\nAfter sort: ${afterDomains.length} domains\n`,
        afterDomains.join('\n'),
        currentDomains.length === afterDomains.length
            ? '' : '\n\nSOMETHING GOES WRONG\nDomains length doesn\'t eql after sort',
        message,
    ].join('\n');
};
