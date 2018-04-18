// remove "Automatic enabling of cancellation of promises is deprecated"
process.env.NTBA_FIX_319 = true;
// remove "In the future, content-type of files you send will default to "application/octet-stream"
process.env.NTBA_FIX_350 = true;

module.exports = {
    corlysisPubToken: process.env.CORLYSIS_PUB_TOKEN,
    corlysisToken: process.env.CORLYSIS_TOKEN,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    myChat: process.env.MY_CHAT,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiIP: process.env.WIFI_IP,
    wifiCred: process.env.WIFI_CRED,
    wifiKnplIP: process.env.WIFI_KNPL_IP,
    wifiKnplCred: process.env.WIFI_KNPL_CRED
};
