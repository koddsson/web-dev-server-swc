import { Plugin } from '@web/dev-server-core';
declare type Loader = unknown;
export interface EsBuildPluginArgs {
  target?: string | string[];
  js?: boolean;
  ts?: boolean;
  json?: boolean;
  jsx?: boolean;
  tsx?: boolean;
  jsxFactory?: string;
  jsxFragment?: string;
  loaders?: Record<string, Loader>;
  define?: {
    [key: string]: string;
  };
  tsconfig?: string;
}
export declare function swcPlugin(args?: EsBuildPluginArgs): Plugin;
export {};
//# sourceMappingURL=swcPluginFactor.d.ts.map
