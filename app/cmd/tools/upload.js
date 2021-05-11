'use strict';

const {repo} = require('@k03mad/utils');

/** @returns {Promise} */
module.exports = async () => {
    try {
        return await repo.run('nextdns-lists-sync', 'upload');
    } catch (err) {
        return err;
    }
};
