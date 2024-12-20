import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
// import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "/Users/jeffhykin/repos/good-component/elements.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
import { toCamelCase } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/to_camel_case.js"
import { pathPieces } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/path_pieces.js"
import { isValidIdentifier } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/flattened/is_valid_identifier.js"
// import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.13.2.0/value.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js"
import { dump, load } from "https://esm.sh/js-yaml@4.1.0/"
const yaml = { stringify: dump, parse: load }

import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"

import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.0/main.js'
import atomOne from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.0/themes/atomone.js'

const { basicSetup } = CM["codemirror"]
const { EditorView, keymap } = CM["@codemirror/view"]
const { EditorState, Prec } = CM["@codemirror/state"]
const { javascript } = CM["@codemirror/lang-javascript"]
const { tags: t } = CM['@lezer/highlight']
const { themeToExtension } = CM["@jeff-hykin/theme-tools"]
window.CM = CM

import { makeRuntime, runCode } from "./tools/js_runtime.js"

// TODO:
    // DONE: get console.log to show up in $out
    // make a save-yaml button  (body.innerHTML save to file)
    // file drag-and-drop
        // DONE: event handling
        // DONE: add to runtime
        // get working on body drag-and-drop
    // persist page reload
        // DONE: edited data stays in sync with yamlData
        // generate cells and runtime from a yaml
        // debounce save-to-local-storage
    // run code experince
        // DONE: show output
        // DONE: show runtime/syntax errors
        // DONE: auto-export some variables
        // fix pathing line-highlighting of errors
        // detect top level destructured variable names
        // convert export statements to return aggregation
        // use tree sitter to get the line number of syntax errors
    // add filesystem
    // image renderer
    // theme system

let runtime = makeRuntime()
window.yamlData = {
    settings: {
    },
    cells: [
        {
            cellId: Math.random(),
            type: "file",
            filePath: "test.js",
            coreContent: "howdy howdy",
            varName: "test",
        },
        {
            cellId: Math.random(),
            type: "jsCode",
            coreContent: "console.log('howdy')\n\n\n\n",
        },
    ]
}


