import axios from "axios";
import {Draw, Modify} from "ol/interaction";
import prepareFeatureProperties from "../utils/prepareFeatureProperties";
import writeTransaction from "../utils/writeTransaction";

let drawInteraction,
    drawLayer,
    modifyInteraction;

const actions = {
    /**
     * @param {object} context actions context object.
     * @param {("LineString"|"Point"|"Polygon"|"delete"|"edit")} interaction Identifier of the selected interaction.
     * @returns {void}
     */
    async prepareInteraction ({commit, dispatch, getters}, interaction) {
        commit("setSelectedInteraction", interaction);
        if (interaction === "LineString" || interaction === "Point" || interaction === "Polygon") {
            drawLayer = await dispatch("Maps/addNewLayerIfNotExists", {layerName: "tool/wfsTransaction/vectorLayer"}, {root: true});

            const style = getters.layerInformation[getters.currentLayerIndex].style,
                drawOptions = {
                    source: drawLayer.getSource(),
                    // TODO(roehlipa): It would generally be really cool to be able to actually draw Multi-X geometries
                    //  and not just have this as a fix for services only accepting Multi-X geometries
                    type: (getters.currentInteractionConfig[interaction].multi ? "Multi" : "") + interaction,
                    geometryName: getters.featureProperties.find(({type}) => type === "geometry").key
                };

            if (interaction === "Point") {
                drawOptions.style = style;
            }
            drawInteraction = new Draw(drawOptions);
            modifyInteraction = new Modify({source: drawLayer.getSource()});
            drawLayer.setStyle(style);

            // TODO(roehlipa): If toggleLayer => hide features

            drawInteraction.on("drawend", () => {
                if (Radio.request("ModelList", "getModelByAttributes", {id: getters.currentLayerId}).get("isOutOfRange")) {
                    drawLayer.getSource().once("change", () => drawLayer.getSource().clear());
                    dispatch("Alerting/addSingleAlert", {
                        category: "Info",
                        displayClass: "info",
                        content: "Drawn feature not in range of layers allowed region.", // TODO(roehlipa): Translation
                        mustBeConfirmed: false
                    }, {root: true});
                    return;
                }
                dispatch("Maps/removeInteraction", drawInteraction, {root: true});
                dispatch("Maps/addInteraction", modifyInteraction, {root: true});
            });
            dispatch("Maps/addInteraction", drawInteraction, {root: true});
        }

        // TODO(roehlipa): key === edit
        //  ==> Update operation

        // TODO(roehlipa): key === delete
        //  ==> Delete operation
    },
    reset ({commit, dispatch}) {
        commit("setSelectedInteraction", null);
        dispatch("Maps/removeInteraction", drawInteraction, {root: true});
        dispatch("Maps/removeInteraction", modifyInteraction, {root: true});
        commit("Maps/removeLayerFromMap", drawLayer, {root: true});
        drawInteraction = undefined;
        modifyInteraction = undefined;
        drawLayer = undefined;
    },
    save ({dispatch, getters}) {
        // TODO(roehlipa): Form validation
        console.warn("You clicked save!");
        const feature = drawLayer.getSource().getFeatures()[0],
            {isSecured, url} = getters.layerInformation[getters.currentLayerIndex];

        if (feature === undefined) {
            // TODO(roelipa): Information to user
            console.warn("No features");
            return;
        }
        getters.featureProperties.forEach(property => {
            if (property.value === "" && property.required) { // TODO(roehlipa): Check other problematic values
                // TODO(roehlipa): Somehow we got here, so show an error
                return;
            }
            if (property.type !== "geometry") {
                feature.set(property.key, property.value);
                // TODO(roehlipa): Do correct data type for value; even for not set ones => not set ones get null
            }
        });
        // TODO(roehlipa) showLoader
        writeTransaction(feature, getters.layerInformation[getters.currentLayerIndex], getters.selectedInteraction)
            .then(transaction => axios({
                url,
                data: transaction,
                method: "POST",
                withCredentials: isSecured,
                headers: {"Content-Type": "text/xml"},
                responseType: "text/xml"
            }))
            .then(() => {
                /*
                    TODO(roehlipa):
                        a) Give feedback on success
                        b) Throw error if transaction failed or something wonky (e.g. more than one inserted) happened
                 */
            })
            .catch(() => {
                // TODO(roehlipa): Show error or give feedback
            })
            .finally(() => {
                // TODO(roehlipa): Hide loader
                dispatch("reset");
            });

        /*
            TODO(roehlipa): On save
             ==> Add drawn feature to original layer as it otherwise would only be displayed after a reload
                -> Alternatively, force a reload so that the source gets fetched again and the feature is now included
        */
    },
    setActive ({commit, dispatch, getters}, active) {
        commit("setActive", active);

        if (active) {
            commit("setLayerInformation", getters.layerIds.map(id => {
                const layer = Radio.request("ModelList", "getModelByAttributes", {id});

                return ["featureNS", "featurePrefix", "featureType", "gfiAttributes", "style", "isSelected", "name", "url", "version"]
                    .reduce((previous, key) => ({...previous, [key]: layer.get(key)}),
                        {
                            id,
                            isSecured: layer.get("isSecured") !== undefined ? layer.get("isSecured") : false
                        }
                    );
            }));
            commit("setCurrentLayerIndex", getters.layerInformation.findIndex(layer => layer.isSelected));
            dispatch("setFeatureProperties");
        }
        else {
            dispatch("reset");
        }
    },
    async setFeatureProperties ({commit, getters}) {
        if (getters.currentLayerIndex === -1) {
            commit("setFeatureProperties", "All layers not selected in tree");
            return;
        }
        if (!Object.prototype.hasOwnProperty.call(getters.layerInformation[getters.currentLayerIndex], "featurePrefix")) {
            commit("setFeatureProperties", "Layer not correctly configured; might be missing 'featurePrefix'");
            return;
        }
        if (!getters.layerInformation[getters.currentLayerIndex].isSelected) {
            commit("setFeatureProperties", "Layer not selected in tree");
            return;
        }
        commit("setFeatureProperties", await prepareFeatureProperties(getters.layerInformation[getters.currentLayerIndex]));
    }
};

export default actions;
