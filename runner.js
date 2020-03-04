'use strict';

const all = require('require-all')(`${__dirname}/app/cmd`);

const {remain} = JSON.parse(process.env.npm_config_argv);

(async () => {
    const log = await all[remain[0]][remain[1]]();
    console.log(log);
})();
