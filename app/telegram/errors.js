'use strict';

const {print} = require('utils-mad');

module.exports = bot => {
    let pollingErrors = 0;

    bot.on('polling_error', err => {
        pollingErrors++;

        if (pollingErrors >= 10) {
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
