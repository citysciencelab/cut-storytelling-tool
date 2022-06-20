/**
 * Receives relevant information about the layers with the given ids.
 *
 * @param {string[]} layerIds Ids of layers to retrieve information for.
 * @returns {TransactionLayer[]} Information for each respective layer wrapped in an array.
 */
export default function (layerIds) {
    return layerIds.map(id => {
        const layer = Radio.request("ModelList", "getModelByAttributes", {id});

        return ["featureNS", "featurePrefix", "featureType", "gfiAttributes", "style", "isSelected", "name", "url", "version"]
            .reduce((previous, key) => ({...previous, [key]: layer.get(key)}),
                {
                    id,
                    isSecured: layer.get("isSecured") !== undefined ? layer.get("isSecured") : false
                }
            );
    });
}
