const moment = require('moment');

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

/**
 * Get current date
 */
const currentDate = () => `\n${moment().format('YYYY.MM.DD HH:mm:ss')}`;

const msg = {
    /* eslint-disable key-spacing, no-multi-spaces */
    common: {
        choose:     ()              => 'Choose network',
        converter:  unit            => `${currentDate()} no units "${unit}" found in converter`,
        emptyLog:                      'Log is empty',
        errDev:     (place, ex)     => `${currentDate()} get ${place} devices: ${ex}`,
        noDev:                         'No devices available',
        noVendor:   (mac, ex)       => `${currentDate()} get ${mac} mac vendor: ${ex}`,
        polling:    ex              => `${currentDate()} polling: ${ex}`,
        reboot:                        'Proceed to reboot',
        updates:                       'No updates available',
        vendor:     (mac, ex)       => `${currentDate()} get ${mac} vendor: ${ex}`,
    },
    cron: {
        aqi:        ex              => `${currentDate()} get air quality: ${ex}`,
        dns:        (log, ex)       => `${currentDate()} get dns queries: ${ex}, log: ${log}`,
        dnsTop:     ex              => `${currentDate()} get pihole top hosts: ${ex}`,
        dnsVar:     ex              => `${currentDate()} get pihole password var: ${ex}`,
        lastfm:     ex              => `${currentDate()} get lastfm top artists: ${ex}`,
        msToken:    ex              => `${currentDate()} get myshows token: ${ex}`,
        msStats:    ex              => `${currentDate()} get myshows stats: ${ex}`,
        pollen:     ex              => `${currentDate()} get pollen index: ${ex}`,
        temp:       ex              => `${currentDate()} get pi temp: ${ex}`,
        traffic:    ex              => `${currentDate()} get router wan traffic: ${ex}`,
        unknownDev: (place, dev)    => `Unknown device connected to the ${place} router:\n\n${dev}`,
        updErr:     ex              => `${currentDate()} get pi updates: ${ex}`,
        usage:      ex              => `${currentDate()} get pi usage: ${ex}`,
        yahoo:      ex              => `${currentDate()} get yahoo weather data: ${ex}`,
        yandex:     ex              => `${currentDate()} get yandex disk stats: ${ex}`,
    },
    influx: {
        get:        (tag, data, ex) => `${currentDate()} getting "${tag}" with "${data}" from influx: ${ex}`,
        send:       (tag, data, ex) => `${currentDate()} sending "${tag}" with "${data}" to influx: ${ex}`,
    },
    readme: {
        badges:                        ['![Dependencies](https://david-dm.org/k03mad/raspberry-tools.svg)'],
        footer:                        '(⌐■_■)',
        header:                        'Run Telegram bot, execute crons, send sensors data to Grafana',
        md:                            'README.md generated',
        txt:                           'commands.txt generated',
    },
    sensor: {
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
