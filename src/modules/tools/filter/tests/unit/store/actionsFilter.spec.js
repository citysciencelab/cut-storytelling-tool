import testAction from "../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsFilter";
import state from "../../../store/stateFilter";

const {
    updateRules,
    deleteAllRules,
    updateFilterHits
} = actions;

describe("tools/filter/store/actionsFilter", () => {
    describe("updateRules", () => {
        it("update rules by given rule", done => {
            const payload = {
                filterId: 0,
                snippetId: 0,
                rule: {}
            };

            testAction(updateRules, payload, state, {}, [
                {type: "addSpotForRule", payload: {filterId: payload.filterId}, commit: true},
                {type: "updateRules",
                    payload: {
                        filterId: payload.filterId,
                        rules: [{}]
                    },
                    commit: true
                }
            ], {}, done);
        });
    });
    describe("deleteAllRules", () => {
        it("deletes all rules by given filterId", done => {
            const payload = {
                    filterId: 0
                },
                localState = {
                    filters: [
                        [
                            {},
                            {}
                        ]
                    ]
                };

            testAction(deleteAllRules, payload, localState, {}, [
                {type: "updateRules", payload: {
                    filterId: payload.filterId,
                    rules: [false, false]
                }, commit: true}
            ], {}, done);
        });
    });
    describe("updateFilterHits", () => {
        it("updates the hits for given filterId", done => {
            const payload = {
                filterId: 0,
                hits: 10
            };

            testAction(updateFilterHits, payload, state, {}, [
                {type: "updateFilterHits", payload: {
                    filterId: payload.filterId,
                    hits: payload.hits
                }, commit: true}
            ], {}, done);
        });
    });
});
