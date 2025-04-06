import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
// import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "/Users/jeffhykin/repos/good-component/elements.js"
import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
import { toCamelCase } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_camel_case.js"
import { toKebabCase } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_kebab_case.js"
import { pathPieces } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/path_pieces.js"
// import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.13.2.0/value.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js"
import { dump, load } from "https://esm.sh/js-yaml@4.1.0/"
const yaml = { stringify: dump, parse: load }

import { TextEditor } from "./components/text_editor.js"
import * as stateManager from './systems/state_manager.js'
// import * as danfo from './tools/danfo.js'
import { focusOn } from './tools/browser_help.js'
// import * as danfo from 'https://esm.sh/danfojs@1.1.2/dist/danfojs-browser/src/index.js?dev'
    // as part of danfojs, we could reuse these to minimize import size:
        // xlsx@0.17.2/esnext/xlsx.development.mjs
        // plotly.js-dist-min@2.8.0/esnext/plotly.js-dist-min.development.mjs
        // tensorflow/tfjs-core@3.21.0/esnext/dist/base_side_effects.development.js
        // fullwidth-code-point@3.0.0/esnext/is-fullwidth-code-point.development.mjsment.js
        // tensorflow/tfjs-backend-cpu@3.21.0/esnext/dist/base.development.js
        // tensorflow/tfjs-backend-webgl@3.21.0/esnext/dist/kernels/AddN.development.js
        // tensorflow/tfjs-core@3.21.0/esnext/dist/ops/image/non_max_suppression.development.js
        // tensorflow/tfjs-backend-webgl@3.21.0/esnext/dist/kernel_utils/reduce.development.js
// window.danfo = danfo

// https://github.com/nhn/tui.editor
import { Editor as MarkdownEditor,} from 'https://esm.sh/@toast-ui/editor@3.2.2'
// import 'https://esm.sh/@toast-ui/editor/dist/toastui-editor.css'

import { makeRuntime, runCode } from "./tools/js_runtime.js"
import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/main.js'
const { javascript } = CM["@codemirror/lang-javascript"]

// TODO:
    // DONE: get console.log to show up in $out
    // DONE: make a save-yaml button  (body.innerHTML save to file)
    // DONE: markdown editor
        // make shift+enter to go to the next editable cell (e.g. markdown or code)
    // refactor some stuff
        // DONE: cleanup state management
        // clean up cell management
        // fixup theming
        // ctrl+enter focuses on the next cell (for markdown and code)
    // file drag-and-drop
        // DONE: event handling
        // DONE: add to runtime
        // get working on body drag-and-drop
        // only preview part of the file string to save on memory
    // persist page reload
        // DONE: edited data stays in sync with yamlData
        // DONE: debounce save-to-local-storage
        // generate cells and runtime from a yaml
        // save html output in the yaml
        // fix the file blobs reloading into variables
    // run code experince
        // DONE: show output
        // DONE: show runtime/syntax errors
        // DONE: auto-export some variables
        // add a loader/spinner for cells
        // fix pathing line-highlighting of errors
        // detect top level destructured variable names
        // convert export statements to return aggregation
        // use tree sitter to get the line number of syntax errors
    // create a lockfile of unspecified imports
        // resolve them to their versioned esm urls
        // add hash of data to lockfile
    // add filesystem
    // image renderer
    // theme system

let runtime = makeRuntime()
const defaultTheme = {
    name: "default-dark",
    background: "#546E7A",
    foreground: "white",
    secondaryForeground: "whitesmoke",
    secondaryBackground: "#272c35",
    green: "turquoise",
    red: "salmon",
    blue: "cornflowerblue",
    yellow: "#E5C07B",
    
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
}
let activeTheme = {}
// debugging:
window.activeState = stateManager.activeState
// {
//     settings: {
//         theme: {...defaultTheme},
//     },
//     cells: [
//         {
//             cellId: Math.random(),
//             type: "file",
//             filePath: "test.js",
//             coreContent: "howdy howdy",
//             varName: "test",
//         },
//         {
//             cellId: Math.random(),
//             type: "jsCode",
//             coreContent: "console.log('howdy')\n\n\n\n",
//         },
//         {
//             cellId: Math.random(),
//             type: "markdown",
//             coreContent: "console.log('howdy')\n\n\n\n",
//         },
//     ]
// }



