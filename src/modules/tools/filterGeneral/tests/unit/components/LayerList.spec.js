import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import LayerList from "../../../components/LayerList.vue";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/tools/filterGeneral/components/LayerList.vue", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(LayerList, {
            propsData: {
                layers: [
                    {
                        "layerId": "8712",
                        "searchInMapExtent": true,
                        "paging": 10,
                        "snippets": [
                            {
                                "attrName": "checkbox",
                                "label": "Ist dies eine Schwerpunktschule?",
                                "type": "checkbox",
                                "operator": "EQ",
                                "prechecked": false,
                                "visible": true
                            }
                        ]
                    },
                    {
                        "layerId": "8713",
                        "title": "FOOBAR",
                        "searchInMapExtent": true,
                        "paging": 10,
                        "snippets": [
                            {
                                "attrName": "checkbox",
                                "label": "Ist dies eine Schwerpunktschule2?",
                                "type": "checkbox",
                                "operator": "EQ",
                                "prechecked": false,
                                "visible": true
                            }
                        ]
                    }
                ],
                multiLayerSelector: false,
                "layerSelectorVisible": true
            },
            localVue
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("should render correctly", () => {
        expect(wrapper.find("div").classes("panel-group")).to.be.true;
    });

});
