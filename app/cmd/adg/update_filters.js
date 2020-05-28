'use strict';

const {adg, repo, promise} = require('utils-mad');

/** @returns {Promise<Array>} */
module.exports = async () => {
    const logMy = await repo.run('adguard-home-lists-my', 'update');

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh', {json: {whitelist: true}});

    return [logMy, `Updated: ${logRefresh.updated} filters`].join('\n\n');
};
