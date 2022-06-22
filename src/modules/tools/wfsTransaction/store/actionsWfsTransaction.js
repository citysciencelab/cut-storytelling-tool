import axios from "axios";
import {Draw, Modify} from "ol/interaction";
import prepareFeatureProperties from "../utils/prepareFeatureProperties";
import writeTransaction from "../utils/writeTransaction";
import loader from "../../../../utils/loaderOverlay";
import getLayerInformation from "../utils/getLayerInformation";

let drawInteraction,
    drawLayer,
    modifyInteraction;

const actions = {
    /**
     * @param {object} context actions context object.
     * @param {("LineString"|"Point"|"Polygon"|"delete"|"edit")} interaction Identifier of the selected interaction.
     * @returns {void}
     */
    async prepareInteraction ({commit, dispatch, getters: {currentInteractionConfig, currentLayerId, currentLayerIndex, layerInformation, featureProperties, toggleLayer}}, interaction) {
        commit("setSelectedInteraction", interaction);
        if (interaction === "LineString" || interaction === "Point" || interaction === "Polygon") {
            drawLayer = await dispatch("Maps/addNewLayerIfNotExists", {layerName: "tool/wfsTransaction/vectorLayer"}, {root: true});

            const {style} = layerInformation[currentLayerIndex],
                drawOptions = {
                    source: drawLayer.getSource(),
                    // TODO: It would generally be really cool to be able to actually draw Multi-X geometries
                    //  and not just have this as a fix for services only accepting Multi-X geometries
                    type: (currentInteractionConfig[interaction].multi ? "Multi" : "") + interaction,
                    geometryName: featureProperties.find(({type}) => type === "geometry").key
                };

            if (interaction === "Point") {
                drawOptions.style = style;
            }
            drawInteraction = new Draw(drawOptions);
            modifyInteraction = new Modify({source: drawLayer.getSource()});
            drawLayer.setStyle(style);

            if (toggleLayer) {
                Radio.request("ModelList", "getModelByAttributes", {id: currentLayerId}).setIsVisibleInMap(false);
            }

            drawInteraction.on("drawend", () => {
                if (Radio.request("ModelList", "getModelByAttributes", {id: currentLayerId}).get("isOutOfRange")) {
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

        else if (interaction === "delete") {
            // TODO(roehlipa): key === delete
            //  ==> Delete operation


        }
    },
    reset ({commit, dispatch, getters}) {
        commit("setSelectedInteraction", null);
        dispatch("Maps/removeInteraction", drawInteraction, {root: true});
        dispatch("Maps/removeInteraction", modifyInteraction, {root: true});
        commit("Maps/removeLayerFromMap", drawLayer, {root: true});
        drawInteraction = undefined;
        modifyInteraction = undefined;
        drawLayer = undefined;
        Radio.request("ModelList", "getModelByAttributes", {id: getters.currentLayerId})?.setIsVisibleInMap(true);
    },
    save ({dispatch, getters: {currentLayerIndex, layerInformation, featureProperties, selectedInteraction}, rootGetters}) {
        // TODO(roehlipa): Form validation
        console.warn("You clicked save!");
        const feature = drawLayer.getSource().getFeatures()[0],
            layer = layerInformation[currentLayerIndex];

        if (feature === undefined) {
            // TODO(roelipa): Information to user
            console.warn("No features");
            return;
        }
        featureProperties.forEach(property => {
            if (property.value === "" && property.required) { // TODO(roehlipa): Check other problematic values
                // TODO(roehlipa): Somehow we got here, so show an error
                return;
            }
            if (property.type !== "geometry") {
                feature.set(property.key, property.value);
                // TODO(roehlipa): Do correct data type for value; even for not set ones => not set ones get null
            }
        });
        loader.show();
        axios({
            url: layer.url,
            data: writeTransaction(
                feature,
                layer,
                ["LineString", "Point", "Polygon"].includes(selectedInteraction)
                    ? "insert"
                    : selectedInteraction,
                rootGetters["Maps/projectionCode"]),
            method: "POST",
            withCredentials: layer.isSecured,
            headers: {"Content-Type": "text/xml"},
            responseType: "text/xml"
        })
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
                loader.hide();
                dispatch("reset");
                Radio.request("ModelList", "getModelByAttributes", {id: layer.id}).layer.getSource().refresh();
            });
    },
    setActive ({commit, dispatch, getters: {layerIds, layerInformation}}, active) {
        commit("setActive", active);

        if (active) {
            commit("setLayerInformation", getLayerInformation(layerIds));
            commit("setCurrentLayerIndex", layerInformation.findIndex(layer => layer.isSelected));
            dispatch("setFeatureProperties");
        }
        else {
            dispatch("reset");
        }
    },
    async setFeatureProperties ({commit, getters: {currentLayerIndex, layerInformation}}) {
        if (currentLayerIndex === -1) {
            commit("setFeatureProperties", "All layers not selected in tree");
            return;
        }
        const layer = layerInformation[currentLayerIndex];

        if (!Object.prototype.hasOwnProperty.call(layer, "featurePrefix")) {
            commit("setFeatureProperties", "Layer not correctly configured; might be missing 'featurePrefix'");
            return;
        }
        if (!layer.isSelected) {
            commit("setFeatureProperties", "Layer not selected in tree");
            return;
        }
        commit("setFeatureProperties", await prepareFeatureProperties(layer));
    }
};

export default actions;
