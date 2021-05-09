import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

// TODO: JSDoc
const mutations = {
    ...generateSimpleMutations(initialState),
    addOptions: (state, val) => {
        if (state.addedOptions.includes(val)) {
            console.warn(`WfsSearch: The value ${val} is added multiple times to the formular. This entry will be skipped.`);
        }
        else {
            state.addedOptions.push(val);
        }
    },
    setSelectedOptions (state, payload) {
        // If, for example, the selectedOptions need to be reset, the value gets set directly
        if (!payload || (Object.keys(payload).length === 0 && payload.constructor === Object)) {
            state.selectedOptions = payload;
            return;
        }

        // TODO: Reusable utility function for updating objects in the store?
        const {options, value} = payload;

        // Remove the options if no value is selected
        if (value === "") {
            delete state.selectedOptions[options];
            // NOTE: This is sadly needed so that the object is reactive :(
            state.selectedOptions = {
                ...state.selectedOptions
            };
        }
        else {
            state.selectedOptions = {
                ...state.selectedOptions,
                [options]: value
            };
        }
    }
};

export default mutations;
