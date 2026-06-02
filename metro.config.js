const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'jspdf') {
    return (originalResolveRequest ?? context.resolveRequest)(
      context,
      'jspdf/dist/jspdf.es.min.js',
      platform,
    );
  }

  return (originalResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
