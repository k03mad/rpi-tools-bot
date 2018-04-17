const {getCorlysisChartImage} = require('../../lib/corlysis');
const {msg} = require('../../lib/messages');
const {run} = require('../../lib/utils');
const path = require('path');

/**
 * Return detailed message about sensor values
 */
const getDetailedMsg = (ppm, type) => {
    if (type === 'co2') {
        switch (true) {
            case ppm > 1400:
                return msg.co2.high;
            case ppm > 1000:
                return msg.co2.aboveMed;
            case ppm > 800:
                return msg.co2.medium;
            case ppm > 600:
                return msg.co2.belowMed;
            case ppm > 300:
                return msg.co2.low;

            default:
                return msg.co2.err;
        }
    }
};

/**
 * Get sensors data with python
 */
const sensors = async onlyNum => {
    const pyFile = path.join(__dirname, '..', '..', 'py', 'ppm.py');
    const ppm = Number(await run(`sudo python ${pyFile}`));

    if (onlyNum) {
        return {ppm};
    }

    const message = [
        `CO₂: *${ppm} ppm* (${getDetailedMsg(ppm, 'co2')})`
    ].join('\n');

    let chart;

    try {
        chart = await getCorlysisChartImage(1);
    } catch (ex) {
        chart = msg.chart.picErr(ex);
    }

    return [message, chart];
};

const BME280 = require('bme280-sensor');

// The BME280 constructor options are optional.
// 
const options = {
//  i2cBusNo   : 1, // defaults to 1
  i2cAddress : 0x76
};

const bme280 = new BME280(options);

// Read BME280 sensor data, repeat
//
const readSensorData = async () => {
  const data = await bme280.readSensorData();
//    .then((data) => {
      // temperature_C, pressure_hPa, and humidity are returned by default.
      // I'll also calculate some unit conversions for display purposes.
      //
      data.temperature_F = BME280.convertCelciusToFahrenheit(data.temperature_C);
      data.pressure_inHg = BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa);
 
      console.log(`data = ${JSON.stringify(data, null, 2)}`);
   //   setTimeout(readSensorData, 2000);
   // })
   // .catch((err) => {
   //   console.log(`BME280 read error: ${err}`);
   //   setTimeout(readSensorData, 2000);
   // });
};

// Initialize the BME280 sensor
//
(async () => {

await bme280.init();
//  .then(() => {
  //  console.log('BME280 initialization succeeded');
    await readSensorData();
 // })
 // .catch((err) => console.error(`BME280 initialization failed: ${err} `));
})();
module.exports = sensors;
