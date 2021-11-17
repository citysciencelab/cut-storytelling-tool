/**
* Calculates the extent in which all given features are displayed.
* @param {ol/Feature[]} features An array of features to be displayed in the extent
* @returns {(Number[])} The extent as an array [xMin, yMin, xMax, yMax]
*/
export default function calculateExtent (features) {
    const extent = [9999999, 9999999, 0, 0];

    features.forEach(feature => {
        const featureExtent = feature?.getGeometry()?.getExtent() || [];

        extent[0] = featureExtent[0] < extent[0] ? featureExtent[0] : extent[0];
        extent[1] = featureExtent[1] < extent[1] ? featureExtent[1] : extent[1];
        extent[2] = featureExtent[2] > extent[2] ? featureExtent[2] : extent[2];
        extent[3] = featureExtent[3] > extent[3] ? featureExtent[3] : extent[3];
    });

    return extent;
}
