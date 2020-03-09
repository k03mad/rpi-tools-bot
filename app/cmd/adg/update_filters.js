'use strict';

const {adg, repo, promise} = require('utils-mad');

module.exports = async () => {
    const logMy = await repo.run('adguard-home-lists-my', 'update');
    const logConverted = await repo.run('adguard-home-lists-converted', 'update');

    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh');

    return [logMy, logConverted, logRefresh].join('\n\n');
};
