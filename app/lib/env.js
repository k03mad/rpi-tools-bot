module.exports = {
    corlysisToken: process.env.CORLYSIS_TOKEN,
    corlysisPubToken: process.env.CORLYSIS_PUB_TOKEN,
    knownDevices: JSON.parse(process.env.KNOWN_DEVICES),
    metricsToken: process.env.RP_METRICS_TOKEN,
    myChat: process.env.MY_CHAT,
    telegramToken: process.env.RP_TELEGRAM_TOKEN,
    wifiIP: process.env.WIFI_IP,
    wifiLogin: process.env.WIFI_LOGIN,
    wifiPass: process.env.WIFI_PASS
};
