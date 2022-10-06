import Feature from "ol/Feature";

/**
 * Adds the given featureProperties and the geometry of the feature
 * to a new feature.
 *
 * @param {{id:string, geometryName: string, geometry: module:ol/geom/Geometry}} feature Object containing the id, geometryName and corresponding geometry of the drawn feature.
 * @param {FeatureProperty[]} featureProperties Properties defined by the service with values by the user.
 * @param {String} featurePrefix Prefix defined by the namespace of the service.
 * @param {Boolean} updateFeature If true, the selectedInteraction is update, otherwise it is insert.
 * @returns {module:ol/Feature} Feature to be inserted or updated.
 */
export default function ({id, geometry, geometryName}, featureProperties, featurePrefix, updateFeature) {
    const transactionFeature = new Feature();

    featureProperties.forEach(property => {
        const key = updateFeature
            ? `${featurePrefix}:${property.key}`
            : property.key;

        if (property.type === "geometry") {
            return;
        }
        if (["", null, undefined].includes(property.value) && updateFeature) {
            transactionFeature.set(key, null);
        }
        else if (["integer", "int", "decimal"].includes(property.type)) {
            if (!Number.isFinite(parseFloat(property.value))) {
                return;
            }
            transactionFeature.set(key, Number(property.value));
        }
        else {
            transactionFeature.set(key, property.value);
        }
    });

    transactionFeature.setGeometryName(updateFeature
        ? `${featurePrefix}:${geometryName}`
        : geometryName);
    transactionFeature.setGeometry(geometry);
    if (id) {
        transactionFeature.setId(id);
    }

    return transactionFeature;
}
