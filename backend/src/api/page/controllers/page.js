'use strict';

/**
 * page controller
 */

// const { createCoreController } = require('@strapi/strapi').factories;

module.exports = {
    async findPageBySlug(ctx) {
      const { slug } = ctx.params;
  
      // Esegui una query sulla collection Page
      const page = await strapi.entityService.findMany('api::page.page', {
        filters: { slug },
        populate: {
          layouts: {
            populate: {
              content1: true,
              content2: true,
              content3: true
            }
          }
        }
      });
  
      if (!page || page.length === 0) {
        return ctx.notFound('Page not found');
      }
  
      return page[0]; // Restituisci la prima corrispondenza
    },
  };
  