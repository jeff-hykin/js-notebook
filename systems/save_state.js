import storageObject from "https://esm.sh/gh/jeff-hykin/storage-object@0.0.3.5/main.js"
import { dump, load } from "https://esm.sh/js-yaml@4.1.0/"
import debounce from "https://esm.sh/lodash@4.17.21/debounce.js"
const yaml = { stringify: dump, parse: load }

export const activeState = {
    settings: {
    },
    cells: [],
}
let prevState = activeState

// 
// misc helpers
// 
    export const injectCellAfter = ({existingCell, cellToInject})=>{
        const cellId = existingCell.cellId
        let index = -1
        for (const each of activeState.cells) {
            index++
            if (each.cellId == cellId) {
                activeState.cells.splice(index+1, 0, newCellData)
                break
            }
        }
    }
    export const injectCellBefore = ({existingCell, cellToInject})=>{
        const cellId = existingCell.cellId
        let index = -1
        for (const each of activeState.cells) {
            index++
            if (each.cellId == cellId) {
                activeState.cells.splice(index, 0, newCellData)
                break
            }
        }
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
        const obj = yaml.parse(yamlString)
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
        debounce(()=>{
            storageObject.activeState = yaml.stringify(activeState)
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
            activeState = prevState
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