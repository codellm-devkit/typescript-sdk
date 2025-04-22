import {addToLookupTable, getFromLookupTable} from "./lookupTable";

export function buildMethodDetail(value) {
    const {type_declaration, signature, callable_declaration} = value;
// Look up or create a new JCallable
    let j_callable = getFromLookupTable(type_declaration, signature);

    if (!j_callable) {
        // Create parameters from the callable declaration
        const parameterString = callable_declaration.split('(')[1]?.split(')')[0] || '';
        const parameters = parameterString === ''
            ? []
            : parameterString.split(',').map(t => ({
                name: null,
                type: t.trim(),
                annotations: [],
                modifiers: [],
                start_line: -1,
                end_line: -1,
                start_column: -1,
                end_column: -1
            }));

        // Create a new JCallable
        j_callable = {
            signature,
            is_implicit: true,
            is_constructor: callable_declaration.includes("<init>"),
            comments: [],
            annotations: [],
            modifiers: [],
            thrown_exceptions: [],
            declaration: "",
            parameters,
            code: "",
            start_line: -1,
            end_line: -1,
            referenced_types: [],
            accessed_fields: [],
            call_sites: [],
            variable_declarations: [],
            crud_operations: null,
            crud_queries: null,
            cyclomatic_complexity: 0
        };

        // Store in lookup table
        addToLookupTable(type_declaration, signature, j_callable);
    }

    // Create and return JMethodDetail
    return {
        method_declaration: j_callable.declaration,
        klass: type_declaration,
        method: j_callable
    };
}