import Feature from "ol/Feature.js";
import {WFS} from "ol/format.js";
import Point from "ol/geom/Point.js";
import {Icon, Style} from "ol/style.js";
import {Vector as VectorLayer} from "ol/layer.js";
import VectorSource from "ol/source/Vector.js";
import {getLayerWhere} from "masterportalAPI/src/rawLayerList";
import getProxyUrl from "../../utils/getProxyUrl";
import store from "../../app-store";
import mapCollection from "../../core/dataStorage/mapCollection";
import calculateExtent from "../../utils/calculateExtent";
import {value} from "text-loader";
import axios from "axios";

/*
eslint-disable
 */

/*
eslint-disable
-	Hole StyleID anhand von LayerID
-	Setze IDs in Array
-	Hole WFS Features mit diesen IDs
-	Parse und setze Features
-	FeatureCenterList: Mittelpunkt von Fläche berechnen
-	Features darstellen:
    o	Setze Punkt
    o	Setze Icon
-	Zoom

 */

export default function init (config) {

    const features = [];
    const format = new WFS();

    //if (store.state.urlParams && store.state.urlParams.zoomTo) {
    store.watch(state => state.urlParams.zoomTo, async (params) => {
        //const params = store.state.urlParams.zoomTo;
        console.log(JSON.stringify(params));
        for (const id in params) {

            const {layerId, property, styleId} = config.find(layer => id === layer.id)
            const values = [params[id]].flatMap(String);

            //getFeaturesFromWFS
            const {url, version, featureType} = getLayerWhere({id: layerId})
            const result = await axios.get(url + "?service=WFS&version=" + version + "&request=GetFeature&TypeName=" + featureType);

            console.log(result);

            const styleListModel = Radio.request("StyleList", "returnModelById", styleId);

            // zoomToFeatures
            const resultFeatures = format.readFeatures(result.data);
            features.push(...resultFeatures.filter(feature => values.includes(feature.get(property))))
            console.log(resultFeatures);
            console.log(values, property, resultFeatures.map((feature) => feature.get(property)));
        }

        /*this.createFeatureCenterList();
        this.putIconsForFeatureIds(this.get("featureCenterList"),
            this.get("imgLink"), // @deprecated in version 3.0.0
            this.get("anchor"), // @deprecated in version 3.0.0
            this.get("imageScale"), // @deprecated in version 3.0.0
            this.get("styleListModel"));*/
        console.log(features);
        mapCollection.getMapView("ol", "2D").setBBox(calculateExtent(features));
    }, {deep: true})

}

