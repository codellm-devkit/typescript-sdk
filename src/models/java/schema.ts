/**
 * Copyright IBM Corporation 2025
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import z from 'zod';
import {CRUDOperationType, CRUDQueryType} from './enums';
import {buildMethodDetail} from './builders';
import {addToLookupTable} from "./lookupTable";

/**
 * Represents a comment in Java source code.
 *
 * @typedef {Object} JComment
 * @property {string|null|undefined} content - The content of the comment.
 * @property {number} start_line - The starting line of the comment.
 * @property {number} end_line - The ending line of the comment.
 * @property {number} start_column - The starting column of the comment.
 * @property {number} end_column - The ending column of the comment.
 * @property {boolean} is_javadoc - Whether the comment is a Javadoc comment.
 */
export const JComment = z.object({
    content: z.string().nullable().optional(),
    start_line: z.number().default(-1),
    end_line: z.number().default(-1),
    start_column: z.number().default(-1),
    end_column: z.number().default(-1),
    is_javadoc: z.boolean().default(false)
});

/**
 * Represents a record component in Java.
 *
 * @typedef {Object} JRecordComponent
 * @property {JComment} comment - The comment associated with the record component.
 * @property {string} name - The name of the record component.
 * @property {string} type - The type of the record component.
 * @property {string[]} modifiers - The modifiers of the record component.
 * @property {string[]} annotations - The annotations of the record component.
 * @property {string|any|null} default_value - The default value of the record component.
 * @property {boolean} is_var_args - Whether the record component is a varargs parameter.
 */
export const JRecordComponent = z.object({
    comment: JComment.nullable().optional(),
    name: z.string(),
    type: z.string(),
    modifiers: z.array(z.string()),
    annotations: z.array(z.string()),
    default_value: z.union([z.string(), z.any(), z.null()]),
    is_var_args: z.boolean()
});

/**
 * Represents a field in Java.
 *
 * @typedef {Object} JField
 * @property {JComment|undefined} comment - The comment associated with the field.
 * @property {string} type - The type of the field.
 * @property {number} start_line - The starting line of the field.
 * @property {number} end_line - The ending line of the field.
 * @property {string[]} variables - The variables declared in the field.
 * @property {string[]} modifiers - The modifiers of the field.
 * @property {string[]} annotations - The annotations of the field.
 */
export const JField = z.object({
    comment: JComment.optional(),
    type: z.string(),
    start_line: z.number(),
    end_line: z.number(),
    variables: z.array(z.string()),
    modifiers: z.array(z.string()),
    annotations: z.array(z.string())
});

/**
 * Represents a callable parameter in Java.
 *
 * @typedef {Object} JCallableParameter
 * @property {string|null|undefined} name - The name of the parameter.
 * @property {string} type - The type of the parameter.
 * @property {string[]} annotations - The annotations of the parameter.
 * @property {string[]} modifiers - The modifiers of the parameter.
 * @property {number} start_line - The starting line of the parameter.
 * @property {number} end_line - The ending line of the parameter.
 * @property {number} start_column - The starting column of the parameter.
 * @property {number} end_column - The ending column of the parameter.
 */
export const JCallableParameter = z.object({
    name: z.string().nullable().optional(),
    type: z.string(),
    annotations: z.array(z.string()),
    modifiers: z.array(z.string()),
    start_line: z.number(),
    end_line: z.number(),
    start_column: z.number(),
    end_column: z.number()
});

/**
 * Represents an enum constant in Java.
 *
 * @typedef {Object} JEnumConstant
 * @property {string} name - The name of the enum constant.
 * @property {string[]} arguments - The arguments passed to the enum constant.
 */
export const JEnumConstant = z.object({
    name: z.string(),
    arguments: z.array(z.string())
});

/**
 * Represents a CRUD operation in Java.
 *
 * @typedef {Object} JCRUDOperation
 * @property {number} line_number - The line number where the operation occurs.
 * @property {CRUDOperationType|null|undefined} operation_type - The type of the CRUD operation.
 */
export const JCRUDOperation = z.object({
    line_number: z.number(),
    operation_type: CRUDOperationType.optional().nullable()
});

/**
 * Represents a CRUD query in Java.
 *
 * @typedef {Object} JCRUDQuery
 * @property {number} line_number - The line number where the query occurs.
 * @property {string[]|null|undefined} query_arguments - The arguments passed to the query.
 * @property {CRUDQueryType|null|undefined} query_type - The type of the CRUD query.
 */
