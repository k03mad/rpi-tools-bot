'use strict';

const {mikrotik} = require('utils-mad');

module.exports = () => mikrotik.interface.switch('wlan1');
