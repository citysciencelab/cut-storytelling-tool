import moment from "moment";

const actions = {
    /**
     * Updates Cesium time in 3D map
     * @param {Object} state vuex context object.
     * @param {timestamp} datetime new Time
     * @returns {void}
     */
    updateCesiumTime (state, datetime) {

        if (typeof Cesium !== "undefined") {
            mapCollection.getMap("3D").time = Cesium.JulianDate.fromDate(moment(datetime).toDate());
        }
    },
    /**
     * Updates shadow in 3D map
     * @param {Object} state vuex context object.
     * @param {Boolean} isShadowEnabled shadow mode
     * @returns {void}
     */
    updateShadow (state, isShadowEnabled) {
        const scene = mapCollection.getMap("3D").getCesiumScene();

        if (scene) {
            if (isShadowEnabled) {
                if (!scene.sun) {
                    scene.sun = new Cesium.Sun();
                }
                scene.globe.shadows = Cesium.ShadowMode.RECEIVE_ONLY;
                scene.globe.enableLighting = isShadowEnabled;
                scene.shadowMap.enabled = isShadowEnabled;
            }
            else {
                scene.shadowMap.enabled = isShadowEnabled;
            }
        }
    }
};

export default actions;
