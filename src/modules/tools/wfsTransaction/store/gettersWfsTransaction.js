import initialState from "./stateWfsTransaction";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import deepCopy from "../../../../utils/deepCopy";

// TODO(roehlipa): Adjust doc for update and delete to new functionality => default is false (is this a breaking change?) and possibility to add 'em service specific
// TODO(roehlipa): Add icon to the possible config.json parameters and add functionality here
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
                    // TODO: Shrink this to a single const when areaButton is removed
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
                configuration[val].available = layerConfiguration.show; // TODO(roehlipa): Maybe deprecate parameter "show" in favour of "visible" or something more in line with what is used in components?
                configuration[val].caption = layerConfiguration.caption ? layerConfiguration.caption : configuration[val].caption;
                if (isGeometryConfiguration) {
                    configuration[val].multi = layerConfiguration.multi ? layerConfiguration.multi : false;
                }
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
