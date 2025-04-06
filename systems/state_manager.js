import { Event, trigger, everyTime, once } from "../imports/good_js.js"
import { get, set, remove, merge } from "../imports/good_js.js"
import { zipParse, zipCreate } from '../imports/good_js.js'
import { makeRuntime, runCode } from "../tools/js_runtime.js"
import { dump, load } from "../imports/js_yaml.js"
import { toKebabCase } from "../imports/good_js.js"
const yaml = { stringify: dump, parse: load }

// NOTE: despite mentioning a theme, this whole file should be completely usable without a browser/DOM
const defaultTheme = {
    name: "default-dark",
    // background: "#546E7A",
    background: "#121212",
    foreground: "white",
    secondaryForeground: "whitesmoke",
    // secondaryBackground: "#272c35",
    secondaryBackground: "#292e37",
    green: "turquoise",
    red: "salmon",
    blue: "cornflowerblue",
    yellow: "#E5C07B",
    accent: "rgba(3,105,161)",
    
    "markdownDarkCharcoal": "#121212",
    "markdownCharcoalGray": "#232428",
    "markdownSlateGray": "#292e37",
    "markdownTealSlate": "#2b4455",
    "markdownDarkSlate": "#2d2f34",
    "markdownCharcoalDark": "#303135",
    "markdownStormGray": "#303238",
    "markdownDeepMaroon": "#35262a",
    "markdownGraphiteGray": "#36383f",
    "markdownMutedWine": "#392d31",
    "markdownDarkSilver": "#393b42",
    "markdownDeepStone": "#3a3c42",
    "markdownBlueGray": "#3c424d",
    "markdownAshGray": "#494c56",
    "markdownSteelGray": "#535662",
    "markdownShadowGray": "#55575f",
    "markdownMistGray": "#595c68",
    "markdownDustyBlue": "#757a86",
    "markdownFogGray": "#777980",
    "markdownCoolGray": "#8f939f",
    "markdownSilverGray": "#969aa5",
    "markdownLightGray": "#9a9da3",
    "markdownLightSilver": "#aaa",
    "markdownSoftSilver": "#b3b5bc",
    "markdownLightIvory": "#eee",
    "markdownPureWhite": "#fff",
    "markdownDeepBlue": "#1f70de",
    "markdownOceanBlue": "#327491",
    "markdownSkyBlue": "#32baff",
    "markdownSoftBlue": "#4b96e6",
    "markdownLightTeal": "#65acca",
    "markdownPaleBlue": "#67ccff",
    "markdownRosePink": "#c1798b",
    "markdownCoralRed": "#ef6767",
}

export class StateManager {
    constructor({
        jsonCellSystem,
        loadStateCallbacks=[],
        stateChangeCallbacks=[],
        onError=(message, error, source,)=>console.error(message),
    }={}) {
        let { config, theme, cells, fileSystemData, } = structuredClone(jsonCellSystem||{})
        this._config = config || {}
        this._theme = {...theme,...defaultTheme}
        this._fileSystemData = fileSystemData || {}

        this._initStackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        this.runtime = makeRuntime()
        this.activeState = structuredClone({
            cells: cells||[],
        })
        this.prevState = structuredClone(this.activeState)
        this.loadStateCallbacks = new Set([...loadStateCallbacks])
        this.stateChangeCallbacks = new Set([...stateChangeCallbacks])
    }
    
