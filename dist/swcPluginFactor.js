'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.swcPlugin = void 0;
const SWCPlugin_1 = require('./SWCPlugin');
function swcPlugin(args = {}) {
  var _a, _b;
  const target = (_a = args.target) !== null && _a !== void 0 ? _a : 'auto';
  const loaders = {};
  for (const [key, value] of Object.entries(
    (_b = args.loaders) !== null && _b !== void 0 ? _b : {},
  )) {
    loaders[key.startsWith('.') ? key : `.${key}`] = value;
  }
  if (args.ts) {
    loaders['.ts'] = 'ts';
  }
  if (args.jsx) {
    loaders['.jsx'] = 'jsx';
  }
  if (args.tsx) {
    loaders['.tsx'] = 'tsx';
  }
  if (args.json) {
    loaders['.json'] = 'json';
  }
  if (args.js) {
    loaders['.js'] = 'js';
  }
  if (
    !Object.prototype.hasOwnProperty.call(loaders, '.js') &&
    (typeof args.target === 'string' || Array.isArray(args.target))
  ) {
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
    define: args.define,
    tsconfig: args.tsconfig,
  });
}
exports.swcPlugin = swcPlugin;
//# sourceMappingURL=swcPluginFactor.js.map