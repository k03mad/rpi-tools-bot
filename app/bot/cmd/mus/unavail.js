const {runRepoScript} = require('../../../utils');
const {shell} = require('utils-mad');
const {yandex} = require('../../../env');

module.exports = () => shell.run(runRepoScript(
    'print-unavailable-yamusic',
    `search --login=${yandex.login} --pass=${yandex.password}`
));
