var a = 10,b,c=2
var hh = {}
hh["i"] = 10
hh.i = 10
let aa = ()=>{ let g = a+b; return 10 }
let bb = ()=>a+c
a += 11
a = 1
const ccc = 10
let ladjkfl = 499420

import { parserFromWasm, xmlStylePreview } from "https://deno.land/x/deno_tree_sitter@0.2.8.3/main.js"
import javascript from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/676ffa3b93768b8ac628fd5c61656f7dc41ba413/main/javascript.js"

const parser = await parserFromWasm(javascript) // path or Uint8Array
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.72/main/file_system.js"
import { run, hasCommand, throwIfFails, zipInto, mergeInto, returnAsString, Timeout, Env, Cwd, Stdin, Stdout, Stderr, Out, Overwrite, AppendTo, } from "https://deno.land/x/quickr@0.6.72/main/run.js"
import { Console, clearAnsiStylesFrom, black, white, red, green, blue, yellow, cyan, magenta, lightBlack, lightWhite, lightRed, lightGreen, lightBlue, lightYellow, lightMagenta, lightCyan, blackBackground, whiteBackground, redBackground, greenBackground, blueBackground, yellowBackground, magentaBackground, cyanBackground, lightBlackBackground, lightRedBackground, lightGreenBackground, lightYellowBackground, lightBlueBackground, lightMagentaBackground, lightCyanBackground, lightWhiteBackground, bold, reset, dim, italic, underline, inverse, strikethrough, gray, grey, lightGray, lightGrey, grayBackground, greyBackground, lightGrayBackground, lightGreyBackground, } from "https://deno.land/x/quickr@0.6.72/main/console.js"
import DateTime from "https://deno.land/x/good@1.13.1.0/date.js"
import { allKeys } from "https://deno.land/x/good@1.13.1.0/value.js"
let root,tree
FileSystem.write({
    path: "./test.js.html",
    data: xmlStylePreview(root=(tree=parser.parse(FileSystem.sync.read(FileSystem.thisFile))).rootNode),
})

// console.debug(`allKeys(tree) is:`,allKeys(tree))
console.debug(`tree.language.fields is:`,tree.language.fields)
for (let each of root.quickQuery(`(assignment_expression)`)) {
    console.debug(`each is:`,each)
}

// import {g} from "./test.js"
function f(a,b,c){
    return a+b+c && {g:a+b}
}
console.log("Hello World!")
var howd