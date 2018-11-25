const b = require('require-all')(`${__dirname}/../bot/cmd`);
const c = require('require-all')(`${__dirname}/lib`);
const cron = require('node-cron');

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const run = bot => {
    // every minute
    cron.schedule('* * * * *', () => {
        c.pi.usage();
        c.sens.data();
    });

    // every N minutes
    cron.schedule('*/10 * * * *', () => {
        c.dns.clients();
        c.dns.queries();
        c.dns.top();
    });

    // every N minutes
    cron.schedule('*/30 * * * *', () => {
        c.lastfm.top();
        c.sys.ip(bot);
        c.ufw.alarm(bot);
    });

    // every hour
    cron.schedule('0 * * * *', () => {
        b.dns.update();
    });

    // every day at
    cron.schedule('0 20 * * *', () => {
        c.pi.update(bot);
        b.ufw.clean();
    });

    // every day at
    cron.schedule('0 5 * * *', () => {
        b.bal.update();
    });

    // every day at
    cron.schedule('0 6 * * *', () => {
        b.pi.reboot();
    });

};

module.exports = run;
