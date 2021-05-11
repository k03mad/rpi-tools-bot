'use strict';

const {repo} = require('@k03mad/utils');

/** @returns {Promise} */
module.exports = () => repo.run('nextdns-lists-sync', 'upload');
