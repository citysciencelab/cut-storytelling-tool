import initialState from "./stateWfsTransaction";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import deepCopy from "../../../../utils/deepCopy";

// TODO(roehlipa): Adjust doc for update and delete to new functionality => default is false (is this a breaking change?) and possibility to add 'em service specific
const defaultInteractionConfig = {
        LineString: {
            available: false,
            caption: "common:modules.tools.wfsTransaction.interactionSelect.line",
            icon: "bi-slash-lg",
            multi: false
        },
        Point: {
            available: false,
            caption: "common:modules.tools.wfsTransaction.interactionSelect.point",
            icon: "bi-record-circle",
            multi: false
        },
        Polygon: {
            available: false,
            caption: "common:modules.tools.wfsTransaction.interactionSelect.polygon",
            icon: "bi-hexagon-fill",
            multi: false
        },
        update: {
            available: false,
            caption: "common:modules.tools.wfsTransaction.interactionSelect.update",
            icon: "bi-pencil-square"
        },
        delete: {
            available: false,
            caption: "common:modules.tools.wfsTransaction.interactionSelect.delete",
            icon: "bi-trash"
        }
    },
    getters = {
        ...generateSimpleGetters(initialState),
        currentInteractionConfig (state, {currentLayerId}) {
            const configuration = deepCopy(defaultInteractionConfig);
            let editUsed = false;

            // TODO: These iterations can be simplified as soon v3.0.0 is on the horizon
            ["LineString", "Point", "Polygon", "edit", "update", "delete"].forEach(val => {
                const isGeometryConfiguration = ["LineString", "Point", "Polygon"].includes(val);
                let interactionConfiguration,
                    layerConfiguration = null;

                if (val === "Polygon" && state.areaButton !== undefined && state.areaButton.length > 0) {
                    console.warn("WfsTransaction: The configuration parameter 'areaButton' has been deprecated. Please use 'polygonButton' instead.");
                    interactionConfiguration = state.areaButton;
                }
                else if (isGeometryConfiguration) {
                    interactionConfiguration = state[(val.endsWith("String") ? val.replace("String", "") : val).toLowerCase() + "Button"];
                }
                else {
                    interactionConfiguration = state[val];
                }
                if (!interactionConfiguration) {
                    return;
                }
                if (val === "edit") {
                    console.warn("WfsTransaction: The parameter 'edit' has been deprecated in version 3.0.0. Please use 'update' instead.");
                    configuration.update.available = typeof interactionConfiguration === "boolean" ? interactionConfiguration : false;
                    configuration.update.caption = typeof interactionConfiguration === "string" ? interactionConfiguration : configuration.update.caption;
                    editUsed = true;
                    return;
                }
                if (editUsed && val === "update") {
                    console.warn("WfsTransaction: Configuration for 'edit' has already been provided. Skipping configuration of 'update'.");
                    return;
                }
                if (typeof interactionConfiguration === "string") {
                    console.warn("WfsTransaction: Please add the caption in an object as the parameter 'caption'; adding it directly will be deprecated in version 3.0.0.");
                    configuration[val].caption = interactionConfiguration;
                    return;
                }
                if (typeof interactionConfiguration === "boolean") {
                    configuration[val].available = true;
                    return;
                }

                layerConfiguration = interactionConfiguration.find(({layerId}) => layerId === currentLayerId);
                if (layerConfiguration === undefined) {
                    return;
                }
                configuration[val].available = layerConfiguration.show;
                configuration[val].caption = layerConfiguration.caption ? layerConfiguration.caption : configuration[val].caption;
                configuration[val].icon = layerConfiguration.icon ? layerConfiguration.icon : configuration[val].icon;
                if (isGeometryConfiguration) {
                    configuration[val].multi = layerConfiguration.multi ? layerConfiguration.multi : false;
                }
            });
            return configuration;
        },
        currentLayerId (state) {
            return state.layerIds[state.currentLayerIndex];
        },
        savingErrorMessage: state => feature => {
            const requiredPropertiesWithNoValue = state.featureProperties
                .filter(property => property.type !== "geometry"
                    && true
                    && [null, undefined, ""].includes(property.value)
                );

            if (feature === undefined) {
                return i18next.t("common:modules.tools.wfsTransaction.error.noFeature");
            }
            if (requiredPropertiesWithNoValue.length > 0) {
                return i18next.t("common:modules.tools.wfsTransaction.error.requiredPropertiesNotSet", {properties: requiredPropertiesWithNoValue.map(({label}) => label).join(", ")});
            }
            return "";
        },
        showInteractionsButtons (state) {
            return [null, "delete", "update"].includes(state.selectedInteraction);
        }
    };

export default getters;
