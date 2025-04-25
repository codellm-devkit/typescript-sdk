/**
 * Global lookup table for JCallable instances
 * @type {Map<string, Object>}
 */
const _CALLABLES_LOOKUP_TABLE = new Map();

/**
 * Add an entry to the lookup table
 * @param {string} typeName - The type name
 * @param {string} signature - The method signature
 * @param {Object} callable - The JCallable object
 */
export function addToLookupTable(typeName, signature, callable) {
    _CALLABLES_LOOKUP_TABLE.set(`${typeName}:${signature}`, callable);
}

/**
 * Get an entry from the lookup table
 * @param {string} typeName - The type name
 * @param {string} signature - The method signature
 * @return {Object} - The JCallable object
 */
export function getFromLookupTable(typeName, signature) {
    return _CALLABLES_LOOKUP_TABLE.get(`${typeName}:${signature}`);
}

/**
 * Build a method detail from a value in the Lookup table
 * @param {string} typeName - The type name
 * @param {string} signature - The method signature
 * @returns {Object} - The JCallable object
 */
