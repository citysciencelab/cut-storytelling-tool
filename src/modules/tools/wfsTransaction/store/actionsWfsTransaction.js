import axios from "axios";
import {Draw, Modify, Select} from "ol/interaction";
import {exceptionCodes} from "../constantsWfsTransaction";
import addFeaturePropertiesToFeature from "../utils/addFeaturePropertiesToFeature";
import getLayerInformation from "../utils/getLayerInformation";
import prepareFeatureProperties from "../utils/prepareFeatureProperties";
import writeTransaction from "../utils/writeTransaction";
import loader from "../../../../utils/loaderOverlay";
import handleAxiosResponse from "../../../../utils/handleAxiosResponse";

let drawInteraction,
    drawLayer,
    modifyInteraction,
    modifyFeature,
    selectInteraction;

const actions = {
    /**
     * @param {object} context actions context object.
     * @param {("LineString"|"Point"|"Polygon"|"delete"|"update")} interaction Identifier of the selected interaction.
     * @returns {void}
     */
    async prepareInteraction ({commit, dispatch, getters, rootGetters}, interaction) {
        const {currentInteractionConfig, currentLayerId, currentLayerIndex, layerInformation, featureProperties, toggleLayer} = getters,
            // NOTE: As this is a rootGetter, the naming scheme is used like this.
            // eslint-disable-next-line new-cap
            sourceLayer = rootGetters["Maps/getLayerById"]({layerId: currentLayerId});

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
                sourceLayer.setVisible(false);
            }

            drawInteraction.on("drawend", () => {
                if (Radio.request("ModelList", "getModelByAttributes", {id: currentLayerId}).get("isOutOfRange")) {
                    drawLayer.getSource().once("change", () => drawLayer.getSource().clear());
                    dispatch("Alerting/addSingleAlert", {
                        category: "Info",
                        displayClass: "info",
                        content: i18next.t("common:modules.tools.wfsTransaction.error.geometryOutOfRange"),
                        mustBeConfirmed: false
                    }, {root: true});
                    return;
                }
                dispatch("Maps/removeInteraction", drawInteraction, {root: true});
                dispatch("Maps/addInteraction", modifyInteraction, {root: true});
            });
            dispatch("Maps/addInteraction", drawInteraction, {root: true});
        }
        else if (interaction === "update") {
            selectInteraction = new Select({
                layers: [sourceLayer]
            });
            selectInteraction.getFeatures().on("add", (event) => {
                commit("setSelectedInteraction", "selectedUpdate");
                modifyFeature = event.target.getArray()[0];
                modifyInteraction = new Modify({
                    features: event.target
                });
                dispatch("Maps/removeInteraction", selectInteraction, {root: true});
                dispatch("Maps/addInteraction", modifyInteraction, {root: true});
                commit(
                    "setFeatureProperties",
                    featureProperties
                        .map(property => ({...property, value: modifyFeature.get(property.key)}))
                );
            });
            dispatch("Maps/addInteraction", selectInteraction, {root: true});
        }
        else if (interaction === "delete") {
            selectInteraction = new Select({
                layers: [sourceLayer]
            });
            selectInteraction.on("select", event => {
                dispatch("ConfirmAction/addSingleAction", {
                    actionConfirmedCallback: () => dispatch("sendTransaction", event.selected[0]),
                    confirmCaption: i18next.t("common:modules.tools.wfsTransaction.deleteInteraction.confirm"),
                    textContent: i18next.t("common:modules.tools.wfsTransaction.deleteInteraction.text"),
                    headline: i18next.t("common:modules.tools.wfsTransaction.deleteInteraction.headline")
                }, {root: true});
                dispatch("Maps/removeInteraction", selectInteraction, {root: true});
            });
            dispatch("Maps/addInteraction", selectInteraction, {root: true});
        }
    },
    reset ({commit, dispatch, getters, rootGetters}) {
        // NOTE: As this is a rootGetter, the naming scheme is used like this.
        // eslint-disable-next-line new-cap
        const sourceLayer = rootGetters["Maps/getLayerById"]({layerId: getters.currentLayerId}),
            layerSelected = Array.isArray(getters.featureProperties);

        commit("setFeatureProperties",
            layerSelected
                ? getters.featureProperties.map(property => ({...property, value: null}))
                : getters.featureProperties
        );
        commit("setSelectedInteraction", null);
        dispatch("Maps/removeInteraction", drawInteraction, {root: true});
        dispatch("Maps/removeInteraction", modifyInteraction, {root: true});
        dispatch("Maps/removeInteraction", selectInteraction, {root: true});
        commit("Maps/removeLayerFromMap", drawLayer, {root: true});
        drawInteraction = undefined;
        modifyInteraction = undefined;
        selectInteraction?.getFeatures().clear();
        selectInteraction = undefined;
        drawLayer = undefined;
        if (layerSelected) {
            sourceLayer?.setVisible(true);
        }
        if (modifyFeature) {
            sourceLayer
                ?.getSource().getFeatures()
                .find(feature => feature.getId() === modifyFeature.getId())
                ?.setGeometry(modifyFeature.getGeometry());
            sourceLayer?.getSource().refresh();
            modifyFeature = undefined;
        }
    },
    async save ({dispatch, getters}) {
        const feature = modifyFeature ? modifyFeature : drawLayer.getSource().getFeatures()[0],
            {currentLayerIndex, featureProperties, layerInformation, selectedInteraction} = getters,
            error = getters.savingErrorMessage(feature);

        if (error.length > 0) {
            dispatch("Alerting/addSingleAlert", {
                category: "Info",
                displayClass: "info",
                content: error,
                mustBeConfirmed: false
            }, {root: true});
            return;
        }
        dispatch(
            "sendTransaction",
            await addFeaturePropertiesToFeature(
                {id: feature.getId(), geometryName: feature.getGeometryName(), geometry: feature.getGeometry()},
                featureProperties,
                layerInformation[currentLayerIndex].featurePrefix,
                selectedInteraction === "selectedUpdate"
            )
        );
    },
    sendTransaction ({dispatch, getters, rootGetters}, feature) {
        const {currentLayerIndex, layerInformation, selectedInteraction} = getters,
            layer = layerInformation[currentLayerIndex],
            transactionMethod = ["LineString", "Point", "Polygon"].includes(selectedInteraction)
                ? "insert"
                : selectedInteraction;
        let messageKey = `success.${transactionMethod}`;

        loader.show();
        return axios.post(layer.url, writeTransaction(
            feature,
            layer,
            transactionMethod,
            rootGetters["Maps/projectionCode"]
        ), {
            withCredentials: layer.isSecured,
            headers: {"Content-Type": "text/xml"},
            responseType: "text/xml"
        })
            .then(response => handleAxiosResponse(response, "wfsTransaction.actions.sendTransaction"))
            .then(data => {
                const xmlDocument = new DOMParser().parseFromString(data, "text/xml"),
                    transactionSummary = xmlDocument.getElementsByTagName("wfs:TransactionSummary");
                let exception = null,
                    exceptionText = null;

                // NOTE: WFS-T services respond errors with the transaction as an XML response, even though it's the http code indicates different...
                if (transactionSummary.length === 0) {
                    messageKey = "genericFailedTransaction";
                    exception = xmlDocument.getElementsByTagName(`${xmlDocument.getElementsByTagName("Exception").length === 0 ? "ows:" : ""}Exception`)[0];
                    exceptionText = exception.getElementsByTagName(`${xmlDocument.getElementsByTagName("ExceptionText").length === 0 ? "ows:" : ""}ExceptionText`)[0];
                    if (exceptionText !== undefined) {
                        console.error("WfsTransaction: An error occurred when sending the transaction to the service.", exceptionText.textContent);
                    }
                    if (exception?.attributes.getNamedItem("code") || exception?.attributes.getNamedItem("exceptionCode")) {
                        const code = exception.attributes.getNamedItem(`${exception?.attributes.getNamedItem("code") ? "c" : "exceptionC"}ode`).textContent;

                        messageKey = exceptionCodes.includes(code) ? code : messageKey;
                    }
                    messageKey = `error.${messageKey}`;
                }
            })
            .catch(error => {
                messageKey = "error.axios";
                console.error("WfsTransaction: An error occurred when sending the transaction to the service.", error);
            })
            .finally(() => {
                loader.hide();
                dispatch("reset");
                Radio.request("ModelList", "getModelByAttributes", {id: layer.id}).layer.getSource().refresh();
                dispatch("Alerting/addSingleAlert", {
                    category: "Info",
                    displayClass: "info",
                    content: i18next.t(`common:modules.tools.wfsTransaction.transaction.${messageKey}`),
                    mustBeConfirmed: false
                }, {root: true});
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
    setFeatureProperty ({commit, dispatch}, {key, type, value}) {
        if (type === "number" && !Number.isFinite(parseFloat(value))) {
            dispatch("Alerting/addSingleAlert", {
                category: "Info",
                displayClass: "info",
                content: i18next.t("common:modules.tools.wfsTransaction.error.onlyNumbersAllowed"),
                mustBeConfirmed: false
            }, {root: true});
            return;
        }
        commit("setFeatureProperty", {key, value});
    },
    async setFeatureProperties ({commit, getters: {currentLayerIndex, layerInformation}}) {
        if (currentLayerIndex === -1) {
            commit("setFeatureProperties", i18next.t("common:modules.tools.wfsTransaction.error.allLayersNotSelected"));
            return;
        }
        const layer = layerInformation[currentLayerIndex];

        if (!Object.prototype.hasOwnProperty.call(layer, "featurePrefix")) {
            commit("setFeatureProperties", i18next.t("common:modules.tools.wfsTransaction.error.layerNotConfiguredCorrectly"));
            return;
        }
        if (!layer.isSelected) {
            commit("setFeatureProperties", i18next.t("common:modules.tools.wfsTransaction.error.layerNotSelected"));
            return;
        }
        commit("setFeatureProperties", await prepareFeatureProperties(layer));
    }
};

export default actions;
