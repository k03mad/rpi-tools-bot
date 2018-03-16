const {run} = require('../lib/utils');
const path = require('path');

/**
 * Get CO2 from mh_z19 with ppm.py
 */
const co2 = () => {
    const pyFile = path.join(__dirname, '..', 'lib', 'ppm.py');
    return run(`sudo python ${pyFile}`);
};

module.exports = co2;
