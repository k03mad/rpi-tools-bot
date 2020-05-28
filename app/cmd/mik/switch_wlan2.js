'use strict';

const {mikrotik} = require('utils-mad');

/** @returns {Promise} */
module.exports = () => mikrotik.switch('/interface', 'wlan2');
