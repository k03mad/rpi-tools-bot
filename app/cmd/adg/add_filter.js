'use strict';

const {adg, repo, promise} = require('utils-mad');

module.exports = async opts => {
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

    const logAdd = await repo.run('adguard-home-lists-my', `${list} --${urlTrim}`);
    const logUpdate = await repo.run('adguard-home-lists-my', 'update', {skipReset: true});

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh');

    return [logAdd, logUpdate, logRefresh, `"${urlTrim}" added to ${list}list`].join('\n\n');
};
