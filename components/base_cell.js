import { Column } from "../imports/good_component.js"

export function BaseCell({cellId }={}) {
    return Column({
        name: "Cell",
        id: `cell-${cellId}`,
        borderTop: "2px solid var(--theme-background)",
        width: "100%",
        position: "relative",
        transistion: `all 0.2s ease-in-out`,
    })
}