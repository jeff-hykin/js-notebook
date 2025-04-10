import { passAlongProps, Elemental, html as html$3 } from 'https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js';
import { Column, Button, Row, components } from 'https://esm.sh/gh/jeff-hykin/good-component@0.3.5/elements.js';
import 'https://esm.sh/gh/jeff-hykin/good-component@0.3.5/main/animations.js';
import { mergeStyles, removeAllChildElements } from 'https://esm.sh/gh/jeff-hykin/good-component@0.3.5/main/helpers.js';
import 'https://esm.sh/gh/jeff-hykin/good-component@0.3.5/main/actions.js';
import 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js';
import { zip } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_camel_case.js';
import { toKebabCase } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_kebab_case.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/path_pieces.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/zip.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js';
import { isValidIdentifier } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.1.0/source/flattened/is_valid_identifier.js';
import { toRepresentation } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.0/source/flattened/to_representation.js';
import { Event as Event$1, trigger } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/events.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/get.js';
import { set } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/set.js';
import { remove } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/remove.js';
import { merge } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/merge.js';
import { parserFromWasm } from 'https://esm.sh/gh/jeff-hykin/deno-tree-sitter@0.2.8.4/main.js';
import javascript$2 from 'https://esm.sh/gh/jeff-hykin/common_tree_sitter_languages@1.3.1.1/main/javascript.js';
import { dump, load } from 'https://esm.sh/js-yaml@4.1.0/';
import { Editor } from 'https://esm.sh/@toast-ui/editor@3.2.2';
import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/main.js';
import atomOne from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/themes/atomone.js';

true&&(function polyfill() {
    const relList = document.createElement('link').relList;
    if (relList && relList.supports && relList.supports('modulepreload')) {
        return;
    }
    for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
    }
    new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'LINK' && node.rel === 'modulepreload')
                    processPreload(node);
            }
        }
    }).observe(document, { childList: true, subtree: true });
    function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity)
            fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy)
            fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === 'use-credentials')
            fetchOpts.credentials = 'include';
        else if (link.crossOrigin === 'anonymous')
            fetchOpts.credentials = 'omit';
        else
            fetchOpts.credentials = 'same-origin';
        return fetchOpts;
    }
    function processPreload(link) {
        if (link.ep)
            // ep marker = processed
            return;
        link.ep = true;
        // prepopulate the load record
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
    }
}());

function focusOn(element) {
    const tabIndex = element.getAttribute("tabindex");
    element.setAttribute("tabindex", "-1");
    element.focus();
    element.setAttribute("tabindex", tabIndex);
}

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    // @ts-expect-error true will be replaced with boolean later
    if (true && deps && deps.length > 0) {
        const links = document.getElementsByTagName('link');
        promise = Promise.all(deps.map((dep) => {
            // @ts-expect-error assetsURL is declared before preload.toString()
            dep = assetsURL(dep);
            if (dep in seen)
                return;
            seen[dep] = true;
            const isCss = dep.endsWith('.css');
            const cssSelector = isCss ? '[rel="stylesheet"]' : '';
            const isBaseRelative = !!importerUrl;
            // check if the file is already preloaded by SSR markup
            if (isBaseRelative) {
                // When isBaseRelative is true then we have `importerUrl` and `dep` is
                // already converted to an absolute URL by the `assetsURL` function
                for (let i = links.length - 1; i >= 0; i--) {
                    const link = links[i];
                    // The `links[i].href` is an absolute URL thanks to browser doing the work
                    // for us. See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes:idl-domstring-5
                    if (link.href === dep && (!isCss || link.rel === 'stylesheet')) {
                        return;
                    }
                }
            }
            else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
            }
            const link = document.createElement('link');
            link.rel = isCss ? 'stylesheet' : scriptRel;
            if (!isCss) {
                link.as = 'script';
                link.crossOrigin = '';
            }
            link.href = dep;
            document.head.appendChild(link);
            if (isCss) {
                return new Promise((res, rej) => {
                    link.addEventListener('load', res);
                    link.addEventListener('error', () => rej(new Error(`Unable to preload CSS for ${dep}`)));
                });
            }
        }));
    }
    return promise
        .then(() => baseModule())
        .catch((err) => {
        const e = new Event('vite:preloadError', { cancelable: true });
        // @ts-expect-error custom payload
        e.payload = err;
        window.dispatchEvent(e);
        if (!e.defaultPrevented) {
            throw err;
        }
    });
};

// import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingKebabCase, toScreamingSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/string.js"

