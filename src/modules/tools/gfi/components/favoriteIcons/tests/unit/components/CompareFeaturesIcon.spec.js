import sinon from "sinon";
import {expect} from "chai";
import {shallowMount} from "@vue/test-utils";
import CompareFeatureIcon from "../../../components/CompareFeatureIcon.vue";

describe("src/modules/tools/gfi/favoriteIcons/components/CompareFeatureIcon.vue", () => {
    let wrapper;

    beforeEach(() => {
        const featureIsOnCompareList = sinon.fake.returns(false);

        wrapper = shallowMount(CompareFeatureIcon, {
            propsData: {
                feature: {
                    getId: () => "feature1",
                    getLayerId: () => "1234",
                    getTitle: () => "TestTitle",
                    getAttributesToShow: () => "TestAttributes",
                    getMappedProperties: () => "TestProperties"
                }
            },
            methods: {
                componentExists: () => true
            },
            computed: {
                featureIsOnCompareList
            }
        });
    });
    afterEach(sinon.restore);

    it("should draw a star if the compareFeatures is configured", () => {
        expect(wrapper.find("span").exists()).to.be.true;
    });
    it("should render empty star button if feature is already on compare list", () => {
        expect(wrapper.find("span").classes("glyphicon-star-empty")).to.be.true;
        expect(wrapper.find("span").classes("glyphicon-star")).to.be.false;
        expect(wrapper.find("span").attributes().title).equals("modules.tools.gfi.favoriteIcons.compareFeatureIcon.toCompareList");
    });
});

describe("src/modules/tools/gfi/favoriteIcons/components/CompareFeatureIcon.vue", () => {
    let wrapper;

    beforeEach(() => {
        const featureIsOnCompareList = sinon.fake.returns(true);

        wrapper = shallowMount(CompareFeatureIcon, {
            propsData: {
                feature: {
                    getId: () => "feature1",
                    getLayerId: () => "1234",
                    getTitle: () => "TestTitle",
                    getAttributesToShow: () => "TestAttributes",
                    getMappedProperties: () => "TestProperties"
                }
            },
            methods: {
                componentExists: () => true
            },
            computed: {
                featureIsOnCompareList
            }
        });
    });
    afterEach(sinon.restore);

    it("should render star button if feature is already on compare list", () => {
        expect(wrapper.find("span").classes("glyphicon-star-empty")).to.be.false;
        expect(wrapper.find("span").classes("glyphicon-star")).to.be.true;
        expect(wrapper.find("span").attributes().title).equals("modules.tools.gfi.favoriteIcons.compareFeatureIcon.fromCompareList");
    });
});

describe("src/modules/tools/gfi/favoriteIcons/components/CompareFeatureIcon.vue", () => {
    let wrapper;

    beforeEach(() => {
        const featureIsOnCompareList = sinon.fake.returns(false);

        wrapper = shallowMount(CompareFeatureIcon, {
            propsData: {
                feature: {
                    getId: () => "feature1",
                    getLayerId: () => "1234",
                    getTitle: () => "TestTitle",
                    getAttributesToShow: () => "TestAttributes",
                    getMappedProperties: () => "TestProperties"
                }
            },
            methods: {
                componentExists: () => false
            },
            computed: {
                featureIsOnCompareList
            }
        });
    });
    afterEach(sinon.restore);

    it("should not draw a star if compareFeatures is not configured", () => {
        expect(wrapper.find("span").exists()).to.be.false;
    });
});
