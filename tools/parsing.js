import { Parser } from "https://esm.sh/acorn@8.10.0"
import { importAttributes } from "https://esm.sh/acorn-import-attributes@1.9.5"
import { convertJsCodeToBase64ImportString } from "https://deno.land/x/good@1.13.3.2/flattened/convert_js_code_to_base64_import_string.js"
const MyParser = Parser.extend(
    importAttributes
)

// import { parserFromWasm } from "https://deno.land/x/deno_tree_sitter@0.2.8.3/main.js"
import { parserFromWasm } from "/Users/jeffhykin/repos/deno-tree-sitter/main.js"
import javascript from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/676ffa3b93768b8ac628fd5c61656f7dc41ba413/main/javascript.js"

const parser = await parserFromWasm(javascript) // path or Uint8Array

export function generateNewJs(code, websocketAddress) {
    const acornTree = MyParser.parse(code,  { sourceType: 'module', ecmaVersion: 2022 })
    let hoisted = []
    let newChunks = [
        `
        import { toRepresentation } from "https://deno.land/x/good@1.13.3.0/string.js"
        import * as _yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
        const _socket = new WebSocket(${JSON.stringify(websocketAddress)})
        const _connection = new Promise((resolve, reject)=>{
            _socket.addEventListener("open", (event)=>{
                resolve(_socket)
            })
            _socket.addEventListener("error", (event)=>{
                reject(event)
            })
        })

        const _identifierLookup = {}
        const _dataByLineNumber = {}
        let _context = []
        function _record(object, context, returnVal) {
            let address = _context.map(each=>each.func)
            let lineNumberHistory = (_dataByLineNumber[context.line]||=[])
            let lineNumberHistoryEntry = {}
            for (const [key, value] of Object.entries(object)) {
                const id = JSON.stringify([...address, key])
                let identifierHistory = (_identifierLookup[id]||=[])
                let entry = {context: [..._context]}
                try {
                    entry.repr = toRepresentation(value)
                } catch (error) {
                    
                }
                try {
                    entry.yaml = _yaml.stringify(value)
                } catch (error) {
                    
                }
                lineNumberHistoryEntry[key] = entry
                identifierHistory.push(entry)
            }
            lineNumberHistory.push(lineNumberHistoryEntry)
            return returnVal
        }
        function _recordAssignment(key, value, lineNumber) {
            let address = _context.map(each=>each.func)
            let lineNumberHistory = (_dataByLineNumber[lineNumber]||=[])
            let lineNumberHistoryEntry = {}
            const id = JSON.stringify([...address, key])
            let identifierHistory = (_identifierLookup[id]||=[])
            let entry = {context: [..._context]}
            try {
                entry.repr = toRepresentation(value)
            } catch (error) {
                
            }
            try {
                entry.yaml = _yaml.stringify(value)
            } catch (error) {
                
            }
            lineNumberHistoryEntry[key] = entry
            identifierHistory.push(entry)
            lineNumberHistory.push(lineNumberHistoryEntry)
            return value
        }
        function _monkeyPatch(object, attrName, createNewFunction) {
            let prevObj = null
            while (!Object.getOwnPropertyNames(object).includes(attrName)) {
                prevObj = object
                object = Object.getPrototypeOf(object)
                if (prevObj === object) {
                    throw new Error(\`Could not find \${attrName} on \${object}\`)
                }
            }
            const originalFunction = object[attrName]
            let theThis
            const wrappedOriginal = function(...args) {
                return originalFunction.apply(theThis, args)
            }
            const innerReplacement = createNewFunction(wrappedOriginal)
            object[attrName] = function(...args) {
                theThis = this
                return innerReplacement.apply(this, args)
            }
        }
        // _monkeyPatch(Array.prototype, "map", (original)=>(...args)=>{
        //     const theFunction = args[0]
        //     args[0] = function(value, index, array, ...args) {
        //         _context.push({map: {value, index}})
        //         let out
        //         try {
        //             out = theFunction.apply(this, [value, index, array, ...args])
        //         } catch (error) {
        //             _context.pop()
        //             throw error
        //         }
        //         _context.pop()
        //         return out
        //     }
        //     return original.apply(this, args)
        // })
        const _wrapFunction = (name, original)=>{
            return function(...args) {
                _context.push({ func: name, args })
                let out
                try {
                    out = original.apply(this, args)
                } catch (error) {
                    _context.pop()
                    throw error
                }
                _context.pop()
                return out
            }
        }
        `,
        hoisted,
    ]
    let endOfPreviousSlice = 0
    let lineNumber = 0
    const tree = parser.parse(code)
    let root = tree.rootNode
    function applyReplacements(replacements) {
        for (let [node, text] of replacements) {
            console.debug(`node is:`,node)
            node.gutWith(text)
        }
        replacements.length = 0
    }
    // hoist imports
    let replacements = []
    for (let each of root.quickQuery(`(import_statement)`).slice(0,2)) {
        hoisted.push(each.text+"\n")
        console.debug(`each.text is:`,each)
        replacements.push([each, ``])
    }
    applyReplacements(replacements)
    console.debug(`hoisted is:`,hoisted)
    console.debug(`tree.string is:`,tree.string)
    Deno.exit()
    
    // 
    // variable declaration statements (record value right after)
    // 
    for (let each of root.quickQuery(`(variable_declaration)`).concat(root.quickQuery(`(lexical_declaration)`))) {
        console.debug(`each.text is:`,each.text)
        const varNames = each.quickQuery(`(variable_declarator)`).map(eachDeclare=>eachDeclare.fields.name.text)
        replacements.push([each, `${each.text};\n_record({${varNames.map(each=>`${each}`).join(",")}}, {line:${each.startPosition.row}})\n`]) // remove from their previous location
    }
    applyReplacements(replacements)
    Deno.exit()
    // 
    // anonymous function wrappers
    // 
    for (let each of root.quickQuery(`(arrow_function)`)) {
        each.gutWith(`_wrapFunction(null, ${each.text})`)
    }
    // 
    // normal function wrappers
    // 
    for (let { statementBlock, functionDeclaration } of root.quickQuery(`(function_declaration (statement_block) @statementBlock) @functionDeclaration`)) {
        const nameNode = functionDeclaration.hardChildren.filter(each=>each.type == "identifier")[0]
        let name = null
        if (nameNode) {
            name = nameNode.text
        }
        statementBlock.gutWith(
            `{ _context.push({ func: ${JSON.stringify(name)}, args: arguments }) ;try ${statementBlock} finally { _context.pop() } }`
        )
    }

    // 
    // record variable usage
    // 
    for (let eachReturnStatement of root.quickQuery(`(return_statement)`)) {
        const identifiers = eachReturnStatement.quickQuery(`(identifier)`).map(each=>each.text)
        eachReturnStatement.gutWith(
            `return _record({${identifiers.join(",")}}, {line:${eachReturnStatement.startPosition.row}}, ${eachReturnStatement.text})`
        )
    }
    for (let arrowFunction of root.quickQuery(`(arrow_function)`)) {
        const body = arrowFunction.fields.body
        if (body.type != "BlockStatement") {
            const identifiers = body.quickQuery(`(identifier)`).map(each=>each.text)
            body.gutWith(
                `_record({${identifiers.join(",")}}, {line:${body.startPosition.row}}, ${body.text})`
            )
        }
    }
    // assignment expressions
    for (let each of root.quickQuery(`(assignment_expression)`).concat(root.quickQuery(`(augmented_assignment_expression)`))) {
        const assignee = each.fields.left
        const rootName = assignee.quickQueryFirst(`(identifier)`).text
        // NOTE: not always var assignment, can also be:
            // subscript_expression
            // member_expression
        each.gutWith(
            `_recordAssignment(${JSON.stringify(rootName)}, (${each.text}), ${each.startPosition.row})`
        )
    }

    // TODO:
        // if statements
        // for loop lengths
        

    // for (let each of acornTree.body) {
    //     let postChunk = ``
    //     let newEnd = each.end
    //     const existingCode = code.slice(endOfPreviousSlice, newEnd)
    //     let lineNumberEndOfChunk = lineNumber + (existingCode.match(/\n/g)||[]).length
    //     if (each.type == "VariableDeclaration") {
    //         const names = each.declarations.map(each=>each.id.name)
    //         postChunk = `\n_record({${names.map(each=>`${each}`).join(",")}}, {line:${lineNumberEndOfChunk}})\n`
    //     } else if (each.type == "ImportDeclaration") {
    //         hoisted.push(existingCode)
    //         endOfPreviousSlice = newEnd
    //         continue
    //     } else if (each.type == "FunctionDeclaration") {
    //         const functionName = each?.id?.name
    //         const topParameterNames = each?.params?.map(each=>each.name)
    //     } else if (each.type == "ExpressionStatement") {
    //     } else {
    //         console.debug(`each.type is:`,each.type)
    //     }
    //     lineNumber = lineNumberEndOfChunk
    //     newChunks.push(existingCode)
    //     newChunks.push(postChunk)
    //     endOfPreviousSlice = newEnd
    // }
    newChunks.push(tree.string)
    newChunks.push(`
        console.log(\`_dataByLineNumber\`, _dataByLineNumber)
        await _connection
        _socket.send(_yaml.stringify({
            from: "evalSystem",
            to: "web",
            dataByLineNumber: _dataByLineNumber,
        }))
    `)
    return newChunks.flat(0).join(`\n`)
}