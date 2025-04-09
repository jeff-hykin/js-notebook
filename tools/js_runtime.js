import { convertImports } from "./parsing.js"
import { isValidIdentifier } from "../imports/good_js.js"
import { toRepresentation } from "../imports/good_js.js"
import { allKeyDescriptions } from 'https://esm.sh/gh/jeff-hykin/good-js@1.15.0.0/source/flattened/all_key_descriptions.js'

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
// enable remapping of document based on the caller (each runtime can get a different document)
const enableDocumentShimWarnings = true
let documentShimMapping = {}
if (typeof document != "undefined") {
    documentShimMapping = globalThis[Symbol.for('documentShimMapping')]
    if (!documentShimMapping) {
        documentShimMapping = globalThis[Symbol.for('documentShimMapping')] = {
            // [cellId]: {
            //     checker: (stack)=>true, stack is an array of strings
            //     document: document,
            // },
            // ex:
            // "19347": {
            //     checker: (stack)=>stack.at(-1).includes("@debugger eval"),
            //     document: {
            //         DOCUMENT_NODE: "it works!"
            //     },
            // }
        }
        // shim all the methods/keys etc
        for (let [key, {value, get, set, enumerable, configurable, writable}] of Object.entries(allKeyDescriptions(document))) {
            if (typeof get == "function"||typeof set == "function") {
                if (get) {
                    const realGet = get
                    get = (...args)=>{
                        const stack = new Error().stack.split(/\n\s*/g).slice(2).map(each=>each.replace(/^at /,"")).filter(each=>each.length)
                        for (const [cellId, {checker,document}] of Object.entries(documentShimMapping)) {
                            if (typeof checker == "function" && checker(stack)) {
                                return realGet.apply(document, args)
                            }
                        }
                        return realGet.apply(document, args)
                    }
                }
                if (set) {
                    const realSet = set
                    set = (...args)=>{
                        const stack = new Error().stack.split(/\n\s*/g).slice(2).map(each=>each.replace(/^at /,"")).filter(each=>each.length)
                        for (const [cellId, {checker,document}] of Object.entries(documentShimMapping)) {
                            if (typeof checker == "function" && checker(stack)) {
                                return realSet.apply(document, args)
                            }
                        }
                        return realSet.apply(document, args)
                    }
                }
                try {
                    Object.defineProperty(document, key, {
                        get,
                        set,
                        enumerable,
                        configurable,
                    })
                } catch (error) {
                    enableDocumentShimWarnings && console.warn(`Could not shim document.${key}`, error)
                }
            // value
            } else {
                if (typeof value == "function") {
                    const realMethod = value
                    value = (...args)=>{
                        const stack = new Error().stack.split(/\n\s*/g).slice(2).map(each=>each.replace(/^at /,"")).filter(each=>each.length)
                        for (const [cellId, {checker,document}] of Object.entries(documentShimMapping)) {
                            if (typeof checker == "function" && checker(stack)) {
                                return realMethod.apply(document, args)
                            }
                        }
                        return realMethod.apply(document, args)
                    }
                    // make even the function look like the real one
                    Object.defineProperty(value, "name", {
                        value: realMethod.name,
                    })
                    value.toString = realMethod.toString.bind(realMethod)
                    try {
                        Object.defineProperty(document, key, {
                            value,
                            enumerable,
                            configurable,
                            writable,
                        })
                    } catch (error) {
                        enableDocumentShimWarnings && console.warn(`Could not shim document.${key}`, error)
                    }
                } else {
                    try {
                        let set
                        if (writable) {
                            set = (newValue)=>{
                                const stack = new Error().stack.split(/\n\s*/g).slice(2).map(each=>each.replace(/^at /,"")).filter(each=>each.length)
                                for (const [cellId, {checker,document}] of Object.entries(documentShimMapping)) {
                                    if (typeof checker == "function" && checker(stack)) {
                                        return document[key] = newValue
                                    }
                                }
                                value = newValue
                                return newValue
                            }
                        }
                        Object.defineProperty(document, key, {
                            get: ()=>{
                                const stack = new Error().stack.split(/\n\s*/g).slice(2).map(each=>each.replace(/^at /,"")).filter(each=>each.length)
                                for (const [cellId, {checker,document}] of Object.entries(documentShimMapping)) {
                                    if (typeof checker == "function" && checker(stack)) {
                                        return document[key]
                                    }
                                }
                                return value
                            },
                            set,
                            enumerable,
                            configurable,
                            // writable,
                        })
                    } catch (error) {
                        enableDocumentShimWarnings && console.warn(`Could not shim document.${key}`, error)
                    }
                }
            }
        }
    }
}
const builtins = {
    document,
    "console": consoleElement,
    "Math": {
        ...Math,
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
export const runCode = async ({ code, runtime, outputElement, document }) => {
    code = convertImports(code)
    // global overrides
    runtime.globalThis = runtime.globalThis || runtime
    runtime.$out = outputElement // TODO: remove this before release
    runtime.console = { ...consoleElement, ...runtime.console }
    runtime.console.$element = outputElement
    runtime.document = document || runtime.document

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
        // run a non-local eval, so there are no variables (from this function) leaking into the runtime
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