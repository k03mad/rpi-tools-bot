'use strict';

const all = require('require-all')(`${__dirname}/cmd`);
const bot = require('./telegram/config');
const {reply} = require('./telegram/chat');

Object.entries(all).forEach(([folder, cmds]) => {
    Object.keys(cmds).forEach(cmd => reply(bot, `${folder}_${cmd}`, all[folder][cmd]));
});

bot.on('polling_error', err => print.ex(err, {exit: true}));
