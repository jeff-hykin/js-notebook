import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "../imports/good_component.js"

import { CellManagementButtons } from "./cell_management_buttons.js"
import { BaseCell } from "./base_cell.js"
import { Editor as MarkdownEditor,} from 'https://esm.sh/@toast-ui/editor@3.2.2'

import { focusOn } from '../tools/browser_help.js'

export function MarkdownCell({cellId, coreContent, style, stateManager, createNewCell }={}) {
    const element = BaseCell({cellId})
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
        CellManagementButtons({
            cellId,
            stateManager,
            createNewCell,
            mainCellElement: element,
            runButtonOnClick: makeOnRunJs({editor, outputArea, stateManager}),
        })
    )
    return element
}