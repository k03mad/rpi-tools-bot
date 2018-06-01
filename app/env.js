// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;
// remove "In the future, content-type of files you send will default to "application/octet-stream"
process.env.NTBA_FIX_350 = true;

process.env.NODE_ENV = 'production';

module.exports = {
    corlysisDash: process.env.CORLYSIS_DASH,
    corlysisDb: process.env.CORLYSIS_DB,
    corlysisPubToken: process.env.CORLYSIS_PUB_TOKEN,
    corlysisToken: process.env.CORLYSIS_TOKEN,
    corlysisWrite: process.env.CORLYSIS_WRITE,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    lastfmToken: process.env.LAST_FM,
    myChat: process.env.MY_CHAT,
    proxy: process.env.PROXY_PAC,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiCred: process.env.WIFI_CRED,
    wifiIP: process.env.WIFI_IP,
    wifiKnplCred: process.env.WIFI_KNPL_CRED,
    wifiKnplIP: process.env.WIFI_KNPL_IP,
};
