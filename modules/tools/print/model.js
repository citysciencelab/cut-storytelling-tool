define(function (require) {
    var Config = require("config"),
        $ = require("jquery"),
        ol = require("openlayers"),
        PrintModel;

    PrintModel = Backbone.Model.extend({
        defaults: {
            printID: "99999",
            MM_PER_INCHES: 25.4,
            POINTS_PER_INCH: 72,
            title: "PrintResult",
            outputFilename: "Ausdruck",
            outputFormat: "pdf",
            gfiToPrint: [], // die sichtbaren GFIs
            center: Config.view.center,
            scale: {},
            layerToPrint: [],
            fetched: false, // gibt an, ob info.json schon geladen wurde
            gfi: false,
            printurl: "",
            gfiMarker: {
                outerCircle: {
                    fill: false,
                    pointRadius: 8,
                    stroke: true,
                    strokeColor: "#ff0000",
                    strokeWidth: 3
                },
                point: {
                    fill: true,
                    pointRadius: 1,
                    fillColor: "#000000",
                    stroke: false
                }
            },
            configYAML: "/master"
        },

        /*
         * Ermittelt die URL zum Fetchen in setStatus durch Abfrage der ServiceId
         */
        url: function () {
            var resp = Radio.request("RestReader", "getServiceById", this.get("printID")),
                url = resp && resp.get("url") ? resp.get("url") : null,
                printurl;

            if (url) {
                printurl = url + this.get("configYAML");

                this.set("printurl", printurl);
                return Config.proxyURL + "?url=" + printurl + "/info.json";
            }
            return "undefined"; // muss String übergeben, sonst Laufzeitfehler
        },

        //
        initialize: function () {
            this.setConfigParams();
            this.listenTo(this, {
                "change:layout change:scale change:isCurrentWin": this.updatePrintPage,
                "change:specification": this.getPDFURL
            });

            this.listenTo(Radio.channel("MapView"), {
                "changedOptions": this.setScaleByMapView,
                "changedCenter": this.setCenter
            });

            this.listenTo(Radio.channel("Window"), {
                "winParams": this.setStatus
            });
        },
        setConfigParams: function () {
            var printConf = Radio.request("ModelList", "getModelByAttributes", {id: "print"}),
                printAttrs = printConf.attributes;

            if (_.has(printAttrs, "printID") === true) {
                this.setPrintID(printAttrs.printID);
            }
            if (_.has(printAttrs, "title") === true) {
                this.setTitle(printAttrs.title);
            }
            if (_.has(printAttrs, "gfi") === true) {
                this.setGfi(printAttrs.gfi);
            }
            if (_.has(printAttrs, "outputFilename") === true) {
                this.setOutputFilename(printAttrs.outputFilename);
            }
            if (_.has(printAttrs, "gfiMarker") === true) {
                this.setGfiMarker(printAttrs.gfiMarker);
            }
            if (_.has(printAttrs, "configYAML") === true) {
                this.setConfigYAML(printAttrs.configYAML);
            }
        },

        // Setzt die setConfigYAML-Datei für url Parameter
        setConfigYAML: function (name) {
            this.set("configYAML", "/" + name);
        },


        // Überschreibt ggf. den Titel für den Ausdruck. Default Value kann in der config.js eingetragen werden.
        setTitleFromForm: function () {
            if ($("#titleField").val()) {
                this.setTitle($("#titleField").val());
            }
        },

        // Setzt das Format(DinA4/A3 Hoch-/Querformat) für den Ausdruck.
        setLayout: function (index) {
            this.set("layout", this.get("layouts")[index]);
        },

        // setter for printID
        setPrintID: function (value) {
            this.set("printID", value);
        },

        // setter for title
        setTitle: function (value) {
            this.set("title", value);
        },

        // setter for gfi
        setGfi: function (value) {
            this.set("gfi", value);
        },

        // setter for outputFilename
        setOutputFilename: function (value) {
            this.set("outputFilename", value);
        },
        // Setzt den Maßstab für den Ausdruck über die Druckeinstellungen.
        setScale: function (index) {
            var scaleval = this.get("scales")[index].valueInt;

            Radio.trigger("MapView", "setScale", scaleval);
        },

        // Setzt den Maßstab für den Ausdruck über das Zoomen in der Karte.
        setScaleByMapView: function () {
            var newScale = _.find(this.get("scales"), function (scale) {
                return scale.valueInt === Radio.request("MapView", "getOptions").scale;
            });

            this.set("scale", newScale);
        },

        // Setzt die Zentrumskoordinate.
        setCenter: function (value) {
            this.set("center", value);
        },

        //
        setStatus: function (args) {
            var scaletext;

            if (args[2].get("id") === "print") {
                if (this.get("fetched") === false) {
                    // get print config (info.json)
                    this.fetch({
                        cache: false,
                        success: function (model) {
                            _.each(model.get("scales"), function (scale) {
                                scale.valueInt = parseInt(scale.value, 10);
                                scaletext = scale.valueInt.toString();
                                scaletext = scaletext < 10000 ? scaletext : scaletext.substring(0, scaletext.length - 3) + " " + scaletext.substring(scaletext.length - 3);
                                scale.name = "1: " + scaletext;
                            });
                            model.set("layout", _.findWhere(model.get("layouts"), {name: "A4 Hochformat"}));
                            model.setScaleByMapView();
                            model.set("isCollapsed", false);
                            model.set("isCurrentWin", true);
                            model.set("fetched", true);
                        },
                        error: function () {
                            Radio.trigger("Alert", "alert", {text: "<strong>Druckkonfiguration konnte nicht geladen werden!</strong> Bitte versuchen Sie es später erneut.", kategorie: "alert-danger"});
                            Radio.trigger("Window", "closeWin");
                        },
                        complete: function () {
                            Radio.trigger("Util", "hideLoader");
                        },
                        beforeSend: function () {
                            Radio.trigger("Util", "showLoader");
                        }
                    });
                }
                else {
                    this.set("isCollapsed", args[1]);
                    this.set("isCurrentWin", args[0]);
                }
            }
            else {
                this.set("isCurrentWin", false);
            }
        },

        updatePrintPage: function () {
            if (this.has("scale")) {
                if (this.get("isCurrentWin") === true) {
                    Radio.trigger("Map", "registerListener", "precompose", this.handlePreCompose, this);
                    Radio.trigger("Map", "registerListener", "postcompose", this.handlePostCompose, this);
                }
                else {
                    Radio.trigger("Map", "unregisterListener", "precompose", this.handlePreCompose, this);
                    Radio.trigger("Map", "unregisterListener", "postcompose", this.handlePostCompose, this);
                }
                Radio.trigger("Map", "render");
            }
        },

        getLayersForPrint: function () {
            var drawLayer = Radio.request("Draw", "getLayer");

            this.set("layerToPrint", []);
            this.setLayerToPrint(Radio.request("ModelList", "getModelsByAttributes", {isVisibleInMap: true, typ: "WMS"}));
            if (drawLayer.getSource().getFeatures().length > 0) {
                this.setLayer(drawLayer);
            }
            this.getGFIForPrint();
        },

        setLayerToPrint: function (layers) {
            var sortedLayers;

            sortedLayers = _.sortBy(layers, function (layer) {
                return layer.get("selectionIDX");
            });
            _.each(sortedLayers, function (layer) {
                // nur wichtig für treeFilter
                var params = {},
                    style = [],
                    layerURL = layer.get("url"),
                    numberOfLayer,
                    i,
                    defaultStyle;

                if (layer.has("SLDBody")) {
                    params.SLD_BODY = layer.get("SLDBody");
                }
                if (layer.get("id") === "2298") {
                    style.push("strassenbaumkataster_grau");
                }
                if (layer.has("styles")) {
                    style.push(layer.get("styles"));
                }
                // Für jeden angegebenen Layer muss ein Style angegeben werden.
                // Wenn ein Style mit einem Blank angegeben wird,
                // wird der Default-Style des Layers verwendet. Beispiel für 3 Layer: countries,,cities
                else {
                    numberOfLayer = layer.get("layers").split(",").length;
                    defaultStyle = "";

                    for (i = 1; i < numberOfLayer; i++) {
                        defaultStyle += ",";
                    }
                    style.push(defaultStyle);
                }
                // Damit Web-Atlas gedruckt werden kann
                if (layer.get("url").indexOf("gdi_mrh_themen") >= 0) {
                    layerURL = layer.get("url").replace("gdi_mrh_themen", "gdi_mrh_themen_print");
                }
                else if (layer.get("url").indexOf("gdi_mrh") >= 0) {
                    layerURL = layer.get("url").replace("gdi_mrh", "gdi_mrh_print");
                }
                else if (layer.get("url").indexOf("http://geoportal.metropolregion.hamburg.de") >= 0 ||
                         layer.get("url").indexOf("http://87.106.16.168") >= 0) {
                    layerURL = layer.get("url") + "_print";
                }
                this.push("layerToPrint", {
                    type: layer.get("typ"),
                    layers: layer.get("layers").split(),
                    baseURL: layerURL,
                    format: "image/png",
                    opacity: (100 - layer.get("transparency")) / 100,
                    customParams: params,
                    styles: style
                });
            }, this);
        },

        setLayer: function (layer) {
            var features = [],
                featureStyles = {},
                printStyleObj = {},
                layerId = layer.get("id"),
                layerModel,
                isClustered,
                styleModel;

            if (!_.isUndefined(layer)) {
                // get styleModel if layerId is defined.
                // layer id is not defined for portal-internal layer like animationLayer and import_draw_layer
                // then the style is located directly at the feature, see line 312
                if (!_.isUndefined(layerId)) {
                    layerModel = Radio.request("ModelList", "getModelByAttributes", {id: layerId});
                    isClustered = !_.isUndefined(layerModel.get("clusterDistance"));
                    styleModel = Radio.request("StyleList", "returnModelById", layerModel.get("styleId"));
                }
                // Alle features die eine Kreis-Geometrie haben
                _.each(layer.getSource().getFeatures(), function (feature) {
                    if (feature.getGeometry() instanceof ol.geom.Circle) {
                        // creates a regular polygon from a circle with 32(default) sides
                        feature.setGeometry(ol.geom.Polygon.fromCircle(feature.getGeometry()));
                    }
                });

                _.each(layer.getSource().getFeatures(), function (feature, index) {
                    var type = feature.getGeometry().getType(),
                        styles = !_.isUndefined(feature.getStyleFunction()) ? feature.getStyleFunction().call(feature) : styleModel.createStyle(feature, isClustered),
                        style = _.isArray(styles) ? styles[0] : styles,
                        coordinates = feature.getGeometry().getCoordinates();

                    features.push({
                        type: "Feature",
                        properties: {
                            _style: index
                        },
                        geometry: {
                            coordinates: coordinates,
                            type: type
                        }
                    });

                    // Punkte
                    if (type === "Point" || type === "MultiPoint") {
                        printStyleObj = this.createPointStyleForPrint(style);
                        featureStyles[index] = printStyleObj;
                    }
                    // Polygone oder Linestrings
                    else {
                        featureStyles[index] = {
                            fillColor: this.getColor(style.getFill().getColor()).color,
                            fillOpacity: this.getColor(style.getFill().getColor()).opacity,
                            strokeColor: this.getColor(style.getStroke().getColor()).color,
                            strokeWidth: style.getStroke().getWidth()
                        };
                    }
                }, this);
                this.push("layerToPrint", {
                    type: "Vector",
                    styles: featureStyles,
                    geoJson: {
                        type: "FeatureCollection",
                        features: features
                    }
                });
            }
        },
        createPointStyleForPrint: function (style) {
            var pointStyleObject = {},
                imgPath = this.createImagePath(),
                imgName = style.getImage() instanceof ol.style.Icon ? style.getImage().getSrc() : undefined;

            // Punkte ohne Text
            if (_.isNull(style.getText()) || _.isUndefined(style.getText())) {
                // style image is an Icon
                if (!_.isUndefined(imgName)) {
                    // get imagename from src path
                    imgName = imgName.match(/(?:[^/]+)$/g)[0];
                    imgPath += imgName;
                    imgPath = encodeURI(imgPath);
                    pointStyleObject = {
                        externalGraphic: imgPath,
                        graphicWidth: _.isArray(style.getImage().getSize()) ? style.getImage().getSize()[0] * style.getImage().getScale() : 20,
                        graphicHeight: _.isArray(style.getImage().getSize()) ? style.getImage().getSize()[1] * style.getImage().getScale() : 20,
                        graphicXOffset: !_.isNull(style.getImage().getAnchor()) ? -style.getImage().getAnchor()[0] : 0,
                        graphicYOffset: !_.isNull(style.getImage().getAnchor()) ? -style.getImage().getAnchor()[1] : 0
                    };
                }
                // style is an Circle or Point without Icon
                else {
                    pointStyleObject = {
                        fillColor: this.getColor(style.getImage().getFill().getColor()).color,
                        fillOpacity: this.getColor(style.getImage().getFill().getColor()).opacity,
                        pointRadius: style.getImage().getRadius(),
                        strokeColor: this.getColor(style.getImage().getFill().getColor()).color,
                        strokeOpacity: this.getColor(style.getImage().getFill().getColor()).opacity
                    };
                }
            }
            // Texte
            else {
                pointStyleObject = {
                    label: style.getText().getText(),
                    fontColor: this.getColor(style.getText().getFill().getColor()).color
                };
            }
            return pointStyleObject;
        },
        createImagePath: function () {
            var imgPath = window.location.origin + "/lgv-config/img/";

            // for local IDE take path to
            if (imgPath.indexOf("localhost") !== -1) {
                imgPath = "http://geofos.fhhnet.stadt.hamburg.de/lgv-config/img/";
            }
            return imgPath;
        },

        setSpecification: function (gfiPosition) {
            var layers = Radio.request("Map", "getLayers").getArray(),
                animationLayer = _.filter(layers, function (layer) {
                    return layer.get("name") === "animationLayer";
                }),
                wfsLayer = _.filter(layers, function (layer) {
                    return layer.get("typ") === "WFS" && layer.get("visible") === true && layer.getSource().getFeatures().length > 0;
                }),
                specification;

            if (animationLayer.length > 0) {
                this.setLayer(animationLayer[0]);
            }
            _.each(wfsLayer, function (layer) {
                this.setLayer(layer);
            }, this);
            specification = {
                // layout: $("#layoutField option:selected").html(),
                layout: this.get("layout").name,
                srs: Config.view.epsg,
                units: "m",
                outputFilename: this.get("outputFilename"),
                outputFormat: this.get("outputFormat"),
                layers: this.get("layerToPrint"),
                pages: [
                    {
                        center: Radio.request("MapView", "getCenter"),
                        scale: this.get("scale").value,
                        scaleText: this.get("scale").name,
                        geodetic: true,
                        dpi: "96",
                        mapTitle: this.get("title")
                    }
                ]
            };

            if (gfiPosition !== null) {
                _.each(_.flatten(this.get("gfiParams")), function (element, index) {
                    specification.pages[0]["attr_" + index] = element;
                }, this);
                specification.pages[0].layerName = this.get("gfiTitle");
            }
            this.set("specification", specification);
        },
        /**
         * Checkt, ob Kreis an GFI-Position gezeichnet werden soll und fügt ggf. Layer ein.
         * @param {number[]} gfiPosition -
         * @returns {void}
         */
        setGFIPos: function (gfiPosition) {
            if (gfiPosition !== null) {
                gfiPosition[0] = gfiPosition[0] + 0.25; // Verbesserung der Punktlage im Print
                this.push("layerToPrint", {
                    type: "Vector",
                    styleProperty: "styleId",
                    styles: {
                        0: this.get("gfiMarker").outerCircle,
                        1: this.get("gfiMarker").point
                    },
                    geoJson: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: gfiPosition
                                },
                                properties: {
                                    styleId: 0
                                }
                            },
                            {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: gfiPosition
                                },
                                properties: {
                                    styleId: 1
                                }
                            }
                        ]
                    }
                });
            }
            this.setSpecification(gfiPosition);
        },

        /**
        * Setzt die createURL in Abhängigkeit der GFI
        * @returns {void}
        */
        getGFIForPrint: function () {
            var gfis = Radio.request("GFI", "getIsVisible") === true ? Radio.request("GFI", "getGFIForPrint") : null,
                gfiParams = _.isArray(gfis) === true ? _.pairs(gfis[0]) : null, // Parameter
                gfiTitle = _.isArray(gfis) === true ? gfis[1] : "", // Layertitel
                gfiPosition = _.isArray(gfis) === true ? gfis[2] : null, // Koordinaten des GFI
                // printGFI = this.get("printGFI"), // soll laut config Parameter gedruckt werden?
                printGFI = this.get("gfi"), // soll laut config Parameter gedruckt werden?
                printurl = this.get("printurl"); // URL des Druckdienstes

            this.set("gfiParams", gfiParams);
            this.set("gfiTitle", gfiTitle);
            // Wenn eine GFIPos vorhanden ist, die Config das hergibt und die Anzahl der gfiParameter != 0 ist
            if (!_.isNull(gfiPosition) && printGFI === true && gfiParams && gfiParams.length > 0) {
                this.set("createURL", printurl + "_gfi_" + this.get("gfiParams").length.toString() + "/create.json");
            }
            else {
                this.set("createURL", printurl + "/create.json");
            }
            this.setGFIPos(gfiPosition);
        },

        /**
         * @desc Führt einen HTTP-Post-Request aus.
         * @returns {void}
         */
        getPDFURL: function () {

            $.ajax({
                url: Config.proxyURL + "?url=" + this.get("createURL"),
                type: "POST",
                context: this,
                async: false,
                data: JSON.stringify(this.get("specification")),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                success: this.openPDF,
                error: function (error) {
                    Radio.trigger("Alert", "alert", {
                        text: "Druck fehlgeschlagen: " + error.statusText,
                        kategorie: "alert-warning"
                    });
                },
                complete: function () {
                    Radio.trigger("Util", "hideLoader");
                },
                beforeSend: function () {
                    Radio.trigger("Util", "showLoader");
                }
            });
        },

        /**
         * @desc Öffnet das erzeugte PDF im Browser.
         * @param {Object} data - Antwort vom Druckdienst. Enthält die URL zur erzeugten PDF.
         * @returns {void}
         */
        openPDF: function (data) {
            window.open(data.getURL);
        },

        /**
         * @desc Hilfsmethode um ein Attribut vom Typ Array zu setzen.
         * @param {String} attribute - Das Attribut das gesetzt werden soll.
         * @param {whatever} value - Der Wert des Attributs.
         * @returns {void}
         */
        push: function (attribute, value) {
            var tempArray = _.clone(this.get(attribute));

            tempArray.push(value);
            this.set(attribute, _.flatten(tempArray));
        },

        // Prüft ob es sich um einen rgb(a) oder hexadezimal String handelt.
        // Ist es ein rgb(a) String, wird er in ein hexadezimal String umgewandelt.
        // Wenn vorhanden, wird die Opacity(default = 1) überschrieben.
        // Gibt den hexadezimal String und die Opacity zurück.
        getColor: function (value) {
            var color = value,
                opacity = 1,
                begin;

            // color kommt als array--> parsen als String
            color = color.toString();

            if (color.search("#") === -1) {
                begin = color.indexOf("(") + 1;

                color = color.substring(begin, color.length - 1);
                color = color.split(",");
                if (color.length === 4) {
                    opacity = parseFloat(color[3], 10);
                }
                color = this.rgbToHex(parseInt(color[0], 10), parseInt(color[1], 10), parseInt(color[2], 10));
                return {
                    "color": color,
                    "opacity": opacity
                };
            }

            return {
                "color": color,
                "opacity": opacity
            };

        },

        // Setzt den hexadezimal String zusammen und gibt ihn zurück.
        rgbToHex: function (red, green, blue) {
            return "#" + this.componentToHex(red) + this.componentToHex(green) + this.componentToHex(blue);
        },

        // Ein Integer (color) wird in ein hexadezimal String umgewandelt und zurückgegeben.
        componentToHex: function (color) {
            var hex = color.toString(16);

            return hex.length === 1 ? "0" + hex : hex;
        },

        handlePreCompose: function (evt) {
            var ctx = evt.context;

            ctx.save();
        },

        handlePostCompose: function (evt) {
            var ctx = evt.context,
                size = Radio.request("Map", "getSize"),
                height = size[1] * ol.has.DEVICE_PIXEL_RATIO,
                width = size[0] * ol.has.DEVICE_PIXEL_RATIO,
                printPageRectangle = this.calculatePageBoundsPixels(),
                minx = printPageRectangle[0],
                miny = printPageRectangle[1],
                maxx = printPageRectangle[2],
                maxy = printPageRectangle[3];

            ctx.beginPath();
            // Outside polygon, must be clockwise
            ctx.moveTo(0, 0);
            ctx.lineTo(width, 0);
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.lineTo(0, 0);
            ctx.closePath();
            // Inner polygon,must be counter-clockwise
            ctx.moveTo(minx, miny);
            ctx.lineTo(minx, maxy);
            ctx.lineTo(maxx, maxy);
            ctx.lineTo(maxx, miny);
            ctx.lineTo(minx, miny);
            ctx.closePath();
            ctx.fillStyle = "rgba(0, 5, 25, 0.55)";
            ctx.fill();
            ctx.restore();
        },

        calculatePageBoundsPixels: function () {
            var s = this.get("scale").value,
                width = this.get("layout").map.width,
                height = this.get("layout").map.height,
                resolution = Radio.request("MapView", "getResolution").resolution,
                w = width / this.get("POINTS_PER_INCH") * this.get("MM_PER_INCHES") / 1000.0 * s / resolution * ol.has.DEVICE_PIXEL_RATIO,
                h = height / this.get("POINTS_PER_INCH") * this.get("MM_PER_INCHES") / 1000.0 * s / resolution * ol.has.DEVICE_PIXEL_RATIO,
                mapSize = Radio.request("Map", "getSize"),
                center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2,
                    mapSize[1] * ol.has.DEVICE_PIXEL_RATIO / 2],
                minx, miny, maxx, maxy;

            minx = center[0] - (w / 2);
            miny = center[1] - (h / 2);
            maxx = center[0] + (w / 2);
            maxy = center[1] + (h / 2);
            return [minx, miny, maxx, maxy];
        },

        /**
         * Setzt die Parameter aus der config.js für den GFI Marker im Druck, wenn vorhanden
         * @param {obj} gfiMarker -
         * @returns {void}
         */
        setGfiMarker: function (gfiMarker) {
            gfiMarker.outerCircle = gfiMarker.outerCircle ? this.setOuterCircle(gfiMarker.outerCircle) : null;
            gfiMarker.point = gfiMarker.point ? this.setPoint(gfiMarker.point) : null;
        },

        /**
         * Wenn vorhanden werden die Parameter aus der config.js verwendet für den Kreis des GFI Markers im Druck
         * @param {object} outerCircle -
         * @returns {void}
         */
        setOuterCircle: function (outerCircle) {
            var gfiMarker = this.get("gfiMarker");

            gfiMarker.outerCircle.pointRadius = outerCircle.pointRadius ? outerCircle.pointRadius : null;
            gfiMarker.outerCircle.stroke = outerCircle.stroke ? outerCircle.stroke : null;
            gfiMarker.outerCircle.strokeColor = outerCircle.strokeColor ? outerCircle.strokeColor : null;
            gfiMarker.outerCircle.strokeWidth = outerCircle.strokeWidth ? outerCircle.strokeWidth : null;
        },

        /**
         * Wenn vorhanden werden die Parameter aus der config.js verwendet für den Punkt im Kreis des GFI Markers im Druck
         * @param {object} point -
         * @returns {void}
         */
        setPoint: function (point) {
            var gfiMarker = this.get("gfiMarker");

            gfiMarker.point.fill = point.fill ? point.fill : null;
            gfiMarker.point.pointRadius = point.pointRadius ? point.pointRadius : null;
            gfiMarker.point.fillColor = point.fillColor ? point.fillColor : null;
            gfiMarker.point.stroke = point.stroke ? point.stroke : null;
        }
    });

    return PrintModel;
});