export const JCRUDQuery = z.object({
    line_number: z.number(),
    query_arguments: z.array(z.string()).optional().nullable(),
    query_type: CRUDQueryType.optional().nullable()
});

/**
 * Represents a call site in Java code.
 *
 * @typedef {Object} JCallSite
 * @property {JComment|null|undefined} comment - The comment associated with the call site.
 * @property {string} method_name - The name of the method called at the call site.
 * @property {string} receiver_expr - Expression for the receiver of the method call.
 * @property {string} receiver_type - Name of type declaring the called method.
 * @property {string[]} argument_types - Types of actual parameters for the call.
 * @property {string} return_type - Return type of the method call (resolved type of the method call expression; empty string if expression is unresolved).
 * @property {string} callee_signature - Signature of the callee.
 * @property {boolean|null} is_static_call - Flag indicating whether the call is a static call.
 * @property {boolean|null} is_private - Flag indicating whether the call is a private call.
 * @property {boolean|null} is_public - Flag indicating whether the call is a public call.
 * @property {boolean|null} is_protected - Flag indicating whether the call is a protected call.
 * @property {boolean|null} is_unspecified - Flag indicating whether the call is an unspecified call.
 * @property {boolean} is_constructor_call - Flag indicating whether the call is a constructor call.
 * @property {JCRUDOperation|null} crud_operation - The CRUD operation type of the call site.
 * @property {JCRUDQuery|null} crud_query - The CRUD query type of the call site.
 * @property {number} start_line - The starting line number of the call site.
 * @property {number} start_column - The starting column of the call site.
 * @property {number} end_line - The ending line number of the call site.
 * @property {number} end_column - The ending column of the call site.
 */
export const JCallSite = z.object({
    comment: JComment.nullable().optional(),
    method_name: z.string(),
    receiver_expr: z.string().default(""),
    receiver_type: z.string(),
    argument_types: z.array(z.string()),
    return_type: z.string().default(""),
    callee_signature: z.string().default(""),
    is_static_call: z.boolean().nullable(),
    is_private: z.boolean().nullable(),
    is_public: z.boolean().nullable(),
    is_protected: z.boolean().nullable(),
    is_unspecified: z.boolean().nullable(),
    is_constructor_call: z.boolean(),
    crud_operation: z.union([JCRUDOperation, z.null()]),
    crud_query: z.union([JCRUDQuery, z.null()]),
    start_line: z.number(),
    start_column: z.number(),
    end_line: z.number(),
    end_column: z.number()
});

/**
 * Represents a variable declaration in Java.
 *
 * @typedef {Object} JVariableDeclaration
 * @property {JComment|null} comment - The comment associated with the variable declaration.
 * @property {string} name - The name of the variable.
 * @property {string} type - The type of the variable.
 * @property {string} initializer - The initialization expression (if present) for the variable declaration.
 * @property {number} start_line - The starting line number of the declaration.
 * @property {number} start_column - The starting column of the declaration.
 * @property {number} end_line - The ending line number of the declaration.
 * @property {number} end_column - The ending column of the declaration.
 */
export const JVariableDeclaration = z.object({
    comment: JComment.nullable().optional(),
    name: z.string(),
    type: z.string(),
    initializer: z.string(),
    start_line: z.number(),
    start_column: z.number(),
    end_line: z.number(),
    end_column: z.number()
});

/**
 * Represents an initialization block in Java.
 *
 * @typedef {Object} InitializationBlock
 * @property {string} file_path - The path to the source file.
 * @property {JComment[]} comments - The comments associated with the block.
 * @property {string[]} annotations - The annotations applied to the block.
 * @property {string[]} thrown_exceptions - Exceptions declared via "throws".
 * @property {string} code - The code block.
 * @property {number} start_line - The starting line number of the block in the source file.
 * @property {number} end_line - The ending line number of the block in the source file.
 * @property {boolean} is_static - A flag indicating whether the block is static.
 * @property {string[]} referenced_types - The types referenced within the block.
 * @property {string[]} accessed_fields - Fields accessed in the block.
 * @property {JCallSite[]} call_sites - Call sites in the block.
 * @property {JVariableDeclaration[]} variable_declarations - Local variable declarations in the block.
 * @property {number} cyclomatic_complexity - Cyclomatic complexity of the block.
 */
