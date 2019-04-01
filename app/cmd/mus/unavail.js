'use strict';

const {shell} = require('utils-mad');
const {yandex} = require('../../../env');

module.exports = () => shell.script(
    'print-unavailable-yamusic',
    `search --login=${yandex.login} --pass=${yandex.password}`
);
