import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"
import { dump, load } from "https://esm.sh/js-yaml@4.1.0/"
// import debounce from "https://esm.sh/lodash@4.17.21/debounce.js"
import throttle from "https://esm.sh/lodash@4.17.21/throttle.js"
const yaml = { stringify: dump, parse: load }

const localStorageKey = "activeState"

export const activeState = {
    settings: {
    },
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
        if (!(obj?.cells instanceof Array) || !(obj?.settings instanceof Object)) {
            obj = {
                settings: {
                },
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