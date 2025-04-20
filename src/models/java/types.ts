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


export const CRUDQueryType = z.enum(['READ', 'WRITE', 'NAMED']);
export const CRUDOperationType = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']);


/** Base: JComment */
export const JComment = z.object({
  content: z.string().nullable().optional(),
  start_line: z.number(),
  end_line: z.number(),
  start_column: z.number(),
  end_column: z.number(),
  is_javadoc: z.boolean()
});

export const JRecordComponent = z.object({
  comment: JComment,
  name: z.string(),
  type: z.string(),
  modifiers: z.array(z.string()),
  annotations: z.array(z.string()),
  default_value: z.union([z.string(), z.any(), z.null()]),
  is_var_args: z.boolean()
})

export const JField = z.object({
  comment: JComment.optional(), // nullable = optional in JS context
  type: z.string(),
  start_line: z.number(),
  end_line: z.number(),
  variables: z.array(z.string()),
  modifiers: z.array(z.string()),
  annotations: z.array(z.string())
});

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

export const JEnumConstant = z.object({
  name: z.string(),
  arguments: z.array(z.string())
});

export const JCRUDOperation = z.object({
  line_number: z.number(),
  operation_type: CRUDOperationType.optional().nullable()
});

export const JCRUDQuery = z.object({
  line_number: z.number(),
  query_arguments: z.array(z.string()).optional().nullable(),
  query_type: CRUDQueryType.optional().nullable() // replace with enum if available
});
