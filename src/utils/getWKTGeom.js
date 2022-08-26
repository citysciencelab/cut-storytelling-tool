import {WKT} from "ol/format.js";

/**
 * Help function for determining a feature with textual description.
 * @param {Object|String[]} content Object with the type of geometry, the geometry itself and the geometry of interior parts.
 * @param {String} [geometryType="POLYGON"] The type of geometry.
 * @returns {ol/Feature} Feature with WellKnownText-Geom.
 */
function getWKTGeom (content, geometryType = "POLYGON") {
    const format = new WKT(),
        type = content?.geometryType ? content.geometryType : geometryType, // the default value is POLYGON because for type street, there is no geometryType defined. But it should be polygon
        geometry = content?.coordinate ? content.coordinate : content;
    let wkt,
        regExp;

    if (type === "POLYGON") {
        wkt = type + "((";
        geometry.forEach(function (element, index, list) {
            // polygon with voids
            if (Array.isArray(element)) {
                element.forEach(function (coord, index2, list2) {
                    if (index2 % 2 === 0) {
                        wkt += coord + " ";
                    }
                    else if (index2 === list2.length - 1) {
                        wkt += coord + ")";
                    }
                    else {
                        wkt += coord + ", ";
                    }
                });
                if (index === list.length - 1) {
                    wkt += ")";
                }
                else {
                    wkt += ",(";
                }
            }
            // simple polygon
            else if (index % 2 === 0) {
                wkt += element + " ";
            }
            else if (index === list.length - 1) {
                wkt += element + "))";
            }
            else {
                wkt += element + ", ";
            }
        });
    }
    else if (type === "POINT") {
        wkt = type + "(";
        wkt += geometry[0] + " " + geometry[1];
        wkt += ")";
    }
    else if (type === "MULTIPOLYGON") {
        wkt = type + "(((";
        // all single polygons
        geometry.forEach(function (element, index) {
            // goes through either all coordinates of a polygon or a polygon with voids
            element.forEach(function (coord, index2, list2) {
                // element is a polygon with voids
                if (Array.isArray(coord)) {
                    coord.forEach(function (coordinate, index3, list3) {
                        if (index3 % 2 === 0) {
                            wkt += coordinate + " ";
                        }
                        else if (index3 === list3.length - 1) {
                            wkt += coordinate + ")";
                        }
                        else {
                            wkt += coordinate + ", ";
                        }
                    });
                    if (index2 === list2.length - 1) {
                        wkt += ")";
                    }
                    else {
                        wkt += ",(";
                    }
                }
                // element is a simple polygon
                else if (index2 % 2 === 0) {
                    wkt += coord + " ";
                }
                else if (index2 === list2.length - 1) {
                    wkt += coord + "))";
                }
                else {
                    wkt += coord + ", ";
                }
            });
            if (index === geometry.length - 1) {
                wkt += ")";
            }
            else {
                wkt += ",((";
            }
        });
        regExp = new RegExp(", \\)\\?\\(", "g");
        wkt = wkt.replace(regExp, "),(");
    }
    return format.readFeature(wkt);
}

export {getWKTGeom};
