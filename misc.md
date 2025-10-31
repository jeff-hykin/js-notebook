Summary:

 - There's a StateManager
        - it can run on the backend (no direct connection to the UI)
        - it doesn't use any globals (multiple instances can be created)
        - the state of the whole notebook always equivalent to a yaml object (theme, cells, etc)
        - it has tools for adding/removing/running cells
    - The current major problems:
        - How to serialize rended output cells:
            - Every output cell is an iframe
            - Saving to HTML using outerHTML might fix this problem
            - Saving to YAML however:
                - When a cell renders output, it potentially effects the CSS of the output iframe. When serializing the state, the styles elements, etc of that iframe need to be preserved. Even if they're preserved it will probably break interactivity since JS and other stuff is not setup. Maybe outerHTML of the iframe is the best option?
                - Taking a screenshot of the iframe is semi-possible, but would loose interactivity
        - When loading a state, should the theme be loaded as well? should we ask the user?
            - Maybe let the export decide (no theme = keep existing theme active)
        - The theme probably should be split into a syntax theme and a UI theme, maybe even be able to merge multiple themes
    - The current minor problems:
        - setting a variable in one cell doesn't mean its available in another cell
        - importing "npm:" or "jsr:" should auto-resolve to an esm url



- on download
    - grab all the styles of iframes and their innerHTML `[...document.head.children].filter(each=>each.tagName=="STYLE")`
    - include zip of files in the yaml

- create a loader for yaml
    - create an HTML download button that works for 

- better file system
    - file system on drop
        - make a file system cell
            - if text, show as text editor
        - render possible options for manipulating the file
            - read text
            - csv parsing
    - on hover show indicator that file can be dropped to be imported 
    - clean up the state management of file system
        - have a get-folders
        - create event for add
        - create tool for append (allow array representation of content)

- figure out something for plotting

- UI inputs
    - connect them to a variable
    - auto-re-run code when input changes

- stage 2
    - consider hooking up file system to duckdb or some other persistent storage

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
