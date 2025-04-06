import { Elemental, passAlongProps, html } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"

export function OutputArea() {
    return Column({
        name: "OutputArea",
        overflow: "auto",
        maxHeight: "20em",
        padding: "0.5rem",
        fontFamily: "monospace",
        whiteSpace: "pre",
        fontSize: "0.8em",
        background: "var(--theme-background)",
        borderRadius: "1rem",
        width: "100%",
        "margin-bottom": "1rem",
    })
}