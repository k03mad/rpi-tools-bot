'use strict';

const {adg, repo, promise} = require('utils-mad');

module.exports = async () => {
    const logRepoUpdate = await repo.run('adguard-home-lists', 'update');
    await promise.delay(5000);
    const logRefresh = await adg.post('filtering/refresh');

    return `${logRepoUpdate}\n\n${logRefresh}`;
};