// 
// 
// Components
// 
// 
    function BasicButton(props) {
        const element = html`<Button />`
        passAlongProps(element, {
            style: `
                border-radius: 1em;
                box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3);
            `,
        })
        passAlongProps(element, props)
        return element
    }
    function Cell({cellId, type, filePath, coreContent, varName, style, }={}) {
        const getCellData = ()=>{
            for (const each of yamlData.cells) {
                if (each.cellId == cellId) {
                    return each
                }
            }
            return {}
        }
        const removeCellData = ()=>{
            let index = -1
            for (const each of yamlData.cells) {
                index++
                if (each.cellId == cellId) {
                    yamlData.cells.splice(index, 1)
                    break
                }
            }
        }
        const element = html`<Column name="Cell" border-top="2px solid #546E7A" width="100%" position="relative"></Column>`
        element.transistion = `all 0.2s ease-in-out`
        const dropStyleChanger = (isDroppping)=>{
            if (isDroppping) {
                element.style.border = "2px dashed #546E7A"
            } else {
                element.style.border = "none"
                element.style.borderTop="2px solid #546E7A"
            }
        }
        element.addEventListener('dragover', (event) => {
            event.preventDefault()
            dropStyleChanger(true)
        })
        element.addEventListener('dragleave', () => {
            dropStyleChanger(false)
        })
        element.addEventListener('drop', (event) => {
            event.preventDefault()
            dropStyleChanger(false)
            const fileObjects = event.dataTransfer.files
            if (fileObjects.length == 1) {
                const fileObject = fileObjects[0]
                const [ folders, itemName, itemExtensionWithDot ] = pathPieces(fileObject.name)
                let varName = toCamelCase(itemName)
                let promptMessage = `What variable should I assign to this file?`
                while (1) {
                    varName = prompt(promptMessage, varName)
                    if (isValidIdentifier(varName)) {
                        break
                    } else {
                        promptMessage = `Sorry ${JSON.stringify(varName)} is not a valid identifier. What variable should I assign to this file?`
                    }
                }
                const afterLoaded = (data)=>{
                    runtime[varName] = data
                    const newCellData = { cellId: Math.random(), type: "file", filePath: fileObject.name, coreContent: data, varName}
                    let index = -1
                    for (const each of yamlData.cells) {
                        index++
                        if (each.cellId == cellId) {
                            yamlData.cells.splice(index, 0, newCellData)
                            break
                        }
                    }
                    element.insertAdjacentElement("beforebegin", Cell(newCellData))
                }
                    
                if (fileObject.type.startsWith("text/")) {
                    fileObject.text().then(afterLoaded)
                } else {
                    fileObject.arrayBuffer().then(data=>new Uint8Array(data)).then(afterLoaded)
                }
            }
        })
        let onRun = () => {}
        if (type == "jsCode") {
            const editor = new Editor({
                initialText: coreContent,
                width: "100%",
                onRun: () => onRun(),
                onChange: () => {
                    getCellData().coreContent = editor.code
                },
            })
            const outputArea = html`<Column
                font-family="monospace"
                fontSize=0.8em
                background="#546E7A"
                width="100%"
                padding="0.5rem"
                overflow="auto"
                max-height="20em"
                />`
            element.editor = editor
            element.outputArea = outputArea
            onRun = async () => {
                removeAllChildElements(outputArea)
                const { runtimeError, syntaxError } = await runCode({
                    code: editor.code,
                    runtime,
                    outputElement: outputArea,
                })
                const formatError = (error)=>{
                    let errorString = (error?.stack||error.message)
                    errorString = errorString.replace(/@https?:(localhost)?.+ > eval:/g, `line `)
                    errorString = errorString.replace(/(runCode|onRun|run|Editor|Cell|loadFromYaml|loadFromYaml\/<)@http:\/\/.+\n?/g, ``)
                    errorString = errorString.replace(/(f|im|keydown|Md\/<|runHandlers|handleEvent|EventListener\.handleEvent\*ensureHandlers|O)@https:\/\/esm\.sh\/.+codemirror_esm@.+\n?/g, ``)
                        // onRun@http://localhost:5173/main.js:187:61
                        // onRun@http://localhost:5173/main.js:169:30
                        // run@http://localhost:5173/main.js:339:36
                        // f@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20617
                        // im@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20742
                        // keydown@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:18821
                        // Editor@http://localhost:5173/main.js:312:22
                        // Cell@http://localhost:5173/main.js:166:28
                        // loadFromYaml/<@http://localhost:5173/main.js:425:62
                        // loadFromYaml@http://localhost:5173/main.js:425:48
                        // @http://localhost:5173/main.js:437:17
                    return errorString.split(/\n/g,).map(line=>html`<p>${line}</p>`)
                }
                if (runtimeError) {
                    outputArea.append(
                        html`<Column style="color:salmon;">
                            runtimeError: ${runtimeError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(runtimeError)}
                            </div>
                        </Column>`
                    )
                } else if (syntaxError) {
                    outputArea.append(
                        html`<Column style="color:salmon;">
                            syntaxError: ${syntaxError?.message}<br><br>
                            <div padding-left=1em>
                                ${formatError(syntaxError)}
                            </div>
                        </Column>`
                    )
                }
            }
            element.append(editor, outputArea)
            element.append(
                html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                    <BasicButton
                        onclick=${(event)=>{
                            const newCellData = {
                                cellId: Math.random(),
                                type: "jsCode",
                                coreContent: "\n\n\n\n",
                            }
                            let index = -1
                            for (const each of yamlData.cells) {
                                index++
                                if (each.cellId == cellId) {
                                    yamlData.cells.splice(index+1, 0, newCellData)
                                    break
                                }
                            }
                            element.insertAdjacentElement("afterend", Cell(newCellData))
                        }}>
                            add JS cell
                    </BasicButton>
                    <BasicButton background-color=turquoise onClick=${onRun}>run</BasicButton>
                    <BasicButton background-color=salmon onClick=${()=>{
                        removeCellData()
                        element.remove()
                        }}>delete (above)</BasicButton>
                </Row>`
            )
        } else if (type == "file") {
            const outputArea = html`<Column
                font-family="monospace"
                fontSize=0.8em
                background="#546E7A"
                width="100%"
                padding="0.5rem"
                overflow="auto"
                max-height="20em"
                >
                    ${typeof coreContent == "string"?coreContent:`[${coreContent.length} bytes]`}
            </Column>`
            element.append(
                html`
                <Column width="100%" height="100%">
                    <h4 padding=1em width=100% border-bottom="2px solid #546E7A">${filePath} <code color=cornflowerblue>(${varName})</code></h4>
                    ${outputArea}
                </Column>`
            )
            element.append(
                html`<Row gap=0.5em padding=1em justify-content=center width="100%">
                    <BasicButton
                        onclick=${(event)=>{
                            const newCellData = {
                                cellId: Math.random(),
                                type: "jsCode",
                                coreContent: "\n\n\n\n",
                            }
                            let index = -1
                            for (const each of yamlData.cells) {
                                index++
                                if (each.cellId == cellId) {
                                    yamlData.cells.splice(index+1, 0, newCellData)
                                    break
                                }
                            }
                            element.insertAdjacentElement("afterend", Cell(newCellData))
                        }}>
                            add JS cell
                    </BasicButton>
                    <BasicButton background-color=salmon onClick=${()=>{
                        removeCellData()
                        element.remove()
                        }}>delete (above)</BasicButton>
                </Row>`
            )
        } else if (type == "markdown") {
            // FIXME: 
        } else if (type == "pseudoShCode") {
            // FIXME: 
        } else if (type == "pyCode") {
            // FIXME: 
        }
        mergeStyles(element, style)
        return element
    }
    function Editor({initialText, onChange, onRun, ...props}={}){
        const parent = document.createElement("div")
        let editor = new EditorView({
            parent,
            state: EditorState.create({
                doc: initialText,
                extensions: [
                    basicSetup, // ctrl+z = undo, and other stuff like that
                    javascript(), // highlighting hooks
                    
                    // 
                    // theme choice
                    // 
                    themeToExtension(
                        atomOne({
                            variant:"dark", // "light" | "dark"
                            settings:{
                                // can override defaults:
                                // background: 'hsl(286, 60%, 67%)',
                                // foreground: 'hsl(286, 60%, 67%)',
                                // caret: '#e06c75',
                                // selection: '#e06c75',
                                // lineHighlight: '#e06c75',
                                // gutterBackground: '#e06c75',
                                // gutterForeground: '#e06c75',
                            },
                            styles:[], // styles to add to the theme
                            mutateThemeStyles:(style)=>style, // return null to remove a style entry from the theme
                        })
                    ),
                    
                    //
                    // keymap
                    //
                    Prec.high(keymap.of([{
                        key: "Ctrl-Enter",
                        run: () =>{
                            // editor.state.doc.text.join("\n")
                            console.log("User pressed Ctrl+Enter!")
                            onRun&&onRun()
                            return true
                        }}
                    ])),
                    
                    // 
                    // codeChange
                    // 
                    ...(!onChange?[]:
                        [EditorView.updateListener.of((update)=>{
                            // const codeString = editor.state.doc.text.join("\n")
                            onChange&&onChange()
                        })]
                    ),
                ],
            }),
        })
        const element = parent.children[0]
        element.name = "Editor"
        passAlongProps(element, props)
        element.editor = editor
        Object.defineProperties(element, {
            code: { get() { return editor.state.doc.text.join("\n") } },
        })
        window.editor = editor // FIXME: remove, debugging only
        if (props.width) {
            element.style.width = props.width
        }
        return element
    }
    // HTML download problems
        // imports are not loaded (main.js)
        // styles from classes
    const HtmlDownloadButton = ()=>html`<Button
        style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
        onclick=${()=>{
            const html = document.body.parentElement.outerHTML
            const blob = new Blob([html], {type: "text/html;charset=utf-8"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "index.html"
            a.click()
            setTimeout(()=>URL.revokeObjectURL(url), 1000)
        }}
        >
            Save HTML
    </Button>`
    const YamlDownloadButton = ()=>html`<Button
        style="position:fixed;top:1rem;right:1rem;z-index:10;border-radius:1em;box-shadow:0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.3); cursor:pointer;" 
        onclick=${()=>{
            const data = yaml.stringify(yamlData)
            const blob = new Blob([data], {type: "text/yaml;charset=utf-8"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "notebook.nb.yaml"
            a.click()
            setTimeout(()=>URL.revokeObjectURL(url), 1000)
        }}
        >
            Save Yaml
    </Button>`

// 
// setup
// 
    const { html } = Elemental({
        ...components,
        BasicButton,
        Editor,
        Cell,
    })
    const cellContainer = html`<Column name="CellContainer" width="100%" position="relative"></Column>`
    const loadFromYaml = async (yamlData)=>{
        removeAllChildElements(cellContainer)
        document.body.append(...yamlData.cells.map(cell=>Cell(cell)))
    }

// 
// body
// 
    let lineHeight = `1.5em`
    document.body = html`
        <body font-size=15px background-color=#272c35 color=whitesmoke overflow=scroll width=100vw padding=0 margin=0>
            ${YamlDownloadButton()}
        </body>
    `
    loadFromYaml(yamlData)