'use strict';

const {log, shell} = require('utils-mad');
const {runRepoScript} = require('../../lib/utils');
const {yandex} = require('../../lib/env');

module.exports = () => shell.run(runRepoScript(
    'print-unavailable-yamusic',
    `search --login=${yandex.login} --pass=${yandex.password}`
)).catch(err => log.print(err));
