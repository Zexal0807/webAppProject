'use strict';

/**
 * test-execution controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::test-execution.test-execution');
