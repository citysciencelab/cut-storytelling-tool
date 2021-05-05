import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

const getters = {
    ...generateSimpleGetters(initialState),
    requiredFields ({requiredValues}) {
        return !Object.values(requiredValues).every(val => typeof val === "string" && val !== "");
    }
};

export default getters;
