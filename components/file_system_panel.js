import { Elemental, passAlongProps } from "../imports/elemental.js"
import { Event, trigger, everyTime, once } from "../imports/good_js.js"
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
    // on hover show content preview
    // connect file system to runtime
    // drag and drop files
        // mark as bytes or text
    // embed file system in yaml
        // loading yaml should load the file system
    // self-hiding panel (either hover or click)


export function FileSystemPanel({ connectOnReceiveChange, onPushChange, stateManager, style }={}) {
    const pathToElement = {}
    const element = html`<div
        display=grid
        width=min(20rem,85vw)
        visibility=visible
        padding=2rem
        background-color=var(--theme-background)
        color=var(--theme-foreground)
        border-radius=1rem
        box-shadow="0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3)"
        max-height=20rem
        overflow=auto
        gap=0.5rem
        >
    </div>`
    const updateFilePaths = ()=>{
        removeAllChildElements(element)
        // for now just regenerate all, later do precise updates
        for (const [path, data] of Object.entries(stateManager.fileSystem.getAllMetadata())) {
            const newElement = html`<Row verticalAlignment=center gap=1rem horizontalAlignment=space-between>
                <span class=path>${path}</span>
                <span class=type>(${data?.directory ? 'folder' : 'file'})</span>
                <BasicButton class=fileRemoveButton background-color=var(--theme-red) onClick=${()=>{
                    console.log(`removing`, path)
                    stateManager.fileSystem.remove(path)
                }} padding="0.3rem 0.5rem">
                    remove
                </BasicButton>
            </Row>`
            pathToElement[path] = newElement
            element.append(newElement)
        }
    }
    const delayedUpdate = ()=>{
        setTimeout(updateFilePaths, 100)
    }
    everyTime(stateManager.fileSystemEvents.beforeRename).then(delayedUpdate)
    everyTime(stateManager.fileSystemEvents.beforeRemove).then(delayedUpdate)
    everyTime(stateManager.fileSystemEvents.beforeWrite).then(delayedUpdate)
    updateFilePaths()
    // // gets called when the file system changes
    // const onFileSystemReceiveChange = (actions)=>{
    //     for (const [path, action, data] of Object.entries(actions)) {
    //         if (action == 'add') {
    //             const newElement = html`<Row>
    //                 <span class=path>${path}</span>
    //                 <span class=type>(${data?.directory ? 'folder' : 'file'})</span>
    //                 <BasicButton class=fileDeleteButton @click=${()=>{
    //                     onPushChange('remove', path)
    //                 }}>
    //                     delete
    //                 <BasicButton>
    //             </Row>`
    //             pathToElement[path] = newElement
    //             element.append(newElement)
    //         } else if (action == 'remove') {
    //             const elementToRemove = pathToElement[path]
    //             elementToRemove.remove()
    //             delete pathToElement[path]
    //         } else if (action == 'update') {
    //             // nothing in panel
    //         } else {
    //             console.error('FileSystemPanel got Unknown action', action)
    //         }
    //     }
    // }
    // connectOnReceiveChange(onFileSystemReceiveChange)
    
    passAlongProps(element, {style})
    return element
}