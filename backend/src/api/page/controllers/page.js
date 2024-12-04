'use strict';

/**
 * page controller
 */

module.exports = {
    async findPageBySlug(ctx) {
        const { slug } = ctx.params;

        try {
            const page = await strapi.entityService.findMany('api::page.page', {
                filters: { slug },
                populate: {
                    layouts: {
                        populate: {
                            content1: {
                                populate: {
                                    members: true,
                                    tableTimes: {
                                        populate: {
                                            day: true,
                                            startTime: true,
                                            endTime: true,
                                        },
                                    },
                                    image: true, // Popolazione semplice per il campo immagine
                                },
                            },
                            content2: true,
                            content3: true,
                        },
                    },
                },
            });

            if (!page || page.length === 0) {
                return ctx.notFound('Page not found');
            }

            return page[0]; // Restituisci la prima corrispondenza
        } catch (error) {
            strapi.log.error('Errore in findPageBySlug:', error);
            return ctx.internalServerError('Errore nel recupero della pagina.');
        }
    },
};
