import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "../imports/good_component.js"
import { zip } from '../imports/good_js.js'

import { BasicButton } from "./basic_button.js"

import { focusOn } from '../tools/browser_help.js'

const { html } = Elemental({
    BasicButton,
    Row,
})
// TODO:
    // styles (fixed, aligned, sort keys, look like file entries)
    // on hover show content preview
    // connect file system to runtime
    // drag and drop files
        // mark as bytes or text
    // embed file system in yaml
        // loading yaml should load the file system
    // self-hiding panel (either hover or click)


export function FileSystemPanel({ connectOnReceiveChange, onPushChange, stateManager, style }={}) {

    const pathToElement = {}
    const element = html`<Column visibility=none padding=2rem></Column>`
    for (const [path, data] of Object.entries(stateManager.fileSystemData)) {
        const newElement = html`<Row>
            <span class=path>${path}</span>
            <span class=type>(${data?.directory ? 'folder' : 'file'})</span>
            <BasicButton class=fileDeleteButton @click=${()=>{
                onPushChange('remove', path)
            }}>
                delete
            </BasicButton>
        </Row>`
        pathToElement[path] = newElement
        element.append(newElement)
    }
    // gets called when the file system changes
    const onFileSystemReceiveChange = (actions)=>{
        for (const [path, action, data] of Object.entries(actions)) {
            if (action == 'add') {
                const newElement = html`<Row>
                    <span class=path>${path}</span>
                    <span class=type>(${data?.directory ? 'folder' : 'file'})</span>
                    <BasicButton class=fileDeleteButton @click=${()=>{
                        onPushChange('remove', path)
                    }}>
                        delete
                    <BasicButton>
                </Row>`
                pathToElement[path] = newElement
                element.append(newElement)
            } else if (action == 'remove') {
                const elementToRemove = pathToElement[path]
                elementToRemove.remove()
                delete pathToElement[path]
            } else if (action == 'update') {
                // nothing in panel
            } else {
                console.error('FileSystemPanel got Unknown action', action)
            }
        }
    }
    connectOnReceiveChange(onFileSystemReceiveChange)

    return element
}