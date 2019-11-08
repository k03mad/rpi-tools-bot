'use strict';

const {repo} = require('utils-mad');

module.exports = () => repo.run(
    'adblock-hosts-list',
    'deploy',
);
