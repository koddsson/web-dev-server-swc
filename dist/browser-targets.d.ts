declare type Release = {
  status: string;
};
export declare type Browser = {
  name: string;
  version: string;
};
export declare const TARGET_LATEST_MODERN: string[];
export declare const TARGET_LOWEST_ESM_SUPPORT: string[];
export declare function getLatestStableMajor(releases: Record<string, Release>): number | undefined;
export declare function isLatestSafari({ name, version }: Browser): boolean;
export declare function isLatestModernBrowser({ name, version }: Browser): boolean;
export {};
//# sourceMappingURL=browser-targets.d.ts.map