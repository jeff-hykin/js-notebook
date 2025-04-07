import { BasicButton } from "./basic_button.js"
import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"

const { html } = Elemental({
    BasicButton,
    Row,
})

export function CellManagementButtons({cellId, mainCellElement, stateManager, createNewCell, runButtonOnClick} = {}) {
    if (!stateManager) {
        throw new Error(`stateManager must be provided to CellManagementButtons`)
    }
    let runButton
    if (runButtonOnClick) {
        runButton = html`<BasicButton background-color=${`var(--theme-green)`} onClick=${runButtonOnClick}>
            run
        </BasicButton>`
    }
    const element = html`<Row gap=0.5em padding=1em justify-content=center width="100%" position=absolute bottom=-2rem>
        <BasicButton
            background-color=${`var(--theme-normal-button, --theme-blue)`}
            onclick=${(event)=>{
                const newCellData = {
                    cellId: Math.random(),
                    type: "jsCode",
                    coreContent: "\n\n\n\n",
                }
                if (mainCellElement) {
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData})
                    mainCellElement.insertAdjacentElement("afterend", createNewCell(newCellData))
                }
            }}>
                add JS cell
        </BasicButton>
        <BasicButton
            background-color=${`var(--theme-normal-button, --theme-blue)`}
            onclick=${(event)=>{
                const newCellData = {
                    cellId: Math.random(),
                    type: "markdown",
                    coreContent: "",
                }
                if (mainCellElement) {
                    stateManager.injectCellAfter({existingCell: {cellId}, cellToInject: newCellData})
                    mainCellElement.insertAdjacentElement("afterend", createNewCell(newCellData))
                }
            }}>
                add markdown cell
        </BasicButton>
        ${runButton}
        <BasicButton
            background-color=${`var(--theme-red)`}
            onClick=${()=>{
                if (mainCellElement) {
                    stateManager.removeCellData({cellId})
                    mainCellElement.remove()
                }
            }}
            >
                delete
        </BasicButton>
    </Row>`
    return element
}