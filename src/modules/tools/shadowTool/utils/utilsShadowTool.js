import moment from "moment";


/**
 * Updates Cesium time in 3D map
 * @param {timestamp} datetime new Time
 * @returns {void}
 */
function updateCesiumTime (datetime) {

    if (typeof Cesium !== "undefined") {
        mapCollection.getMap("3D").time = Cesium.JulianDate.fromDate(moment(datetime).toDate());
    }
}
/**
 * Updates shadow in 3D map
 * @param {Boolean} isShadowEnabled shadow mode
 * @returns {void}
 */
function updateShadow (isShadowEnabled) {
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

export {
    updateShadow,
    updateCesiumTime
};

