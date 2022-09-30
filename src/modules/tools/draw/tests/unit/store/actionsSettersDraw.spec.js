import sinon from "sinon";
import {expect} from "chai";
import actions from "../../../store/actionsDraw";

describe("src/modules/tools/draw/store/actions/settersDraw.js", () => {
    let commit, dispatch, state, target, getters;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    afterEach(sinon.restore);

    /**
     * @param {String} id id to use for drawType and options prefix
     * @param {Object} [drawTypeOptions={}] the object to use for the drawType options
     * @param {Object} [gettersOptions={}] additional key value pairs to add to the resulting getters
     * @returns {Object}  a mocked getters for this test
     */
    function createGetters (id, drawTypeOptions = {}, gettersOptions = {}) {
        return Object.assign({
            drawType: {
                id,
                geometry: ""
            },
            styleSettings: drawTypeOptions
        }, gettersOptions);
    }

    describe("setActive", () => {
        let active;

        beforeEach(() => {
            state = {
                withoutGUI: false,
                currentInteraction: "draw",
                iconList: [{
                    id: "iconPoint",
                    type: "simple_point",
                    value: "simple_point"
                }]
            };
        });

        it("should commit as intended if 'active' is false", () => {
            active = false;

            actions.setActive({state, commit, dispatch}, active);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setActive", false]);
            expect(dispatch.notCalled).to.be.true;
        });
        it("should commit and dispatch as intended if 'active' is true", async () => {
            active = true;

            await actions.setActive({state, commit, dispatch}, active);

            expect(commit.callCount).to.equal(4);
            expect(commit.firstCall.args).to.eql(["setActive", true]);
            expect(commit.thirdCall.args[0]).to.equal("setLayer");
            expect(commit.thirdCall.args[1]).to.be.undefined;
            expect(dispatch.callCount).to.equal(6);
            expect(dispatch.firstCall.args).to.eql(["Maps/addNewLayerIfNotExists", "importDrawLayer", {root: true}]);
            expect(dispatch.secondCall.args).to.eql(["createDrawInteractionAndAddToMap", {active: true}]);
            expect(dispatch.thirdCall.args).to.eql(["createSelectInteractionAndAddToMap", false]);
            expect(dispatch.getCall(3).args).to.eql(["createModifyInteractionAndAddToMap", false]);
            expect(dispatch.getCall(4).args).to.eql(["createModifyAttributesInteractionAndAddToMap", false]);
            expect(dispatch.getCall(5).args).to.eql(["setDrawLayerVisible", true]);
        });
        it("should commit and dispatch as intended if 'active' and 'withoutGUI' are true", async () => {
            active = true;
            state.withoutGUI = true;

            await actions.setActive({state, commit, dispatch}, active);

            expect(commit.callCount).to.equal(4);
            expect(commit.firstCall.args).to.eql(["setActive", true]);
            expect(commit.thirdCall.args[0]).to.equal("setLayer");
            expect(commit.thirdCall.args[1]).to.be.undefined;
            expect(dispatch.callCount).to.equal(7);
            expect(dispatch.firstCall.args).to.eql(["Maps/addNewLayerIfNotExists", "importDrawLayer", {root: true}]);
            expect(dispatch.secondCall.args).to.eql(["createDrawInteractionAndAddToMap", {active: true}]);
            expect(dispatch.thirdCall.args).to.eql(["createSelectInteractionAndAddToMap", false]);
            expect(dispatch.getCall(3).args).to.eql(["createModifyInteractionAndAddToMap", false]);
            expect(dispatch.getCall(4).args).to.eql(["createModifyAttributesInteractionAndAddToMap", false]);
            expect(dispatch.getCall(5).args).to.eql(["setDrawLayerVisible", true]);
            expect(dispatch.lastCall.args).to.eql(["toggleInteraction", "draw"]);
        });
    });
    describe("setStyleSettings", () => {
        it("should commit on the mutation key recognized by the current drawType", () => {
            getters = createGetters("drawType");
            actions.setStyleSettings({getters, commit}, "styleSettings");

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setDrawTypeSettings", "styleSettings"]);
        });
    });
    describe("setCircleRadius", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {circleRadius: 0, unit: "m"});
            target = 42.5;

            actions.setCircleRadius({getters, commit, dispatch}, target);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {circleRadius: 42.5, unit: "m"}]);
        });
    });
    describe("setCircleMethod", () => {
        it("should commit as intended", () => {
            const method = Symbol();

            getters = createGetters("test", {circleMethod: null});
            target = {options: [{value: method}], selectedIndex: 0};

            actions.setCircleMethod({commit, getters}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {circleMethod: method}]);
        });
    });
    describe("setCircleOuterRadius", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {circleOuterRadius: 0, unit: "m"});
            target = 42.5;

            actions.setCircleOuterRadius({getters, commit, dispatch}, target);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {circleOuterRadius: 42.5, unit: "m"}]);
        });
    });
    describe("setColor", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {color: [255, 255, 255], opacity: 3});
            target = {options: [{value: "0,1,2"}], selectedIndex: 0};

            actions.setColor({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {color: [0, 1, 2, 3], opacity: 3}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setColorContour", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {colorContour: [255, 255, 255], opacityContour: 3});
            target = {options: [{value: "0,1,2"}], selectedIndex: 0};

            actions.setColorContour({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {colorContour: [0, 1, 2, 3], opacityContour: 3}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setOuterColorContour", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {outerColorContour: [255, 255, 255], opacityContour: 3});
            target = {options: [{value: "0,1,2"}], selectedIndex: 0};

            actions.setOuterColorContour({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {outerColorContour: [0, 1, 2, 3], opacityContour: 3}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setDrawType", () => {
        const geometry = Symbol();

        it("should commit as intended", () => {
            const id = Symbol();

            target = {options: [{id: id, value: geometry}], selectedIndex: 0};
            actions.setDrawType({commit, dispatch}, {target});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args).to.eql(["setFreeHand", false]);
            expect(commit.secondCall.args).to.eql(["setDrawType", {id, geometry}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
        it("should commit 'true' to 'setFreeHand' if the id of the selectedElement equals 'drawCurve'", () => {
            target = {options: [{id: "drawCurve", value: geometry}], selectedIndex: 0};
            actions.setDrawType({commit, dispatch}, {target});

            expect(commit.calledWithExactly("setFreeHand", true)).to.be.true;
        });
    });
    describe("setFont", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {font: "Courier New"});
            target = {options: [{value: "Arial"}], selectedIndex: 0};

            actions.setFont({commit, dispatch, getters}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {font: "Arial"}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setFontSize", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {fontSize: 10});
            target = {options: [{value: 16}], selectedIndex: 0};

            actions.setFontSize({commit, dispatch, getters}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {fontSize: 16}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setOpacity", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {color: [0, 1, 2, 3], opacity: 3});
            target = {options: [{value: "3.5"}], selectedIndex: 0};

            actions.setOpacity({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {color: [0, 1, 2, 3.5], opacity: 3.5}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setOpacityContour", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {colorContour: [0, 1, 2, 3], opacityContour: 3});
            target = {options: [{value: "3.5"}], selectedIndex: 0};

            actions.setOpacityContour({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {colorContour: [0, 1, 2, 3.5], opacityContour: 3.5}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setPointSize", () => {
        it("should commit as intended", () => {
            target = {options: [{value: "6"}], selectedIndex: 0};

            actions.setPointSize({commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setPointSize", 6]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setStrokeWidth", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {strokeWidth: 1});
            target = {options: [{value: "6"}], selectedIndex: 0};

            actions.setStrokeWidth({commit, dispatch, getters}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {strokeWidth: 6}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setSymbol", () => {
        it("should commit as intended if id is used for the symbol", () => {
            const myIcon = Symbol(),
                otherIcon = Symbol();

            state = {iconList: [{id: otherIcon}, {id: myIcon}]};

            target = {options: [{value: myIcon}], selectedIndex: 0};

            actions.setSymbol({state, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setSymbol", {id: myIcon}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
        it("should commit as intended if caption is used for the symbol", () => {
            const myIcon = Symbol(),
                otherIcon = Symbol();

            state = {iconList: [{caption: otherIcon}, {caption: myIcon}]};

            target = {options: [{value: myIcon}], selectedIndex: 0};

            actions.setSymbol({state, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setSymbol", {caption: myIcon}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("addSymbolIfNotExists", () => {
        it("should commit the given icon", () => {
            const icon = {
                id: "id"
            };

            state = {iconList: [{id: "otherId"}]};
            actions.addSymbolIfNotExists({state, commit}, icon);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["addSymbol", {id: "id"}]);
        });
        it("should not commit if the given icon already exists", () => {
            const icon = {
                id: "id"
            };

            state = {iconList: [{id: "id"}]};
            actions.addSymbolIfNotExists({state, commit}, icon);

            expect(commit.callCount).to.equal(0);
        });
    });
    describe("setText", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {text: "test"});
            target = {value: "My Text"};

            actions.setText({commit, dispatch, getters}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {text: "My Text"}]);
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.eql(["updateDrawInteraction"]);
        });
    });
    describe("setUnit", () => {
        it("should commit as intended", () => {
            getters = createGetters("test", {unit: "m", circleRadius: 1, circleOuterRadius: 2});
            target = {options: [{value: "km"}], selectedIndex: 0};

            actions.setUnit({getters, commit, dispatch}, {target});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args).to.eql(["setTestSettings", {unit: "km", circleRadius: 1, circleOuterRadius: 2}]);
        });
    });
});
