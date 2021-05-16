import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsSearch";

// TODO: JSDoc
const getters = {
    ...generateSimpleGetters(initialState),
    requiredFields ({requiredValues}) {
        return !Object.values(requiredValues).every(val => typeof val === "string" && val !== "");
    },
    currentInstance ({instances, currentInstanceId}) {
        return instances[currentInstanceId];
    }
};

export default getters;