// 
// 
// Components
// 
// 
    function BasicButton(props) {
        const element = html`<Button />`
        passAlongProps(element, {
            style: `
                border-radius: 1em;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
            `,
        })
        passAlongProps(element, props)
        return element
    }
    function OutputArea() {
        return html`<Column
            font-family="monospace"
            white-space="pre"
            fontSize=0.8em
            background="var(--theme-background)"
            width="100%"
            padding="0.5rem"
            overflow="auto"
            max-height="20em"
            />
        `
    }
    function Cell({cellId, type, coreContent, fileInfos, style, }={}) {
        const element = html`<Column id=${`cell-${cellId}`} name="Cell" border-top="2px solid var(--theme-background)" width="100%" position="relative"></Column>`
        element.transistion = `all 0.2s ease-in-out`

        // 
        // helpers
        // 
            let onRun = () => {}
            const makeOnRunJs = (editor, outputArea) => async () => {
                removeAllChildElements(outputArea)
                console.log(`running cell ${cellId}`)
                const { runtimeError, syntaxError } = await runCode({
                    code: editor.code,
                    runtime,
                    outputElement: outputArea,
                })
                const formatError = (error)=>{
                    let errorString = (error?.stack||error.message)
                    // FIXME: this is a bit too agressive of pattern matching. Use window.location.href 
                    errorString = errorString.replace(/@https?:(localhost)?.+ > eval:/g, `line `)
                    errorString = errorString.replace(/(runCode|onRun|run|TextEditor|Cell|loadDataAndUiFromYaml|loadDataAndUiFromYaml\/<)@http:\/\/.+\n?/g, ``)
                    errorString = errorString.replace(/(f|im|keydown|Md\/<|runHandlers|handleEvent|EventListener\.handleEvent\*ensureHandlers|O)@https:\/\/esm\.sh\/.+codemirror_esm@.+\n?/g, ``)
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
                    return errorString.split(/\n/g,).map(line=>html`<p>${line}</p>`)
                }
                if (runtimeError) {
                    outputArea.append(
                        html`<Column style="color:var(--theme-red);">
                            runtimeError: ${runtimeError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(runtimeError)}
                            </div>
                        </Column>`
                    )
                } else if (syntaxError) {
                    outputArea.append(
                        html`<Column style="color:var(--theme-red);">
                            syntaxError: ${syntaxError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(syntaxError)}
                            </div>
                        </Column>`
                    )
                }
            }
            const newJsCellButtton = html`<BasicButton
                onclick=${(event)=>{
                    const newCellData = {
                        cellId: Math.random(),
                        type: "jsCode",
                        coreContent: "\n\n\n\n",
                    }
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData})
                    element.insertAdjacentElement("afterend", Cell(newCellData))
                }}>
                    add JS cell
            </BasicButton>`
            const newMarkdownCellButtton = html`<BasicButton
                onclick=${(event)=>{
                    const newCellData = {
                        cellId: Math.random(),
                        type: "markdown",
                        coreContent: "",
                    }
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData})
                    element.insertAdjacentElement("afterend", Cell(newCellData))
                }}>
                    add markdown cell
            </BasicButton>`
            const deleteCellButton = html`<BasicButton
                background-color=var(--theme-red)
                onClick=${()=>{
                    stateManager.removeCellData({cellId})
                    element.remove()
                }}
                >
                    delete (above)
            </BasicButton>`
            const RunButton = (onRun)=>html`<BasicButton background-color=var(--theme-green) onClick=${(...args)=>{console.log("onrun ",onRun);onRun(...args)}}>run</BasicButton>`
        
        // 
        // type
        // 
            if (type == "jsCode") {
                const outputArea = OutputArea()
                const editor = new TextEditor({
                    initialText: coreContent,
                    width: "100%",
                    onRun: () => onRun(),
                    language: javascript(),
                    onChange: () => {
                        stateManager.getCellFromId(cellId).coreContent = editor.code
                        stateManager.activeStateWasUpdated()
                    },
                })
                onRun = makeOnRunJs(editor, outputArea)
                element.append(editor, outputArea)
                element.append(
                    html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                        ${newJsCellButtton}
                        ${newMarkdownCellButtton}
                        ${RunButton(onRun)}
                        ${deleteCellButton}
                    </Row>`
                )
            } else if (type == "file") {
                // FIXME: rework this
                let hasDataFrameImport = false
                const codeChunks = []
                for (let { name, type, data } of (fileInfos||[])) {
                    const originalName = name
                    name = toCamelCase(name)
                    if (type == "text/csv") {
                        codeChunks.unshift(`/*MAGIC: var ${name} = contents of ${originalName}*/`)
                        codeChunks.push(`var ${name}AsBlob = new Blob([${name}], {type: "text/csv;charset=utf-8"})`)
                        codeChunks.push(`var ${name}DataFrame = `)
                    } else if (type.startsWith("text/")) {
                        // FIXME:
                    } else {
                        
                    }
                }
                
                const outputArea = OutputArea()
                const editor = new TextEditor({
                    initialText: coreContent,
                    width: "100%",
                    onRun: () => onRun(),
                    language: javascript(),
                    onChange: () => {
                        stateManager.getCellFromId(cellId).coreContent = editor.code
                        stateManager.activeStateWasUpdated()
                    },
                })
                element.append(editor, outputArea)
                element.append(
                    html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                        ${newJsCellButtton}
                        ${newMarkdownCellButtton}
                        ${RunButton(makeOnRunJs(editor, outputArea))}
                        ${deleteCellButton}
                    </Row>`
                )
            } else if (type == "markdown") {
                let markdownEditor = new MarkdownEditor({
                    el: element,
                    usageStatistics: false,
                    theme: 'dark',
                    initialValue: coreContent,
                    // initialEditType: 'wysiwyg',
                })
                element.addEventListener('keydown', (event)=>{
                    if (event.ctrlKey && event.key == "Enter") {
                        for (const [each, next] of zip(element.parentNode.children, [...element.parentNode.children].slice(1))) {
                            if (each && next && each.id == element.id) {
                                focusOn(next)
                                next.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
                                break
                            }
                        }
                    }
                })
                markdownEditor.on('change', (value)=>{
                    stateManager.getCellFromId(cellId).coreContent = markdownEditor.getMarkdown()
                })
                element.append(
                    html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                        ${newJsCellButtton}
                        ${newMarkdownCellButtton}
                        ${deleteCellButton}
                    </Row>`
                )
            } else if (type == "pseudoShCode") {
                // FIXME: 
            } else if (type == "pyCode") {
                // FIXME: 
            }
        // 
        // drag and drop handler
        // 
            const dropStyleChanger = (isDroppping)=>{
                if (isDroppping) {
                    element.style.border = "2px dashed var(--theme-background)"
                } else {
                    element.style.border = "none"
                    element.style.borderTop="2px solid var(--theme-background)"
                }
            }
            element.addEventListener('dragover', (event) => {
                event.preventDefault()
                dropStyleChanger(true)
            })
            element.addEventListener('dragleave', () => {
                dropStyleChanger(false)
            })
            element.addEventListener('drop', async (event) => {
                event.preventDefault()
                dropStyleChanger(false)
                const fileObjects = event.dataTransfer.files
                const fileInfos = []
                const newCellData = { cellId: Math.random(), type: "file", coreContent: "", fileInfos}
                for (let each of fileObjects) {
                    let dataPromise
                    // if (fileObject.type == "text/csv") {
                    if (fileObject.type.startsWith("text/")) {
                        dataPromise = fileObject.text()
                    } else {
                        dataPromise = fileObject.arrayBuffer().then(data=>new Uint8Array(data))
                    }
                    const fileInfo = {
                        name: each.name,
                        type: each.type,
                        data: await dataPromise,
                    }
                }
                injectCellBefore({existingCell: {cellId}, cellToInject: newCellData})
                element.insertAdjacentElement("beforebegin", Cell(newCellData))
            })
        
        mergeStyles(element, style)
        return element
    }
    // HTML download problems
        // imports are not loaded (main.js)
        // styles from classes
    const HtmlDownloadButton = ()=>html`<Button
        style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
        onclick=${()=>{
            const html = document.body.parentElement.outerHTML
            const blob = new Blob([html], {type: "text/html;charset=utf-8"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "index.html"
            a.click()
            setTimeout(()=>URL.revokeObjectURL(url), 1000)
        }}
        >
            Save HTML
    </Button>`
    const YamlDownloadButton = ()=>html`<Button
        style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
        onclick=${()=>{
            const data = yaml.stringify(stateManager.activeState)
            const blob = new Blob([data], {type: "text/yaml;charset=utf-8"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "notebook.nb.yaml"
            a.click()
            setTimeout(()=>URL.revokeObjectURL(url), 1000)
        }}
        >
            Save Yaml
    </Button>`

// 
// setup
// 
    const { html } = Elemental({
        ...components,
        BasicButton,
        TextEditor,
        Cell,
        OutputArea,
    })
    const themeStyleElement = document.createElement("style")
    document.head.append(themeStyleElement)
    const cellContainer = html`<Column name="CellContainer" width="100%" position="relative"></Column>`
    const loadDataAndUiFromYaml = async (yamlString)=>{
        removeAllChildElements(cellContainer)
        let styleChunks = []
        for (const [key, value] of Object.entries({...defaultTheme, ...activeTheme, })) {
            styleChunks.push(`--theme-${toKebabCase(key)}: ${value};`)
        }
        themeStyleElement.innerHTML = `
            :root {
                ${styleChunks.join("\n")}
            }
        `
        await stateManager.loadDataFromYaml(yamlString)
        document.body.append(...stateManager.activeState.cells.map(cell=>Cell(cell)))
    }

// 
// body
// 
    let lineHeight = `1.5em`
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
                ${YamlDownloadButton()}
        </body>
    `
    loadDataAndUiFromYaml(storageObject.activeState)