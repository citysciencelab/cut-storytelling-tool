import {transformFromMapProjection} from "masterportalAPI/src/crs";
import store from "../../src/app-store";
import mapCollection from "../../src/core/dataStorage/mapCollection";
import {getMapMode} from "../../src/core/maps/maps.js";

const map = Backbone.Model.extend(/** @lends map.prototype */{
    defaults: {
    },

    initialize: function () {
        const channel = Radio.channel("Map");

        channel.reply({
            "getLayers": function () {
                return mapCollection.getMap("ol", "2D").getLayers();
            },
            "createLayerIfNotExists": function (name) {
                return mapCollection.getMap("ol", "2D").addNewLayerIfNotExists(name);
            },
            "getSize": function () {
                return mapCollection.getMap("ol", "2D").getSize();
            },
            "registerListener": function (event, callback, context) {
                mapCollection.getMap("ol", "2D").registerListener(event, callback, context);
            },
            "getMap": function () {
                return mapCollection.getMap("ol", "2D");
            },
            "getLayerByName": function (name) {
                return mapCollection.getMap("ol", "2D").getLayerByName(name);
            },
            "getMapMode": getMapMode
        }, this);

        channel.on({
            "addLayer": function (layer) {
                this.getMap().addLayer(layer);
            },
            "addLayerToIndex": function (args) {
                mapCollection.getMap("ol", "2D").addLayerToIndex(args[0], args[1]);
            },
            "addLayerOnTop": function (layer) {
                mapCollection.getMap("ol", "2D").addLayer(layer);
            },
            "addOverlay": function (overlay) {
                mapCollection.getMap("ol", "2D").addOverlay(overlay);
            },
            "addInteraction": function (interaction) {
                mapCollection.getMap("ol", "2D").addInteraction(interaction);
            },
            "removeLayer": function (layer) {
                mapCollection.getMap("ol", "2D").removeLayer(layer);
            },
            "removeOverlay": function (overlay) {
                mapCollection.getMap("ol", "2D").removeOverlay(overlay);
            },
            "removeInteraction": function (interaction) {
                mapCollection.getMap("ol", "2D").removeInteraction(interaction);
            },
            "setBBox": function (bbox) {
                mapCollection.getMapView("ol", "2D").setBBox(bbox);
            },
            "render": function () {
                mapCollection.getMap("ol", "2D").render();
            },
            "zoomToExtent": function (extent, options) {
                mapCollection.getMapView("ol", "2D").zoomToExtent(extent, options);
            },
            "zoomToProjExtent": function (data) {
                mapCollection.getMapView("ol", "2D").zoomToProjExtent(data);
            },
            "zoomToFilteredFeatures": function (ids, layerId, zoomOptions) {
                mapCollection.getMapView("ol", "2D").zoomToFilteredFeatures(ids, layerId, zoomOptions);
            },
            "registerListener": function (event, callback, context) {
                mapCollection.getMap("ol", "2D").registerListener(event, callback, context);
            },
            "unregisterListener": function (event, callback, context) {
                mapCollection.getMap("ol", "2D").unregisterListener(event, callback, context);
            },
            "updateSize": function () {
                mapCollection.getMap("ol", "2D").updateSize();
            },
            "setMap3dModel": function (map3dModel) {
                this.set("map3dModel", map3dModel);
            },
            "setObliqueMap": function (obliqueMap) {
                this.set("obliqueMap", obliqueMap);
            }
        }, this);

        this.listenTo(this, {
            "change:vectorLayer": function (model, value) {
                this.addLayerToIndex([value, 0]);
            }
        });

        /**
         * resolution
         * @deprecated in 3.0.0
         */
        if (mapViewSettings && mapViewSettings?.resolution) {
            console.warn("MapView parameter 'resolution' is deprecated. Please use 'startResolution' instead.");
            mapViewSettings.startResolution = mapViewSettings.resolution;
        }
        /**
         * zoomLevel
         * @deprecated in 3.0.0
         */
        if (mapViewSettings && mapViewSettings?.zoomLevel) {
            console.warn("MapView parameter 'zoomLevel' is deprecated. Please use 'startZoomLevel' instead.");
            mapViewSettings.startZoomLevel = mapViewSettings.zoomLevel;
        }

        this.setMap(api.map.createMap(
            {...Config, ...mapViewSettings, layerConf: getLayerList()}, {}, "2D"));

        new MapView({view: mapCollection.getMap("ol", "2D").getView(), settings: mapViewSettings});

        this.set("view", mapCollection.getMap("ol", "2D").getView());

        this.addAliasForWFSFromGoeserver(getMapProjection(mapCollection.getMap("ol", "2D")));

        if (window.Cesium) {
            this.set("map3dModel", new Map3dModel());
        }
        if (Config.obliqueMap) {
            this.set("obliqueMap", new ObliqueMap({}));
        }
        Radio.trigger("ModelList", "addInitiallyNeededModels");
        Radio.trigger("Map", "isReady", "gfi", false);

        // potentially deprecated, replaced by drawend
        if (typeof Config.inputMap !== "undefined" && Config.inputMap.setMarker) {
            this.registerListener("click", this.addMarker.bind(this));
        }
    },

    /**
     * !!!!!!!!!!!!!!!!!! wird nur im remoteInterface für dipas benutzt !!!!!!!!!!!!!!!!!!
     * Function is registered as an event listener if the config-parameter "inputMap" is present
     * and always sets a mapMarker at the clicked position without activating it.
     * Also triggers the RemoteInterface with the marker coordinates.
     * @param  {event} event - The MapBrowserPointerEventShowMarker
     * @fires Core#RadioTriggerMapViewSetCenter
     * @fires RemoteInterface#RadioTriggerRemoteInterfacePostMessage
     * @returns {void}
     */
    addMarker: function (event) {
        let coords = event.coordinate;

        store.dispatch("MapMarker/placingPointMarker", coords);

        // If the marker should be centered, center the map around it.
        if (Config.inputMap.setCenter) {
            Radio.trigger("MapView", "setCenter", coords);
        }

        // Should the coordinates get transformed to another coordinate system for broadcast?
        if (Config.inputMap.targetProjection !== undefined) {
            coords = transformFromMapProjection(mapCollection.getMap("ol", "2D"), Config.inputMap.targetProjection, coords);
        }

        // Broadcast the coordinates clicked in the desired coordinate system.
        Radio.trigger("RemoteInterface", "postMessage", {"setMarker": coords});

    },

    /**
    * Moves the layer on the map to the intended position.
    * @param {Array} args - [0] = Layer, [1] = Index
    * @returns {void}
    */
    addLayerToIndex: function (args) {
        console.log(args);
        const layer = args[0],
            index = args[1],
            layersCollection = mapCollection.getMap("ol", "2D").getLayers();
console.log(layersCollection.getArray());
        let layerModel;

        if (layer) {
            layerModel = Radio.request("ModelList", "getModelByAttributes", {"id": layer.get("id")});
        }

        layer.setZIndex(index);
        if (!layersCollection.getArray().includes(layer)) {
            mapCollection.getMap("ol", "2D").addLayer(layer);
        }

        this.setImportDrawMeasureLayersOnTop(layersCollection);

        // Laden des Layers überwachen
        if (layer instanceof LayerGroup) {
            console.log("LayerGroup");
            layer.getLayers().forEach(function (singleLayer) {
                /* NOTE
                 * Broken. channel.trigger is called immediately and returns undefined.
                 * However, depending on the config, the loader will not disappear without this toggle.
                 * (e.g. if only one WMTS without optionsFromCapabilities is set)
                 */
                singleLayer.getSource().on("wmsloadend", Radio.trigger("Map", "removeLoadingLayer"), this);
                singleLayer.getSource().on("wmsloadstart", Radio.trigger("Map", "addLoadingLayer"), this);
            });
        }
        else if (layerModel instanceof WMTSLayer) {
            console.log("WMTSLayer");
            if (layerModel.attributes.optionsFromCapabilities && !layerModel.hasBeenActivatedOnce) {
                console.log("hasBeenActivatedOnce");
                /* Additional guard: "addLayerToIndex" is called about 3 times on startup,
                 * but addLoadingLayer should only be called once */
                layerModel.hasBeenActivatedOnce = true;
                // wmts source will load asynchonously
                // -> source=null at this step
                // listener to remove loading layer is set in WMTS class (on change:layerSource)
                Radio.trigger("Map", "addLoadingLayer");
            }
        }
        else {
            console.log("else");
            /* NOTE
             * Broken. channel.trigger is called immediately and returns undefined.
             * However, depending on the config, the loader will not disappear without this toggle.
             * (e.g. if only one WMTS without optionsFromCapabilities is set)
             */
            layer.getSource().on("wmsloadend", Radio.trigger("Map", "removeLoadingLayer"), this);
            layer.getSource().on("wmsloadstart", Radio.trigger("Map", "addLoadingLayer"), this);
        }
        console.log(layersCollection.getArray());
        layersCollection.getArray().forEach(singleLayer => {
            console.log("**********");
            console.log(singleLayer);
            console.log(singleLayer.get("id"));
            console.log(singleLayer.get("name"));
            console.log(singleLayer.getZIndex());
        });
    },

    /**
     * Sets an already inserted ol.layer to the defined index using openlayers setZIndex method
     * @param {ol.Layer} layer  - Layer to set.
     * @param {integer} [index=0] - New Index.
     * @returns {void}
     */
    setLayerToIndex: function (layer, index) {
        if (layer instanceof LayerGroup) {
            layer.getLayers().forEach(function (singleLayer) {
                singleLayer.setZIndex(parseInt(index, 10) || 0);
            });
        }
        else {
            layer.setZIndex(parseInt(index, 10) || 0);
        }
    },

    /**
     * Pushes 'alwaysOnTop' layers to the top of the collection.
     * @param {ol.Collection} layers - Layer Collection.
     * @returns {void}
     */
    setImportDrawMeasureLayersOnTop: function (layers) {
        const newIndex = layers.getLength(),
            layersOnTop = layers.getArray().filter(function (layer) {
                return layer.get("alwaysOnTop") === true;
            });

        layersOnTop.forEach(layer => {
            this.setLayerToIndex(layer, newIndex);
        });
    },

    /**
     * todo
     * @returns {void}
     */
    addLoadingLayer: function () {
        this.set("initialLoading", this.get("initialLoading") + 1);
    },

    /**
     * todo
     * @returns {void}
     */
    removeLoadingLayer: function () {
        this.set("initialLoading", this.get("initialLoading") - 1);
    },

    /**
    * Initial loading. "initialLoading" is incremented across layers if several tiles are loaded and incremented again if the tiles are loaded.
    * Listener is then stopped so that the loader is only displayed during initial loading - not when zoom/pan is selected. [...]
    * @returns {void}
    */
    initialLoadingChanged: function () {
        const num = this.get("initialLoading");

        if (num === 0) {
            this.stopListening(this, "change:initialLoading");
        }
    }
});

export default map;
