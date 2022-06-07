import prepareFeatureProperties from "../utils/prepareFeatureProperties";

const actions = {
    setActive ({commit, dispatch, state}, active) {
        commit("setActive", active);

        if (active) {
            commit("setLayerInformation", state.layerIds.map(id => {
                const layer = Radio.request("ModelList", "getModelByAttributes", {id});

                return ["featureNS", "featurePrefix", "featureType", "gfiAttributes", "isSelected", "name", "url", "version"]
                    .reduce((previous, key) => ({...previous, [key]: layer.get(key)}),
                        {
                            id,
                            isSecured: layer.get("isSecured") !== undefined ? layer.get("isSecured") : false
                        }
                    );
            }));
            commit("setCurrentLayerIndex", state.layerInformation.findIndex(layer => layer.isSelected));
            dispatch("setFeatureProperties");
        }
        else {
            // TODO(roehlipa): Reset module
        }
    },
    async setFeatureProperties ({state, commit}) {
        if (state.currentLayerIndex === -1) {
            commit("setFeatureProperties", "All layers not selected in tree");
            return;
        }
        if (!Object.prototype.hasOwnProperty.call(state.layerInformation[state.currentLayerIndex], "featurePrefix")) {
            commit("setFeatureProperties", "Layer not correctly configured; might be missing 'featurePrefix'");
            return;
        }
        if (!state.layerInformation[state.currentLayerIndex].isSelected) {
            commit("setFeatureProperties", "Layer not selected in tree");
            return;
        }
        commit("setFeatureProperties", await prepareFeatureProperties(state.layerInformation[state.currentLayerIndex]));
    }
};

export default actions;
