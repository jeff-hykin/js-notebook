import { Elemental, passAlongProps, html } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "../imports/good_component.js"

import { BaseCell } from "./base_cell.js"
import { MarkdownCell } from "./markdown_cell.js"
import { JsCell } from "./js_cell.js"

 
export function Cell({cellId, type, coreContent, style, stateManager }={}) {
    let element
    if (type == "jsCode") {
        element = JsCell({cellId, coreContent, style, stateManager, createNewCell: (args)=>Cell({...args, stateManager})})
    } else if (type == "markdown") {
        element = MarkdownCell({cellId, coreContent, style, stateManager, createNewCell: (args)=>Cell({...args, stateManager})})
    } else {
        element = BaseCell({cellId})
        element.append(
            html`<div>unknown cell type ${type}</div>`
        )
    }
    // element.addEventListener('dragover', () => {
    //     console.log(`dragover`)
    // })
    // element.addEventListener('dragleave', () => {
    //     console.log(`dragleave`)
    // })
    // element.addEventListener('dragenter', () => {
    //     console.log(`dragenter`)
    // })

    element.addEventListener("drop", (eventObject) => {
        eventObject.preventDefault()
        eventObject.stopPropagation()
        const files = eventObject.dataTransfer.files
        if (files.length > 0) {
            for (const file of files) {
                let name = file.name
                if (stateManager.fileSystem.get(name)) {
                    let response = prompt(`${JSON.stringify(name)} already exists. Please enter a new name or (to overwrite) enter nothing`)
                    if (response==null) {
                        // cancelled
                        return
                    }
                    if (typeof response == "string") {
                        if (response.length != 0) {
                            name = response
                        }
                    }
                }
                // 
                // add to backend system
                // 
                if (file.type.startsWith("text/")) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        stateManager.fileSystem.write({path: name, content: event.target.result})
                    }
                    reader.readAsText(file)
                } else {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                        stateManager.fileSystem.write({path: name, content: new Uint8Array(event.target.result)})
                    }
                    reader.readAsArrayBuffer(file)
                }
                // 
                // FIXME: create visual element for file
                // 
            }
        }
    })

    return element
}