    // 
    // config
    // 
    configChange = new Event()
    get config() { return Object.freeze(structuredClone(this._config))  }
    set config(value) {
        if (!(value instanceof Object)) {
            throw new TypeError(`config must be an object`)
        }
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.configChange, {keyList:[], value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setter of config`})
        )
        this._config = structuredClone(value)
    }
    setConfig(keyList, value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.configChange, {keyList, value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setConfig`})
        )
        set({ keyList, on: this._config, to: value})
    }
    removeConfig(keyList) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.configChange, {keyList, value: undefined, action: "remove"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `removeConfig`})
        )
        remove({ keyList, from: this._config})
    }
    mergeConfig(value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        if (!(value instanceof Object)) {
            throw new TypeError(`config must be an object`)
        }
        trigger(this.configChange, {keyList: [], value, action: "merge"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `mergeConfig`})
        )
        this._config = merge({ oldData: this._config, newData: value})
    }
    
    // 
    // theme
    // 
    themeChange = new Event()
    get theme() { return Object.freeze(structuredClone(this._theme))  }
    set theme(value) {
        if (!(value instanceof Object)) {
            throw new TypeError(`theme must be an object`)
        }
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.themeChange, {keyList:[], value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setter of theme`})
        )
        this._theme = structuredClone(value)
    }
    setTheme(keyList, value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.themeChange, {keyList, value, action: "set"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `setTheme`})
        )
        set({ keyList, on: this._theme, to: value})
    }
    removeTheme(keyList) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        trigger(this.themeChange, {keyList, value: undefined, action: "remove"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `removeTheme`})
        )
        remove({ keyList, from: this._theme})
    }
    mergeTheme(value) {
        const stackFrame = new Error().stack.split("\n").slice(2).join("\n").trim()
        if (!(value instanceof Object)) {
            throw new TypeError(`theme must be an object`)
        }
        trigger(this.themeChange, {keyList: [], value, action: "merge"}).catch(
            makeRobustErrorHandler({ initStackFrame: this._initStackFrame, stackFrame, source: `mergeTheme`})
        )
        this._theme = merge({ oldData: this._theme, newData: value})
    }
    
    // 
    // serializing
    // 
    toYaml() {
        return yaml.stringify({
            config: this._config,
            theme: this._theme,
            fileSystemData: this._fileSystemData,
            cells: this.activeState.cells,
        })
    }
    themeToCssString() {
        let styleChunks = []
        for (const [key, value] of Object.entries(this._theme)) {
            styleChunks.push(`--theme-${toKebabCase(key)}: ${value};`)
        }
        return styleChunks.join("\n")
    }
    getCodeMirrorTheme() {
        return {settings: structuredClone(this._theme)}
    }

    // 
    // serial events
    // 
    
    // listener
    onLoadState(callback) {
        this.loadStateCallbacks.add(callback)
        return this.loadStateCallbacks.size-1
    }

    // trigger
    loadDataFromYaml(yamlString) {
        let obj = yaml.parse(yamlString)
        if (!(obj?.cells instanceof Array)) {
            obj = {
                cells: [],
            }
        }
        for (const [key, value] of Object.entries(obj)) {
            delete this.activeState[key]
        }
        Object.assign(this.activeState, obj)
        this.prevState = structuredClone(this.activeState)
        let returnVals = []
        for (let each of new Set([...this.loadStateCallbacks, ...this.stateChangeCallbacks])) {
            try {
                returnVals.push(each(this.activeState))
            } catch (error) {
                console.error(error?.stack||error)
            }
        }
        return returnVals
    }
    
    // listener
    onStateChange(callback) {
        this.stateChangeCallbacks.add(callback)
        return this.stateChangeCallbacks.size-1
    }
    // trigger
    _activeStateWasUpdated() {
        // ensure the new state is yaml-able
        try {
            this.toYaml() // attempt trigger error 
            this.prevState = structuredClone(this.activeState)
        } catch (error) {
            const stateClone = structuredClone(this.prevState)
            for (const [key, value] of Object.entries(this.activeState)) {
                delete this.activeState[key]
            }
            Object.assign(this.activeState, stateClone)
            throw error
        }
        let returnVals = []
        for (let each of this.stateChangeCallbacks) {
            try {
                returnVals.push(each(this.activeState))
            } catch (error) {
                console.error(error?.stack||error)
            }
        }
        return returnVals
    }
    getCellFromId(cellId) {
        for (const each of this.activeState.cells) {
            if (each.cellId == cellId) {
                return each
            }
        }
        return {}
    }
    injectCellAfter({existingCell, cellToInject}) {
        const cellId = existingCell.cellId
        let index = -1
        for (const each of this.activeState.cells) {
            index++
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index+1, 0, cellToInject)
                break
            }
        }
        this._activeStateWasUpdated()
    }
    injectCellBefore({existingCell, cellToInject}) {
        const cellId = existingCell.cellId
        let index = -1
        for (const each of this.activeState.cells) {
            index++
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index, 0, cellToInject)
                break
            }
        }
        this._activeStateWasUpdated()
    }
    removeCellData({cellId}) {
        let index = -1
        for (const each of this.activeState.cells) {
            index++
            if (each.cellId == cellId) {
                this.activeState.cells.splice(index, 1)
                break
            }
        }
        this._activeStateWasUpdated()
    }
    
    // 
    // runtime
    // 
    runCode(code, {outputElement}) {
        return runCode({
            code,
            runtime: this.runtime,
            outputElement,
        })
    }
}

const makeRobustErrorHandler = ({ initStackFrame, stackFrame, source})=>{
    return (error)=>{
        const errorMessage = `Error was caused in a callback after ${source}\n\nThe main object was initilized here:\n${this._initStackFrame}\n\nThe ${source} was called here:\n${stackFrame}\n\nThe error in the callback itself is:\n${error?.stack||error}`
        safeCallErrorHandler(errorMessage, error, source, onError)
    }
}

const safeCallErrorHandler = (errorMessage, error, source, handler)=>{
    try {
        Promise.resolve(handler(errorMessage, error, source)).catch(error=>{
            console.error("Error while trying to report another error")
            console.error("Original error was:")
            console.error(errorMessage)
            console.error("Error in handling that error:")
            console.error(error?.stack||error)
        })
    } catch (error) {
        console.error("Error while trying to report another error")
        console.error("Original error was:")
        console.error(errorMessage)
        console.error("Error in handling that error:")
        console.error(error?.stack||error)
    }
}