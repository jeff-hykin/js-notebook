import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/main.js'
import atomOne from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/themes/atomone.js'
import { passAlongProps } from "https://esm.sh/gh/jeff-hykin/elemental@0.6.4/main/deno.js"
// import { zip, enumerate, count, permute, combinations, wrapAroundGet } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.1/source/array.js"
// import { deepCopy, deepCopySymbol, allKeyDescriptions, deepSortObject, shallowSortObject, isGeneratorObject,isAsyncIterable, isSyncIterable, isIterableTechnically, isSyncIterableObjectOrContainer, allKeys } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/value.js"

const { basicSetup } = CM["codemirror"]
const { EditorView, keymap } = CM["@codemirror/view"]
const { EditorState, Prec } = CM["@codemirror/state"]
const { javascript } = CM["@codemirror/lang-javascript"]
const { tags: t } = CM['@lezer/highlight']
const { themeToExtension } = CM["@jeff-hykin/theme-tools"]

export function TextEditor({initialText, onChange, onRun, language=javascript(), themeObject, ...props}={}){
    const parent = document.createElement("div")
    let editor = new EditorView({
        parent,
        state: EditorState.create({
            doc: initialText,
            extensions: [
                basicSetup, // ctrl+z = undo, and other stuff like that
                language, // highlighting hooks
                
                // 
                // theme choice
                // 
                themeToExtension(
                    atomOne({
                        settings:{
                            background: '#272C35',
                            foreground: '#9d9b97',
                            caret: '#797977',
                            selection: '#3d4c64',
                            selectionMatch: '#3d4c64',
                            gutterBackground: '#272C35',
                            gutterForeground: '#465063',
                            gutterBorder: 'transparent',
                            lineHighlight: '#2e3f5940',
                            ...themeObject?.settings||{}
                        },
                        // styles to add to the theme
                        styles: themeObject?.styles || [],
                        // return null to remove a style entry from the theme
                        mutateThemeStyles: themeObject?.mutateThemeStyles || ((style, tags)=>style),
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
        code: { get() { return (editor?.state?.doc?.text||[])?.join("\n") || "" } },
    })
    if (props.width) {
        element.style.width = props.width
    }
    return element
}