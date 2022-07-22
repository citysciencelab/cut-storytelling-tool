import getProxyUrl from "../../../../utils/getProxyUrl";
import {getWmsFeaturesByMimeType} from "../../../../api/gfi/getWmsFeaturesByMimeType";
import {getVisibleWmsLayersAtResolution} from "../utils/getLayers";

export default {
/**
     * Updates the click coordinate and the related pixel depending on the map mode.
     * If Gfi Tool is active, the features of this coordinate/pixel are set.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    updateClick ({commit, dispatch}) {
        commit("setGfiFeatures", null);
        dispatch("MapMarker/removePolygonMarker", null, {root: true});
        dispatch("collectGfiFeatures");
    },


    /**
     * collects features for the gfi.
     * @param {Object} param store context
     * @param {Object} param.getters the getter
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @returns {void}
     */
    collectGfiFeatures ({getters, commit, dispatch, rootGetters}) {
        const clickCoordinate = rootGetters["Maps/clickCoordinate"],
            resolution = rootGetters["Maps/resolution"],
            projection = rootGetters["Maps/projection"],
            gfiFeaturesAtPixel = getters.gfiFeaturesAtPixel,
            gfiWmsLayerList = getVisibleWmsLayersAtResolution(resolution).filter(layer => {
                return layer.get("gfiAttributes") !== "ignore";
            });

        Promise.all(gfiWmsLayerList.map(layer => {
            const gfiParams = {
                INFO_FORMAT: layer.get("infoFormat"),
                FEATURE_COUNT: layer.get("featureCount")
            };
            let url = layer.getSource().getFeatureInfoUrl(clickCoordinate, resolution, projection, gfiParams);

            // this part is needed if a Url contains a style which seems to mess up the getFeatureInfo call
            if (url.indexOf("STYLES") && url.indexOf("STYLES=&") === -1) {
                const newUrl = url.replace(/STYLES=.*?&/g, "STYLES=&");

                url = newUrl;
            }

            /**
             * @deprecated in the next major-release!
             * useProxy
             * getProxyUrl()
             */
            url = layer.get("useProxy") ? getProxyUrl(url) : url;

            return getWmsFeaturesByMimeType(layer, url);
        }))
            .then(gfiFeatures => {
                const clickPixel = rootGetters["Maps/clickPixel"],
                    clickCartesianCoordinate = rootGetters["Maps/clickCartesianCoordinate"],
                    mode = rootGetters["Maps/mode"],
                    allGfiFeatures = gfiFeaturesAtPixel(clickPixel, clickCartesianCoordinate, mode).concat(...gfiFeatures);

                // only commit if features found
                if (allGfiFeatures.length > 0) {
                    commit("setGfiFeatures", allGfiFeatures);
                }
            })
            .catch(error => {
                console.warn(error);
                dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.gfi.errorMessage"), {root: true});
            });
    }
};
