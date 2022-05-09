import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import StoryCreationToolComponent from "../../../components/StoryCreationTool.vue";
import StoryCreationTool from "../../../store/StoryCreationTool";
import {storyCreationModes} from "../../../store/constantsStoryCreationTool";

Vue.use(Vuetify);

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("addons/StoryCreationTool/components/StoryCreationTool.vue", () => {
    global.Config = {};
    const mockConfigJson = {
        Portalconfig: {
            menu: {
                tools: {
                    children: {
                        storyCreationTool: {
                            name:
                                "translate#additional:modules.tools.storyCreationTool.title",
                            glyphicon: "glyphicon-book"
                        }
                    }
                }
            }
        }
    };
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        StoryCreationTool
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Tools/StoryCreationTool/setActive", true);
    });

    it("renders the StoryCreationTool tool", () => {
        const wrapper = shallowMount(StoryCreationToolComponent, {
            store,
            localVue
        });

        expect(wrapper.find("#tool-storyCreationTool").exists()).to.be.true;
        expect(wrapper.find("#tool-storyCreationTool-modeSelection").exists()).to
            .be.true;
    });

    it("do not render the StoryCreationTool tool if not active", () => {
        store.commit("Tools/StoryCreationTool/setActive", false);
        const wrapper = shallowMount(StoryCreationToolComponent, {
            store,
            localVue
        });

        expect(wrapper.find("#tool-storyCreationTool").exists()).to.be.false;
        expect(wrapper.find("#tool-storyCreationTool-modeSelection").exists()).to
            .be.false;
    });

    it("renders the UI of the story creator when selected", async () => {
        const wrapper = shallowMount(StoryCreationToolComponent, {
            store,
            localVue,
            stubs: {
                StoryCreator: true,
                StoryPlayer: true
            }
        });

        await wrapper.setData({mode: storyCreationModes.CREATE});

        expect(wrapper.find("#tool-storyCreationTool").exists()).to.be.true;
        expect(wrapper.find("#tool-storyCreationTool-modeSelection").exists()).to
            .be.false;
        expect(wrapper.find("storycreator-stub").exists()).to.be.true;
        expect(wrapper.find("storyplayer-stub").exists()).to.be.false;
    });

    it("renders the UI of the story player when selected", async () => {
        const wrapper = shallowMount(StoryCreationToolComponent, {
            store,
            localVue,
            stubs: {
                StoryCreator: true,
                StoryPlayer: true
            }
        });

        await wrapper.setData({
            mode: storyCreationModes.PLAY,
            storyConfPath: "/"
        });

        expect(wrapper.find("#tool-storyCreationTool").exists()).to.be.true;
        expect(wrapper.find("#tool-storyCreationTool-modeSelection").exists()).to
            .be.false;
        expect(wrapper.find("storycreator-stub").exists()).to.be.false;
        expect(wrapper.find("storyplayer-stub").exists()).to.be.true;
    });
});