// FIXME: import defaul doesn't work without {}'s
// FIXME: detect destructured top level assignments for auto-export

const parser = await parserFromWasm(javascript$2); // path or Uint8Array

/**
 * switch imports to a require statement for shimming
 *
 * @example
 * ```js
 * console.log(convertImports(`
 *     import { isValidIdentifier } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.4.0/source/flattened/is_valid_identifier.js"
 *     import { foo } from "bar"
 *     import { foo as bar } from "bar"
 *     import * as foo from "bar"
 *     import "bar"
 *     require("side_effect/bar")
 *     var a = require("bar/normal")
 * `))
 * // output:
 * //     var {foo} = await require("bar")
 * //     var {foo:bar} = await require("bar")
 * //     var foo = await require("bar")
 * //     await require("bar")
 * //     await require("side_effect/bar")
 * //     var a = await require("bar/normal")
 * ```
 *
 * @param arg1 - description
 * @param arg1.parameter - description
 * @returns {Object} output - description
 * @returns output.x - description
 *
 */
function convertImports(code) {
    let stuffToExport = [];
    const root = parser.parse(code).rootNode;
    const maxResultDepth = 5; // NOTE: this not as limiting as it seems: we only need to find top-level require statements, all the others will be handled by a different query
                                //       it might be legitmately impossible to have a top level require that is deeper than this
    const handledStatements = [
        // require
        ...[
            ...root.quickQuery(`((call_expression (identifier) @funcCallName)  (#eq? @funcCallName "require"))`, { maxResultDepth }),
        ].map(each=>({...each, importType: 'normalRequire',})),
        
        // 
        // ES import
        // 
        ...[
            // ES import (all different types)
            ...root.quickQuery(`(import_statement (string) @importPath) @statement`, { maxResultDepth: maxResultDepth+1 }),
        ].map(each=>({...each, importType: 'esImport'})),
    ];
    
    const nodes = handledStatements.sort((a,b)=>(a.statement||a.funcCallName).startIndex-(b.statement||b.funcCallName).startIndex);
    const codeChunks = [];
    let previousIndex = 0;
    for (let { funcCallName, importPath, importType, statement } of nodes) {
        statement = statement || funcCallName;
        codeChunks.push(
            code.slice(previousIndex, statement.startIndex)
        );
        previousIndex = statement.endIndex;
        
        // 
        // require
        // 
        if (importType === "normalRequire") {
            codeChunks.push(
                `await require`
            );
        // 
        // es import
        // 
        } else if (importType === "esImport") {
            const text = statement.text;
            // import type: side effect
            if (text.match(/^\s*import\s*("|').+\1\s*$/)) {
                codeChunks.push(
                    `await require(${importPath.text})`
                );
            } else {
                const importClause = statement.children.find(each=>each.type === "import_clause");
                let output = "var ";
                for (let each of importClause.children) {
                    if (each.type === "ERROR") {
                        each = each.children[0];
                    }
                    if (each.type === ",") {
                        continue
                    }
                    if (each.type === "from") {
                        break
                    }
                    // default import
                    if (each.type === "identifier") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <identifier text="loadConfigFile_js" />
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./shared/loadConfigFile.js" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        // TODO: might need to be equal to default, unclear
                        output += ` ${each.text} = `;
                    } else if (each.type === "namespace_import") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <namespace_import>
                        //             <"*" text="*" />
                        //             <as text="as" />
                        //             <identifier text="thing79" />
                        //         </namespace_import>
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./bundle-url" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        output += ` ${each.children[2].text} = `;
                    } else if (each.type === "named_imports") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <named_imports>
                        //            <"{" text="{" />
                        //            <import_specifier>
                        //                <identifier text="thing79a" />
                        //            </import_specifier>
                        //            <"," text="," />
                        //            <import_specifier>
                        //                <identifier text="thing79b" />
                        //                <as text="as" />
                        //                <identifier text="thing79c" />
                        //            </import_specifier>
                        //            <"}" text="}" />
                        //         </named_imports>
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./bundle-url" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        for (let eachInner of each.children) {
                            if (eachInner.type === "import_specifier") {
                                output += eachInner.children.map(each=>each.type == "as"? ":" : each.text).join("");
                            } else if (eachInner.type === "as") {
                                output += ":";
                            } else {
                                output += eachInner.text;
                            }
                        }
                        output += " = ";
                    }
                }
                output = output.replace(/\s+/g, " ");
                output += `await require(${importPath.text})`;
                codeChunks.push(
                    output
                );
            }
        } else {
            codeChunks.push(
                statement.text
            );
        }
    }
    codeChunks.push(
        code.slice(previousIndex, code.length)
    );

    const output = codeChunks.join("");
    const newRoot = parser.parse(output).rootNode;
    // what to export
    for (let each of [
        // let/const
        ...newRoot.quickQuery(`((lexical_declaration (variable_declarator (identifier) @varName )) @statement)`, { maxResultDepth }),
        ...newRoot.quickQuery(`((variable_declaration (variable_declarator (identifier) @varName )) @statement)`, { maxResultDepth }),
    ]) {
        stuffToExport.push(each.varName.text);
    }

    return output + `;return {${stuffToExport.join(",")}}`
}

