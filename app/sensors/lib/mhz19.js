const path = require('path');

/**
 * Get data from mhz19
 */
const getMhz19 = async () => {
    const pyFile = path.join(__dirname, 'ppm.py');
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (ppm < 100 || ppm > 3000) {
        throw new Error(`wrong ppm count: ${ppm}`);
    }

    return {ppm};
};

module.exports = getMhz19;
