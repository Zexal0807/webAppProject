module.exports = {
    async getAllSexEntries(ctx) {
        try {
            const entries = await strapi.entityService.findMany('api::sex.sex');
            ctx.body = entries;
        } catch (err) {
            ctx.throw(500, err);
        }
    },
};
