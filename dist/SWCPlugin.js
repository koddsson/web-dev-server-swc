"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SWCPlugin = void 0;
const dev_server_core_1 = require("@web/dev-server-core");
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dom5_1 = require("@web/dev-server-core/dist/dom5");
const parse5_1 = require("parse5");
const core_1 = require("@swc/core");
async function fileExists(path) {
    try {
        await (0, util_1.promisify)(fs_1.default.access)(path);
        return true;
    }
    catch (_a) {
        return false;
    }
}
class SWCPlugin {
    constructor(swcConfig) {
        this.transformedHtmlFiles = [];
        this.name = 'SWC';
        this.swcConfig = swcConfig;
    }
    async serverStart({ config }) {
        this.config = config;
    }
    resolveMimeType(context) {
        const fileExtension = path_1.default.posix.extname(context.path);
        if (this.swcConfig.handledExtensions.includes(fileExtension)) {
            return 'js';
        }
    }
    async resolveImport({ source, context }) {
        const fileExtension = path_1.default.posix.extname(context.path);
        if (!this.swcConfig.tsFileExtensions.includes(fileExtension)) {
            // only handle typescript files
            return;
        }
        if (!source.endsWith('.js') || !source.startsWith('.')) {
            // only handle relative imports
            return;
        }
        // a TS file imported a .js file relatively, but they might intend to import a .ts file instead
        // check if the .ts file exists, and rewrite it in that case
        const filePath = (0, dev_server_core_1.getRequestFilePath)(context.url, this.config.rootDir);
        const fileDir = path_1.default.dirname(filePath);
        const importAsTs = source.substring(0, source.length - 3) + '.ts';
        const importedTsFilePath = path_1.default.join(fileDir, importAsTs);
        if (!(await fileExists(importedTsFilePath))) {
            return;
        }
        return importAsTs;
    }
    async transform(context) {
        let loader;
        if (context.response.is('html')) {
            // we are transforming inline scripts
            loader = 'js';
        }
        else {
            const fileExtension = path_1.default.posix.extname(context.path);
            loader = this.swcConfig.loaders[fileExtension];
        }
        if (!loader) {
            // we are not handling this file
            return;
        }
        const filePath = (0, dev_server_core_1.getRequestFilePath)(context.url, this.config.rootDir);
        if (context.response.is('html')) {
            this.transformedHtmlFiles.push(context.path);
            return this.__transformHtml(context, filePath, loader);
        }
        return this.__transformCode(context.body, filePath, loader);
    }
    async __transformHtml(context, filePath, loader) {
        const documentAst = (0, parse5_1.parse)(context.body);
        const inlineScripts = (0, dom5_1.queryAll)(documentAst, dom5_1.predicates.AND(dom5_1.predicates.hasTagName('script'), dom5_1.predicates.NOT(dom5_1.predicates.hasAttr('src')), dom5_1.predicates.OR(dom5_1.predicates.NOT(dom5_1.predicates.hasAttr('type')), dom5_1.predicates.hasAttrValue('type', 'module'))));
        if (inlineScripts.length === 0) {
            return;
        }
        for (const node of inlineScripts) {
            const code = (0, dom5_1.getTextContent)(node);
            const transformedCode = await this.__transformCode(code, filePath, loader);
            (0, dom5_1.setTextContent)(node, transformedCode);
        }
        return (0, parse5_1.serialize)(documentAst);
    }
    __getConfig(loader) {
        const typeScriptParser = { syntax: 'typescript' };
        const ecmaScriptParser = { syntax: 'ecmascript' };
        let parser = ecmaScriptParser;
        switch (loader) {
            case 'jsx':
                parser = ecmaScriptParser;
                parser.jsx = true;
                break;
            case 'ts':
                parser = typeScriptParser;
                parser.decorators = true;
                break;
            case 'tsx':
                parser = typeScriptParser;
                parser.tsx = true;
                break;
        }
        const transformOptions = {
            sourceMaps: 'inline',
            jsc: {
                parser,
                transform: {
                    react: {
                        pragma: this.swcConfig.jsxFactory,
                        pragmaFrag: this.swcConfig.jsxFragment, // 'React.Fragment',
                    },
                },
                target: this.swcConfig.target,
                loose: false,
                externalHelpers: false,
                // Requires v1.2.50 or upper and requires target to be es2016 or upper.
                keepClassNames: false,
            },
        };
        return transformOptions;
    }
    async __transformCode(code, filePath, loader) {
        try {
            const transformOptions = this.__getConfig(loader);
            transformOptions.filename = filePath;
            const { code: transformedCode } = await (0, core_1.transform)(code, transformOptions);
            return transformedCode;
        }
        catch (e) {
            if (Array.isArray(e.errors)) {
                const msg = e.errors[0];
                if (msg.location) {
                    throw new dev_server_core_1.PluginSyntaxError(msg.text, filePath, code, msg.location.line, msg.location.column);
                }
                throw new Error(msg.text);
            }
            throw e;
        }
    }
}
exports.SWCPlugin = SWCPlugin;
//# sourceMappingURL=SWCPlugin.js.map