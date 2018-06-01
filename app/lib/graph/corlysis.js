const {get} = require('../utils');
const {corlysisToken, corlysisDash, corlysisDb, corlysisWrite} = require('../../../env');

/**
 * Send data to corlysis
 */
const sendToCorlysis = (field, data) => {
    return get(corlysisWrite, {
        query: {
            db: corlysisDb,
        },
        body: `${corlysisDash},${field} ${data}`,
        auth: `token:${corlysisToken}`,
    });
};

module.exports = {
    sendToCorlysis,
};
