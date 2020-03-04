'use strict';

const {repo, promise} = require('utils-mad');

module.exports = async () => {
    const log = await repo.run('mikrotik-pptp-hidemy-ip', 'script');
    await promise.delay(10000);
    return log;
};
