export function focusOn(element) {
    const tabIndex = element.getAttribute("tabindex")
    element.setAttribute("tabindex", "-1")
    element.focus()
    element.setAttribute("tabindex", tabIndex)
}