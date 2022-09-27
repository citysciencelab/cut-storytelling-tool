import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateWfst";

const mutations = {
    ...generateSimpleMutations(initialState),
    setFeatureProperty ({featureProperties}, {key, value}) {
        featureProperties.find(property => property.key === key).value = value;
    }
};

export default mutations;
