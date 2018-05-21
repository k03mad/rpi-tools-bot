const {currentDate} = require('./utils');

const commands = [
    '/help - this list',
    '/graph - get all grafana graphs',
    '/log - print forever log',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/pi_reboot - reboot pi',
    '/pi_shutdown - shutdown pi',
    '/pi_stat - some usage stats',
    '',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
];

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces, indent */
    chart: {
        cor:        ex              => `${currentDate()} sending data to corlysis: ${ex}`,
        picErr:     ex              => `I can't get chart picture from corlysis\n${ex}`,
    },
    common: {
        choose:     ()              => 'Choose network',
        emptyLog:                      'Log is empty',
        noDev:                         'No devices available',
        noVendor:   (mac, ex)       => `${currentDate()} get ${mac} mac vendor: ${ex}`,
        errDev:     (place, ex)     => `${currentDate()} get ${place} devices: ${ex}`,
        polling:    ex              => `${currentDate()} polling: ${ex}`,
        reboot:                        'Proceed to reboot',
        vendor:     (mac, ex)       => `${currentDate()} get ${mac} vendor: ${ex}`,
        updates:                       'No updates available',
    },
    cron: {
        dns:        (log, ex)       => `${currentDate()} get dns queries: ${ex}, log: ${log}`,
        dnsVar:     ex              => `${currentDate()} get pihole password var: ${ex}`,
        dnsTop:     ex              => `${currentDate()} get pihole top hosts: ${ex}`,
        lastfm:     ex              => `${currentDate()} get lastfm plays count: ${ex}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`,
    },
    readme: {
        badges: [
                                       '![Dependencies](https://david-dm.org/k03mad/raspi-tlgrm-bot.svg)',
        ],
        footer:                        '(⌐■_■)',
        header:                        'Get data from Raspberry Pi 3',
        md:                            'README.md generated',
        txt:                           'commands.txt generated',
    },
    sensor: {
        noData:                        `${currentDate()} data from sensors is empty`,
        bme:        ex              => `${currentDate()} cannot get data from bme: ${ex}`,
        mhz:        ex              => `${currentDate()} cannot get data from mhz: ${ex}`,
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex}`,
    },
};

module.exports = {commands, msg};
