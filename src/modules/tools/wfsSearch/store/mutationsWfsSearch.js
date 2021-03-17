import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

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
    setSelectedOptions (state, {options, value}) {
        // The updates need to be done this way to be able to update the computed properties of the Field components
        const obj = state.selectedOptions;

        // Remove the options if no value is selected
        if (value === "") {
            delete obj[options];
        }
        else {
            obj[options] = value;
        }

        state.selectedOptions = {...obj}; // TODO: This kinda breaks it, because the value is not really accessible anymore <.<; no "Vue object"
    }
};

export default mutations;
