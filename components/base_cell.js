import { Column } from "../imports/good_component.js"

// [name="Cell"] {
// }
export function BaseCell({cellId }={}) {
    return Column({
        name: "Cell",
        id: `cell-${cellId}`,
        width: "100%",
        position: "relative",
        transistion: `all 0.2s ease-in-out`,
        "max-width": "61.4rem",
        "border": "solid var(--theme-accent) 1px",
        "border-radius": "1rem",
        "margin-top": "2rem",
        // "padding": "0.3rem",
        background: "var(--theme-background)",
    })
}