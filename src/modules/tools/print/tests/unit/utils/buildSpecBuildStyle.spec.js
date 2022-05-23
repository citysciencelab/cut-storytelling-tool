import BuildSpec from "../../../utils/buildSpec";
import Polygon from "ol/geom/Polygon";
import {Fill, Stroke} from "ol/style";
import {expect} from "chai";
import sinon from "sinon";
import createTestFeatures from "./testHelper";

describe("src/modules/tools/print/utils/buildSpec.buildStyle", function () {
    let buildSpec,
        polygonFeatures,
        getStylingRules,
        getFeatureStyle,
        getStyleAttributes,
        buildPolygonStyle;
    const attr = {
            "layout": "A4 Hochformat",
            "outputFormat": "pdf",
            "attributes": {
                "title": "TestTitel",
                "map": {
                    "dpi": 96,
                    "projection": "EPSG:25832",
                    "center": [561210, 5932600],
                    "scale": 40000
                }
            }
        },
        layer = {
            values_: {
                id: "1711"
            },
            get: sinon.stub()
        },
        geometry = new Polygon([[[0, 0], [1000, 0], [0, 1000], [0, 0]]]),
        fill = new Fill({
            color: "#4b4bff"
        }),
        stroke = new Stroke({
            color: "#000000",
            width: 1.25
        }),
        style = {
            getGeometryFunction: () => () => {
                return (
                    geometry
                );
            },
            getFill: () => fill,
            getStroke: () => stroke,
            getColor: () => "#4b4bff",
            getWidth: () => 1,
            getText: () => null
        },
        polygonStyleObj = {
            fillColor: "#4b4bff",
            fillOpacity: 1,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeWidth: 1.25,
            type: "polygon"
        };

    before(() => {
        buildSpec = BuildSpec;
        getStylingRules = buildSpec.getStylingRules;
        getFeatureStyle = buildSpec.getFeatureStyle;
        getStyleAttributes = buildSpec.getStyleAttributes;
        buildPolygonStyle = buildSpec.buildPolygonStyle;
        buildSpec.setAttributes(attr);
        polygonFeatures = createTestFeatures("resources/testFeaturesBewohnerparkgebiete.xml");
    });

    afterEach(() => {
        buildSpec.getStylingRules = getStylingRules;
        buildSpec.getFeatureStyle = getFeatureStyle;
        buildSpec.getStyleAttributes = getStyleAttributes;
        buildSpec.buildPolygonStyle = buildPolygonStyle;
        sinon.restore();
    });

    describe("buildStyle", function () {
        it("buildStyle shall return a style for the style attribute", function () {
            let mapfishStyleObject = null,
                styleObject = null;
                // stylingRule: bewirtschaftungsart='Parkschein, Bewohner mit Ausweis frei_0'
            const stylingRule = "bewirtschaftungsart=" + polygonFeatures[0].values_.bewirtschaftungsart + "_0";

            buildSpec.getStyleModel = sinon.spy();
            buildSpec.getStylingRules = () => stylingRule;
            buildSpec.getFeatureStyle = () => [style];
            buildSpec.getStyleAttributes = () => ["bewirtschaftungsart"];
            buildSpec.buildPolygonStyle = () => polygonStyleObj;

            mapfishStyleObject = buildSpec.buildStyle(layer, polygonFeatures, []);
            styleObject = mapfishStyleObject[stylingRule];

            expect(mapfishStyleObject.version).to.be.equal("2");
            expect(styleObject).to.be.an("object");
            expect(styleObject.symbolizers).to.be.an("array");
            expect(styleObject.symbolizers.length).to.be.equal(1);
            expect(styleObject.symbolizers[0]).to.be.deep.equal(polygonStyleObj);
        });
    });

});
