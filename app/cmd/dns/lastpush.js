'use strict';

const {shell} = require('utils-mad');

module.exports = () => shell.run([
    'cd ~/git/adblock-hosts-list',
    'git show -p origin/master | grep Date',
]).catch(err => err);
