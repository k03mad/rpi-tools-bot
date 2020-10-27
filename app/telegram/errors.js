'use strict';

const {print} = require('utils-mad');

/** @param {object} bot */
module.exports = bot => {
    bot.on('webhook_error', err => print.ex(err, {
        before: 'onWebHookErr',
        exit: true,
    }));

    bot.on('uncaughtException', err => print.ex(err, {
        before: 'onUncaughtEx',
        exit: true,
    }));
};
