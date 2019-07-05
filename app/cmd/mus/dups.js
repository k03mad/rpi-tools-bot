'use strict';

const {repo} = require('utils-mad');
const {yandex} = require('../../../env');

module.exports = () => repo.run(
    'print-unavailable-yamusic',
    `search --login=${yandex.login} --pass=${yandex.password} --dups`,
);
