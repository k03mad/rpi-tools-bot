'use strict';

const {repo} = require('@k03mad/utils');

/** @returns {Promise} */
module.exports = () => repo.run('magnet-co-parser', 'parse');
