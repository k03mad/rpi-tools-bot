'use strict';

const {adg, repo, promise} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 */
module.exports = async opts => {
    const LISTS_REPO = 'adguard-home-lists-my';

    if (!opts) {
        return 'No params found, example: white|black yandex.ru';
    }

    const [list, url] = opts.split(/\s+/);
    const urlTrim = (url || '').trim();

    if (
        !url
        || !url.includes('.')
        || !['white', 'black'].includes(list)
    ) {
        throw new Error(`Something wrong with params\nURL: "${urlTrim}"\nLIST: "${list}"`);
    }

    const logAdd = await repo.run(LISTS_REPO, [
        `${list} --url=${urlTrim}`,
        'update',
    ]);

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh', {json: {whitelist: true}});

    return [
        logAdd,
        JSON.stringify(logRefresh),
        `"${urlTrim}" added to ${list}list`,
    ].join('\n\n');
};
