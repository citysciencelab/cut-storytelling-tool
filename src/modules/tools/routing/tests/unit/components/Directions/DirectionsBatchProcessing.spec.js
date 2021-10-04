import Vuex from "vuex";
import {expect} from "chai";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import DirectionsBatchProcessingComponent from "../../../../components/Directions/DirectionsBatchProcessing.vue";
import RoutingBatchProcessingComponent from "../../../../components/RoutingBatchProcessing.vue";
import Routing from "../../../../store/indexRouting";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/routing/components/Directions/DirectionsBatchProcessing.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        routing: {
                            name: "translate#common:menu.tools.routing",
                            glyphicon: "glyphicon-road",
                            renderToWindow: true
                        }
                    }
                }
            }
        }
    };
    let store, wrapper, props;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        Routing
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Tools/Routing/setActive", true);
        props = {
            settings: {
                speedProfile: "CAR",
                batchProcessing: {
                    limit: 1000,
                    maximumConcurrentRequests: 1
                }
            }
        };
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders DirectionsBatchProcessingComponent", () => {
        wrapper = shallowMount(DirectionsBatchProcessingComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.findComponent(RoutingBatchProcessingComponent).exists())
            .to.be.true;
    });

    it("should create CSV download filename", () => {
        wrapper = shallowMount(DirectionsBatchProcessingComponent, {
            store,
            localVue,
            propsData: props
        });
        const filenameGeojson = "testgeo.geojson",
            filenameCsv = "testcsv.csv";

        expect(wrapper.vm.createDownloadFilename(filenameGeojson)).equal(
            "testgeo.csv"
        );
        expect(wrapper.vm.createDownloadFilename(filenameCsv)).equal(
            "testcsv.csv"
        );
    });

    describe("test csv parsing", () => {
        it("should process csv without errors", async () => {
            wrapper = shallowMount(DirectionsBatchProcessingComponent, {
                store,
                localVue,
                propsData: props
            });
            wrapper.vm.fetchDirections = () => ({
                distance: 12.34,
                duration: 61234
            });

            const csv = `DEBBAL540001ChiF;13.05518;52.39465;9.37832;49.40167
DEBBAL660000sAIN;13.95471;51.74632;9.21956;49.07882
DEGAC00000007133;13.0285;52.30963;8.8615;48.82629`,
                result = await wrapper.vm.parseCsv(csv),
                expectedResult = JSON.stringify([
                    {
                        ID: "DEBBAL540001ChiF",
                        "X-Wert_Start": 13.05518,
                        "Y-Wert_Start": 52.39465,
                        "X-Wert_End": 9.37832,
                        "Y-Wert_End": 49.40167,
                        "Zeit(min)": "1020.57",
                        "Entfernung(m)": "12.34",
                        Profil: "CAR"
                    },
                    {
                        ID: "DEBBAL660000sAIN",
                        "X-Wert_Start": 13.95471,
                        "Y-Wert_Start": 51.74632,
                        "X-Wert_End": 9.21956,
                        "Y-Wert_End": 49.07882,
                        "Zeit(min)": "1020.57",
                        "Entfernung(m)": "12.34",
                        Profil: "CAR"
                    },
                    {
                        ID: "DEGAC00000007133",
                        "X-Wert_Start": 13.0285,
                        "Y-Wert_Start": 52.30963,
                        "X-Wert_End": 8.8615,
                        "Y-Wert_End": 48.82629,
                        "Zeit(min)": "1020.57",
                        "Entfernung(m)": "12.34",
                        Profil: "CAR"
                    }
                ]);

            expect(JSON.stringify(result)).equal(expectedResult);
        });


        it("should throw error with empty csv", async () => {
            wrapper = shallowMount(DirectionsBatchProcessingComponent, {
                store,
                localVue,
                propsData: props
            });

            try {
                await wrapper.vm.parseCsv("");
                // Should not reach here
                expect(true).to.be.false;
            }
            catch (e) {
                expect(e.message).equal("common:modules.tools.routing.directions.batchProcessing.errorNoEntries");
            }
        });

        it("should throw error with csv too large", async () => {
            props.settings.batchProcessing.limit = 1;
            wrapper = shallowMount(DirectionsBatchProcessingComponent, {
                store,
                localVue,
                propsData: props
            });

            try {
                await wrapper.vm.parseCsv(`DEBBAL540001ChiF;13.05518;52.39465;9.37832;49.40167
DEBBAL660000sAIN;13.95471;51.74632;9.21956;49.07882
DEGAC00000007133;13.0285;52.30963;8.8615;48.82629`);
                // Should not reach here
                expect(true).to.be.false;
            }
            catch (e) {
                expect(e.message).equal("common:modules.tools.routing.directions.batchProcessing.errorToManyEntriesInFile");
            }
        });

        it("should throw error with csv row with too many columns", async () => {
            wrapper = shallowMount(DirectionsBatchProcessingComponent, {
                store,
                localVue,
                propsData: props
            });

            try {
                await wrapper.vm.parseCsv(`DEBBAL540001ChiF;13.05518;52.39465;9.37832;49.40167;1
DEBBAL660000sAIN;13.95471;51.74632;9.21956;49.07882;1
DEGAC00000007133;13.0285;52.30963;8.8615;48.82629;1`);
                // Should not reach here
                expect(true).to.be.false;
            }
            catch (e) {
                expect(e.message).equal("common:modules.tools.routing.directions.batchProcessing.errorToManyEntriesInRow");
            }
        });

        it("should throw error with coordinate not being a number", async () => {
            wrapper = shallowMount(DirectionsBatchProcessingComponent, {
                store,
                localVue,
                propsData: props
            });

            try {
                await wrapper.vm.parseCsv(`DEBBAL540001ChiF;a;b;c;d
DEBBAL660000sAIN;13.95471;51.74632;9.21956;49.07882
DEGAC00000007133;13.0285;52.30963;8.8615;48.82629`);
                // Should not reach here
                expect(true).to.be.false;
            }
            catch (e) {
                expect(e.message).equal("common:modules.tools.routing.directions.batchProcessing.errorRowContainsEntriesNoNumber");
            }
        });
    });
});
