import {shallowMount, createLocalVue, config} from "@vue/test-utils";
import SnippetFeatureInfo from "../../../components/SnippetFeatureInfo.vue";
import Feature from "ol/Feature";
import {expect} from "chai";

config.mocks.$t = key => key;

const localVue = createLocalVue();

describe("src/modules/tools/filter/components/SnippetFeatureInfo.vue", () => {
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
    it("should render if visible is true", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.isVisible()).to.be.true;
        wrapper.destroy();
    });

    it("should render with a title if the title is a string", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                title: "foobar"
            },
            localVue
        });

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find("h6").text()).to.be.equal("foobar");
        wrapper.destroy();
    });
    it("should render without a title if title is a boolean and false", async () => {
        const wrapper = shallowMount(SnippetFeatureInfo, {
            propsData: {
                visible: true,
                title: false
            },
            localVue
        });

        wrapper.vm.visible = true;
        await wrapper.vm.$nextTick();

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
        const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

        wrapper.setData({featureInfo: {"foo": "bar"}});
        await wrapper.vm.$nextTick();

        expect(wrapper.find("dt").text()).to.be.equal("foo:");
        expect(wrapper.find("dd").text()).to.be.equal("bar");
        wrapper.destroy();
    });

    describe("getUniqueObjectFromAttributes", () => {
        it("should return null if first param is not an array", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

            expect(wrapper.vm.getUniqueObjectFromAttributes(null)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(undefined)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(1234)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes("string")).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(true)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes(false)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes({})).to.be.null;
        });
        it("should return null if second param is not an array", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

            expect(wrapper.vm.getUniqueObjectFromAttributes([], null)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], undefined)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], 1234)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], "string")).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], true)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], false)).to.be.null;
            expect(wrapper.vm.getUniqueObjectFromAttributes([], {})).to.be.null;
        });
        it("should return null if second param is an array but has no length", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {localVue});

            expect(wrapper.vm.getUniqueObjectFromAttributes([], [])).to.be.null;
        });
        it("should return an object with unique keys and a list of values for each attrName (first param)", () => {
            const wrapper = shallowMount(SnippetFeatureInfo, {localVue}),
                items = [
                    new Feature({foo: "bar"}),
                    new Feature({foo: "bar"}),
                    new Feature({foo: "baz"})
                ],
                expected = {
                    foo: ["bar", "baz"]
                };

            expect(wrapper.vm.getUniqueObjectFromAttributes(["foo"], items)).to.deep.equal(expected);
        });
    });
});
