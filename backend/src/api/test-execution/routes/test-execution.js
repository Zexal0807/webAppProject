module.exports = {
    routes: [
        {
            method: 'PUT',
            path: '/test-execution/:id',
            handler: 'test-execution.updateInstance',
            config: {
                auth: false
            },
        },
    ],
};