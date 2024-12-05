'use strict';

/**
 * page router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/pages',
        handler: 'page.find',
        config: {
          auth: false,
        }
      },
      {
        method: 'POST',
        path: '/find-page',
        handler: 'page.findPageBySlug',
        config: {
          auth: false,
        },
      },
    ],
  };
  