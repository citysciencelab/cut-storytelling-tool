const FeatureViaURL = Backbone.Model.extend(/** @lends FeatureViaURL.prototype*/{
    defaults: {
        coordLabel: "",
        featureLabel: "",
        folderName: "",
        typeLabel: ""
    },
    /**
     * @class FeatureViaURL
     * @description Creates a new GeoJSON layer on the basis of the given features by the user via the URL.
     * @extends Backbone.Model
     * @memberof FeatureViaURL
     * @param {Object} config The configuration of the module from the config.js.
     * @constructs
     * @property {String} featureLabel="Beschriftung" The label for the features.
     * @property {String} coordLabel="Koordinaten" The label for the coordinates of the features.
     * @property {String} typeLabel="Geometrietyp" The label for the type of the features.
     * @fires Core#RadioRequestParametricURLGetFeatureViaURL
     * @fires Core.ConfigLoader#RadioRequestParserGetTreeType
     * @fires Core.ConfigLoader#RadioTriggerParserAddFolder
     * @fires Tools.AddGeoJSON#RadioTriggerAddGeoJSONAddGeoJsonToMap
     * @listens i18next#RadioTriggerLanguageChanged
     */
    initialize: function (config) {
        if (!config || !Array.isArray(config.layers) || config.layers.length === 0) {
            Radio.trigger("Alert", "alert", "FeatureViaURL: No layers were defined in the config.js for the given features.");
            return;
        }
        this.translate();
        this.listenTo(Radio.channel("i18next"), {
            "languageChanged": this.translate
        });

        const gfiAttributes = {
                featureLabel: this.get("featureLabel"),
                coordLabel: this.get("coordLabel"),
                typeLabel: this.get("typeLabel")
            },
            layers = Radio.request("ParametricURL", "getFeatureViaURL"),
            treeType = Radio.request("Parser", "getTreeType");
        let features,
            geoJSON,
            geometryType,
            layerId,
            layerPosition,
            parentId = "tree";

        if (treeType === "custom") {
            Radio.trigger("Parser", "addFolder", this.get("folderName"), "featureViaURLFolder", "Overlayer", 0, true, "modules.featureViaURL.folderName");
            parentId = "featureViaURLFolder";
        }

        layers.forEach(layer => {
            layerId = layer.layerId;
            features = layer.features;
            layerPosition = config.layers.findIndex(element => element.id === layerId);
            if (layerPosition === -1) {
                Radio.trigger("Alert", "alert", `FeatureViaURL: The layer with the id ${layerId} was not found.`);
                return;
            }
            if (!config.layers[layerPosition].name) {
                Radio.trigger("Alert", "alert", `FeatureViaURL: No name was defined for the layer with the id ${layerId}.`);
                return;
            }
            geometryType = config.layers[layerPosition].geometryType;
            if (geometryType !== "LineString" && geometryType !== "Point" && geometryType !== "Polygon") {
                Radio.trigger("Alert", "alert", `FeatureViaURL: The given geometryType ${geometryType} is not supported.`);
                return;
            }
            geoJSON = this.createGeoJSON(config.epsg, features, geometryType);
            Radio.trigger("AddGeoJSON", "addGeoJsonToMap", config.layers[layerPosition].name, config.layers[layerPosition].id, geoJSON, config.layers[layerPosition].styleId, parentId, gfiAttributes);
        });
    },
    /**
     * Creates a basic GeoJSON structure and add the features from the user to it.
     *
     * @param {Integer} [epsg=4326] The EPSG-Code in which the features are coded.
     * @param {Object[]} features The features given by the user to be added to the map.
     * @param {String} geometryType Geometry type of the given features.
     * @returns {JSON} GeoJSON containing the features.
     */
    createGeoJSON: function (epsg = 4326, features, geometryType) {
        const geoJSON = {
            "type": "FeatureCollection",
            "crs": {
                "type": "link",
                "properties": {
                    "href": "http://spatialreference.org/ref/epsg/" + epsg + "/proj4/",
                    "type": "proj4"
                }
            },
            "features": []
        };
        let featureJSON;

        features.forEach(feature => {
            featureJSON = {
                "type": "Feature",
                "geometry": {
                    "type": geometryType,
                    "coordinates": feature.coordinates
                },
                "properties": {
                    "featureLabel": feature.label,
                    "coordLabel": feature.coordinates,
                    "typeLabel": geometryType
                }
            };
            geoJSON.features.push(featureJSON);
        });

        return geoJSON;
    },
    /**
     * Translates the values of this module, namely "coordLabel", "featureLabel", "folderName" and "typeLabel".
     * NOTE: The labels are currently not updated when changing a language. To accomplish this the layer will have to be removed and readded.
     *
     * @returns {void}
     */
    translate: function () {
        this.set("coordLabel", i18next.t("common:modules.featureViaURL.coordLabel"));
        this.set("featureLabel", i18next.t("common:modules.featureViaURL.featureLabel"));
        this.set("folderName", i18next.t("common:modules.featureViaURL.coordLabel"));
        this.set("typeLabel", i18next.t("common:modules.featureViaURL.typeLabel"));
    }
});

export default FeatureViaURL;
