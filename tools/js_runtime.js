import { convertImports } from "./parsing.js"
import { isValidIdentifier } from "https://deno.land/x/good@1.13.1.0/flattened/is_valid_identifier.js"

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
    ...globalThis,
}

export const makeRuntime = ({ randomSeed, }) => {
    const runtime = {...builtins}
    runtime.globalThis = runtime
    return runtime
}

/**
 * @example
 * ```js
 * let runtime = { console: { log: (...args)=>console.log("ha!", ...args) } }
 * await runCode({
 *     code: `
 *         console.log("hello")
 *         return { foo: "bar" }
 *     `,
 *     runtime,
 *     outputElement: null,
 * })
 * console.log("final runtime is:", runtime)
 * ```
 */
export const runCode = async ({ code, runtime, outputElement, }) => {
    code = convertImports(code)
    runtime.globalThis = runtime.globalThis || runtime
    runtime.$out = outputElement
    const variableNames = [...new Set(Object.keys(runtime).concat(Object.keys(builtins)).concat(Object.keys(globalThis)))].filter(isValidIdentifier)
    let cellAsFunction
    try {
        cellAsFunction = eval?.(`
            ({${variableNames.join(", ")}})=>((async function() {"use strict";
                ${code}
            })())
        `)
    } catch (error) {
        // basically only syntax errors are possible here
        return {
            syntaxError: error,
        }
    }
    try {
        Object.assign(runtime, await cellAsFunction(runtime))
    } catch (error) {
        // TODO: handle error
        console.debug(`error.stack is:`,error.stack)
        return {
            runtimeError: error,
        }
    }
}