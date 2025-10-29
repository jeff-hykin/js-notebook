import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { fadeIn, fadeOut } from "../imports/good_component.js"
import { showToast, showErrorToast } from "../imports/good_component.js"
import { removeAllChildElements } from "../imports/good_component.js"
import { focusOn } from '../tools/browser_help.js'

import storageObject from "../imports/storage_object.js"
import { escapeJsString } from "../imports/good_js.js"

import { StateManager } from '../systems/state_manager.js'

import { Cell } from "../components/cell.js"
import yaml from "../imports/yaml.js"
import { FileSystemPanel } from "../components/file_system_panel.js"

// 
// this is the main notebook: fileSystem component + cells + save/load buttons + errors
// 
    // while multiple stateManagers can exist (in theory, for testing or something), only one Notebook can exist

const { html } = Elemental({
    ...components,
})

export function Notebook({ deserializedState }={}) {
    let stateManager
    
    // 
    // setup core components
    // 
    // TODO: element for naming/renaming notebook
    const themeStyleElement = document.createElement("style")
    const cellContainer = Column({name: "CellContainer", width: "100%", position: "relative", "align-items": "center", "justify-content": "center"})
    let filePanelElement = html`<div>Loading</div>`
    const buttonPanel = html`<Column name="ButtonPanel" style="position:fixed;top:1rem;right:1rem;z-index:10;">
        <Button
            name="SaveYaml"
            style="border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
            onclick=${()=>{
                let data
                try {
                    data = stateManager.toYaml()
                } catch (error) {
                    showErrorToast(`Looks like there is a bug in JS notebook. The error I got is: ${error?.message||error}`)
                    return
                }
                const blob = new Blob([data], {type: "text/yaml;charset=utf-8"})
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = stateManager.notebookName + ".nb.yaml"
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
                // TODO: actual HTML parsing to get the real head tag
                html.replace(/<head>/, `<head><script>globalThis.jsNotebookPreviousState = ${escapeJsString(stateManager.toYaml())}</script>`)
                const blob = new Blob([html], {type: "text/html;charset=utf-8"})
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = stateManager.notebookName + ".html"
                a.click()
                setTimeout(()=>URL.revokeObjectURL(url), 1000)
            }}
            >
                Save HTML
        </Button> -->
    </Column>`
    const outputElement = html`
        <Column
            min-height=100vh
            font-size=15px
            background-color=var(--theme-secondary-background)
            color=var(--theme-secondary-foreground)
            overflow=scroll
            width="calc(100vw - 1rem)"
            padding=0
            margin=0
            >
                ${themeStyleElement}
                ${cellContainer}
                ${filePanelElement}
                ${buttonPanel}
        </Column>
    `

    // 
    // methods
    // 
    const notebookMethods = {
        loadYamlString: (yamlString)=>{
            let deserializedState
            try {
                deserializedState = yaml.parse(yamlString)
            } catch (error) {
                showErrorToast(`It looks like that yaml file is corrupted or invalid. I got this error when trying to parse it: ${error?.message||error}`)
            }
            
            notebookMethods.loadNewState(deserializedState)
        },
        loadNewState: (deserializedState)=>{
            deserializedState ||= {
                notebookName: "my_notebook",
                config: {},
                theme: {},
                fileSystemData: {
                    "testFile.txt": {
                        directory: false,
                        content: "hello world",
                    },
                    "testFile2.txt": {
                        directory: false,
                        content: new TextEncoder().encode("hello world"),
                    },
                },
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
            }
            try {
                stateManager = new StateManager({
                    onError: (message, error, source)=>{
                        // FIXME: this should probably get connected to a cell
                        showErrorToast(`Error from state ${message}`)
                    },
                    jsonCellSystem: deserializedState,
                })
            } catch (error) {
                showErrorToast(`There was an error (likely some kind of corruption or version mismatch) when trying to load that state. The error I got was: ${error?.message||error}`)
            }
            
            // if there was a theme load it and flush out the existing one
            if (deserializedState?.theme) {
                // activate theme
                themeStyleElement.innerHTML = `
                    :root {
                        ${stateManager.themeToCssString()}
                    }
                `
            }
            
            // if there were files, replace the file system
            if (deserializedState?.fileSystemData) {
                // TODO: consider asking the user if old files should be kept
                const newFilePanelElement = FileSystemPanel({ stateManager, style:"position:fixed; bottom:2rem;" })
                filePanelElement.replaceWith(newFilePanelElement)
                filePanelElement = newFilePanelElement
            }

            // render the cells
            removeAllChildElements(cellContainer)
            cellContainer.append(
                ...stateManager.activeState.cells.map(
                    cell=>Cell({...cell, stateManager})
                )
            )

        },
    }
    notebookMethods.loadNewState(deserializedState)
    
    return outputElement
}