const { console: console$1, Math: Math$1, Date, setTimout, setInterval, clearTimeout, clearInterval, fetch: fetch$1, Uint8Array, Map, Set: Set$1, URL: URL$1, WebAssembly, Array: Array$1, Number, Symbol: Symbol$1, Promise: Promise$1, RegExp, Error: Error$1, document: document$1 } = globalThis;
const elementLogger = (element, tag, ...args)=>{
    const el = document$1.createElement("p");
    el.classList.add(`console-${tag}`);
    el.innerText = args.map((each)=>{
        if (typeof each == "string") {
            return each
        } else {
            return toRepresentation(each)
        }
    }).join(" ");
    element.append(el);
};
const consoleElement = {
    $element: null,
    assert: console$1.assert,
    clear: console$1.clear,
    count: console$1.count,
    countReset: console$1.countReset,
    debug: console$1.debug,
    dir: console$1.dir,
    dirxml: console$1.dirxml,
    error: function(...args){
        if (this.$element) {
            elementLogger(this.$element, "error", ...args);
        } else {
            console$1.error(...args);
        }
    },
    exception: console$1.exception,
    group: console$1.group,
    groupCollapsed: console$1.groupCollapsed,
    groupEnd: console$1.groupEnd,
    info: console$1.info,
    log: function(...args){
        if (this.$element) {
            elementLogger(this.$element, "log", ...args);
        } else {
            console$1.log(...args);
        }
    },
    profile: console$1.profile,
    profileEnd: console$1.profileEnd,
    table: console$1.table,
    time: console$1.time,
    timeEnd: console$1.timeEnd,
    timeLog: console$1.timeLog,
    timeStamp: console$1.timeStamp,
    trace: console$1.trace,
    warn: function(...args){
        if (this.$element) {
            elementLogger(this.$element, "warn", ...args);
        } else {
            console$1.warn(...args);
        }
    },
};
const builtins = {
    "console": consoleElement,
    "Math": {
        random: ()=>Math$1.random(),
    },
    "require": (path)=>{
        if (path.startsWith("https://") || path.startsWith("http://")) {
            return __vitePreload(() => import(path),true?__vite__mapDeps([]):void 0)
        } else {
            return __vitePreload(() => import(`https://esm.sh/${path}`),true?__vite__mapDeps([]):void 0)
        }
    },
    ...globalThis,
};

const makeRuntime = ({ randomSeed, }={}) => {
    const runtime = {...builtins};
    runtime.globalThis = runtime;
    return runtime
};

/**
 * @example
 * ```js
 * let runtime = { console: { log: (...args)=>console.log("ha!", ...args) } }
 * await runCode({
 *     code: `
 *         console.log("hello")
 *         return { foo: "bar" }
 *     `,
 *     runtime,
 *     outputElement: null,
 * })
 * console.log("final runtime is:", runtime)
 * ```
 */
const runCode = async ({ code, runtime, outputElement }) => {
    code = convertImports(code);
    // global overrides
    runtime.globalThis = runtime.globalThis || runtime;
    runtime.$out = outputElement;
    runtime.console = { ...consoleElement, ...runtime.console };
    runtime.console.$element = outputElement;

    const variableNames = [
        ...new Set$1(
            Object.keys(runtime).concat(
                Object.keys(globalThis)
            )
        )
    ].filter(isValidIdentifier);
    let newCode = `({${variableNames.join(", ")}})=>((async function() {"use strict"; ${code}
        ;})())`;
    // console.debug(`code is:`,newCode)
    let cellAsFunction;
    try {
        // run a non-local eval, so there are no variable leaks
        cellAsFunction = eval?.(newCode);
    } catch (error) {
        // basically only syntax errors are possible here
        return {
            syntaxError: error,
        }
    }
    try {
        Object.assign(runtime, await cellAsFunction(runtime));
    } catch (error) {
        return {
            runtimeError: error,
        }
    }
    return {}
};

