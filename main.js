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
let runtime = makeRuntime()


// TODO:
    // DONE: get console.log to show up in $out
    // file drag-and-drop
        // DONE: event handling
        // add to runtime
        // get working on body drag-and-drop
    // make a save-html button  (body.innerHTML save to file)
    // save and load to yaml file (code and HTML output)
    // detect top level destructured variable names
    // add filesystem
    // drag-and-drop text file loader
    // image renderer

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
    function Cell({type, filePath, coreContent, varName, style, }={}) {
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
                var varName = toCamelCase(itemName)
                let promptMessage = `What variable should I assign to this file?`
                while (1) {
                    varName = prompt(promptMessage, varName)
                    if (isValidIdentifier(varName)) {
                        break
                    } else {
                        promptMessage = `Sorry ${JSON.stringify(varName)} is not a valid identifier. What variable should I assign to this file?`
                    }
                }
                console.debug(`fileObject is:`,fileObject)
                
                // check if text file
                try {
                    fileObject.text().then(text=>{
                        element.insertAdjacentElement("beforebegin", Cell({type: "file", filePath: fileObject.name, coreContent: text, varName}))
                    })
                } catch (error) {
                    fileObject.arrayBuffer().then(data=>new Uint8Array(data)).then(data=>{
                        element.insertAdjacentElement("beforebegin", Cell({type: "file", filePath: fileObject.name, coreContent: data, varName}))
                    })
                }
            }
            // const items = event.dataTransfer.items
            // if (fileInfos.length == 1) {
            //     globalThis.file = file
            // }
            // for (let [info, item] of zip(fileInfos, items)) {
            //     if (item.kind === "file") {
            //         var data = new Uint8Array(await info.arrayBuffer()) 
            //         const file = item.getAsFile()
            //         console.debug(`file is:`,file)
            //         globalThis.file = file
            //     }
            // }
            // if (files.length == 1) { 
            //     globalThis.data = event
            // } else if (files.length > 0) {
            //     // Display the file names
            //     Array.from(files).forEach(file => {
            //         const listItem = document.createElement('li')
            //         listItem.textContent = file.name
            //         fileList.appendChild(listItem)
            //     })
            // }
        })
        let onRun = () => {}
        if (type == "jsCode") {
            const editor = new Editor({
                initialText: coreContent,
                width: "100%",
                onRun: () => onRun()
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
                    return error.stack.replace(/@https?:\/\/localhost:.+( eval)?(?=:\d+:\d+)/g, ` line`).split(/\n/g,).map(line=>html`<p>${line}</p>`)
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
                            element.insertAdjacentElement("afterend", Cell({type: "jsCode", coreContent: "\n\n\n\n"}))
                        }}>
                            add JS cell
                    </BasicButton>
                    <BasicButton background-color=turquoise onClick=${onRun}>run</BasicButton>
                    <BasicButton background-color=salmon onClick=${()=>{element.remove()}}>delete (above)</BasicButton>
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
                padding-bottom=2em
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
        } else if (type == "markdown") {
            // FIXME: file
        } else if (type == "pseudoShCode") {
            // FIXME: file
        } else if (type == "pyCode") {
            // FIXME: file
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
                        onChange&&EditorView.updateListener.of((update)=>{
                            // const codeString = editor.state.doc.text.join("\n")
                            onChange&&onChange()
                        })
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

// 
// setup
// 
    const { html } = Elemental({
        ...components,
        BasicButton,
        Editor,
        Cell,
    })

// 
// body
// 
    let lineHeight = `1.5em`
    document.body = html`
        <body font-size=15px background-color=#272c35 color=whitesmoke overflow=scroll width=100vw padding=0 margin=0>
            <Cell type="jsCode" coreContent="console.log('howdy')\n\n\n\n" />
        </body>
    `