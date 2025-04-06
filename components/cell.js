import { Elemental, passAlongProps, html } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "../imports/good_component.js"

import { CellManagementButtons } from "./cell_management_buttons.js"
import { MarkdownCell } from "./markdown_cell.js"
import { JsCell } from "./js_cell.js"

export function Cell({cellId, type, coreContent, style, stateManager }={}) {
    if (type == "jsCode") {
        return JsCell({cellId, coreContent, style, stateManager, createNewCell: Cell})
    } else if (type == "markdown") {
        return MarkdownCell({cellId, coreContent, style, stateManager, createNewCell: Cell})
    } else {
        return html`<div>unknown cell type ${type}</div>`
    }
}