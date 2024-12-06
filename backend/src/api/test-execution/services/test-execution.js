'use strict';

/**
 * test-execution service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::test-execution.test-execution');