const yaml$1 = { stringify: dump, parse: load };

// NOTE: despite mentioning a theme, this whole file should be completely usable without a browser/DOM
const defaultTheme = {
    name: "default-dark",
    // background: "#546E7A",
    background: "#121212",
    foreground: "white",
    secondaryForeground: "whitesmoke",
    // secondaryBackground: "#272c35",
    secondaryBackground: "#292e37",
    // green: "turquoise",
    green: "#349a90",
    // red: "salmon",
    red: "#ba6d64",
    // blue: "cornflowerblue",
    blue: "cornflowerblue",
    yellow: "#E5C07B",
    accent: "rgba(3,105,161)",

    normalButton: "#3d5072",
    
    "markdownDarkCharcoal": "#121212",
    "markdownCharcoalGray": "#232428",
    "markdownSlateGray": "#292e37",
    "markdownTealSlate": "#2b4455",
    "markdownDarkSlate": "#2d2f34",
    "markdownCharcoalDark": "#303135",
    "markdownStormGray": "#303238",
    "markdownDeepMaroon": "#35262a",
    "markdownGraphiteGray": "#36383f",
    "markdownMutedWine": "#392d31",
    "markdownDarkSilver": "#393b42",
    "markdownDeepStone": "#3a3c42",
    "markdownBlueGray": "#3c424d",
    "markdownAshGray": "#494c56",
    "markdownSteelGray": "#535662",
    "markdownShadowGray": "#55575f",
    "markdownMistGray": "#595c68",
    "markdownDustyBlue": "#757a86",
    "markdownFogGray": "#777980",
    "markdownCoolGray": "#8f939f",
    "markdownSilverGray": "#969aa5",
    "markdownLightGray": "#9a9da3",
    "markdownLightSilver": "#aaa",
    "markdownSoftSilver": "#b3b5bc",
    "markdownLightIvory": "#eee",
    "markdownPureWhite": "#fff",
    "markdownDeepBlue": "#1f70de",
    "markdownOceanBlue": "#327491",
    "markdownSkyBlue": "#32baff",
    "markdownSoftBlue": "#4b96e6",
    "markdownLightTeal": "#65acca",
    "markdownPaleBlue": "#67ccff",
    "markdownRosePink": "#c1798b",
    "markdownCoralRed": "#ef6767",
};

class StateManager {
    constructor({
        jsonCellSystem,
        loadStateCallbacks=[],
        stateChangeCallbacks=[],
        onError=(message, error, source,)=>console.error(message),
    }={}) {
        let { config, theme, cells, fileSystemData, } = structuredClone(jsonCellSystem||{});
        this._config = config || {};
        this._theme = {...theme,...defaultTheme};
        this._fileSystemData = fileSystemData || {};

        this._initStackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        this.runtime = makeRuntime();
        this.activeState = structuredClone({
            cells: cells||[],
        });
        this.prevState = structuredClone(this.activeState);
        this.loadStateCallbacks = new Set([...loadStateCallbacks]);
        this.stateChangeCallbacks = new Set([...stateChangeCallbacks]);
    }
    
