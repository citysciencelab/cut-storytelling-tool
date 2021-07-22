import {translate} from "./translator";
import {deepAssignIgnoreCase} from "../deepAssign";
import {triggerParametricURLReady, translateToBackbone} from "./ParametricUrlBrige";
import store from "../../app-store";
import {transformToMapProjection} from "masterportalAPI/src/crs";

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
            const source = makeObject(keySplitted, value),
                newState = deepAssignIgnoreCase(state, source);

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
        deepAssignIgnoreCase(vuexState, makeObject(keySplitted, value));
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
 * Calls muatations, if necessary.
 * @param {Object} state vuex state
 * @returns {void}
 */
function callMutations (state) {
    if (state.urlParams["Map/center"]) {
        let centerCoords = state.Map.center;

        if (state.urlParams.projection !== undefined) {
            centerCoords = transformToMapProjection(state.Map.map, state.urlParams.projection, centerCoords);
        }
        store.commit("Map/setCenter", centerCoords);
    }
}
/**
 * Calls actions, if necessary.
 * @param {Object} state vuex state
 * @returns {void}
 */
function callActions (state) {
    if (state.urlParams["MapMarker/coordinates"]) {
        let coordinates = state.MapMarker.coordinates;

        if (state.urlParams.projection !== undefined) {
            coordinates = transformToMapProjection(state.Map.map, state.urlParams.projection, coordinates);
        }
        setTimeout(() => {
            store.dispatch("MapMarker/placingPointMarker", coordinates);
        }, 500);
    }
}
/**
 * Sets the url params at state and produces desired reaction.
 * @param {Object} state vuex state
 * @param {URLSearchParams} params an instance of URLSearchParams
 *  @returns {void}
 */
export default async function setValuesToState (state, params) {
    await params.forEach(function (value, key) {
        setValueToState(state, key, value);
    });
    triggerParametricURLReady();
    callMutations(state);
    callActions(state);
}

/**
 * Sets the given key and value to state.
 * @param {Object} state vuex state
 * @param {String} key of the url param
 * @param {String} value of the url param
 * @returns {void}
 */
export async function setValueToState (state, key, value) {
    // console.log("---- key=", key);
    // console.log("value=", value);

    if (typeof key === "string") {
        translate(key.trim(), value).then(entry => {
            let setToState = false;

            // console.log("translated key=", entry.key);
            // console.log("translated value=", entry.value);


            const found = searchAndSetValue(state, entry.key.split("/"), entry.value);

            // console.log("state:", state);
            // console.log("found:", found);

            if (!found) {
                const oldParam = translateToBackbone(entry.key, entry.value);

                if (oldParam) {
                    state.urlParams[oldParam.key] = oldParam.value;
                    setToState = true;
                }
            }
            if (!setToState) {
                state.urlParams[entry.key] = value;
            }
            // console.log("state.urlParams=", state.urlParams);
        }).catch(error => {
            console.warn("Error occured during applying url param to state ", error);
        });
    }
}
