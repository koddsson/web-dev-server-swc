'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isLatestModernBrowser =
  exports.isLatestSafari =
  exports.getLatestStableMajor =
  exports.TARGET_LOWEST_ESM_SUPPORT =
  exports.TARGET_LATEST_MODERN =
    void 0;
const browser_compat_data_1 = require('@mdn/browser-compat-data');
exports.TARGET_LATEST_MODERN = createModernTarget();
// earliest browser versions to support module scripts, dynamic imports and import.meta
exports.TARGET_LOWEST_ESM_SUPPORT = ['chrome64', 'edge79', 'firefox67', 'safari11.1'];
function createModernTarget() {
  try {
    const latestChrome = getLatestStableMajor(browser_compat_data_1.browsers.chrome.releases);
    if (!latestChrome) throw new Error('Could not find latest Chrome major version');
    const latestEdge = getLatestStableMajor(browser_compat_data_1.browsers.edge.releases);
    if (!latestEdge) throw new Error('Could not find latest Edge major version');
    const latestSafari = getLatestStableMajor(browser_compat_data_1.browsers.safari.releases);
    if (!latestSafari) throw new Error('Could not find latest Safari major version');
    const latestFirefox = getLatestStableMajor(browser_compat_data_1.browsers.firefox.releases);
    if (!latestFirefox) throw new Error('Could not find latest Firefox major version');
    return [
      `chrome${latestChrome - 1}`,
      `edge${latestEdge - 1}`,
      `safari${latestSafari}`,
      `firefox${latestFirefox}`,
    ];
  } catch (error) {
    throw new Error(
      `Error while initializing default browser targets for @web/dev-server-swc: ${error.message}`,
    );
  }
}
function getMajorVersion(version) {
  return Number(version.toString().split('.')[0]);
}
function getLatestStableMajor(releases) {
  var _a;
  const release =
    (_a = Object.entries(releases).find(([, release]) => release.status === 'current')) === null ||
    _a === void 0
      ? void 0
      : _a[0];
  if (release) {
    return getMajorVersion(release);
  }
  return undefined;
}
exports.getLatestStableMajor = getLatestStableMajor;
function isWithinRange(releases, version, range) {
  const currentMajorVersion = getMajorVersion(version);
  const latestMajorVersion = getLatestStableMajor(releases);
  if (latestMajorVersion == null) {
    return false;
  }
  return currentMajorVersion >= latestMajorVersion - range;
}
function isLatestSafari({ name, version }) {
  const nameLowerCase = name.toLowerCase();
  // don't use include to avoid matching safari iOS
  if (nameLowerCase === 'safari') {
    return isWithinRange(browser_compat_data_1.browsers.safari.releases, version, 0);
  }
  return false;
}
exports.isLatestSafari = isLatestSafari;
function isLatestModernBrowser({ name, version }) {
  const nameLowerCase = name.toLowerCase();
  if (['chrome', 'chromium'].some(name => nameLowerCase.includes(name))) {
    return isWithinRange(browser_compat_data_1.browsers.chrome.releases, version, 1);
  }
  if (nameLowerCase.includes('edge')) {
    return isWithinRange(browser_compat_data_1.browsers.edge.releases, version, 1);
  }
  if (nameLowerCase.includes('firefox')) {
    return isWithinRange(browser_compat_data_1.browsers.firefox.releases, version, 0);
  }
  return false;
}
exports.isLatestModernBrowser = isLatestModernBrowser;
//# sourceMappingURL=browser-targets.js.map