    // 
    // config
    // 
    configChange = new Event$1()
    get config() { return Object.freeze(structuredClone(this._config))  }
    set config(value) {
        if (!(value instanceof Object)) {
            throw new TypeError(`config must be an object`)
        }
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.configChange, {keyList:[], value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setter of config`})
        );
        this._config = structuredClone(value);
    }
    setConfig(keyList, value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.configChange, {keyList, value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setConfig`})
        );
        set({ keyList, on: this._config, to: value});
    }
    removeConfig(keyList) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.configChange, {keyList, value: undefined, action: "remove"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `removeConfig`})
        );
        remove({ keyList, from: this._config});
    }
    mergeConfig(value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        if (!(value instanceof Object)) {
            throw new TypeError(`config must be an object`)
        }
        trigger(this.configChange, {keyList: [], value, action: "merge"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `mergeConfig`})
        );
        this._config = merge({ oldData: this._config, newData: value});
    }
    
    // 
    // theme
    // 
    themeChange = new Event$1()
    get theme() { return Object.freeze(structuredClone(this._theme))  }
    set theme(value) {
        if (!(value instanceof Object)) {
            throw new TypeError(`theme must be an object`)
        }
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.themeChange, {keyList:[], value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setter of theme`})
        );
        this._theme = structuredClone(value);
    }
    setTheme(keyList, value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.themeChange, {keyList, value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setTheme`})
        );
        set({ keyList, on: this._theme, to: value});
    }
    removeTheme(keyList) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        trigger(this.themeChange, {keyList, value: undefined, action: "remove"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `removeTheme`})
        );
        remove({ keyList, from: this._theme});
    }
    mergeTheme(value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim();
        if (!(value instanceof Object)) {
            throw new TypeError(`theme must be an object`)
        }
        trigger(this.themeChange, {keyList: [], value, action: "merge"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `mergeTheme`})
        );
        this._theme = merge({ oldData: this._theme, newData: value});
    }
    
    // 
    // serializing
    // 
    toYaml() {
        return yaml$1.stringify({
            config: this._config,
            theme: this._theme,
            fileSystemData: this._fileSystemData,
            cells: this.activeState.cells,
        })
    }
    themeToCssString() {
        let styleChunks = [];
        for (const [key, value] of Object.entries(this._theme)) {
            styleChunks.push(`--theme-${toKebabCase(key)}: ${value};`);
        }
        return styleChunks.join("\n")
    }
    getCodeMirrorTheme() {
        return {settings: structuredClone(this._theme)}
    }

    // 
    // serial events
    // 
    
    // listener
    onLoadState(callback) {
        this.loadStateCallbacks.add(callback);
        return this.loadStateCallbacks.size-1
    }

    // trigger
    loadDataFromYaml(yamlString) {
        let obj = yaml$1.parse(yamlString);
        if (!(obj?.cells instanceof Array)) {
            obj = {
                cells: [],
            };
        }
        for (const [key, value] of Object.entries(obj)) {
            delete this.activeState[key];
        }
        Object.assign(this.activeState, obj);
        this.prevState = structuredClone(this.activeState);
        let returnVals = [];
        for (let each of new Set([...this.loadStateCallbacks, ...this.stateChangeCallbacks])) {
            try {
                returnVals.push(each(this.activeState));
            } catch (error) {
                console.error(error?.stack||error);
            }
        }
        return returnVals
    }
    
    // listener
    onStateChange(callback) {
        this.stateChangeCallbacks.add(callback);
        return this.stateChangeCallbacks.size-1
    }
    // trigger
    _activeStateWasUpdated() {
        // ensure the new state is yaml-able
        try {
            this.toYaml(); // attempt trigger error 
            this.prevState = structuredClone(this.activeState);
        } catch (error) {
            const stateClone = structuredClone(this.prevState);
            for (const [key, value] of Object.entries(this.activeState)) {
                delete this.activeState[key];
            }
            Object.assign(this.activeState, stateClone);
            throw error
        }
        let returnVals = [];
        for (let each of this.stateChangeCallbacks) {
            try {
                returnVals.push(each(this.activeState));
            } catch (error) {
                console.error(error?.stack||error);
            }
        }
        return returnVals
    }
    getCellFromId(cellId) {
        for (const each of this.activeState.cells) {
            if (each.cellId == cellId) {
                return each
            }
        }
        return {}
    }
    injectCellAfter({existingCell, cellToInject}) {
        const cellId = existingCell.cellId;
        let index = -1;
        for (const each of this.activeState.cells) {
            index++;
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index+1, 0, cellToInject);
                break
            }
        }
        this._activeStateWasUpdated();
    }
    injectCellBefore({existingCell, cellToInject}) {
        const cellId = existingCell.cellId;
        let index = -1;
        for (const each of this.activeState.cells) {
            index++;
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index, 0, cellToInject);
                break
            }
        }
        this._activeStateWasUpdated();
    }
    removeCellData({cellId}) {
        let index = -1;
        for (const each of this.activeState.cells) {
            index++;
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index, 1);
                break
            }
        }
        this._activeStateWasUpdated();
    }
    
    // 
    // runtime
    // 
    runCode(code, {outputElement}) {
        return runCode({
            code,
            runtime: this.runtime,
            outputElement,
        })
    }
}

const makeRobustErrorHandler = ({ initStackFrame, stackFrame, source})=>{
    return (error)=>{
        const errorMessage = `Error was caused in a callback after ${source}\n\nThe main object was initilized here:\n${undefined._initStackFrame}\n\nThe ${source} was called here:\n${stackFrame}\n\nThe error in the callback itself is:\n${error?.stack||error}`;
        safeCallErrorHandler(errorMessage, error, source, onError);
    }
};

