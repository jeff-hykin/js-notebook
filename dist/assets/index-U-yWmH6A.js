import { Elemental, passAlongProps } from 'https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js';
import { components } from 'https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js';
import 'https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js';
import 'https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js';
import { mergeStyles, removeAllChildElements } from 'https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js';
import { toCamelCase } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_camel_case.js';
import { pathPieces } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/path_pieces.js';
import { isValidIdentifier as isValidIdentifier$1 } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/is_valid_identifier.js';
import 'https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js';
import 'https://esm.sh/js-yaml@4.1.0/';
import 'https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js';
import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.0/main.js';
import atomOne from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.0/themes/atomone.js';
import { parserFromWasm } from 'https://esm.sh/gh/jeff-hykin/deno-tree-sitter@0.2.8.4/main.js';
import javascript$1 from 'https://esm.sh/gh/jeff-hykin/common_tree_sitter_languages@1.3.1.1/main/javascript.js';
import { isValidIdentifier } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.1.0/source/flattened/is_valid_identifier.js';
import { toRepresentation } from 'https://esm.sh/gh/jeff-hykin/good-js@1.13.5.0/source/flattened/to_representation.js';

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

// FIXME: detect destructured top level assignments for auto-export

const parser = await parserFromWasm(javascript$1); // path or Uint8Array

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

