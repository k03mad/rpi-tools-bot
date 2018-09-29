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
    pihole: {
        url: process.env.PIHOLE_URL,
        auth: process.env.PIHOLE_PASSWORD,
    },
    chat: Number(process.env.MY_CHAT),
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
};
