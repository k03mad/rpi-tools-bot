'use strict';

const {adg, repo, promise} = require('utils-mad');

module.exports = async opts => {
    const [list, url] = opts.split(/\s+/);

    const urlTrim = url.trim();

    if (!url || !url.includes('.')) {
        throw new Error(`Something wrong with URL: ${urlTrim}`);
    }

    if (!['white', 'black'].includes(list)) {
        throw new Error(`Something wrong with List: ${list}`);
    }

    const logAdd = await repo.run('adguard-home-lists-my', `${list} --${urlTrim}`);
    const logUpdate = await repo.run('adguard-home-lists-my', 'update');

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh');

    return [logAdd, logUpdate, logRefresh, `"${urlTrim}" added to ${list}list`].join('\n\n');
};
