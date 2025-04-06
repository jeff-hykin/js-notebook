// element tooling
import { Elemental, passAlongProps } from "./imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "./imports/good_component.js"
import { fadeIn, fadeOut } from "./imports/good_component.js"
import { showToast } from "./imports/good_component.js"
import { removeAllChildElements } from "./imports/good_component.js"
import { focusOn } from './tools/browser_help.js'

import storageObject from "./imports/storage_object.js"

import { StateManager } from './systems/state_manager.js'

import { Cell } from "./components/cell.js"
import { dump, load } from "./imports/js_yaml.js"

// TODO:
    // cleanup main.js
    // switch to new state system
    // fixup styling of cells
    // download-upload iframe output
    // html download
    // LATER:
        // connect theme hooks
        // connect config hooks
// 
// setup
// 
    const yaml = { stringify: dump, parse: load }
    const { html } = Elemental({
        ...components,
    })
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
    })
    let lineHeight = `1.5em`
    const cellContainer = html`<Column name="CellContainer" width="100%" position="relative" align-items=center justify-content=center></Column>`
    const themeStyleElement = document.createElement("style")
// 
// body
// 
    document.head.append(themeStyleElement)
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
                </Button>
                <!-- <Button
                    name="HtmlDownloadButton"
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
                </Button> -->
        </body>
    `
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
    }))

// 
// connect conceptual system to UI
// 
    async function loadDataAndUiFromYaml(yamlString) {
        // clear existing 
        removeAllChildElements(cellContainer)
        // activat theme
        themeStyleElement.innerHTML = `
            :root {
                ${stateManager.themeToCssString()}
            }
        `
        // load the state
        await stateManager.loadDataFromYaml(yamlString)
        // then render the cells
        cellContainer.append(
            ...stateManager.activeState.cells.map(
                cell=>Cell({...cell, stateManager})
            )
        )
    }