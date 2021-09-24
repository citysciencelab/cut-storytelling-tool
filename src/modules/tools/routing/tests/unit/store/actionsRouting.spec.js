import sinon from "sinon";
import actions from "../../../store/directions/actionsDirections";
import VectorSource from "ol/source/Vector.js";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import testAction from "../../../../../../../test/unittests/VueTestUtils";

describe("src/modules/tools/routing/store/directions/actionsDirections.js", () => {
    let state, directionsRouteSource, directionsWaypointSource, directionsAvoidSource;

    beforeEach(() => {
        directionsRouteSource = new VectorSource({
            features: [
                new Feature({
                    geometry: new LineString([]),
                    isHighlight: false
                }),
                new Feature({
                    geometry: new LineString([]),
                    isHighlight: true
                })
            ]
        });
        directionsWaypointSource = new VectorSource();
        directionsAvoidSource = new VectorSource();
        state = {
            directionsRouteSource,
            directionsWaypointSource,
            directionsAvoidSource,
            waypoints: []
        };
    });

    afterEach(sinon.restore);

    describe("initWaypoints", () => {
        it("initWaypoints", done => {
            testAction(actions.initWaypoints, {}, state, {}, [
                {type: "addWaypoint", payload: {index: 0}, dispatch: true},
                {type: "addWaypoint", payload: {index: 1}, dispatch: true}
            ], {}, done);
        });
    });
});
