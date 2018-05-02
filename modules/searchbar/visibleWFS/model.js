define(function (require) {
    var Radio = require("backbone.radio"),
        VisibleWFSModel;

    VisibleWFSModel = Backbone.Model.extend({
        /**
        *
        */
        defaults: {
            inUse: false,
            minChars: 3
        },
        /**
         * @description Initialisierung der visibleWFS Suche
         * @param {Object} config - Das Konfigurationsobjekt der Suche in sichtbaren WFS.
         * @param {integer} [config.minChars=3] - Mindestanzahl an Characters, bevor eine Suche initiiert wird.
         */
        initialize: function (config) {
            if (config.minChars) {
                this.setMinChars(config.minChars);
            }
            this.listenTo(Radio.channel("Searchbar"), {
                "search": this.prepSearch
            });
        },
        /**
        *
        */
        prepSearch: function (searchString) {
            if (this.getInUse() === false && searchString.length >= this.getMinChars()) {
                this.setInUse(true);
                var searchString = searchString.replace(" ", ""),
                    wfsModels = Radio.request("ModelList", "getModelsByAttributes", {isVisibleInMap: true, typ: "WFS"}),
                    elasticModels = Radio.request("ModelList", "getModelsByAttributes", {isVisibleInMap: true, typ: "Elastic"}),
                    filteredModels = _.filter(_.union(wfsModels, elasticModels), function (model) {
                        return model.has("searchField") === true && model.get("searchField") !== "";
                    });

                this.findMatchingFeatures(filteredModels, searchString);
                Radio.trigger("Searchbar", "createRecommendedList");
                this.setInUse(false);
            }
        },

        findMatchingFeatures: function (models, searchString) {
            var featureArray = [];

            _.each(models, function (model) {
                var features = model.get("layer").getSource().getFeatures();

                if (_.isArray(model.get("searchField"))) {
                    _.each(model.get("searchField"), function (field) {
                        var filteredFeatures = _.filter(features, function (feature) {

                            return feature.get(field).indexOf(searchString) !== -1;
                        });
                        // createFeatureObject for each feature
                        featureArray.push(this.getFeatureObject(field, filteredFeatures, model));
                    }, this);
                }
                else {
                    var filteredFeatures = _.filter(features, function (feature) {
                        return feature.get(model.get("searchField")).indexOf(searchString) !== -1;
                    });
                    // createFeatureObject for each feature
                    featureArray.push(this.getFeatureObject(model.get("searchField"), filteredFeatures, model));
                }
            }, this);

            Radio.trigger("Searchbar", "pushHits", "hitList", featureArray);
        },



        /**
         * gets a new feature object
         * @param  {string} searchField
         * @param  {ol.Feature} feature
         * @param  {Backbone.Model} model
         * @return {object}
         */
        getFeatureObject: function (searchField, filteredFeatures, model) {
            var featureArray = [];

            _.each(filteredFeatures, function (feature) {
                featureArray.push({
                    name: feature.get(searchField),
                    type: model.get("name"),
                    coordinate: this.getCentroidPoint(feature.getGeometry()),
                    imageSrc: this.getImageSource(feature, model),
                    id: _.uniqueId(model.get("name")),
                    additionalInfo: this.getAdditionalInfo(model, feature)
                });
            }, this);
            return featureArray;
        },

        /**
         * gets centroid point for a openlayers geometry
         * @param  {ol.geom.Geometry} geometry
         * @return {ol.Coordinate}
         */
        getCentroidPoint: function (geometry) {
            if (geometry.getType() === "MultiPolygon") {
                return geometry.getExtent();
            }
            else {
                return geometry.getCoordinates();
            }
        },

        /**
         * returns an image source of a feature style
         * @param  {ol.Feature} feature
         * @param  {Backbone.Model} model
         * @return {string}
         */
        getImageSource: function (feature, model) {
            if (feature.getGeometry().getType() === "Point" || feature.getGeometry().getType() === "MultiPoint") {
                var layerStyle = model.get("layer").getStyle(feature),
                    layerTyp = model.getTyp();

                // layerStyle returns style
                if (typeof layerStyle === "object") {
                    return layerStyle[0].getImage().getSrc();
                }
                // layerStyle returns stylefunction
                else {
                    var style = layerStyle(feature);

                    return (layerTyp === "WFS") ? style.getImage().getSrc() : undefined;
                }
            }
            else {
                return undefined;
            }
        },

        getAdditionalInfo: function (model, feature) {
            var additionalInfo;

            if (!_.isUndefined(model.get("additionalInfoField"))) {
                additionalInfo = feature.getProperties()[model.get("additionalInfoField")];
            }

            return additionalInfo;
        },

        // getter for minChars
        getMinChars: function () {
            return this.getMinChars();
        },
        // setter for minChars
        setMinChars: function (value) {
            this.set("minChars", value);
        },

        // getter for inUse
        getInUse: function () {
            return this.getInUse();
        },
        // setter for inUse
        setInUse: function (value) {
            this.set("inUse", value);
        }
    });

    return VisibleWFSModel;
});
