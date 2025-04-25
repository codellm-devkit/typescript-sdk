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

/**
 * Enum for CRUD query types.
 *
 * @typedef {Object} CRUDQueryType
 * @enum {string}
 * @property {string} READ - Represents a read query.
 * @property {string} WRITE - Represents a write query.
 * @property {string} NAMED - Represents a named query.
 */
export const CRUDQueryType = z.enum(['READ', 'WRITE', 'NAMED']);

/**
 * Enum for CRUD operation types.
 *
 * @typedef {Object} CRUDOperationType
 * @enum {string}
 * @property {string} CREATE - Represents a create operation.
 * @property {string} READ - Represents a read operation.
 * @property {string} UPDATE - Represents an update operation.
 * @property {string} DELETE - Represents a delete operation.
 */
export const CRUDOperationType = z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE']);
