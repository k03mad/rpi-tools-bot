'use strict';

const {adg, repo, promise} = require('utils-mad');

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

    const logUpdate = await repo.update(LISTS_REPO);
    const logAdd = await repo.run(LISTS_REPO, `${list} --url=${urlTrim}`);
    const logCommit = await repo.run(LISTS_REPO, 'update');

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh', {json: {whitelist: true}});

    return [
        logUpdate, logAdd, logCommit,
        JSON.stringify(logRefresh),
        `"${urlTrim}" added to ${list}list`,
    ].join('\n\n');
};
