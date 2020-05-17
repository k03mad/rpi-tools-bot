'use strict';

const {print} = require('utils-mad');

const MIN_ERRORS = 30;

module.exports = bot => {
    let pollingErrors = 0;

    bot.on('polling_error', err => {
        pollingErrors++;

        if (pollingErrors >= MIN_ERRORS) {
            print.ex(err, {
                before: `onPollingErr (count: ${pollingErrors})`,
                exit: true,
            });
            pollingErrors = 0;
        }
    });

    bot.on('uncaughtException', err => print.ex(err, {
        before: 'onUncaughtEx',
        exit: true,
    }));
};