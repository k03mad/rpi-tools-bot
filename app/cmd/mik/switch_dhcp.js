'use strict';

const {mikrotik} = require('utils-mad');

/** @returns {Promise} */
module.exports = () => mikrotik.switch('/ip/dhcp-server', 'defconf');
