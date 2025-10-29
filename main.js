// element tooling
import { Elemental, passAlongProps } from "./imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "./imports/good_component.js"
import { Notebook } from "./components/notebook.js"

// 
// setup
// 
    const { html } = Elemental({
        ...components,
        Notebook,
    })
// 
// body
// 
    document.body = html`
        <body
            min-height=100vh
            font-size=15px
            overflow=hidden
            width="100vw"
            height="100vh"
            padding=0
            margin=0
            >
                <Notebook deserializedState=${globalThis.jsNotebookPreviousState} />
        </body>
    `