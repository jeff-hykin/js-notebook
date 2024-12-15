import { parserFromWasm, xmlStylePreview } from "https://esm.sh/gh/jeff-hykin/deno-tree-sitter@0.2.8.4/main.js"
import javascript from "https://esm.sh/gh/jeff-hykin/common_tree_sitter_languages@1.3.1.1/main/javascript.js"
// import { capitalize, indent, toCamelCase, digitsToEnglishArray, toPascalCase, toKebabCase, toSnakeCase, toScreamingKebabCase, toScreamingSnakeCase, toRepresentation, toString, regex, findAll, iterativelyFindAll, escapeRegexMatch, escapeRegexReplace, extractFirst, isValidIdentifier, removeCommonPrefix } from "https://esm.sh/gh/jeff-hykin/good-js@1.13.2.0/source/string.js"

// FIXME: detect destructured top level assignments for auto-export

const parser = await parserFromWasm(javascript) // path or Uint8Array

/**
 * switch imports to a require statement for shimming
 *
 * @example
 * ```js
 * console.log(convertImports(`
 *     import { foo } from "bar"
 *     import { foo as bar } from "bar"
 *     import * as foo from "bar"
 *     import "bar"
 *     require("side_effect/bar")
 *     var a = require("bar/normal")
 * `))
 * // output:
 * //     var {foo} = await require("bar")
 * //     var {foo:bar} = await require("bar")
 * //     var foo = await require("bar")
 * //     await require("bar")
 * //     await require("side_effect/bar")
 * //     var a = await require("bar/normal")
 * ```
 *
 * @param arg1 - description
 * @param arg1.parameter - description
 * @returns {Object} output - description
 * @returns output.x - description
 *
 */
export function convertImports(code) {
    let stuffToExport = []
    const root = parser.parse(code).rootNode
    const maxResultDepth = 5 // NOTE: this not as limiting as it seems: we only need to find top-level require statements, all the others will be handled by a different query
                                //       it might be legitmately impossible to have a top level require that is deeper than this
    const handledStatements = [
        // require
        ...[
            ...root.quickQuery(`((call_expression (identifier) @funcCallName)  (#eq? @funcCallName "require"))`, { maxResultDepth }),
        ].map(each=>({...each, importType: 'normalRequire',})),
        
        // 
        // ES import
        // 
        ...[
            // ES import (all different types)
            ...root.quickQuery(`(import_statement (string) @importPath) @statement`, { maxResultDepth: maxResultDepth+1 }),
        ].map(each=>({...each, importType: 'esImport'})),
    ]
    
    const nodes = handledStatements.sort((a,b)=>(a.statement||a.funcCallName).startIndex-(b.statement||b.funcCallName).startIndex)
    const codeChunks = []
    let previousIndex = 0
    for (let { funcCallName, importPath, importType, statement } of nodes) {
        statement = statement || funcCallName
        codeChunks.push(
            code.slice(previousIndex, statement.startIndex)
        )
        previousIndex = statement.endIndex
        
        // 
        // require
        // 
        if (importType === "normalRequire") {
            codeChunks.push(
                `await require`
            )
        // 
        // es import
        // 
        } else if (importType === "esImport") {
            const text = statement.text
            // import type: side effect
            if (text.match(/^\s*import\s*("|').+\1\s*$/)) {
                codeChunks.push(
                    `await require(${importPath.text})`
                )
            } else {
                const importClause = statement.children.find(each=>each.type === "import_clause")
                let output = "var "
                for (let each of importClause.children) {
                    if (each.type === "ERROR") {
                        each = each.children[0]
                    }
                    if (each.type === ",") {
                        continue
                    }
                    if (each.type === "from") {
                        break
                    }
                    // default import
                    if (each.type === "identifier") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <identifier text="loadConfigFile_js" />
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./shared/loadConfigFile.js" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        // TODO: might need to be equal to default, unclear
                        output += ` ${each.text} = `
                    } else if (each.type === "namespace_import") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <namespace_import>
                        //             <"*" text="*" />
                        //             <as text="as" />
                        //             <identifier text="thing79" />
                        //         </namespace_import>
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./bundle-url" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        output += ` ${each.children[2].text} = `
                    } else if (each.type === "named_imports") {
                        // statement is: <import_statement>
                        //     <import text="import" />
                        //     <import_clause>
                        //         <named_imports>
                        //            <"{" text="{" />
                        //            <import_specifier>
                        //                <identifier text="thing79a" />
                        //            </import_specifier>
                        //            <"," text="," />
                        //            <import_specifier>
                        //                <identifier text="thing79b" />
                        //                <as text="as" />
                        //                <identifier text="thing79c" />
                        //            </import_specifier>
                        //            <"}" text="}" />
                        //         </named_imports>
                        //     </import_clause>
                        //     <from text="from" />
                        //     <string>
                        //         <"\"" text="\"" />
                        //         <string_fragment text="./bundle-url" />
                        //         <"\"" text="\"" />
                        //     </string>
                        // </import_statement>
                        for (let eachInner of each.children) {
                            if (eachInner.type === "import_specifier") {
                                output += eachInner.children.map(each=>each.type == "as"? ":" : each.text).join("")
                            } else if (eachInner.type === "as") {
                                output += ":"
                            } else {
                                output += eachInner.text
                            }
                        }
                        output += " = "
                    }
                }
                output = output.replace(/\s+/g, " ")
                output += `await require(${importPath.text})`
                codeChunks.push(
                    output
                )
            }
        } else {
            codeChunks.push(
                statement.text
            )
        }
    }
    codeChunks.push(
        code.slice(previousIndex, code.length)
    )

    const output = codeChunks.join("")
    const newRoot = parser.parse(output).rootNode
    // what to export
    for (let each of [
        // let/const
        ...newRoot.quickQuery(`((lexical_declaration (variable_declarator (identifier) @varName )) @statement)`, { maxResultDepth }),
        ...newRoot.quickQuery(`((variable_declaration (variable_declarator (identifier) @varName )) @statement)`, { maxResultDepth }),
    ]) {
        stuffToExport.push(each.varName.text)
    }

    return code + `;return {${stuffToExport.join(",")}}`
}