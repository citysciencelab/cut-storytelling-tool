import {WFS} from "ol/format.js";
import {addProjection} from "ol/proj.js";
import Projection from "ol/proj/Projection.js";

const fs = require("fs"),
    proj = new Projection({
        code: "EPSG:25832",
        units: "m",
        axisOrientation: "enu",
        global: false
    });

addProjection(proj);

/**
 * creates Features used in tests
 * @param {String} path path to xml
 * @returns {void}
 */
export default function createTestFeatures (path) {
    const format = new WFS({
            featureNS: "http://www.deegree.org/app"
        }),
        data = fs.readFileSync("src/modules/tools/print/tests/unit/utils/" + path, "utf8"),
        features = format.readFeatures(data);

    return features;
}
