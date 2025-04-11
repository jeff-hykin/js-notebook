import { Elemental, passAlongProps } from "../imports/elemental.js"
import { css, components, Column, Row, askForFiles, Code, Input, Button, Checkbox, Dropdown, popUp, cx, } from "../imports/good_component.js"
import { addDynamicStyleFlags, setupStyles, createCssClass, setupClassStyles, hoverStyleHelper, combineClasses, mergeStyles, AfterSilent, removeAllChildElements } from "../imports/good_component.js"

import CM from 'https://esm.sh/gh/jeff-hykin/codemirror_esm@0.0.2.2/main.js'
const { javascript } = CM["@codemirror/lang-javascript"]

import { convertImports } from "../tools/parsing.js"
import { OutputArea } from "./output_area.js"
import { TextEditor } from "./text_editor.js"
import { CellManagementButtons } from "./cell_management_buttons.js"
import { BaseCell } from "./base_cell.js"

const { html } = Elemental({
    Row,
    Column,
})

const jsResponse = {}
window.addEventListener("message", (event) => {
    if (event.data.cellId) {
        jsResponse[event.data.cellId](event.data)
    }
})
export function JsCell({cellId, coreContent, style, stateManager, createNewCell }={}) {
    const element = BaseCell({cellId})
    const iframe = document.createElement("iframe")
    iframe.style.width = "100%"
    iframe.style.height = "20rem"
    iframe.srcdoc = `
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Iframe Content</title>
        </head>
        <body style="background: gray;">
        </body>
        <script type="module">
            let prevPromise = null
            const respond = (code)=>{
                let evalResult
                try {
                    evalResult = eval?.(code)
                // sync error
                } catch (error) {
                    window.parent.postMessage({ cellId: ${JSON.stringify(cellId)}, error, errorStack: error?.stack})
                }
                if (evalResult instanceof Promise) {
                    prevPromise = evalResult.catch(error=>{
                        window.parent.postMessage({ cellId: ${JSON.stringify(cellId)}, error, errorStack: error?.stack})
                    })
                }
            }
            window.addEventListener("message", (event)=>{
                if (prevPromise) {
                    prevPromise.finally(respond)
                    prevPromise = null
                } else {
                    respond(event.data)
                }
            })
        </script>
        </html>
    `
    // FIXME: memory leak
    // FIXME: these errors will pretty much just be from loading the 
    jsResponse[cellId] = (data)=>{
        if (data.error) {
            console.error(`error in cell ${cellId}`, data.error)
        }
    }
    const outputArea = OutputArea()
    const editor = new TextEditor({
        initialText: coreContent,
        width: "100%",
        onRun: () => onRun(),
        language: javascript(),
        themeObject: stateManager.getCodeMirrorTheme(),
        onChange: () => {
            stateManager.getCellFromId(cellId).coreContent = editor.code
            stateManager._activeStateWasUpdated() // FIXME: redo this interface
        },
    })
    editor.style.borderRadius = "1rem" // FIXME: this should come from theme AND this needs to coordinate with the markdown editor
    iframe.style.borderRadius = "1rem"
    editor.style.overflow = "hidden"
    console.log(`makeing onRun`)
    const onRun = makeOnRunJs({editor, outputArea, iframe, stateManager, cellId})
    element.append(
        editor,
        outputArea,
        iframe,
        CellManagementButtons({
            cellId,
            stateManager,
            createNewCell,
            mainCellElement: element,
            runButtonOnClick: onRun,
        }),
    )
    mergeStyles(element, style)
    return element
}

const makeOnRunJs = ({editor, outputArea, iframe, stateManager, cellId}) => {
    if (iframe) {
        globalThis.iframe = iframe
    }
    // console.debug(`iframe.contentWindow.document is:`,iframe.contentWindow.document)
    return async () => {
        removeAllChildElements(outputArea)
        if (iframe) {
            globalThis.iframe = iframe
        }
        // wait for the iframe to load if it hasn't already
        while (!iframe.contentWindow.document) {
            await new Promise(r=>setTimeout(r,100)) // TODO: make this 100ms configurable somehow
        }
        removeAllChildElements(iframe.contentWindow.document.body)
        const code = editor.code
        const { code: convertedCode, importSources } = convertImports(code)
        const asyncImportStatements = importSources.map(each=>`console.log("importing", ${each});await import(${each})`).join(";")
        iframe.contentWindow.postMessage(`((async ()=>{${asyncImportStatements}})())`)
        const { runtimeError, syntaxError } = await stateManager.runCode(
            code,
            {
                outputElement: outputArea,
                document: iframe.contentWindow.document,
                convertedCode: {code:convertedCode},
                otherGlobals: {
                    $fs: stateManager.fileSystem,
                },
            })
        if (runtimeError) {
            outputArea.append(
                html`<Column style="color:var(--theme-red);">
                    runtimeError: ${runtimeError?.message}<br><br>
                    <div padding-left=1em>
                        ${formatError(runtimeError)}
                    </div>
                </Column>`
            )
        } else if (syntaxError) {
            outputArea.append(
                html`<Column style="color:var(--theme-red);">
                    syntaxError: ${syntaxError?.message}<br><br>
                    <div padding-left=1em>
                        ${formatError(syntaxError)}
                    </div>
                </Column>`
            )
        }
    }
}

const formatError = (error)=>{
    let errorString = (error?.stack||error.message)
    // FIXME: this is a bit too agressive of pattern matching. Use window.location.href 
    errorString = errorString.replace(/@https?:(localhost)?.+ > eval:/g, `line `)
    errorString = errorString.replace(/(runCode|onRun|run|TextEditor|Cell|loadDataAndUiFromYaml|loadDataAndUiFromYaml\/<)@http:\/\/.+\n?/g, ``)
    errorString = errorString.replace(/(f|im|keydown|Md\/<|runHandlers|handleEvent|EventListener\.handleEvent\*ensureHandlers|O)@https:\/\/esm\.sh\/.+codemirror_esm@.+\n?/g, ``)
        // onRun@http://localhost:5173/main.js:187:61
        // onRun@http://localhost:5173/main.js:169:30
        // run@http://localhost:5173/main.js:339:36
        // f@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20617
        // im@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:20742
        // keydown@https://esm.sh/v135/gh/jeff-hykin/codemirror_esm@0.0.2.0/es2022/main.js:19:18821
        // TextEditor@http://localhost:5173/main.js:312:22
        // Cell@http://localhost:5173/main.js:166:28
        // loadDataAndUiFromYaml/<@http://localhost:5173/main.js:425:62
        // loadDataAndUiFromYaml@http://localhost:5173/main.js:425:48
        // @http://localhost:5173/main.js:437:17
    return errorString.split(/\n/g,).map(line=>html`<p>${line}</p>`)
}

