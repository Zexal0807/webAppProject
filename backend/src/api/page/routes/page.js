'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/pages',
      handler: 'page.find',
      config: {
        auth: false
        // { 
        //   scope: ['find', 'findMany','findOne']
        // }
      }
    },
    {
      method: 'GET',
      path: '/page/:pageId',
      handler: 'page.findPageBySlug',
      config: {
        auth: false
        // { 
        //   scope: ['find', 'findMany', 'findOne'] // Specifica l'azione richiesta
        // }
      },
    },
  ],
};
