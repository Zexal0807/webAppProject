'use strict';

module.exports = {
  async search(ctx) {
    try {
      const { query } = ctx.request.query;

      // Esempio di ricerca nella collection 'test'
      const results = await strapi.entityService.findMany('api::test-execution.test-execution', {
        filters: {
          code: {
            $containsi: query,
          },
        },
        populate: {
          sex: true,
          test: {
            questions: true
          }
        }
      });

      ctx.send({ data: results });
    } catch (err) {
      ctx.badRequest('Error during search', err);
    }
  },
};