export const InitializationBlock = z.object({
    file_path: z.string(),
    comments: z.array(JComment),
    annotations: z.array(z.string()),
    thrown_exceptions: z.array(z.string()),
    code: z.string(),
    start_line: z.number(),
    end_line: z.number(),
    is_static: z.boolean(),
    referenced_types: z.array(z.string()),
    accessed_fields: z.array(z.string()),
    call_sites: z.array(JCallSite),
    variable_declarations: z.array(JVariableDeclaration),
    cyclomatic_complexity: z.number()
});

/**
 * Represents a callable entity such as a method or constructor in Java.
 *
 * @typedef {Object} JCallable
 * @property {string} signature - The signature of the callable.
 * @property {boolean} is_implicit - A flag indicating whether the callable is implicit (e.g., a default constructor).
 * @property {boolean} is_constructor - A flag indicating whether the callable is a constructor.
 * @property {JComment[]} comments - A list of comments associated with the callable.
 * @property {string[]} annotations - The annotations applied to the callable.
 * @property {string[]} modifiers - The modifiers applied to the callable (e.g., public, static).
 * @property {string[]} thrown_exceptions - Exceptions declared via "throws".
 * @property {string} declaration - The declaration of the callable.
 * @property {JCallableParameter[]} parameters - The parameters of the callable.
 * @property {string|null} return_type - The return type of the callable. Null if the callable does not return a value.
 * @property {string} code - The code block of the callable.
 * @property {number} start_line - The starting line number of the callable in the source file.
 * @property {number} end_line - The ending line number of the callable in the source file.
 * @property {string[]} referenced_types - The types referenced within the callable.
 * @property {string[]} accessed_fields - Fields accessed in the callable.
 * @property {JCallSite[]} call_sites - Call sites in the callable.
 * @property {boolean} is_entrypoint - A flag indicating whether this is a service entry point method.
 * @property {JVariableDeclaration[]} variable_declarations - Local variable declarations in the callable.
 * @property {JCRUDOperation[]|null} crud_operations - CRUD operations in the callable.
 * @property {JCRUDQuery[]|null} crud_queries - CRUD queries in the callable.
 * @property {number|null} cyclomatic_complexity - Cyclomatic complexity of the callable.
 */
export const JCallable = z.object({
    signature: z.string(),
    is_implicit: z.boolean(),
    is_constructor: z.boolean(),
    comments: z.array(JComment),
    annotations: z.array(z.string()),
    modifiers: z.array(z.string()),
    thrown_exceptions: z.array(z.string()).default([]),
    declaration: z.string(),
    parameters: z.array(JCallableParameter),
    return_type: z.string().nullable(),
    code: z.string(),
    start_line: z.number(),
    end_line: z.number(),
    referenced_types: z.array(z.string()),
    accessed_fields: z.array(z.string()),
    call_sites: z.array(JCallSite),
    is_entrypoint: z.boolean().default(false),
    variable_declarations: z.array(JVariableDeclaration),
    crud_operations: z.array(JCRUDOperation).nullable(),
    crud_queries: z.array(JCRUDQuery).nullable(),
    cyclomatic_complexity: z.number().nullable()
});

/**
 * Represents a Java class or interface.
 *
 * @typedef {Object} JType
 * @property {boolean} is_interface - A flag indicating whether the object is an interface.
 * @property {boolean} is_inner_class - A flag indicating whether the object is an inner class.
 * @property {boolean} is_local_class - A flag indicating whether the object is a local class.
 * @property {boolean} is_nested_type - A flag indicating whether the object is a nested type.
 * @property {boolean} is_class_or_interface_declaration - A flag indicating whether the object is a class or interface declaration.
 * @property {boolean} is_enum_declaration - A flag indicating whether the object is an enum declaration.
 * @property {boolean} is_annotation_declaration - A flag indicating whether the object is an annotation declaration.
 * @property {boolean} is_record_declaration - A flag indicating whether this object is a record declaration.
 * @property {boolean} is_concrete_class - A flag indicating whether this is a concrete class.
 * @property {JComment[]|null} comments - A list of comments associated with the class/type.
 * @property {string[]|null} extends_list - The list of classes or interfaces that the object extends.
 * @property {string[]|null} implements_list - The list of interfaces that the object implements.
 * @property {string[]|null} modifiers - The list of modifiers of the object.
 * @property {string[]|null} annotations - The list of annotations of the object.
 * @property {string} parent_type - The name of the parent class (if it exists).
 * @property {string[]|null} nested_type_declarations - All the class declarations nested under this class.
 * @property {Record<string, JCallable>} callable_declarations - The list of constructors and methods of the object.
 * @property {JField[]} field_declarations - The list of fields of the object.
 * @property {JEnumConstant[]|null} enum_constants - The list of enum constants in the object.
 * @property {JRecordComponent[]|null} record_components - The list of record components in the object.
 * @property {InitializationBlock[]|null} initialization_blocks - The list of initialization blocks in the object.
 * @property {boolean} is_entrypoint_class - A flag indicating whether this is a service entry point class.
 */
