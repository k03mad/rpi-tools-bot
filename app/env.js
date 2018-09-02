// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;

process.env.NODE_ENV = 'production';

module.exports = {
    influx: {
        db: process.env.INFLUX_DB,
        meas: process.env.INFLUX_MEAS,
        url: process.env.INFLUX_URL,
    },
    myShows: {
        grant_type: process.env.MYSHOWS_GRANT_TYPE,
        client_id: process.env.MYSHOWS_CLIENT_ID,
        client_secret: process.env.MYSHOWS_CLIENT_SECRET,
        username: process.env.MYSHOWS_USERNAME,
        password: process.env.MYSHOWS_PASSWORD,
    },
    wifi: {
        mad: {
            cred: process.env.WIFI_CRED,
            ip: process.env.WIFI_IP,
        },
        knpl: {
            cred: process.env.WIFI_KNPL_CRED,
            ip: process.env.WIFI_KNPL_IP,
        },
    },
    proxy: {
        socksHost: process.env.PROXY_HOST,
        socksPort: process.env.PROXY_PORT,
        socksUsername: process.env.PROXY_USER,
        socksPassword: process.env.PROXY_PASS,
    },

    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    piholeUrl: process.env.PIHOLE_URL,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
};
