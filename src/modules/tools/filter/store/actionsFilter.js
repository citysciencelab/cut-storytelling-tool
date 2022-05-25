import FilterConfigConverter from "../utils/filterConfigConverter.js";

export default {
    /**
     * Converts the current config to a new version if the current config is of an older version.
     * @param {Object} context the context Vue instance
     * @param {Object} payload the payload Vue instance
     * @param {Object} payload.snippetInfos an object with key value pairs as attrName and text content
     * @returns {void}
     */
    convertConfig: (context, {snippetInfos}) => {
        const converter = new FilterConfigConverter(context.state);

        if (!converter.isOldConfig()) {
            return;
        }
        if (converter.checkboxClassicExists()) {
            context.commit("setActive", true);
        }
        context.commit("setSaveTo", converter.getSaveTo());
        context.commit("setLayerSelectorVisible", converter.getLayerSelectorVisible());
        context.commit("setLayers", converter.getLayers(snippetInfos));
    }
};