const safeCallErrorHandler = (errorMessage, error, source, handler)=>{
    try {
        Promise.resolve(handler(errorMessage, error, source)).catch(error=>{
            console.error("Error while trying to report another error");
            console.error("Original error was:");
            console.error(errorMessage);
            console.error("Error in handling that error:");
            console.error(error?.stack||error);
        });
    } catch (error) {
        console.error("Error while trying to report another error");
        console.error("Original error was:");
        console.error(errorMessage);
        console.error("Error in handling that error:");
        console.error(error?.stack||error);
    }
};

// [name="Cell"] {
// }
function BaseCell({cellId }={}) {
    return Column({
        name: "Cell",
        id: `cell-${cellId}`,
        width: "100%",
        position: "relative",
        transistion: `all 0.2s ease-in-out`,
        "max-width": "61rem",
        "border": "solid var(--theme-accent) 1px",
        "border-radius": "1rem",
        "margin-top": "2rem",
        // "padding": "0.3rem",
        background: "var(--theme-background)",
    })
}

function BasicButton(props) {
    const element = Button({});
    passAlongProps(element, {
        style: `
            border-radius: 1em;
            box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
        `,
    });
    passAlongProps(element, props);
    return element
}

const { html: html$2 } = Elemental({
    BasicButton,
    Row,
});

function CellManagementButtons({cellId, mainCellElement, stateManager, createNewCell, runButtonOnClick} = {}) {
    if (!stateManager) {
        throw new Error(`stateManager must be provided to CellManagementButtons`)
    }
    let runButton;
    if (runButtonOnClick) {
        runButton = html$2`<BasicButton background-color=${`var(--theme-green)`} onClick=${runButtonOnClick}>
            run
        </BasicButton>`;
    }
    const element = html$2`<Row gap=0.5em padding=1em justify-content=center width="100%" position=absolute bottom=-2rem>
        <BasicButton
            background-color=${`var(--theme-normal-button, --theme-blue)`}
            onclick=${(event)=>{
                const newCellData = {
                    cellId: Math.random(),
                    type: "jsCode",
                    coreContent: "\n\n\n\n",
                };
                if (mainCellElement) {
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData});
                    mainCellElement.insertAdjacentElement("afterend", createNewCell(newCellData));
                }
            }}>
                add JS cell
        </BasicButton>
        <BasicButton
            background-color=${`var(--theme-normal-button, --theme-blue)`}
            onclick=${(event)=>{
                const newCellData = {
                    cellId: Math.random(),
                    type: "markdown",
                    coreContent: "",
                };
                if (mainCellElement) {
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData});
                    mainCellElement.insertAdjacentElement("afterend", createNewCell(newCellData));
                }
            }}>
                add markdown cell
        </BasicButton>
        ${runButton}
        <BasicButton
            background-color=${`var(--theme-red)`}
            onClick=${()=>{
                if (mainCellElement) {
                    stateManager.removeCellData({cellId});
                    mainCellElement.remove();
                }
            }}
            >
                delete
        </BasicButton>
    </Row>`;
    return element
}

function MarkdownCell({cellId, coreContent, style, stateManager, createNewCell }={}) {
    const element = BaseCell({cellId});
    let markdownEditor = new Editor({
        el: element,
        usageStatistics: false,
        theme: 'dark',
        initialValue: coreContent,
        // initialEditType: 'wysiwyg',
    });
    element.addEventListener('keydown', (event)=>{
        if (event.ctrlKey && event.key == "Enter") {
            for (const [each, next] of zip(element.parentNode.children, [...element.parentNode.children].slice(1))) {
                if (each && next && each.id == element.id) {
                    focusOn(next);
                    next.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
                    break
                }
            }
        }
    });
    markdownEditor.on('change', (value)=>{
        stateManager.getCellFromId(cellId).coreContent = markdownEditor.getMarkdown();
    });
    element.append(
        CellManagementButtons({
            cellId,
            stateManager,
            createNewCell,
            mainCellElement: element,
        })
    );
    return element
}

function OutputArea() {
    return Column({
        name: "OutputArea",
        overflow: "auto",
        maxHeight: "20em",
        padding: "0.5rem",
        fontFamily: "monospace",
        whiteSpace: "pre",
        fontSize: "0.8em",
        background: "var(--theme-background)",
        borderRadius: "1rem",
        width: "100%",
        "margin-bottom": "1rem",
    })
}

// import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
// import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js"

const { basicSetup } = CM["codemirror"];
const { EditorView, keymap } = CM["@codemirror/view"];
const { EditorState, Prec } = CM["@codemirror/state"];
const { javascript: javascript$1 } = CM["@codemirror/lang-javascript"];
CM['@lezer/highlight'];
const { themeToExtension } = CM["@jeff-hykin/theme-tools"];

