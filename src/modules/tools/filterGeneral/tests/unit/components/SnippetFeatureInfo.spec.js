import {shallowMount, createLocalVue} from "@vue/test-utils";
import SnippetFeatureInfo from "../../../components/SnippetFeatureInfo.vue";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

describe("src/modules/tools/filterGeneral/components/SnippetFeatureInfo.vue", () => {
    it("should have correct default values", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

        expect(wrapper.vm.adjustment).to.be.false;
        expect(wrapper.vm.title).to.be.true;
        expect(wrapper.vm.snippetId).to.equal(0);
        expect(wrapper.vm.layerId).to.be.undefined;
        expect(wrapper.vm.visible).to.be.false;
        wrapper.destroy();
    });
    it("should not render with default values", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

        expect(wrapper.isVisible()).to.be.false;
        wrapper.destroy();
    });
    it("should render if visible is true", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true
            },
            localVue
        });

        expect(wrapper.isVisible()).to.be.true;
        wrapper.destroy();
    });

    it("should render with a title if the title is a string", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true,
                title: "foobar"
            },
            localVue
        });

        expect(wrapper.find("h6").text()).to.be.equal("foobar");
        wrapper.destroy();
    });
    it("should render without a title if title is a boolean and false", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true,
                title: false
            },
            localVue
        });

        expect(wrapper.find("h6").exists()).to.be.false;
        wrapper.destroy();
    });

    it("should rename object keys", () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {localVue});
        let obj = {
            "foo_123": "bar",
            "foo_ 1_23": "bar"
        };

        obj = wrapper.vm.beautifyObjectKeys(obj);

        expect(obj).to.deep.equal({
            "Foo 123": "bar",
            "Foo  1 23": "bar"
        });
        wrapper.destroy();
    });

    it("should render feature info if it available", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true
            },
            localVue
        });

        await wrapper.setData({featureInfo: {"foo": "bar"}});

        expect(wrapper.find("dt").text()).to.be.equal("foo:");
        expect(wrapper.find("dd").text()).to.be.equal("bar");
        wrapper.destroy();
    });
});
