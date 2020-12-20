'use strict';

const pMap = require('p-map');
const {next, request} = require('utils-mad');

/**
 * @returns {Promise}
 */
module.exports = async () => {
    const concurrency = 5;
    const lists = ['allowlist', 'denylist'];

    const domains = await Promise.all(lists.map(async path => {
        const list = await next.query({path});
        return list.map(({domain}) => domain);
    }));

    const noAnswer = await pMap(domains.flat(), async domain => {
        const {body} = await request.cache('https://cloudflare-dns.com/dns-query', {
            headers: {accept: 'application/dns-json'},
            searchParams: {name: domain},
        }, {expire: '1h'});

        return body.Answer ? '' : domain;
    }, {concurrency});

    const noAnswerFiltered = noAnswer.filter(Boolean).sort();
    return noAnswerFiltered.length > 0
        ? `Domains in lists without dns answer:\n\n${noAnswerFiltered.join('\n')}`
        : 'All domains in lists with dns answer';
};