function TextEditor({initialText, onChange, onRun, language=javascript$1(), themeObject, ...props}={}){
    const parent = document.createElement("div");
    let editor = new EditorView({
        parent,
        state: EditorState.create({
            doc: initialText,
            extensions: [
                basicSetup, // ctrl+z = undo, and other stuff like that
                language, // highlighting hooks
                
                // 
                // theme choice
                // 
                themeToExtension(
                    atomOne({
                        settings:{
                            background: '#272C35',
                            foreground: '#9d9b97',
                            caret: '#797977',
                            selection: '#3d4c64',
                            selectionMatch: '#3d4c64',
                            gutterBackground: '#272C35',
                            gutterForeground: '#465063',
                            gutterBorder: 'transparent',
                            lineHighlight: '#2e3f5940',
                            ...themeObject?.settings||{}
                        },
                        // styles to add to the theme
                        styles: themeObject?.styles || [],
                        // return null to remove a style entry from the theme
                        mutateThemeStyles: themeObject?.mutateThemeStyles || ((style, tags)=>style),
                    })
                ),
                
                //
                // keymap
                //
                Prec.high(keymap.of([{
                    key: "Ctrl-Enter",
                    run: () =>{
                        // editor.state.doc.text.join("\n")
                        console.log("User pressed Ctrl+Enter!");
                        onRun&&onRun();
                        return true
                    }}
                ])),
                
                // 
                // codeChange
                // 
                ...(!onChange?[]:
                    [EditorView.updateListener.of((update)=>{
                        // const codeString = editor.state.doc.text.join("\n")
                        onChange&&onChange();
                    })]
                ),
            ],
        }),
    });
    const element = parent.children[0];
    element.name = "Editor";
    passAlongProps(element, props);
    element.editor = editor;
    Object.defineProperties(element, {
        code: { get() { return (editor?.state?.doc?.text||[])?.join("\n") || "" } },
    });
    if (props.width) {
        element.style.width = props.width;
    }
    return element
}

const { javascript } = CM["@codemirror/lang-javascript"];

const { html: html$1 } = Elemental({
    Row,
    Column,
});

function JsCell({cellId, coreContent, style, stateManager, createNewCell }={}) {
    const element = BaseCell({cellId});
    const outputArea = OutputArea();
    const editor = new TextEditor({
        initialText: coreContent,
        width: "100%",
        onRun: () => onRun(),
        language: javascript(),
        themeObject: stateManager.getCodeMirrorTheme(),
        onChange: () => {
            stateManager.getCellFromId(cellId).coreContent = editor.code;
            stateManager._activeStateWasUpdated(); // FIXME: redo this interface
        },
    });
    editor.style.borderRadius = "1rem";
    editor.style.overflow = "hidden";
    const onRun = makeOnRunJs({editor, outputArea, stateManager, cellId});
    element.append(
        editor,
        outputArea,
        CellManagementButtons({
            cellId,
            stateManager,
            createNewCell,
            mainCellElement: element,
            runButtonOnClick: onRun,
        }),
    );
    mergeStyles(element, style);
    return element
}

const makeOnRunJs = ({editor, outputArea, stateManager, cellId}) => async () => {
    removeAllChildElements(outputArea);
    console.log(`running cell ${cellId}`);
    const { runtimeError, syntaxError } = await stateManager.runCode(editor.code, {outputElement: outputArea});
    if (runtimeError) {
        outputArea.append(
            html$1`<Column style="color:var(--theme-red);">
                runtimeError: ${runtimeError?.message}<br><br>
                <div padding-left=1em>
                    ${formatError(runtimeError)}
                </div>
            </Column>`
        );
    } else if (syntaxError) {
        outputArea.append(
            html$1`<Column style="color:var(--theme-red);">
                syntaxError: ${syntaxError?.message}<br><br>
                <div padding-left=1em>
                    ${formatError(syntaxError)}
                </div>
            </Column>`
        );
    }
};

