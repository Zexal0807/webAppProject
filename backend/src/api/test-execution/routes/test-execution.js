module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/test-execution/:id',
            handler: 'test-execution.updateInstance',
            config: {
                auth: false
'use strict';

/**
 * test-execution router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::test-execution.test-execution');
            },
        },
    ],
};
