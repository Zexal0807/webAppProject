'use strict';

/**
 * test-execution router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::test-execution.test-execution');