const formatError = (error)=>{
    let errorString = (error?.stack||error.message);
    // FIXME: this is a bit too agressive of pattern matching. Use window.location.href 
    errorString = errorString.replace(/@https?:(localhost)?.+ > eval:/g, `line `);
    errorString = errorString.replace(/(runCode|onRun|run|TextEditor|Cell|loadDataAndUiFromYaml|loadDataAndUiFromYaml\/<)@http:\/\/.+\n?/g, ``);
    errorString = errorString.replace(/(f|im|keydown|Md\/<|runHandlers|handleEvent|EventListener\.handleEvent\*ensureHandlers|O)@https:\/\/esm\.sh\/.+codemirror_esm@.+\n?/g, ``);
        // onRun@http://localhost:5173/main.js:187:61
        // onRun@http://localhost:5173/main.js:169:30
        // run@http://localhost:5173/main.js:339:36
        // f@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20617
        // im@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20742
        // keydown@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:18821
        // TextEditor@http://localhost:5173/main.js:312:22
        // Cell@http://localhost:5173/main.js:166:28
        // loadDataAndUiFromYaml/<@http://localhost:5173/main.js:425:62
        // loadDataAndUiFromYaml@http://localhost:5173/main.js:425:48
        // @http://localhost:5173/main.js:437:17
    return errorString.split(/\n/g,).map(line=>html$1`<p>${line}</p>`)
};

function Cell({cellId, type, coreContent, style, stateManager }={}) {
    if (type == "jsCode") {
        return JsCell({cellId, coreContent, style, stateManager, createNewCell: (args)=>Cell({...args, stateManager})})
    } else if (type == "markdown") {
        return MarkdownCell({cellId, coreContent, style, stateManager, createNewCell: (args)=>Cell({...args, stateManager})})
    } else {
        const element = BaseCell({cellId});
        element.append(
            html$3`<div>unknown cell type ${type}</div>`
        );
        return element
    }
}

// element tooling

// TODO:
    // download-upload iframe output
    // html download
    // file system panel
    // LATER:
        // connect theme hooks
        // connect config hooks
// 
// setup
// 
    const yaml = { stringify: dump, parse: load };
    const { html } = Elemental({
        ...components,
    });
    const stateManager = new StateManager({
        jsonCellSystem: {
            config: {},
            theme: {},
            fileSystemData: {},
            // cells: [
            //     {
            //         cellId: Math.random(),
            //         type: "jsCode",
            //         coreContent: "import { showToast } from \"https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js\"\nconsole.log('howdy')\n\nshowToast('hello!')\n\n",
            //     },
            //     {
            //         cellId: Math.random(),
            //         type: "markdown",
            //         coreContent: "# Howdy!\nhow's it going?",
            //     },
            // ]
        },
    });
    const cellContainer = html`<Column name="CellContainer" width="100%" position="relative" align-items=center justify-content=center></Column>`;
    const themeStyleElement = document.createElement("style");
// 
// body
// 
    document.head.append(themeStyleElement);
    document.body = html`
        <body
            font-size=15px
            background-color=var(--theme-secondary-background)
            color=var(--theme-secondary-foreground)
            overflow=scroll
            width="calc(100vw - 1rem)"
            padding=0
            margin=0
            >
                ${cellContainer}
                <Button
                    name="YamlDownloadButton"
                    style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
                    onclick=${()=>{
                        const data = yaml.stringify(stateManager.activeState);
                        const blob = new Blob([data], {type: "text/yaml;charset=utf-8"});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "notebook.nb.yaml";
                        a.click();
                        setTimeout(()=>URL.revokeObjectURL(url), 1000);
                    }}
                    >
                        Save Yaml
                </Button>
                <!-- <Button
                    name="HtmlDownloadButton"
                    style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
                    onclick=${()=>{
                        const html = document.body.parentElement.outerHTML;
                        const blob = new Blob([html], {type: "text/html;charset=utf-8"});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "index.html";
                        a.click();
                        setTimeout(()=>URL.revokeObjectURL(url), 1000);
                    }}
                    >
                        Save HTML
                </Button> -->
        </body>
    `;
    // loadDataAndUiFromYaml(storageObject.activeState)
    loadDataAndUiFromYaml(JSON.stringify({
        cells: [
            {
                cellId: Math.random(),
                type: "jsCode",
                coreContent: "import { showToast } from \"https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js\"\nconsole.log('howdy')\n\nshowToast('hello!')\n\n",
            },
            {
                cellId: Math.random(),
                type: "markdown",
                coreContent: "# Howdy!\nhow's it going?",
            },
        ]
    }));

// 
// connect conceptual system to UI
// 
    async function loadDataAndUiFromYaml(yamlString) {
        // clear existing 
        removeAllChildElements(cellContainer);
        // activat theme
        themeStyleElement.innerHTML = `
            :root {
                ${stateManager.themeToCssString()}
            }
        `;
        // load the state
        await stateManager.loadDataFromYaml(yamlString);
        // then render the cells
        cellContainer.append(
            ...stateManager.activeState.cells.map(
                cell=>Cell({...cell, stateManager})
            )
        );
    }
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
