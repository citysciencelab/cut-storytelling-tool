import {translate} from "./urlParamsTranslator";
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
            else {
                foundInState = false;
            }
        }
        else if (keySplitted.find(key=>key.toLowerCase() === "active")) {
            // search in Tools:
            const tool = Object.keys(state.Tools).find(toolName=>toolName.toLowerCase() === keySplitted[0].toLowerCase());

            if (tool) {
                // console.log("found tool in state:", tool);
                keySplitted[0] = tool;
                keySplitted.unshift("Tools");
                vuexState = nestedAssign(state, makeObject(keySplitted, value));
                foundInState = true;
            }
            else {
                console.warn("Parametric url: cannot start tool with name ", keySplitted[0]);
            }
        }
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
        // console.log("sourcekey=",sourcekey);
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
 * @returns {boolean} if true, key was found in vuex state
 */
export default function setValueToState (state, key, value) {
    // console.log("key=",key);
    // console.log("value=",value);
    let found = false;

    if (typeof key === "string") {
        const entry = translate(key.trim(), value);
        // console.log("translated key=",entry.key);
        // console.log("translated value=",entry.value);

        found = searchAndSetValue(state, entry.key.split("/"), entry.value);

        if (!found) {
            const oldParam = translateToBackbone(entry.key, entry.value);

            if (oldParam) {
                state[oldParam.key] = oldParam.value;
            }
            else {
                state[key] = value;
            }
        }
    }
    return found;
}
