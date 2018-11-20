const b = require('require-all')(`${__dirname}/../bot/cmd`);
const c = require('require-all')(`${__dirname}/lib`);
const cron = require('node-cron');

/**
 * Schedule crons
 * @param {Object} bot telegram node api
 */
const run = bot => {
    // every minute
    cron.schedule('* * * * *', async () => {
        await c.pi.usage();
    });

    // every N minutes
    cron.schedule('*/10 * * * *', async () => {
        await Promise.all([
            c.dns.clients(),
            c.dns.queries(),
            c.dns.top(),
        ]);
    });

    // every N minutes
    cron.schedule('*/30 * * * *', async () => {
        await Promise.all([
            c.sys.ip(bot),
            c.ufw.alarm(bot),
        ]);
    });

    // every hour
    cron.schedule('0 * * * *', async () => {
        await b.dns.update();
    });

    // every day at
    cron.schedule('0 20 * * *', async () => {
        await Promise.all([
            c.pi.update(bot),
            b.ufw.clean(),
        ]);
    });

    // every day at
    cron.schedule('0 5 * * *', async () => {
        await b.bal.update();
        await b.pi.reboot();
    });

};

module.exports = run;
