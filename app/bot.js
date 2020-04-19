'use strict';

const all = require('require-all')(`${__dirname}/cmd`);
const bot = require('./telegram/config');
const reply = require('./telegram/reply');
const {print} = require('utils-mad');

Object.entries(all).forEach(([folder, cmds]) => {
    Object.keys(cmds).forEach(cmd => reply(
        bot,
        `${folder}_${cmd}`,
        all[folder][cmd],
        {parse_mode: 'Markdown'},
    ));
});

let pollingErrors = 0;

bot.on('polling_error', err => {
    pollingErrors++;

    if (pollingErrors > 5) {
        print.ex(err, {before: 'err::polling', exit: true});
        pollingErrors = 0;
    }
});

bot.on('uncaughtException', err => print.ex(err, {before: 'err::uncaught', exit: true}));
