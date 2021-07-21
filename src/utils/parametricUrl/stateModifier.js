import {translate} from "./translator";
import {translateToBackbone} from "./ParametricUrlBrige";

/**
 * Searches for the keys in state and if found, sets the value at it.
 * @param {Object} state vuex state
 * @param {Array} keySplitted keys of the url param as array
 * @param {String} value of the url param
 * @param {boolean} found=false true, if keys found in state
 * @returns {boolean} true, if keys found in state
 */
function searchAndSetValue (state, keySplitted, value, found = false) {
    let foundInState = found,
        vuexState = state;

    if (Array.isArray(keySplitted)) {
        if (vuexState[keySplitted[0]]) {
            const newState = nestedAssign(state, makeObject(keySplitted, value));

            if (newState) {
                foundInState = true;
                vuexState = newState;
            }
        }
        else {
            foundInState = inspectStateForTools(vuexState, keySplitted, value);
        }
    }
    return foundInState;
}

/**
 * If param key does not contain 'Tools', but contains 'active' tool ist activated by state.
 * @param {Object} vuexState vuex state
 * @param {Array} keySplitted keys of the url param as array
 * @param {String} value of the url param
 * @returns {boolean} true, if keys found in state
 */
function inspectStateForTools (vuexState, keySplitted, value) {
    const tool = vuexState.Tools ? Object.keys(vuexState.Tools).find(toolName=>toolName.toLowerCase() === keySplitted[0].toLowerCase()) : null;
    let foundInState = false;

    if (tool) {
        keySplitted[0] = tool;
        keySplitted.unshift("Tools");
        if (!keySplitted.find(key=>key.toLowerCase() === "active")) {
            keySplitted.push("active");
        }
        nestedAssign(vuexState, makeObject(keySplitted, value));
        foundInState = true;
    }
    return foundInState;
}
/**
 * Creates an object from an array and sets the value at it.
 * @param {Array} keys to make an object from
 * @param {*} value to set at object
 * @returns {Object} the produced object or empty if no keys are given
 */
function makeObject (keys, value) {
    if (keys) {
        return keys.reverse().reduce((a, c)=>({[c]: a}), value);
    }
    return {};
}

/**
 * Assignes nested source object to nested target object.
 * @param {Object} target object to assign source at
 * @param {Object} source to assign at target
 * @returns {Object} target with source assigned to
 */
function nestedAssign (target, source) {
    for (const sourcekey of Object.keys(source)) {
        // console.log("nestedAssign sourcekey=", sourcekey);
        if (target === null || target === undefined) {
            // console.log("return null");
            return null;
        }
        const targetKey = target === null || target === undefined ? null : Object.keys(target).find(key=>key.toLowerCase() === sourcekey.toLowerCase());

        // console.log("sourcekey:",sourcekey);
        // console.log("targetKey:",targetKey);
        if (Object.keys(source).find(key=>key.toLowerCase() === sourcekey.toLowerCase()) !== undefined && typeof source[sourcekey] === "object") {
            const ret = nestedAssign(target[targetKey], source[sourcekey]);

            if (ret === null) {
                return ret;
            }
            target[targetKey] = ret;
        }
        else {
            target[targetKey] = source[sourcekey];
        }
    }
    return target;
}

/**
 * Sets the given key and value to state.
 * @param {Object} state vuex state
 * @param {String} key of the url param
 * @param {String} value of the url param
 * @returns {void}
 */
export default async function setValueToState (state, key, value) {
    // console.log("---- key=", key);
    // console.log("value=", value);

    if (typeof key === "string") {
        translate(key.trim(), value).then(entry => {
            // console.log("translated key=", entry.key);
            // console.log("translated value=", entry.value);

            const found = searchAndSetValue(state, entry.key.split("/"), entry.value);

            // console.log(state);

            if (!found) {
                const oldParam = translateToBackbone(entry.key, entry.value);

                if (oldParam) {
                    state[oldParam.key] = oldParam.value;
                }
                else {
                    state[key] = value;
                }
            }
        });
    }
}
