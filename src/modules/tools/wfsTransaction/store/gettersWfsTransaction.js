import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import initialState from "./stateWfsTransaction";

const getters = {
    ...generateSimpleGetters(initialState),
    currentInteractionConfig (state, {currentLayerId}) {
        // TODO(roehlipa): Adjust doc for edit and delete and functionality
        // TODO(roehlipa): Add config and interactions to call on click
        const configuration = {
            line: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.line",
                icon: ""
            },
            point: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.point",
                icon: ""
            },
            polygon: {
                available: false,
                caption: "common:modules.tools.wfsTransaction.interactionSelect.polygon",
                icon: ""
            },
            edit: {
                icon: ""
            },
            delete: {
                icon: ""
            }
        };

        ["delete", "edit"].forEach(val => {
            configuration[val].available = typeof state[val] === "boolean" ? state[val] : true;
            configuration[val].caption = typeof state[val] === "string" ? state[val] : `common:modules.tools.wfsTransaction.interactionSelect.${val}`;
        });
        ["line", "point", "polygon"].forEach(val => {
            // TODO(roehlipa): Do extra step for "areaButton" -> soon to be deprecated parameter
            const geometryConfiguration = state[val + "Button"];
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
            configuration[val].available = layerConfiguration.show;
            configuration[val].caption = layerConfiguration.caption ? layerConfiguration.caption : configuration[val].caption;
        });
        return configuration;
    },
    currentLayerId (state) {
        return state.layerIds[state.currentLayerIndex];
    }
};

export default getters;
