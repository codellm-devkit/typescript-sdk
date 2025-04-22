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

import { z } from 'zod';
import * as schema from './schema';
import { CRUDOperationType, CRUDQueryType } from './enums';

// Export all types inferred from Zod schemas
export type JCommentType = z.infer<typeof schema.JComment>;
export type JRecordComponentType = z.infer<typeof schema.JRecordComponent>;
export type JFieldType = z.infer<typeof schema.JField>;
export type JCallableParameterType = z.infer<typeof schema.JCallableParameter>;
export type JEnumConstantType = z.infer<typeof schema.JEnumConstant>;
export type JCRUDOperationType = z.infer<typeof schema.JCRUDOperation>;
export type JCRUDQueryType = z.infer<typeof schema.JCRUDQuery>;
export type JCallSiteType = z.infer<typeof schema.JCallSite>;
export type JVariableDeclarationType = z.infer<typeof schema.JVariableDeclaration>;
export type InitializationBlockType = z.infer<typeof schema.InitializationBlock>;
export type JCallableType = z.infer<typeof schema.JCallable>;
export type JTypeType = z.infer<typeof schema.JType>;
export type JCompilationUnitType = z.infer<typeof schema.JCompilationUnit>;
export type JMethodDetailType = z.infer<typeof schema.JMethodDetail>;
export type JGraphEdgesType = z.infer<typeof schema.JGraphEdges>;
export type JApplicationType = z.infer<typeof schema.JApplication>;

// Re-export the enums for convenience
export { CRUDOperationType, CRUDQueryType };