const {getCorlysisChartImage} = require('../lib/graph/corlysis');
const {msg} = require('../lib/messages');

/**
 * Get corlysis charts
 */
const graph = async () => {
    const GRAPHS_COUNT = 10;
    const ids = [...new Array(GRAPHS_COUNT)].map((_, x) => ++x);

    const output = [];
    await Promise.all(ids.map(async elem => {
        try {
            output.push(await getCorlysisChartImage(elem));
        } catch (err) {
            output.push(msg.chart.picErr(err));
        }
    }));

    return output;
};

module.exports = graph;