const { console: console$1, Math, Date, setTimout, setInterval, clearTimeout, clearInterval, fetch: fetch$1, Uint8Array: Uint8Array$1, Map, Set, URL: URL$1, WebAssembly, Array, Number, Symbol: Symbol$1, Promise: Promise$1, RegExp, Error: Error$1, document: document$1 } = globalThis;
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
            const el = document$1.createElement("p");
            el.classList.add("console-error");
            el.innerText = args.map(toRepresentation).join(" ");
            this.$element.append(el);
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
            const el = document$1.createElement("p");
            el.classList.add("console-log");
            el.innerText = args.map(toRepresentation).join(" ");
            this.$element.append(el);
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
            const el = document$1.createElement("p");
            el.classList.add("console-warn");
            el.innerText = args.map(toRepresentation).join(" ");
            this.$element.append(el);
        } else {
            console$1.warn(...args);
        }
    },
};
const builtins = {
    "console": consoleElement,
    "Math": {
        random: ()=>Math.random(),
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
const runCode = async ({ code, runtime, outputElement, cellNumber=0 }) => {
    code = convertImports(code);
    // global overrides
    runtime.globalThis = runtime.globalThis || runtime;
    runtime.$out = outputElement;
    runtime.console = { ...consoleElement, ...runtime.console };
    runtime.console.$element = outputElement;

    const variableNames = [
        ...new Set(
            Object.keys(runtime).concat(
                Object.keys(globalThis)
            )
        )
    ].filter(isValidIdentifier);
    let cellAsFunction;
    try {
        // run a non-local eval, so there are no variable leaks
        cellAsFunction = eval?.(`({${variableNames.join(", ")}})=>((async function() {"use strict"; ${code}
        ;})())`);
    } catch (error) {
        console$1.debug(`error is:`,error);
        console$1.debug(`error.stack is:`,error.stack);
        // basically only syntax errors are possible here
        return {
            syntaxError: error,
        }
    }
    try {
        Object.assign(runtime, await cellAsFunction(runtime));
    } catch (error) {
        // TODO: handle error
        console$1.debug(`error is:`,error);
        console$1.debug(`error.stack is:`,error.stack.replace(/@http:\/\/localhost:.+ eval:/g, `cell: ${cellNumber}:`));
        return {
            runtimeError: error,
        }
    }
    return {}
};

const { basicSetup } = CM["codemirror"];
const { EditorView, keymap } = CM["@codemirror/view"];
const { EditorState, Prec } = CM["@codemirror/state"];
const { javascript } = CM["@codemirror/lang-javascript"];
CM['@lezer/highlight'];
const { themeToExtension } = CM["@jeff-hykin/theme-tools"];
window.CM = CM;
let runtime = makeRuntime();


// TODO:
    // DONE: get console.log to show up in $out
    // make a save-html button  (body.innerHTML save to file)
    // file drag-and-drop
        // DONE: event handling
        // DONE: add to runtime
        // get working on body drag-and-drop
    // persist page reload
        // generate cells and runtime from a yaml
        // debounce save-to-local-storage
    // save and load to yaml file (code and HTML output)
    // detect top level destructured variable names
    // add filesystem
    // drag-and-drop text file loader
    // image renderer

// 
// 
// Components
// 
// 
    function BasicButton(props) {
        const element = html`<Button />`;
        passAlongProps(element, {
            style: `
                border-radius: 1em;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
            `,
        });
        passAlongProps(element, props);
        return element
    }
    function Cell({type, filePath, coreContent, varName, style, }={}) {
        const element = html`<Column name="Cell" border-top="2px solid #546E7A" width="100%" position="relative"></Column>`;
        element.transistion = `all 0.2s ease-in-out`;
        const dropStyleChanger = (isDroppping)=>{
            if (isDroppping) {
                element.style.border = "2px dashed #546E7A";
            } else {
                element.style.border = "none";
                element.style.borderTop="2px solid #546E7A";
            }
        };
        element.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropStyleChanger(true);
        });
        element.addEventListener('dragleave', () => {
            dropStyleChanger(false);
        });
        element.addEventListener('drop', (event) => {
            event.preventDefault();
            dropStyleChanger(false);
            const fileObjects = event.dataTransfer.files;
            if (fileObjects.length == 1) {
                const fileObject = fileObjects[0];
                const [ folders, itemName, itemExtensionWithDot ] = pathPieces(fileObject.name);
                let varName = toCamelCase(itemName);
                let promptMessage = `What variable should I assign to this file?`;
                while (1) {
                    varName = prompt(promptMessage, varName);
                    if (isValidIdentifier$1(varName)) {
                        break
                    } else {
                        promptMessage = `Sorry ${JSON.stringify(varName)} is not a valid identifier. What variable should I assign to this file?`;
                    }
                }
                if (fileObject.type.startsWith("text/")) {
                    fileObject.text().then(text=>{
                        runtime[varName] = text;
                        element.insertAdjacentElement("beforebegin", Cell({type: "file", filePath: fileObject.name, coreContent: text, varName}));
                    });
                } else {
                    fileObject.arrayBuffer().then(data=>new Uint8Array(data)).then(data=>{
                        runtime[varName] = data;
                        element.insertAdjacentElement("beforebegin", Cell({type: "file", filePath: fileObject.name, coreContent: data, varName}));
                    });
                }
            }
            // const items = event.dataTransfer.items
            // if (fileInfos.length == 1) {
            //     globalThis.file = file
            // }
            // for (let [info, item] of zip(fileInfos, items)) {
            //     if (item.kind === "file") {
            //         var data = new Uint8Array(await info.arrayBuffer()) 
            //         const file = item.getAsFile()
            //         console.debug(`file is:`,file)
            //         globalThis.file = file
            //     }
            // }
            // if (files.length == 1) { 
            //     globalThis.data = event
            // } else if (files.length > 0) {
            //     // Display the file names
            //     Array.from(files).forEach(file => {
            //         const listItem = document.createElement('li')
            //         listItem.textContent = file.name
            //         fileList.appendChild(listItem)
            //     })
            // }
        });
        let onRun = () => {};
        if (type == "jsCode") {
            const editor = new Editor({
                initialText: coreContent,
                width: "100%",
                onRun: () => onRun()
            });
            const outputArea = html`<Column
                font-family="monospace"
                fontSize=0.8em
                background="#546E7A"
                width="100%"
                padding="0.5rem"
                overflow="auto"
                max-height="20em"
                />`;
            element.editor = editor;
            element.outputArea = outputArea;
            onRun = async () => {
                removeAllChildElements(outputArea);
                const { runtimeError, syntaxError } = await runCode({
                    code: editor.code,
                    runtime,
                    outputElement: outputArea,
                });
                const formatError = (error)=>{
                    return error.stack.replace(/@https?:\/\/localhost:.+( eval)?(?=:\d+:\d+)/g, ` line`).split(/\n/g,).map(line=>html`<p>${line}</p>`)
                };
                if (runtimeError) {
                    outputArea.append(
                        html`<Column style="color:salmon;">
                            runtimeError: ${runtimeError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(runtimeError)}
                            </div>
                        </Column>`
                    );
                } else if (syntaxError) {
                    outputArea.append(
                        html`<Column style="color:salmon;">
                            syntaxError: ${syntaxError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(syntaxError)}
                            </div>
                        </Column>`
                    );
                }
            };
            element.append(editor, outputArea);
            element.append(
                html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                    <BasicButton
                        onclick=${(event)=>{
                            element.insertAdjacentElement("afterend", Cell({type: "jsCode", coreContent: "\n\n\n\n"}));
                        }}>
                            add JS cell
                    </BasicButton>
                    <BasicButton background-color=turquoise onClick=${onRun}>run</BasicButton>
                    <BasicButton background-color=salmon onClick=${()=>{element.remove();}}>delete (above)</BasicButton>
                </Row>`
            );
        } else if (type == "file") {
            const outputArea = html`<Column
                font-family="monospace"
                fontSize=0.8em
                background="#546E7A"
                width="100%"
                padding="0.5rem"
                overflow="auto"
                max-height="20em"
                >
                    ${typeof coreContent == "string"?coreContent:`[${coreContent.length} bytes]`}
            </Column>`;
            element.append(
                html`
                <Column width="100%" height="100%">
                    <h4 padding=1em width=100% border-bottom="2px solid #546E7A">${filePath} <code color=cornflowerblue>(${varName})</code></h4>
                    ${outputArea}
                </Column>`
            );
            element.append(
                html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                    <BasicButton
                        onclick=${(event)=>{
                            element.insertAdjacentElement("afterend", Cell({type: "jsCode", coreContent: "\n\n\n\n"}));
                        }}>
                            add JS cell
                    </BasicButton>
                    <BasicButton background-color=salmon onClick=${()=>{element.remove();}}>delete (above)</BasicButton>
                </Row>`
            );
        } else ;
        mergeStyles(element, style);
        return element
    }
    function Editor({initialText, onChange, onRun, ...props}={}){
        const parent = document.createElement("div");
        let editor = new EditorView({
            parent,
            state: EditorState.create({
                doc: initialText,
                extensions: [
                    basicSetup, // ctrl+z = undo, and other stuff like that
                    javascript(), // highlighting hooks
                    
                    // 
                    // theme choice
                    // 
                    themeToExtension(
                        atomOne({
                            variant:"dark", // "light" | "dark"
                            settings:{
                                // can override defaults:
                                // background: 'hsl(286, 60%, 67%)',
                                // foreground: 'hsl(286, 60%, 67%)',
                                // caret: '#e06c75',
                                // selection: '#e06c75',
                                // lineHighlight: '#e06c75',
                                // gutterBackground: '#e06c75',
                                // gutterForeground: '#e06c75',
                            },
                            styles:[], // styles to add to the theme
                            mutateThemeStyles:(style)=>style, // return null to remove a style entry from the theme
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
                        onChange&&EditorView.updateListener.of((update)=>{
                            // const codeString = editor.state.doc.text.join("\n")
                            onChange&&onChange();
                        })
                    ),
                ],
            }),
        });
        const element = parent.children[0];
        element.name = "Editor";
        passAlongProps(element, props);
        element.editor = editor;
        Object.defineProperties(element, {
            code: { get() { return editor.state.doc.text.join("\n") } },
        });
        window.editor = editor; // FIXME: remove, debugging only
        if (props.width) {
            element.style.width = props.width;
        }
        return element
    }
    // HTML download problems
        // imports are not loaded (main.js)
        // styles from classes
    const HtmlDownloadButton = ()=>html`<Button
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
    </Button>`;

// 
// setup
// 
    const { html } = Elemental({
        ...components,
        BasicButton,
        Editor,
        Cell,
    });
    document.body = html`
        <body font-size=15px background-color=#272c35 color=whitesmoke overflow=scroll width=100vw padding=0 margin=0>
            ${HtmlDownloadButton()}
            <Cell type="jsCode" coreContent="console.log('howdy')\n\n\n\n" />
        </body>
    `;
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}