import initialState from "./stateWfsTransaction";
import {generateSimpleGetters} from "../../../../app-store/utils/generators";

const getters = {
    ...generateSimpleGetters(initialState),
    currentInteractionConfig (state, {currentLayerId}) {
        // TODO(roehlipa): Adjust doc for edit and delete and functionality
        // TODO(roehlipa): Add config and interactions to call on click
        const configuration = {
            LineString: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.line",
                icon: "bi-slash-lg"
            },
            Point: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.point",
                icon: "bi-record-circle"
            },
            Polygon: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.polygon",
                icon: "bi-hexagon-fill"
            },
            edit: {
                icon: "bi-pencil-square"
            },
            delete: {
                icon: "bi-trash"
            }
        };

        ["delete", "edit"].forEach(val => {
            configuration[val].available = typeof state[val] === "boolean" ? state[val] : true;
            configuration[val].caption = typeof state[val] === "string" ? state[val] : `common:modules.tools.wfsTransaction.interactionSelect.${val}`;
        });
        ["LineString", "Point", "Polygon"].forEach(val => {
            // TODO(roehlipa): Do extra step for "areaButton" -> soon to be deprecated parameter
            const geometryConfiguration = state[(val.endsWith("String") ? val.replace("String", "") : val).toLowerCase() + "Button"];
            let layerConfiguration = null;

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
            configuration[val].available = layerConfiguration.show; // TODO(roehlipa): Maybe deprecate parameter "show" in favour of "available"?
            configuration[val].caption = layerConfiguration.caption ? layerConfiguration.caption : configuration[val].caption;
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
        return [null, "delete", "edit"].includes(state.selectedInteraction);
    }
};

export default getters;
