// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;

process.env.NODE_ENV = 'production';

module.exports = {
    influxDb: process.env.INFLUX_DB,
    influxMeas: process.env.INFLUX_MEAS,
    influxUrl: process.env.INFLUX_URL,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    lastfmToken: process.env.LAST_FM,
    lastfmUserMad: process.env.LAST_FM_MAD,
    lastfmUserKnpl: process.env.LAST_FM_KNPL,
    myChat: process.env.MY_CHAT,
    owmCityId: process.env.OWM_CITY_ID,
    owmToken: process.env.OWM_TOKEN,
    piholeUrl: process.env.PIHOLE_URL,
    proxy: process.env.PROXY_PAC,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiCred: process.env.WIFI_CRED,
    wifiIP: process.env.WIFI_IP,
    wifiKnplCred: process.env.WIFI_KNPL_CRED,
    wifiKnplIP: process.env.WIFI_KNPL_IP,
};
