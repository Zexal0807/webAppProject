module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/test',
            handler: 'test.getRandomEntry',
            config: {
                auth: false, // Imposta su true se vuoi autenticare l'accesso
            },
        },
    ],
};
