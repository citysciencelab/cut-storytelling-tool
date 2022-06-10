import {WFS} from "ol/format";

/**
 * Writes a wfs transaction including the given feature for given layer
 * inserting, editing or deleting the feature depending on the given selectedInteraction.
 *
 * @param {module:ol/Feature} feature Feature to be inserted, edited or deleted.
 * @param {TransactionLayer} layerInformation Information about the layer to be manipulated.
 * @param {("LineString"|"Point"|"Polygon"|"delete"|"edit"|null)} selectedInteraction Interaction deciding which transaction to perform.
 * @returns {string} WFS Transaction as an XML String.
 */
export default function (feature, layerInformation, selectedInteraction) {
    const {featureNS, featurePrefix, featureType, version} = layerInformation,
        transaction = [[], [], []];

    // TODO(roehlipa): Can this be done more elegantly?
    if (["LineString", "Point", "Polygon"].includes(selectedInteraction)) {
        transaction[0].push(feature);
    }
    else if (selectedInteraction === "edit") { // TODO(roehlipa): It has become clear, that edit should be deprecated in favour of update
        transaction[1].push(feature);
    }
    else if (selectedInteraction === "delete") {
        transaction[2].push(feature);
    }
    // TODO(roehlipa): See lines 1351 - 1363 in model.js for (possibly needed) extra steps for delete and update
    return new XMLSerializer()
        .serializeToString(
            new WFS({version})
                .writeTransaction(...transaction, {
                    featureNS,
                    featurePrefix,
                    featureType,
                    srsName: "EPSG:25832", // TODO(roehlipa): Get this from the map
                    version
                })
        );
}
