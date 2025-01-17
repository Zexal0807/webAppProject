module.exports = {
    // Metodo per creare una nuova istanza
    async create(ctx) {
        let { data } = ctx.request.body;
        data.IP = ctx.request.ip;

        try {
            const newInstance = await strapi.entityService.create('api::test-execution.test-execution', {
                data
            });

            ctx.send({ data: newInstance });
        } catch (error) {
            console.error("Errore durante la creazione dell'istanza:", error);
            ctx.throw(400, 'Errore durante la creazione dell\'istanza');
        }
    },
    // Metodo per aggiornare una istanza
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
