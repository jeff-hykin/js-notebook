import storageObject from "../imports/storage_object.js"
import { dump, load } from "../imports/js_yaml.js"
import { toKebabCase } from "../imports/good_js.js"
// import debounce from "https://esm.sh/lodash@4.17.21/debounce.js"
import throttle from "https://esm.sh/lodash@4.17.21/throttle.js"
import { makeRuntime, runCode as pureRunCode } from "../tools/js_runtime.js"
const yaml = { stringify: dump, parse: load }

const localStorageKey = "activeState"
export const runtime = makeRuntime()
export const activeState = {
    cells: [],
    // [
    //     {
    //         cellId: Math.random(),
    //         type: "file",
    //         filePath: "test.js",
    //         coreContent: "howdy howdy",
    //         varName: "test",
    //     },
    //     {
    //         cellId: Math.random(),
    //         type: "jsCode",
    //         coreContent: "console.log('howdy')\n\n\n\n",
    //     },
    //     {
    //         cellId: Math.random(),
    //         type: "markdown",
    //         coreContent: "console.log('howdy')\n\n\n\n",
    //     },
    // ]
}
let prevState = activeState

// 
// misc helpers
// 
    export const getCellFromId = (cellId)=>{
        for (const each of activeState.cells) {
            if (each.cellId == cellId) {
                return each
            }
        }
        return {}
    }
    export const injectCellAfter = ({existingCell, cellToInject})=>{
        const cellId = existingCell.cellId
        let index = -1
        for (const each of activeState.cells) {
            index++
            if (each.cellId == cellId) {
                activeState.cells.splice(index+1, 0, cellToInject)
                break
            }
        }
        activeStateWasUpdated()
    }
    export const injectCellBefore = ({existingCell, cellToInject})=>{
        const cellId = existingCell.cellId
        let index = -1
        for (const each of activeState.cells) {
            index++
            if (each.cellId == cellId) {
                activeState.cells.splice(index, 0, cellToInject)
                break
            }
        }
        activeStateWasUpdated()
    }
    export const removeCellData = ({cellId})=>{
        let index = -1
        for (const each of activeState.cells) {
            index++
            if (each.cellId == cellId) {
                activeState.cells.splice(index, 1)
                break
            }
        }
        activeStateWasUpdated()
    }

// 
// load event
// 
    const loadStateCallbacks = new Set()
    // listener
    export const onLoadState = (callback)=>{
        loadStateCallbacks.add(callback)
        return loadStateCallbacks.size-1
    }
    // trigger(s)
    export const loadDataFromYaml = (yamlString)=>{
        let obj = yaml.parse(yamlString)
        if (!(obj?.cells instanceof Array)) {
            obj = {
                cells: [
                    {
                        cellId: Math.random(),
                        type: "file",
                        filePath: "test.js",
                        coreContent: "howdy howdy",
                        varName: "test",
                    },
                    {
                        cellId: Math.random(),
                        type: "jsCode",
                        coreContent: "console.log('howdy')\n\n\n\n",
                    },
                    {
                        cellId: Math.random(),
                        type: "markdown",
                        coreContent: "console.log('howdy')\n\n\n\n",
                    },
                ]
            }
        }
        // DEBUGGING override
        obj = {
            settings: {
            },
            cells: [
                // {
                //     cellId: Math.random(),
                //     type: "file",
                //     filePath: "test.js",
                //     coreContent: "howdy howdy",
                //     varName: "test",
                // },
                {
                    cellId: Math.random(),
                    type: "jsCode",
                    coreContent: "import { showToast } from \"https://esm.sh/gh/jeff-hykin/good-component@0.3.0/main/actions.js\"\nconsole.log('howdy')\n\nshowToast('hello!')\n\n",
                },
                {
                    cellId: Math.random(),
                    type: "markdown",
                    coreContent: "console.log('howdy')\n\n\n\n",
                },
            ]
        }
        for (const [key, value] of Object.entries(obj)) {
            delete activeState[key]
        }
        Object.assign(activeState, obj)
        prevState = structuredClone(activeState)
        for (let each of new Set([...loadStateCallbacks, ...stateChangeCallbacks])) {
            try {
                each(activeState)
            } catch (error) {
                console.error(error?.stack||error)
            }
        }
    }
// 
// change event
// 
    const stateChangeCallbacks = new Set([
        // save to local storage
        throttle(()=>{
            storageObject[localStorageKey] = yaml.stringify(activeState)
        }, 1000)
    ])
    // listener
    export const onStateChange = (callback)=>{
        stateChangeCallbacks.add(callback)
        return stateChangeCallbacks.size-1
    }
    // trigger(s)
    export const activeStateWasUpdated = ()=>{
        // ensure the new state is yaml-able
        try {
            yaml.stringify(activeState)
            prevState = structuredClone(activeState)
        } catch (error) {
            const stateClone = structuredClone(prevState)
            for (const [key, value] of Object.entries(activeState)) {
                delete activeState[key]
            }
            Object.assign(activeState, stateClone)
            throw error
        }

        for (let each of stateChangeCallbacks) {
            try {
                each(activeState)
            } catch (error) {
                console.error(error?.stack||error)
            }
        }
    }
// 
// runtime
// 
    export function runCode(code, {outputElement}) {
        return pureRunCode({
            code,
            runtime,
            outputElement,
        })
    }


export const defaultTheme = {
    name: "default-dark",
    background: "#546E7A",
    foreground: "white",
    secondaryForeground: "whitesmoke",
    secondaryBackground: "#272c35",
    green: "turquoise",
    red: "salmon",
    blue: "cornflowerblue",
    yellow: "#E5C07B",
    
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
export const activeTheme = {...defaultTheme}

export function themeToCssString() {
    let styleChunks = []
    for (const [key, value] of Object.entries(activeTheme)) {
        styleChunks.push(`--theme-${toKebabCase(key)}: ${value};`)
    }
    return styleChunks.join("\n")
}