module.exports = {
    async getRandomEntry(ctx) {
        try {
            // Recupera solo le entries pubblicate
            const entries = await strapi.entityService.findMany('api::test.test', {
                filters: { publishedAt: { $notNull: true } }, // Solo le pubblicate
                populate: {
                    questions: {
                        populate: {
                            answers: true
                        }
                    }
                }
            });

            if (!entries || entries.length === 0) {
                return ctx.notFound('No published entries found.');
            }

            // Seleziona una entry casuale
            const randomEntry = entries[Math.floor(Math.random() * entries.length)];

            ctx.body = randomEntry;
        } catch (err) {
            ctx.throw(500, err.message);
        }
    },
};
