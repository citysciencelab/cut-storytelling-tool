import "../../2DMapView";
import Map from "ol/Map";
import View from "ol/View";
import mapCollection from "../../../../core/dataStorage/mapCollection.js";
import {expect} from "chai";

describe("src/core/maps/2DMapView.js", () => {
    let map,
        mapView;

    beforeEach(() => {
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View({
                extent: [510000.0, 5850000.0, 625000.4, 6000000.0]
            })
        });

        map.setSize([1059, 887]);

        mapCollection.addMap(map, "ol", "2D");
        mapView = mapCollection.getMapView("ol", "2D");
    });

    it("setBBox - sets the bbox", function () {
        mapView.setBBox([565760.049, 5931747.185, 568940.626, 5935453.891]);

        expect(mapView.getCenter()).to.deep.equal([567350.3375, 5933600.538]);
        expect(Math.round(mapView.getZoom())).equals(12);
    });

});
