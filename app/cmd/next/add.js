'use strict';

const debug = require('debug')('utils-mad:cmd:next:add');
const hexyjs = require('hexyjs');
const pMap = require('p-map');
const {next, hosts, promise} = require('utils-mad');

const getList = async path => {
    const list = await next.query({path});
    return list.map(({domain}) => domain);
};

/**
 * @param {string} list
 * @param {string} addDomain
 * @returns {Promise}
 */
module.exports = async (list, addDomain) => {
    const concurrency = 5;

    const lists = {
        '-': 'denylist',
        '+': 'allowlist',
    };

    if (!Object.keys(lists).includes(list)) {
        return '/next_add {type (-|+)} {domain}';
    }

    const listType = lists[list];
    const currentDomains = await getList(listType);

    await pMap(currentDomains, domain => next.query({
        method: 'DELETE',
        path: `${listType}/hex:${hexyjs.strToHex(domain)}`,
    }), {concurrency});

    let message = '';

    if (addDomain?.match(/.+\..+/)) {
        const trimmed = addDomain.trim();
        currentDomains.push(trimmed);
        message = `"${trimmed}" added to ${listType}`;
    }

    let i = 1;
    const sortedReversed = hosts.sort(new Set(currentDomains)).reverse();
    const {length} = sortedReversed;

    for (const domain of sortedReversed) {
        debug(`${i} of ${length}`);

        await promise.delay();
        await next.query({
            method: 'PUT',
            path: `${listType}/hex:${hexyjs.strToHex(domain)}`,
        });

        i++;
    }

    const afterDomains = await getList(listType);

    return [
        `\nBefore sort: ${currentDomains.length} domains in ${listType}\n`,
        currentDomains.join('\n'),
        `\nAfter sort: ${afterDomains.length} domains in ${listType}\n`,
        afterDomains.join('\n'),
        currentDomains.length === afterDomains.length
            ? '' : '\n\nSOMETHING GOES WRONG\nDomains length doesn\'t eql after sort',
        message,
    ].join('\n');
};
