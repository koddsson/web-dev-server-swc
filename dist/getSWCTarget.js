'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getEsbuildTarget = void 0;
const parseUserAgent_1 = require('./parseUserAgent');
const browser_targets_1 = require('./browser-targets');
const cache = new Map();
function getTargetForUserAgent(target, userAgent) {
  const browser = parseUserAgent_1.parseUserAgent(userAgent);
  if (typeof browser.name === 'string' && typeof browser.version === 'string') {
    if (target === 'auto') {
      if (browser_targets_1.isLatestModernBrowser(browser)) {
        // skip compiling on latest chrome/firefox/edge
        return 'esnext';
      }
      if (browser_targets_1.isLatestSafari(browser)) {
        // we don't skip safari, but we also don't want to compile to the lowest common denominator
        return `safari${browser.version}`;
      }
    }
    if (target === 'auto-always') {
      if (
        browser_targets_1.isLatestModernBrowser(browser) ||
        browser_targets_1.isLatestSafari(browser)
      ) {
        // compile to JS compatible with latest chrome/firefox/edge/safari
        return browser_targets_1.TARGET_LATEST_MODERN;
      }
    }
  }
  // fall back to compiling to the lowest compatible with browsers that support es modules
  return browser_targets_1.TARGET_LOWEST_ESM_SUPPORT;
}
function getEsbuildTarget(targets, userAgent) {
  const target =
    typeof targets === 'string' ? targets : targets.length === 1 ? targets[0] : undefined;
  if (!target || !['auto-always', 'auto'].includes(target)) {
    // user has defined one or more targets that is not auto, so compile to this target directly
    return targets;
  }
  if (userAgent == null) {
    // user has auto but there is no user agent, fall back to the lowest compatible with browsers that support es modules
    return browser_targets_1.TARGET_LOWEST_ESM_SUPPORT;
  }
  const cached = cache.get(userAgent);
  if (cached != null) {
    return cached;
  }
  const targetForUserAgent = getTargetForUserAgent(target, userAgent);
  cache.set(userAgent, targetForUserAgent);
  return targetForUserAgent;
}
exports.getEsbuildTarget = getEsbuildTarget;
//# sourceMappingURL=getSWCTarget.js.map