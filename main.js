import { Elemental, passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/elements.js"
// import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "/Users/jeffhykin/repos/good-component/elements.js"
import { fadeIn, fadeOut } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/animations.js"
import { showToast } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/helpers.js"
import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.5.1.0/source/array.js"
import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://deno.land/x/good@1.13.2.0/value.js"
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
    function Cell({type, coreContent, style, }={}) {
        const element = html`<Column name="Cell" width="100%" position="relative"></Column>`
        let onRun = () => {}
        if (type == "jsCode") {
            onRun = () => {
                // FIXME: run
            }
            const editor = new Editor({
                initialText: coreContent,
                width: "100%",
                onRun,
            })
            const outputArea = html`<Column font="monospace" fontSize=0.8em></Column>`
            element.editor = editor
            element.outputArea = outputArea
            element.append(editor, outputArea)
        } else if (type == "file") {
            // FIXME: file
        } else if (type == "markdown") {
            // FIXME: file
        } else if (type == "pseudoShCode") {
            // FIXME: file
        } else if (type == "pyCode") {
            // FIXME: file
        }
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
        <body font-size=15px background-color=#5b5f60 overflow=scroll width=100vw padding=0 margin=0>
            <Cell type="jsCode" coreContent="console.log('howdy')\n\n\n\n" />
        </body>
    `