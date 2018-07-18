// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;

process.env.NODE_ENV = 'production';

module.exports = {
    aqiLat: process.env.AQI_LAT,
    aqiLon: process.env.AQI_LON,
    aqiToken: process.env.AQI_TOKEN,
    influxDb: process.env.INFLUX_DB,
    influxMeas: process.env.INFLUX_MEAS,
    influxUrl: process.env.INFLUX_URL,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    lastfmToken: process.env.LAST_FM,
    lastfmUserKnpl: process.env.LAST_FM_KNPL,
    lastfmUserMad: process.env.LAST_FM_MAD,
    myChat: Number(process.env.MY_CHAT),
    myGroup: Number(process.env.MY_GROUP),
    myShowsClientId: process.env.MYSHOWS_CLIENT_ID,
    myShowsClientSecret: process.env.MYSHOWS_CLIENT_SECRET,
    myShowsPassword: process.env.MYSHOWS_PASSWORD,
    myShowsUserName: process.env.MYSHOWS_USERNAME,
    piholeUrl: process.env.PIHOLE_URL,
    probName: process.env.PROB_NAME,
    probSel: process.env.PROB_SEL,
    probUa: process.env.PROB_UA,
    probUrl: process.env.PROB_URL,
    proxy: process.env.PROXY_PAC,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiCred: process.env.WIFI_CRED,
    wifiIP: process.env.WIFI_IP,
    wifiKnplCred: process.env.WIFI_KNPL_CRED,
    wifiKnplIP: process.env.WIFI_KNPL_IP,
};
