import {expect} from "chai";
import mutations from "../../../store/mutationsLayerSlider";

const {
    setActiveLayer,
    setProgressBarWidth,
    setWindowsInterval,
    resetActiveLayer
} = mutations;

describe("src/modules/tools/layerSlider/store/mutationslayerSlider.js", () => {
    describe("setActiveLayer", () => {
        it("setActiveLayer", () => {
            const state = {
                    currentProgressBarWidth: "width: 0%; margin-left: 0%",
                    progressBarWidth: 10,
                    activeLayer: {
                        layerId: "",
                        index: -1
                    }
                },
                layerId = {
                    layerId: "123",
                    title: "Pommes",
                    index: 1
                };

            setActiveLayer(state, layerId);

            expect(state.currentProgressBarWidth).to.equals("width: 10%; margin-left: 10%");
            expect(state.activeLayer).to.equals(layerId);
        });
    });
    describe("setProgressBarWidth", () => {
        it("setProgressBarWidth", () => {
            const state = {
                    progressBarWidth: 10
                },
                layerIds = [
                    {
                        layerId: "123",
                        title: "Pommes",
                        index: 0
                    },
                    {
                        layerId: "456",
                        title: "Ketchup",
                        index: 1
                    },
                    {
                        layerId: "789",
                        title: "Myonnaise",
                        index: 2
                    }
                ];

            setProgressBarWidth(state, layerIds);

            expect(state.progressBarWidth).to.equals(33);
        });
    });
    describe("setWindowsInterval", () => {
        it("set windowsInterval to null, if null is input", () => {
            const state = {
                timeInterval: 2000
            };

            setWindowsInterval(state, null);

            expect(state.windowsInterval).to.equals(null);
        });

        it("set a windowsInterval, if a function is input", () => {
            const state = {
                timeInterval: 2000
            };

            setWindowsInterval(state, () => ({}));

            expect(state.windowsInterval).to.not.equals(null);
        });
    });
    describe("resetActiveLayer", () => {
        it("resetActiveLayer", () => {
            const state = {
                currentProgressBarWidth: "width: 10%; margin-left: 10%",
                activeLayer: {
                    layerId: "123",
                    index: 1
                }
            };

            resetActiveLayer(state);

            expect(state.currentProgressBarWidth).to.equals("width: 0%; margin-left: 0%");
            expect(state.activeLayer).to.deep.equals({
                layerId: "",
                index: -1
            });
        });
    });
});
