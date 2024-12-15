import { parserFromWasm, xmlStylePreview } from "https://deno.land/x/deno_tree_sitter@0.2.6.0/main.js"
// import { parserFromWasm, xmlStylePreview } from "/Users/jeffhykin/repos/deno-tree-sitter/main.js"
import javascript from "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/4d8a6d34d7f6263ff570f333cdcf5ded6be89e3d/main/javascript.js"
const parser = await parserFromWasm(javascript) // path or Uint8Array
import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingKebabCase, toScreamingSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix } from "https://deno.land/x/good@1.13.0.1/string.js"


const builtins = {
    "console": {
        log: console.log,
        error: console.error,
    },
    "Math": {
        random: ()=>Math.random(),
    },
    "require": (path)=>{
        if (path.startsWith("https://") || path.startsWith("http://")) {
            return import(path)
        } else {
            return import(`https://esm.sh/${path}`)
        }
    },
}

const runCode = ({ code, runtime, outputElement, }) => {
    const result = eval(code)
    return result
}
const makeRuntime = ({ randomSeed, }) => {
    const runtime = {...builtins}
    return runtime
}