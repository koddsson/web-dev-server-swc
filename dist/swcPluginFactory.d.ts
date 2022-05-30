import { Plugin } from '@web/dev-server-core';
import { JscTarget } from '@swc/core';
export interface SWCPluginArgs {
  target?: JscTarget;
  js?: boolean;
  ts?: boolean;
  jsx?: boolean;
  tsx?: boolean;
  jsxFactory?: string;
  jsxFragment?: string;
  define?: {
    [key: string]: string;
  };
}
export declare function swcPlugin(args?: SWCPluginArgs): Plugin;
//# sourceMappingURL=swcPluginFactory.d.ts.map
