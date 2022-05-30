'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.swcPlugin = void 0;
const SWCPlugin_1 = require('./SWCPlugin');
function swcPlugin(args = {}) {
  var _a;
  const target = (_a = args.target) !== null && _a !== void 0 ? _a : 'es2022';
  const loaders = {};
  if (args.ts) {
    loaders['.ts'] = 'ts';
  }
  if (args.jsx) {
    loaders['.jsx'] = 'jsx';
  }
  if (args.tsx) {
    loaders['.tsx'] = 'tsx';
  }
  if (args.js) {
    loaders['.js'] = 'js';
  }
  if (!Object.prototype.hasOwnProperty.call(loaders, '.js')) {
    loaders['.js'] = 'js';
  }
  const handledExtensions = Object.keys(loaders);
  const tsFileExtensions = [];
  for (const [extension, loader] of Object.entries(loaders)) {
    if (loader === 'ts' || loader === 'tsx') {
      tsFileExtensions.push(extension);
    }
  }
  return new SWCPlugin_1.SWCPlugin({
    loaders,
    target,
    handledExtensions,
    tsFileExtensions,
    jsxFactory: args.jsxFactory,
    jsxFragment: args.jsxFragment,
  });
}
exports.swcPlugin = swcPlugin;
//# sourceMappingURL=swcPluginFactory.js.map
