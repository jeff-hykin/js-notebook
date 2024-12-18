import { convertImports } from "./parsing.js"
import { isValidIdentifier } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.1.0/source/flattened/is_valid_identifier.js"
import { toRepresentation } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.5.0/source/flattened/to_representation.js"

const { console, Math, Date, setTimout, setInterval, clearTimeout, clearInterval, fetch, Uint8Array, Map, Set, URL, WebAssembly, Array, Number, Symbol, Promise, RegExp, Error, document } = globalThis
const consoleElement = {
    $element: null,
    assert: console.assert,
    clear: console.clear,
    count: console.count,
    countReset: console.countReset,
    debug: console.debug,
    dir: console.dir,
    dirxml: console.dirxml,
    error: function(...args){
        if (this.$element) {
            const el = document.createElement("p")
            el.classList.add("console-error")
            el.innerText = args.map(toRepresentation).join(" ")
            this.$element.append(el)
        } else {
            console.error(...args)
        }
    },
    exception: console.exception,
    group: console.group,
    groupCollapsed: console.groupCollapsed,
    groupEnd: console.groupEnd,
    info: console.info,
    log: function(...args){
        if (this.$element) {
            const el = document.createElement("p")
            el.classList.add("console-log")
            el.innerText = args.map(toRepresentation).join(" ")
            this.$element.append(el)
        } else {
            console.log(...args)
        }
    },
    profile: console.profile,
    profileEnd: console.profileEnd,
    table: console.table,
    time: console.time,
    timeEnd: console.timeEnd,
    timeLog: console.timeLog,
    timeStamp: console.timeStamp,
    trace: console.trace,
    warn: function(...args){
        if (this.$element) {
            const el = document.createElement("p")
            el.classList.add("console-warn")
            el.innerText = args.map(toRepresentation).join(" ")
            this.$element.append(el)
        } else {
            console.warn(...args)
        }
    },
}
const builtins = {
    "console": consoleElement,
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

export const makeRuntime = ({ randomSeed, }={}) => {
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
export const runCode = async ({ code, runtime, outputElement, cellNumber=0 }) => {
    code = convertImports(code)
    // global overrides
    runtime.globalThis = runtime.globalThis || runtime
    runtime.$out = outputElement
    runtime.console = { ...consoleElement, ...runtime.console }
    runtime.console.$element = outputElement

    const variableNames = [
        ...new Set(
            Object.keys(runtime).concat(
                Object.keys(globalThis)
            )
        )
    ].filter(isValidIdentifier)
    let cellAsFunction
    try {
        // run a non-local eval, so there are no variable leaks
        cellAsFunction = eval?.(`({${variableNames.join(", ")}})=>((async function() {"use strict"; ${code}
        ;})())`)
    } catch (error) {
        console.debug(`error is:`,error)
        console.debug(`error.stack is:`,error.stack)
        // basically only syntax errors are possible here
        return {
            syntaxError: error,
        }
    }
    try {
        Object.assign(runtime, await cellAsFunction(runtime))
    } catch (error) {
        // TODO: handle error
        console.debug(`error is:`,error)
        console.debug(`error.stack is:`,error.stack.replace(/@http:\/\/localhost:.+ eval:/g, `cell: ${cellNumber}:`))
        return {
            runtimeError: error,
        }
    }
    return {}
}