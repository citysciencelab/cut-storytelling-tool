import Vuex from "vuex";
import {config, shallowMount, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import GfiComponent from "../../../components/Gfi.vue";
import moment from "moment";

const localVue = createLocalVue(),
    mockMutations = {
        setCurrentFeature: () => sinon.stub()
    },
    mockGetters = {
        desktopType: () => "",
        centerMapToClickPoint: () => sinon.stub(),
        active: () => true
    };

localVue.use(Vuex);
config.mocks.$t = key => key;

/**
 * Returns the store.
 * @returns {object} the store
 */
function getGfiStore () {
    return new Vuex.Store({
        namespaced: true,
        modules: {
            Tools: {
                namespaced: true,
                modules: {
                    Gfi: {
                        namespaced: true,
                        mutations: mockMutations,
                        getters: mockGetters
                    }
                }
            },
            Map: {
                namespaced: true,
                getters: {
                    gfiFeaturesReverse: () => [{
                        getTheme: () => "default",
                        getTitle: () => "Feature 1",
                        getMimeType: () => "text/html",
                        getGfiUrl: () => null,
                        getMappedProperties: () => null,
                        getAttributesToShow: () => sinon.stub(),
                        getProperties: () => {
                            return {};
                        },
                        getlayerId: () => null,
                        getFeatures: () => []
                    }, {}],
                    size: sinon.stub(),
                    visibleLayerListWithChildrenFromGroupLayers: sinon.stub()
                }
            }
        },
        getters: {
            mobile: () => sinon.stub(),
            gfiWindow: () => "",
            uiStyle: () => sinon.stub(),
            ignoredKeys: () => sinon.stub()
        }
    });
}


describe("src/modules/tools/gfi/components/Gfi.vue", () => {

    it("should find the child component Mobile", () => {
        const wrapper = shallowMount(GfiComponent, {store: getGfiStore, localVue});

        expect(wrapper.findComponent({name: "Mobile"}).exists()).to.be.true;
    });

    it("should find the child component Attached", () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => false,
                uiStyle: () => "",
                desktopType: () => "attached",
                active: () => true,
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getProperties: () => {
                        return {};
                    },
                    getFeatures: () => sinon.stub()
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.findComponent({name: "Attached"}).exists()).to.be.true;
    });

    it("should find the child component Detached", () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => false,
                desktopType: () => "",
                active: () => true,
                uiStyle: () => "",
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => sinon.stub(),
                    getProperties: () => {
                        return {};
                    }
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.findComponent({name: "Detached"}).exists()).to.be.true;
    });

    it("should find the child component Table", () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => false,
                desktopType: () => "",
                active: () => true,
                uiStyle: () => "TABLE",
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => sinon.stub(),
                    getProperties: () => {
                        return {};
                    }
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.findComponent({name: "Table"}).exists()).to.be.true;
    });

    it("no child component should be found if gfi is not activated", () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                active: () => false,
                gfiFeatures: () => null,
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.findComponent({name: "Mobile"}).exists()).to.be.false;
        expect(wrapper.findComponent({name: "Detached"}).exists()).to.be.false;
    });

    it("no child component should be found if gfi has no features", () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => true,
                active: () => true,
                gfiFeatures: () => [],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.findComponent({name: "Mobile"}).exists()).to.be.false;
        expect(wrapper.findComponent({name: "Detached"}).exists()).to.be.false;
    });

    it("should set pagerIndex to zero if gfiFeatures change", () => {
        const wrapper = shallowMount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            computed: {
                isMobile: () => false,
                active: () => true,
                mapSize: () => [],
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => sinon.stub(),
                    getProperties: () => {
                        return {};
                    }
                }],
                gfiFeaturesReverse: () => sinon.stub()
            },
            store: getGfiStore,
            localVue
        });

        wrapper.vm.$options.watch.gfiFeatures.call(wrapper.vm, null);
        expect(wrapper.vm.pagerIndex).to.equal(0);
    });

    it("should display the footer", () => {
        const store = getGfiStore(),
            wrapper = mount(GfiComponent, {
                computed: {
                    isMobile: () => true,
                    active: () => true,
                    gfiFeatures: () => [{
                        getTheme: () => "default",
                        getTitle: () => "Feature 1",
                        getMimeType: () => "text/html",
                        getGfiUrl: () => null,
                        getMappedProperties: () => null,
                        getProperties: () => {
                            return {};
                        },
                        getlayerId: () => null,
                        getFeatures: () => []
                    },
                    {}],
                    gfiFeaturesReverse: () => sinon.stub(),
                    mapSize: () => []
                },
                store,
                localVue
            });

        expect(wrapper.find(".pager-left").exists()).to.be.true;
        expect(wrapper.find(".pager-right").exists()).to.be.true;
    });

    it("should display the next feature if pager-right is clicked", async () => {
        const store = getGfiStore(),
            wrapper = mount(GfiComponent, {
                computed: {
                    isMobile: () => true,
                    desktopType: () => "",
                    active: () => true,
                    gfiFeatures: () => [{
                        getTheme: () => "default",
                        getTitle: () => "Feature 1",
                        getMimeType: () => "text/html",
                        getGfiUrl: () => null,
                        getMappedProperties: () => null,
                        getAttributesToShow: () => sinon.stub(),
                        getProperties: () => {
                            return {};
                        },
                        getlayerId: () => null,
                        getFeatures: () => []
                    },
                    {
                        getTheme: () => "default",
                        getTitle: () => "Feature 2",
                        getMimeType: () => "text/html",
                        getGfiUrl: () => null,
                        getAttributesToShow: () => sinon.stub(),
                        getProperties: () => {
                            return {};
                        },
                        getlayerId: () => null,
                        getFeatures: () => []
                    }],
                    gfiFeaturesReverse: () => sinon.stub(),
                    mapSize: () => []
                },
                store,
                localVue
            });

        await wrapper.find(".pager-right").trigger("click");
        expect(wrapper.find(".modal-title").text()).to.equal("Feature 2");
    });

    it("should display the previous feature if pager-left is clicked", async () => {
        const store = getGfiStore(),
            wrapper = mount(GfiComponent, {
                computed: {
                    isMobile: () => true,
                    desktopType: () => "",
                    active: () => true,
                    gfiFeatures: () => [{
                        getTheme: () => "default",
                        getTitle: () => "Feature 1",
                        getGfiUrl: () => null,
                        getMimeType: () => "text/html",
                        getAttributesToShow: () => sinon.stub(),
                        getMappedProperties: () => null,
                        getProperties: () => {
                            return {};
                        },
                        getFeatures: () => []
                    },
                    {
                        getTheme: () => "default",
                        getTitle: () => "Feature 2",
                        getGfiUrl: () => null,
                        getMimeType: () => "text/html",
                        getAttributesToShow: () => sinon.stub(),
                        getMappedProperties: () => null,
                        getProperties: () => {
                            return {};
                        },
                        getFeatures: () => []
                    }],
                    gfiFeaturesReverse: () => sinon.stub(),
                    mapSize: () => []
                },
                store,
                localVue
            });

        wrapper.setData({pagerIndex: 1});
        await wrapper.find(".pager-left").trigger("click");
        expect(wrapper.find(".modal-title").text()).to.equal("Feature 1");
    });

    it("should disabled left pager if pagerIndex is zero", () => {
        const wrapper = mount(GfiComponent, {
            computed: {
                isMobile: () => true,
                desktopType: () => "",
                active: () => true,
                gfiFeatures: () => [{
                    getTheme: () => "default",
                    getTitle: () => "Feature 1",
                    getGfiUrl: () => null,
                    getMimeType: () => "text/html",
                    getAttributesToShow: () => sinon.stub(),
                    getProperties: () => {
                        return {};
                    },
                    getFeatures: () => [],
                    "attributesToShow": sinon.stub()
                },
                {}],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore(),
            localVue
        });

        expect(wrapper.find(".pager-left").classes("disabled")).to.be.true;
    });

    it("should enabled right pager if pagerIndex is zero", () => {
        const store = getGfiStore(),
            wrapper = mount(GfiComponent, {
                computed: {
                    isMobile: () => true,
                    desktopType: () => "",
                    active: () => true,
                    gfiFeatures: () => [{
                        getTheme: () => "default",
                        getTitle: () => "Feature 1",
                        getGfiUrl: () => null,
                        getMimeType: () => "text/html",
                        getAttributesToShow: () => sinon.stub(),
                        getProperties: () => {
                            return {};
                        },
                        getFeatures: () => []
                    },
                    {}],
                    gfiFeaturesReverse: () => sinon.stub(),
                    mapSize: () => []
                },
                store,
                localVue
            });

        expect(wrapper.find(".pager-right").classes("disabled")).to.be.false;
    });

    it("should disabled right pager if pagerIndex === gfiFeatures.length - 1", () => {
        const wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            computed: {
                isMobile: () => true,
                desktopType: () => "",
                active: () => true,
                gfiFeatures: () => [{}, {
                    getTheme: () => "default",
                    getTitle: () => "Feature 1",
                    getGfiUrl: () => null,
                    getMimeType: () => "text/html",
                    getMappedProperties: () => null,
                    getProperties: () => {
                        return {};
                    },
                    getFeatures: () => []
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore(),
            localVue
        });

        expect(wrapper.find(".pager-right").classes("disabled")).to.be.true;
    });

    it("should enable left pager if pagerIndex === gfiFeatures.length - 1", () => {
        const wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            computed: {
                isMobile: () => true,
                desktopType: () => "",
                active: () => true,
                gfiFeatures: () => [{}, {
                    getTheme: () => "default",
                    getTitle: () => "Feature 1",
                    getGfiUrl: () => null,
                    getMimeType: () => "text/html",
                    getMappedProperties: () => null,
                    getProperties: () => {
                        return {};
                    },
                    getFeatures: () => []
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.find(".pager-left").classes("disabled")).to.be.false;
    });


    it("should enable left pager and right pager if pagerIndex is between zero and gfiFeature.length - 1", () => {
        const wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            computed: {
                isMobile: () => true,
                desktopType: () => "",
                active: () => true,
                gfiFeatures: () => [{}, {
                    getTheme: () => "default",
                    getTitle: () => "Feature 1",
                    getGfiUrl: () => null,
                    getMimeType: () => "text/html",
                    getMappedProperties: () => null,
                    getProperties: () => sinon.stub(),
                    getFeatures: () => sinon.stub()
                }, {}],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        expect(wrapper.find(".pager-left").classes("disabled")).to.be.false;
        expect(wrapper.find(".pager-right").classes("disabled")).to.be.false;
    });

    it("should find a new detached component, if componentKey was changed", async () => {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => false,
                desktopType: () => "",
                active: () => true,
                uiStyle: () => "",
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => sinon.stub(),
                    getProperties: () => sinon.stub()
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });
        let firstDetachedComponent = "",
            secondDetachedComponent = "";

        firstDetachedComponent = wrapper.findComponent({name: "Detached"});
        await wrapper.setData({componentKey: true});
        secondDetachedComponent = wrapper.findComponent({name: "Detached"});

        expect(firstDetachedComponent.exists()).to.be.false;
        expect(secondDetachedComponent.exists()).to.be.true;
    });

    describe("prepareGfiValue", function () {
        it("Should return the value of given key", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                gfi = {
                    foo: "bar",
                    bar: "foo",
                    barfoo: {
                        firstLevel: "foobar"
                    }
                },
                key = "bar";

            expect(wrapper.vm.prepareGfiValue(gfi, key)).to.equal("foo");
        });
        it("Should return the value of given key if key is an object path", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                gfi = {
                    foo: "bar",
                    bar: "foo",
                    barfoo: {
                        firstLevel: "foobar"
                    }
                },
                key = "@barfoo.firstLevel";

            expect(wrapper.vm.prepareGfiValue(gfi, key)).to.equal("foobar");
        });
        it("Should return undefined for key that is not in gfi", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                gfi = {
                    foo: "bar",
                    bar: "foo",
                    barfoo: {
                        firstLevel: "foobar"
                    }
                },
                key = "foobar";

            expect(wrapper.vm.prepareGfiValue(gfi, key)).to.be.undefined;
        });
        it("should return a value to a key regardless of upper and lower case", function () {
            const wrapper = shallowMount(GfiComponent, {store: getGfiStore, localVue}),
                gfi = {
                    Test1: "Test1 Value",
                    TEST2: "Test2 Value"
                },
                key1 = "Test1",
                key2 = "Test2",
                key3 = "TEST1";

            expect(wrapper.vm.prepareGfiValue(gfi, key1)).equals(gfi.Test1);
            expect(wrapper.vm.prepareGfiValue(gfi, key2)).equals(gfi.TEST2);
            expect(wrapper.vm.prepareGfiValue(gfi, key3)).equals(gfi.Test1);
        });
    });
    describe("prepareGfiValueFromObject", function () {
        it("Should return value of attribute that starts with 'foo_' and append 'mySuffix'", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "foo_",
                obj = {
                    condition: "startsWith",
                    suffix: "mySuffix"
                },
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.prepareGfiValueFromObject(key, obj, gfi)).to.equal("foo_bar mySuffix");
        });
        it("Should return value of attribute that contains 'o_b' and convert it to date with default format", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "o_b",
                obj = {
                    condition: "contains",
                    type: "date"
                },
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "2020-04-14T11:00:00.000Z",
                    bar_foo: "bar_foo"
                },
                defaultFormat = "DD.MM.YYYY HH:mm:ss";

            expect(wrapper.vm.prepareGfiValueFromObject(key, obj, gfi)).to.equal(moment("2020-04-14T11:00:00.000Z").format(defaultFormat));
        });
        it("Should return value of attribute that contains 'o__b' and convert it to date with given format 'DD.MM.YYYY'", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "o_b",
                obj = {
                    condition: "contains",
                    type: "date",
                    format: "DD.MM.YYYY"
                },
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "2020-04-14T11:00:00.000Z",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.prepareGfiValueFromObject(key, obj, gfi)).to.equal("14.04.2020");
        });
        it("Should return value of attribute that contains 'o__b' and convert it to number with thousand seperator", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "o_b",
                obj = {
                    condition: "contains",
                    type: "number"
                },
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "2000",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.prepareGfiValueFromObject(key, obj, gfi)).to.equal("2.000");
        });
        it("Should return value of attribute that contains 'o__b' and return the original value without translation", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "o_b",
                obj = {
                    condition: "contains",
                    type: "boolean"
                },
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "no translation",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.prepareGfiValueFromObject(key, obj, gfi)).to.equal("no translation");
        });
    });
    describe("getBooleanValue", function () {
        it("Should return the original value without translation if there is no translation function", function () {
            const wrapper = shallowMount(GfiComponent, {store: getGfiStore, localVue}),
                value = true,
                format = {
                    "true": "translate#common:modules.tools.gfi.boolean.true",
                    "false": "translate#common:modules.tools.gfi.boolean.false"
                };

            expect(wrapper.vm.getBooleanValue(value, format, false)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, format, undefined)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, format, null)).to.equal("true");
        });
        it("Should return the original value without translation if the format is not right", function () {
            const wrapper = shallowMount(GfiComponent, {store: getGfiStore, localVue}),
                value = true;

            expect(wrapper.vm.getBooleanValue(value, null, v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, {}, v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, "DD.MM.YYYY HH:mm:ss", v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, undefined, v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, 0, v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, "test", v => v)).to.equal("true");
            expect(wrapper.vm.getBooleanValue(value, [], v => v)).to.equal("true");
        });
        it("Should return the value with the right format", function () {
            const wrapper = shallowMount(GfiComponent, {store: getGfiStore, localVue}),
                value = "foo",
                format = {
                    "foo": "bar",
                    "foobar": "baz"
                };

            expect(wrapper.vm.getBooleanValue(value, format, v => v)).to.equal("bar");
        });
    });
    describe("getValueFromCondition", function () {
        it("Should return first key matching the contains condition", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "oo_",
                condition = "contains",
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.getValueFromCondition(key, condition, gfi)).to.equal("foo_bar");
        });
        it("Should return first key matching the startsWidth condition", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => [],
                        getProperties: () => sinon.stub()
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "bar",
                condition = "startsWith",
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.getValueFromCondition(key, condition, gfi)).to.equal("bar");
        });
        it("Should return first key matching the startsWidth condition", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => []
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "bar_",
                condition = "startsWith",
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.getValueFromCondition(key, condition, gfi)).to.equal("bar_foo");
        });
        it("Should return first key matching the endsWith condition", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => []
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "foo",
                condition = "endsWith",
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.getValueFromCondition(key, condition, gfi)).to.equal("foo");
        });
        it("Should return first key matching the endsWith condition", function () {
            const wrapper = shallowMount(GfiComponent, {
                    computed: {
                        isMobile: () => true,
                        active: () => true,
                        gfiFeatures: () => [{
                            getGfiUrl: () => null,
                            getFeatures: () => sinon.stub(),
                            getProperties: () => sinon.stub()
                        }],
                        gfiFeaturesReverse: () => sinon.stub(),
                        mapSize: () => []
                    },
                    store: getGfiStore,
                    localVue
                }),
                key = "_foo",
                condition = "endsWith",
                gfi = {
                    foo: "foo",
                    bar: "bar",
                    foo_bar: "foo_bar",
                    bar_foo: "bar_foo"
                };

            expect(wrapper.vm.getValueFromCondition(key, condition, gfi)).to.equal("bar_foo");
        });
    });
    describe("appendSuffix", function () {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => true,
                active: () => true,
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => []
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        it("Should leave string value as is, when suffix is undefined", function () {
            expect(wrapper.vm.appendSuffix("test1", undefined)).to.equal("test1");
        });
        it("Should leave number value as is, when suffix is undefined", function () {
            expect(wrapper.vm.appendSuffix(123, undefined)).to.equal(123);
        });
        it("Should leave float value as is, when suffix is undefined", function () {
            expect(wrapper.vm.appendSuffix(12.3, undefined)).to.equal(12.3);
        });
        it("Should leave boolean value as is, when suffix is undefined", function () {
            expect(wrapper.vm.appendSuffix(true, undefined)).to.be.true;
        });
        it("Should append suffix", function () {
            expect(wrapper.vm.appendSuffix("test1", "suffix")).to.equal("test1 suffix");
        });
        it("Should turn number value into string and append suffix", function () {
            expect(wrapper.vm.appendSuffix(123, "suffix")).to.equal("123 suffix");
        });
        it("Should turn float value into string and append suffix", function () {
            expect(wrapper.vm.appendSuffix(12.3, "suffix")).to.equal("12.3 suffix");
        });
        it("Should turn boolean value into string and append suffix", function () {
            expect(wrapper.vm.appendSuffix(true, "suffix")).to.equal("true suffix");
        });
    });

    describe("prependPrefix", function () {
        const wrapper = shallowMount(GfiComponent, {
            computed: {
                isMobile: () => true,
                active: () => true,
                gfiFeatures: () => [{
                    getGfiUrl: () => null,
                    getFeatures: () => []
                }],
                gfiFeaturesReverse: () => sinon.stub(),
                mapSize: () => []
            },
            store: getGfiStore,
            localVue
        });

        it("Should leave string value as is, when prefix is undefined", function () {
            expect(wrapper.vm.prependPrefix("test1", undefined)).to.equal("test1");
        });
        it("Should leave number value as is, when prefix is undefined", function () {
            expect(wrapper.vm.prependPrefix(123, undefined)).to.equal(123);
        });
        it("Should leave float value as is, when prefix is undefined", function () {
            expect(wrapper.vm.prependPrefix(12.3, undefined)).to.equal(12.3);
        });
        it("Should leave boolean value as is, when prefix is undefined", function () {
            expect(wrapper.vm.prependPrefix(true, undefined)).to.be.true;
        });
        it("Should prepend prefix w/o whitespace", function () {
            expect(wrapper.vm.prependPrefix("test1", "prefix")).to.equal("prefixtest1");
        });
        it("Should turn number value into string and prepend prefix w/o whitespace", function () {
            expect(wrapper.vm.prependPrefix(0, "prefix")).to.equal("prefix0");
        });
        it("Should turn float value into string and prepend prefix w/o whitespace", function () {
            expect(wrapper.vm.prependPrefix(12.3, "prefix")).to.equal("prefix12.3");
        });
        it("Should turn boolean value into string and prepend prefix w/o whitespace", function () {
            expect(wrapper.vm.prependPrefix(true, "prefix")).to.equal("prefixtrue");
        });
        it("Should prepend prefix with whitespace", function () {
            expect(wrapper.vm.prependPrefix("test", "prefix ")).to.equal("prefix test");
        });
    });
});
