import { convertImports } from "./parsing.js"
import { isValidIdentifier } from "../imports/good_js.js"
import { toRepresentation } from "../imports/good_js.js"

const { console, Math, Date, setTimout, setInterval, clearTimeout, clearInterval, fetch, Uint8Array, Map, Set, URL, WebAssembly, Array, Number, Symbol, Promise, RegExp, Error, document } = globalThis
const elementLogger = (element, tag, ...args)=>{
    const el = document.createElement("p")
    el.classList.add(`console-${tag}`)
    el.innerText = args.map((each)=>{
        if (typeof each == "string") {
            return each
        } else {
            return toRepresentation(each)
        }
    }).join(" ")
    element.append(el)
}
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
            elementLogger(this.$element, "error", ...args)
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
            elementLogger(this.$element, "log", ...args)
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
            elementLogger(this.$element, "warn", ...args)
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
export const runCode = async ({ code, runtime, outputElement }) => {
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
    let newCode = `({${variableNames.join(", ")}})=>((async function() {"use strict"; ${code}
        ;})())`
    // console.debug(`code is:`,newCode)
    let cellAsFunction
    try {
        // run a non-local eval, so there are no variable leaks
        cellAsFunction = eval?.(newCode)
    } catch (error) {
        // basically only syntax errors are possible here
        return {
            syntaxError: error,
        }
    }
    try {
        Object.assign(runtime, await cellAsFunction(runtime))
    } catch (error) {
        return {
            runtimeError: error,
        }
    }
    return {}
}