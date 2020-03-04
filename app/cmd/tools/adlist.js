'use strict';

const {repo} = require('utils-mad');

module.exports = () => repo.run('adguard-home-lists', 'update');
