import { Elemental, passAlongProps, html } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"

export function OutputArea() {
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