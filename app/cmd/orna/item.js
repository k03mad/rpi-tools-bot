'use strict';

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

    const json = {name: opts};
    let item;

    try {
        const res = await request.got(`${GUIDE_URL}/api/v1/item`, {method: 'POST', json});
        [item] = res.body;
    } catch (err) {
        if (err.response && err.response.body) {
            const {error} = JSON.parse(err.response.body);

            if (error) {
                return `${error}\n\n${JSON.stringify(json, 0, 2)}`;
            }
        }

        throw err;
    }

    const message = [
        `[${item.name}](${generateShowUrl(item.id)}) \\*${item.tier} ${item.type}`,
        '',
        item.description,
        '',
        `Dropped by: ${item.boss ? 'boss ' : ''}${item.dropped_by.map(elem => `[${elem.name}](${generateShowUrl(elem.id, 'monsters')})`).join(', ')}`,
        '',
        `Equipped by: ${item.equipped_by.map(elem => `[${elem.name}](${generateShowUrl(elem.id, 'classes')})`).join(', ')}`,
        '',
    ];

    const materials = await Promise.all(item.materials.map(async material => {
        const {body} = await request.cache(`${GUIDE_URL}/api/v1/item`, {method: 'POST', json: {id: material.id}});
        material.tier = body[0].tier;
        return material;
    }));

    message.push(
        `Materials: ${materials
            .sort((a, b) => b.tier - a.tier)
            .map(elem => `[${elem.name} *${elem.tier}](${generateShowUrl(elem.id)})`).join(', ')}`,
    );

    return {
        message: message.join('\n'),
        opts: {
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
        },
    };
};
