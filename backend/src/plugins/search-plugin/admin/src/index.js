import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import { Search } from '@strapi/icons';


import { auth } from '@strapi/helper-plugin';

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: Search,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: "Cerca test",
      },
      Component: async () => {
        const component = await import('./pages/App');

        return component;
      },
      permissions: [],
    });

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name: pluginId,
    });

    const user = auth.getUserInfo();

    if (!user)
      return;

    if (user.roles.find(r => r.name == 'Medico') != undefined) {
      // Hide plugins links
      const exludedLinks = [
        '/plugins/content-type-builder',
        '/plugins/upload',
        '/plugins/purchase-content-releases',
        '/plugins/cloud'
      ];
      app.menu = app.menu.filter(link => !exludedLinks.includes(link.to));
    }
  },

  bootstrap(app) { },
};
