import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"

export function BasicButton(props) {
    const element = Button({})
    passAlongProps(element, {
        style: `
            cursor: pointer;
            border-radius: 1em;
            box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
        `,
    })
    passAlongProps(element, props)
    return element
}