import { Context, Plugin, Logger, DevServerCoreConfig } from '@web/dev-server-core';
import { JscTarget } from '@swc/core';
declare type Loader = unknown;
export interface SWCConfig {
  loaders: Record<string, Loader>;
  target: JscTarget;
  handledExtensions: string[];
  tsFileExtensions: string[];
  jsxFactory?: string;
  jsxFragment?: string;
}
export declare class SWCPlugin implements Plugin {
  private config?;
  private swcConfig;
  private transformedHtmlFiles;
  name: string;
  constructor(swcConfig: SWCConfig);
  serverStart({ config }: { config: DevServerCoreConfig; logger: Logger }): Promise<void>;
  resolveMimeType(context: Context): 'js' | undefined;
  resolveImport({
    source,
    context,
  }: {
    source: string;
    context: Context;
  }): Promise<string | undefined>;
  transform(context: Context): Promise<string | undefined>;
  private __transformHtml;
  private __getConfig;
  private __transformCode;
}
export {};
//# sourceMappingURL=SWCPlugin.d.ts.map
