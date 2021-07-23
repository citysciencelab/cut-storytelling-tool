import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";
import {removePath} from "../utils/pathFunctions";
import isObject from "../../../../utils/isObject";

const mutations = {
    ...generateSimpleMutations(initialState),
    /**
     * If the given value has not already been added as an option, it is added.
     *
     * @param {Object} state State object of the module.
     * @param {String} option The option to be added.
     * @returns {void}
     */
    addOptions: ({currentInstanceIndex, instances}, option) => {
        const currentInstance = instances[currentInstanceIndex];

        if (!Array.isArray(currentInstance?.addedOptions)) {
            currentInstance.addedOptions = [];
        }
        if (currentInstance.addedOptions.includes(option)) {
            console.warn(`WfsSearch: The option ${option} is added multiple times to the formular. This entry will be skipped.`);
        }
        else {
            currentInstance.addedOptions.push(option);
        }
    },
    /**
     * Updates the state parameter for the currently selected options
     * If payload is not given or is an empty object this indicates that the selectedOptions should be reset.
     * If the value is empty, the option is removed from the selectedOptions as well as all the options depending on it.
     * If it is not empty, the value and index are added as an object to the selectedOptions with the value of 'options' as the key.
     *
     * @param {Object} state State object of the module.
     * @param {Object} payload Object containing possible values to be set to the currently set options.
     * @param {?String} payload.index The position as a parameter of the field inside the selectedOptions object.
     * @param {?String} payload.options The name of the field to update including its path inside the service.
     * @param {?String} payload.value The value selected in the UI.
     * @returns {void}
     */
    setSelectedOptions (state, payload) {
        if (!payload || (isObject(payload) && Object.keys(payload).length === 0)) {
            state.selectedOptions = payload;
            return;
        }

        const {index, options, value} = payload;

        if (value === "") {
            const keys = Object.keys(state.selectedOptions).reverse();

            for (const key of keys) {
                delete state.selectedOptions[key];

                if (key === removePath(options)) {
                    break;
                }
            }
            // NOTE: This is sadly needed so that the object is reactive :(
            state.selectedOptions = {
                ...state.selectedOptions
            };
        }
        else {
            state.selectedOptions = {
                ...state.selectedOptions,
                [removePath(options)]: {value, index}
            };
        }
    }
};

export default mutations;
