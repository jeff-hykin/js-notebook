// import * as danfo from './tools/danfo.js'
// import * as danfo from 'https://esm.sh/danfojs@1.1.2/dist/danfojs-browser/src/index.js?dev'
    // as part of danfojs, we could reuse these to minimize import size:
        // xlsx@0.17.2/esnext/xlsx.development.mjs
        // plotly.js-dist-min@2.8.0/esnext/plotly.js-dist-min.development.mjs
        // tensorflow/tfjs-core@3.21.0/esnext/dist/base_side_effects.development.js
        // fullwidth-code-point@3.0.0/esnext/is-fullwidth-code-point.development.mjsment.js
        // tensorflow/tfjs-backend-cpu@3.21.0/esnext/dist/base.development.js
        // tensorflow/tfjs-backend-webgl@3.21.0/esnext/dist/kernels/AddN.development.js
        // tensorflow/tfjs-core@3.21.0/esnext/dist/ops/image/non_max_suppression.development.js
        // tensorflow/tfjs-backend-webgl@3.21.0/esnext/dist/kernel_utils/reduce.development.js
// window.danfo = danfo
// https://github.com/nhn/tui.editor
// import 'https://esm.sh/@toast-ui/editor/dist/toastui-editor.css'

// TODO:
    // DONE: get console.log to show up in $out
    // DONE: make a save-yaml button  (body.innerHTML save to file)
    // DONE: markdown editor
        // make shift+enter to go to the next editable cell (e.g. markdown or code)
    // refactor some stuff
        // DONE: cleanup state management
        // clean up cell management
        // fixup theming
        // ctrl+enter focuses on the next cell (for markdown and code)
    // file drag-and-drop
        // DONE: event handling
        // DONE: add to runtime
        // get working on body drag-and-drop
        // only preview part of the file string to save on memory
    // persist page reload
        // DONE: edited data stays in sync with yamlData
        // DONE: debounce save-to-local-storage
        // generate cells and runtime from a yaml
        // save html output in the yaml
        // fix the file blobs reloading into variables
    // run code experince
        // DONE: show output
        // DONE: show runtime/syntax errors
        // DONE: auto-export some variables
        // add a loader/spinner for cells
        // fix pathing line-highlighting of errors
        // detect top level destructured variable names
        // convert export statements to return aggregation
        // use tree sitter to get the line number of syntax errors
    // create a lockfile of unspecified imports
        // resolve them to their versioned esm urls
        // add hash of data to lockfile
    // add filesystem
    // image renderer
    // theme system
