import initialState from "./stateWfsTransaction";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import deepCopy from "../../../../utils/deepCopy";

// TODO(roehlipa): Adjust doc for update and delete as well as their functionality
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
            icon: "bi-pencil-square"
        },
        delete: {
            icon: "bi-trash"
        }
    },
    getters = {
        ...generateSimpleGetters(initialState),
        currentInteractionConfig (state, {currentLayerId}) {
            const configuration = deepCopy(defaultInteractionConfig);

            // TODO: The parts for update and delete can be simplified once v3.0.0 happens
            if ((typeof state.edit === "boolean" && state.edit) || typeof state.edit === "string") {
                console.warn("WfsTransaction: The parameter 'edit' has been deprecated in version 3.0.0. Please use 'update' instead.");
                configuration.update.available = typeof state.edit === "boolean" ? state.edit : true;
                configuration.update.caption = typeof state.edit === "string" ? state.edit : "common:modules.tools.wfsTransaction.interactionSelect.update";
            }
            else {
                configuration.update.available = typeof state.update === "boolean" ? state.update : true;
                configuration.update.caption = typeof state.update === "string" ? state.update : "common:modules.tools.wfsTransaction.interactionSelect.update";
            }
            configuration.delete.available = typeof state.delete === "boolean" ? state.delete : true;
            configuration.delete.caption = typeof state.delete === "string" ? state.delete : "common:modules.tools.wfsTransaction.interactionSelect.delete";
            ["LineString", "Point", "Polygon"].forEach(val => {
                let geometryConfiguration,
                    layerConfiguration = null;

                if (val === "Polygon" && state.areaButton !== undefined && state.areaButton.length > 0) {
                    // TODO: Shrink this to a single const when areaButton is removed
                    console.warn("WfsTransaction: The configuration parameter 'areaButton' has been deprecated. Please use 'polygonButton' instead.");
                    geometryConfiguration = state.areaButton;
                }
                else {
                    geometryConfiguration = state[(val.endsWith("String") ? val.replace("String", "") : val).toLowerCase() + "Button"];
                }
                if (!geometryConfiguration) {
                    return;
                }
                if (typeof geometryConfiguration === "boolean") {
                    configuration[val].available = true;
                    return;
                }
                layerConfiguration = geometryConfiguration.find(config => config.layerId === currentLayerId);
                if (layerConfiguration === undefined) {
                    return;
                }
                configuration[val].available = layerConfiguration.show; // TODO(roehlipa): Maybe deprecate parameter "show" in favour of "visible"?
                configuration[val].caption = layerConfiguration.caption ? layerConfiguration.caption : configuration[val].caption;
                configuration[val].multi = layerConfiguration.multi ? layerConfiguration.multi : false;
            });
            return configuration;
        },
        currentLayerId (state) {
            return state.layerIds[state.currentLayerIndex];
        },
        requiredFieldsFilled (state) {
            return state.featureProperties.every(property => property.required ? property.value !== null : true);
        },
        showInteractionsButtons (state) {
            return [null, "delete", "update"].includes(state.selectedInteraction);
        }
    };

export default getters;
