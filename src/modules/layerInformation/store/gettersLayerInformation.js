import {generateSimpleGetters} from "../../../app-store/utils/generators";
import layerInformationState from "./stateLayerInformation";

const getters = {
    ...generateSimpleGetters(layerInformationState),
    displayableLayerNames: (state) => state.layerInfo.layerNames.filter(entry => entry !== null),
    displayableMetaIdArray: (state) => state.layerInfo.metaIdArray.filter(entry => entry !== null)
};

export default getters;
