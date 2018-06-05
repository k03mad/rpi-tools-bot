const {currentDate} = require('./utils');

const commands = [
    '/help - this list',
    '/log - print forever log',
    '',
    '/apt_update - check for updates',
    '/apt_upgrade - install updates',
    '',
    '/pi_reboot - reboot pi',
    '/pi_shutdown - shutdown pi',
    '',
    '/wifi_devices - wifi connected devices list',
    '/wifi_reboot - wifi spot reboot',
];

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces, indent */
    common: {
        choose:     ()              => 'Choose network',
        emptyLog:                      'Log is empty',
        influx:     (db, ex)        => `${currentDate()} sending ${db} to influx: ${ex}`,
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
        lastfm:     ex              => `${currentDate()} get lastfm top artists: ${ex}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`,
    },
    readme: {
        badges: [
                                       '![Dependencies](https://david-dm.org/k03mad/raspberry-tools.svg)',
        ],
        footer:                        '(⌐■_■)',
        header:                        'Run Telegram bot, execute crons, send sensors data to Grafana',
        md:                            'README.md generated',
        txt:                           'commands.txt generated',
    },
    sensor: {
        noData:                        `${currentDate()} data from sensors is empty`,
        bme:        ex              => `${currentDate()} cannot get data from bme: ${ex}`,
        mhz:        ex              => `${currentDate()} cannot get data from mhz: ${ex}`,
        warning:    ppm             => `Ventilate the room! Too high ppm: ${ppm}`,
    },
    send: {
        norm:       ex              => `${currentDate()} sending normal message: ${ex}`,
        photo:      ex              => `${currentDate()} sending photo message: ${ex}`,
        typing:     ex              => `${currentDate()} sending typing message: ${ex}`,
    },
};

module.exports = {commands, msg};
