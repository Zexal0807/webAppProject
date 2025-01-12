module.exports = { 
    routes: [
        {
            method: 'POST',
            path: '/test-executions',
            handler: 'test-execution.create',
            config: {
                auth: false, 
            },
        },
        {
            method: 'PUT',
            path: '/test-executions/:id',
            handler: 'test-execution.updateInstance',
            config: {
                auth: false, 
            },
        },
    ],
};
