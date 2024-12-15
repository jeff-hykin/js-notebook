
        import { toRepresentation } from "https://deno.land/x/good@1.13.3.0/string.js"
        import * as _yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
        const _socket = new WebSocket("ws://localhost:8080")
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
                    throw new Error(`Could not find ${attrName} on ${object}`)
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
        
import { parserFromWasm, xmlStylePreview } from "https://deno.land/x/deno_tree_sitter@0.2.8.3/main.js"
,ac628fd5c61656f7dc41ba413/main/javascript.js"

const parser = await parserFromWasm(javascript) // path or Uint8Array
import { FileSystem, glob } fr
,deno.land/x/quickr@0.6.72/main/run.js"
import { Console, c
,ghtWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackgroun
,ckground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.72/main/console.js"
import DateTime from "https://deno.land/x/good@1.13.1.0/date.js"
import { allKeys } from "https://deno.land/x/good@1.13.1.0/value.js"
let root,tree
FileSystem.write({
    path: "./test.js.html",
    data: xmlStylePreview(root=(tree=parser.parse(FileSystem.sync.read(FileSystem.thisFile))
,
,

var a = 10,b,c=2;
_record({a;
_record({co}, {line:1})
,b,c}, {line:0})

var hh ;
_record({
}, {line:4})
= {};
_record({in}, {line:5})

hh;
_record({:5}}, {lin;
_record({cord({:}, {line:9})
e:8})
["i"];
_record({,c,
}, {line:4})
_recor_recordAssignment("dA", (dAssignme), 1)nt("", ( = 10), 0)
hh.i = 10
let aa = _wrapFunction(null, ()=>{ let g = a+b; r_wrapFunction(null, eturn 1)0 })return _record({}, {line:80}, )_record({,,}, __recordAssignment("r", (record(), 171){_recordAssignment("{", ({,i},), 172) {line:112}, {li)ne:111}, )
let bb = ()=>a+c
a += 11
a = 1
const ccc = 10
let ladjkfl = 499420


// import {;
_record({}, {line:13})
 parserFromWasm, xmlStylePreview } from "/Users/jeffhykin/repos/deno-tree-sitter/main.js"
import javascript from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/676ffa3b93768b8om "https://deno.land/x/quickr@0.6.72/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://learAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magen;
_record({,}, {line:18})
ta, lightBlack, lid, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBa_recordAssignment("", (), 170)_recordAssignment("", (ckground, ), 170)lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBa).rootNode),
})

// console.debug(`allKeys(tree) is:`,allKeys(tree))
console.debug(`tree.language.fields is:`,tree.language.fields)
for (let each of root.quickQuery(`(assignment_expression)`)) {
    console.debug(`each is:`,each)
}

// import {g} from "./test.js"
function f(a,b,c){ _context.push({ func: "f", args: arguments }) ;try (statement_block (return_statement (binary_expression left: (binary_expression left: (binary_expression left: (identifier) right: (identifier)) right: (identifier)) right: (object (pair key: (property_identifier) value: (binary_expression left: (identifier) right: (identifier)))))return _record({,,,,}, {line:460}, ))) finally { _context.pop() } }
console.log("Hello World!")
var howd

        console.log(`_dataByLineNumber`, _dataByLineNumber)
        await _connection
        _socket.send(_yaml.stringify({
            from: "evalSystem",
            to: "web",
            dataByLineNumber: _dataByLineNumber,
        }))
    