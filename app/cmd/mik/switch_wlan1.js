'use strict';

const {mikrotik} = require('utils-mad');

module.exports = () => mikrotik.switch('/interface', 'wlan1');
