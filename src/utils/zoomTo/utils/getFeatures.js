import axios from "axios";
import {getLayerWhere} from "masterportalapi/src/rawLayerList";
import {WFS} from "ol/format";
import handleAxiosResponse from "../../handleAxiosResponse";

/**
 * Retrieves features from the defined layer.
 *
 * @param {string} layerId Id of the layer to retrieve the features from.
 * @returns {Promise<Feature[]>} If resolved, returns an array of features.
 */
export default function (layerId) {
    const {url, version, featureType} = getLayerWhere({id: layerId});

    return axios
        .get(`${url}?service=WFS&version=${version}&request=GetFeature&typeName=${featureType}`)
        .then(response => handleAxiosResponse(response, "utils/zoomTo/actionsZoomTo/zoomToFeatures"))
        .then(data => new WFS().readFeatures(data));
}
