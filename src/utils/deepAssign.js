/**
 * This function provides a "soft" deep assign of objects, where objects aren't overwritten, but followed.
 *
 * EXAMPLES
 * // In this example the m-object has a property x that isn't replaced but left intact by deepAssign:
 * a = {m: {x: 1, y: 1}};
 * deepAssign(a, {m: {y: 2}});
 * // -> {m: {x: 1, y: 2}}
 *
 * // In this example the m-object has a property x that is replaced and thereby destroyed by Object.assign:
 * a = {m: {x: 1, y: 1}};
 * Object.assign(a, {m: {y: 2}});
 * // -> {m: {y: 2}}
 *
 * @param {Object} target The target object — what to apply the sources' properties to, which is returned after it is modified.
 * @param {Object} sources The source object(s) — objects containing the properties you want to apply.
 * @returns {Object} The modified target object.
 */
export default function deepAssign (target, ...sources) {
    if (typeof target !== "object" || target === null) {
        console.error("deepAssign: The given target is not an object. Please check the target object before handing it over to deepAssign.");
        return null;
    }

    sources.forEach(source => {
        // the depth barrier is fixed to a depth of 200
        deepAssignHelper(target, source, 200);
    });

    return target;
}
/**
 * Assignes nested source object to nested target object. Ignores case of source keys.
 * If source key is not found in target no target key is created, null is returned.
 * @param {Object} target object to assign source at
 * @param {Object} source to assign at target
 * @returns {Object|null} target with source assigned to or null, if source was not found in target
 */
export function deepAssignIgnoreCase (target, source) {
    if (typeof target !== "object" || target === null) {
        console.error("deepAssign: The given target is not an object. Please check the target object before handing it over to deepAssign.");
        return null;
    }
    return deepAssignHelper(target, source, 200, 0, true, false);
}
/**
 * helper function for the recursion
 * @param {Object} target The target object — what to apply the sources properties to.
 * @param {Object} source The source object — object containing the properties you want to apply.
 * @param {Number} depthBarrier The depth barrier to escape infinit loops.
 * @param {Number} [depth=0] The depth of the current recursion.
 * @param {boolean} [ignoreCase=false] if true, case of sourceKeys is ignored
 * @param {boolean} [createTargetKey=true] if true, not available key in target is created
 * @returns {Object|null} target with source assigned to or null, if source was not found in target
 */
function deepAssignHelper (target, source, depthBarrier, depth = 0, ignoreCase = false, createTargetKey = true) {
    if (depthBarrier <= depth || typeof source !== "object" || source === null) {
        return null;
    }
    for (const [key] of Object.entries(source)) {
        if (target === null || target === undefined) {
            return null;
        }
        const targetKey = ignoreCase ? Object.keys(target).find(tKey=>tKey.toLowerCase() === key.toLowerCase()) : key;

        if (typeof source[key] === "object" && source[key] !== null) {
            if (createTargetKey && (!Object.prototype.hasOwnProperty.call(target, targetKey) || typeof target[targetKey] !== "object" || target[targetKey] === null)) {
                target[targetKey] = {};
            }
            if (Array.isArray(source[key]) && typeof source[key][0] !== "object") {
                target[targetKey] = source[key];
            }
            else {
                const assigned = deepAssignHelper(target[targetKey], source[key], depthBarrier, depth + 1, ignoreCase, createTargetKey);

                if (!createTargetKey && (assigned === null || assigned === undefined)) {
                    return null;
                }
            }
        }
        else {
            target[targetKey] = source[key];
        }
    }
    return target;
}
