module.exports = {
    corlysisPubToken: process.env.CORLYSIS_PUB_TOKEN,
    corlysisToken: process.env.CORLYSIS_TOKEN,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    metricsToken: process.env.RP_METRICS_TOKEN,
    myChat: process.env.MY_CHAT,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiIP: process.env.WIFI_IP,
    wifiCred: process.env.WIFI_CRED,
    wifiKnplIP: process.env.WIFI_KNPL_IP,
    wifiKnplCred: process.env.WIFI_KNPL_CRED
};