export const JType = z.object({
    is_interface: z.boolean().default(false),
    is_inner_class: z.boolean().default(false),
    is_local_class: z.boolean().default(false),
    is_nested_type: z.boolean().default(false),
    is_class_or_interface_declaration: z.boolean().default(false),
    is_enum_declaration: z.boolean().default(false),
    is_annotation_declaration: z.boolean().default(false),
    is_record_declaration: z.boolean().default(false),
    is_concrete_class: z.boolean().default(false),
    comments: z.array(JComment).nullable().default([]),
    extends_list: z.array(z.string()).nullable().default([]),
    implements_list: z.array(z.string()).nullable().default([]),
    modifiers: z.array(z.string()).nullable().default([]),
    annotations: z.array(z.string()).nullable().default([]),
    parent_type: z.string(),
    nested_type_declarations: z.array(z.string()).nullable().default([]),
    callable_declarations: z.record(z.string(), JCallable).default({}),
    field_declarations: z.array(JField).default([]),
    enum_constants: z.array(JEnumConstant).nullable().default([]),
    record_components: z.array(JRecordComponent).nullable().default([]),
    initialization_blocks: z.array(InitializationBlock).nullable().default([]),
    is_entrypoint_class: z.boolean().default(false)
});

/**
 * Represents a compilation unit in Java.
 *
 * @typedef {Object} JCompilationUnit
 * @property {JComment[]} comments - A list of comments in the compilation unit.
 * @property {string[]} imports - A list of import statements in the compilation unit.
 * @property {Record<string, JType>} type_declarations - A dictionary mapping type names to their corresponding JType representations.
 * @property {boolean} is_modified - A flag indicating whether the compilation unit has been modified.
 */
export const JCompilationUnit = z.object({
    comments: z.array(JComment),
    imports: z.array(z.string()),
    type_declarations: z.record(z.string(), JType),
    is_modified: z.boolean().default(false)
});

/**
 * Represents details about a method in a Java class.
 *
 * @typedef {Object} JMethodDetail
 * @property {string} method_declaration - The declaration string of the method.
 * @property {string} klass - The name of the class containing the method.
 * @property {JCallable} method - An instance of JCallable representing the callable details of the method.
 */
export const JMethodDetail = z.object({
    method_declaration: z.string(),
    klass: z.string(),
    method: JCallable
});

const _metaMethodDetail = z.object({
    file_path: z.string(),
    type_declaration: z.string(),
    signature: z.string(),
    callable_declaration: z.string()
});

export const JGraphEdges = z.object({
    source: _metaMethodDetail.transform(buildMethodDetail),
    target: _metaMethodDetail.transform(buildMethodDetail),
    type: z.string(),
    weight: z.number(),
    source_kind: z.string().nullable().optional(),
    target_kind: z.string().nullable().optional(),
});

const JSymbolTable = z.record(z.string(), JCompilationUnit).transform(symbolTable => {
        for (const [_, compilationUnit] of Object.entries(symbolTable)) {
            // Check if type_declarations exists before trying to iterate over it
            if (compilationUnit && 'type_declarations' in compilationUnit) {
                for (const [typeName, jType] of Object.entries(compilationUnit.type_declarations)) {
                    // Check if callable_declarations exists before trying to iterate over it
                    if (jType && jType.callable_declarations) {
                        for (const [_, callable] of Object.entries(jType.callable_declarations)) {
                            addToLookupTable(typeName, callable.signature, callable);
                        }
                    }
                }
            }
        }
    return symbolTable;
});

export const JApplication = z.object({
    symbol_table: JSymbolTable,
    call_graph: z.array(JGraphEdges).nullable().optional(),
    system_dependency_graph: z.array(JGraphEdges).nullable().optional()
});