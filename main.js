import { Elemental, passAlongProps } from "./imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "./imports/good_component.js"
import { fadeIn, fadeOut } from "./imports/good_component.js"
import storageObject from "./imports/storage_object.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "./imports/good_component.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "./imports/good_js.js"
import { toCamelCase } from "./imports/good_js.js"
import { toKebabCase } from "./imports/good_js.js"
import { pathPieces } from "./imports/good_js.js"
import { zipParse, zipCreate } from './imports/good_js.js'
// import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.13.2.0/value.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "./imports/good_js.js"
import * as stateManager from './systems/state_manager.js'
import { focusOn } from './tools/browser_help.js'
import { dump, load } from "./imports/js_yaml.js"

import { Cell } from "./components/cell.js"

const yaml = { stringify: dump, parse: load }
// import * as danfo from './tools/danfo.js'
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
// import 'https://esm.sh/@toast-ui/editor/dist/toastui-editor.css'

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


// 
// 
// Components
// 
// 
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
    })
    const themeStyleElement = document.createElement("style")
    document.head.append(themeStyleElement)
    const cellContainer = html`<Column name="CellContainer" width="100%" position="relative"></Column>`
    const loadDataAndUiFromYaml = async (yamlString)=>{
        removeAllChildElements(cellContainer)
        let styleChunks = []
        for (const [key, value] of Object.entries({...stateManager.activeTheme, })) {
            styleChunks.push(`--theme-${toKebabCase(key)}: ${value};`)
        }
        themeStyleElement.innerHTML = `
            :root {
                ${styleChunks.join("\n")}
            }
        `
        await stateManager.loadDataFromYaml(yamlString)
        document.body.append(...stateManager.activeState.cells.map(cell=>Cell({...cell, stateManager})))
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