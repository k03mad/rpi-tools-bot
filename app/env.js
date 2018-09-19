// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;

process.env.NODE_ENV = 'production';

module.exports = {
    influx: {
        db: process.env.INFLUX_DB,
        meas: process.env.INFLUX_MEAS,
        url: process.env.INFLUX_URL,
    },
    proxy: {
        socksHost: process.env.PROXY_HOST,
        socksPort: process.env.PROXY_PORT,
        socksUsername: process.env.PROXY_USER,
        socksPassword: process.env.PROXY_PASS,
    },

    chat: Number(process.env.MY_CHAT),
    piholeUrl: process.env.PIHOLE_URL,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
};
