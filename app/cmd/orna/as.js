'use strict';

const asTable = require('as-table');
const {request} = require('utils-mad');

/**
 * @param {string} opts
 * @returns {Promise<string>}
 * https://orna.guide/gameplay?show=16
 */
module.exports = async opts => {
    const GUIDE_URL = 'https://orna.guide';

    /**
     * @param {string|number} id
     * @param {string} type
     * @returns {string}
     */
    const generateShowUrl = (id, type = 'items') => `${GUIDE_URL}/${type}?show=${id}`;

    const mapping = {
        lvl: 'level',
        hp: 'hp',
        mp: 'mana',
        att: 'attack',
        mag: 'magic',
        def: 'defense',
        res: 'resistance',
        dex: 'dexterity',
        ward: 'ward',
        crit: 'crit',
    };

    const statsNames = Object.keys(mapping);

    if (!opts || !opts.includes(' ') || !opts.match(statsNames.join('|'))) {
        return [
            'Something wrong with stats, example: balor armor def 404 res 40',
            `Supported stats: ${statsNames.join(', ')}`,
        ].join('\n');
    }

    const name = [];
    let body, json, nameEnd;

    const prepareData = opts
        .split(' ')
        .map(stat => {
            if (!statsNames.includes(stat) && !nameEnd) {
                name.push(stat);
                return '';
            }

            nameEnd = true;
            return Number(stat) || mapping[stat] || stat;
        })
        .filter(Boolean);

    if (name.length > 0) {
        json = {name: name.join(' ')};
    } else {
        return 'Something wrong with item name, example: balor leggings def 386 res 34';
    }

    for (let i = 0; i < prepareData.length; i += 2) {
        json[prepareData[i]] = prepareData[i + 1];
    }

    try {
        ({body} = await request.got(`${GUIDE_URL}/api/v1/assess`, {method: 'POST', json}));
    } catch (err) {
        if (err.response && err.response.body) {
            const {error} = JSON.parse(err.response.body);

            if (error) {
                return `${error}\n\n${JSON.stringify(json, 0, 2)}`;
            }
        }

        throw err;
    }

    const stats = Object.entries(body.stats).map(([stat, data]) => {
        const df = data.values.pop();
        const mf = data.values.pop();
        const l10 = data.values.pop();

        return {'': stat, l10, mf, df};
    });

    return [
        {
            message: [
                `[${body.name}](${generateShowUrl(body.id)}) \\*${body.tier} ${body.quality * 100}%`,
                `\n${body.description}\n`,
                `Type: ${body.type}`,
                `Dropped by: ${body.boss ? 'boss ' : ''}${body.dropped_by.map(elem => `[${elem.name}](${generateShowUrl(elem.id, 'monsters')})`).join(', ')}`,
                `Equipped by: ${body.equipped_by.map(elem => `[${elem.name}](${generateShowUrl(elem.id, 'classes')})`).join(', ')}`,
                `Materials: ${body.materials.map(elem => `[${elem.name}](${generateShowUrl(elem.id)})`).join(', ')}`,
            ].join('\n'),
            opts: {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
            },
        },
        asTable(stats),
    ];
};
