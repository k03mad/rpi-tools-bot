'use strict';

const all = require('require-all')(`${__dirname}/cmd`);
const bot = require('./telegram/config');
const errorsHandler = require('./telegram/errors');
const reply = require('./telegram/reply');

errorsHandler(bot);

Object.entries(all).forEach(([folder, cmds]) => {
    Object.keys(cmds).forEach(cmd => reply(
        bot,
        `${folder}_${cmd}`,
        all[folder][cmd],
        {parse_mode: 'Markdown'},
    ));
});
