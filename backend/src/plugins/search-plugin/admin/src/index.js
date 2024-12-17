import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import { Search } from '@strapi/icons';

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
  },

  bootstrap(app) {},
};
