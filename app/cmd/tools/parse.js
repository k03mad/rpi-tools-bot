'use strict';

const {repo} = require('utils-mad');

/** @returns {Promise} */
module.exports = () => repo.run('magnet-co-parser', 'parse');
