module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/sex',
            handler: 'sex.getAllSexEntries',
            config: {
                auth: false
            },
        },
    ],
};
