module.exports = {
    async updateInstance(ctx) {
      const { id } = ctx.params;
      const { revision_date, note } = ctx.request.body;
  
      try {
        const updatedInstance = await strapi.entityService.update('api::test-execution.test-execution', id, {
          data: {
            revision_date,
            note,
          },
        });
  
        ctx.send({ data: updatedInstance });
      } catch (error) {
        ctx.throw(400, 'Errore durante l\'aggiornamento dell\'istanza');
      }
    },
  };
  