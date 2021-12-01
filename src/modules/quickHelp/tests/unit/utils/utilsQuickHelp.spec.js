import {expect} from "chai";
import {
    cloneObject,
    addKeysToContent,
    getNormalizedStringEntry,
    getNormalizedObjectEntry,
    getNormalizedSectionList,
    getNormalizeSection,
    getContentByConfigRules,
    createContent,
    applyConfig,
    applyQuickHelpConfigsToDefaultContents
} from "../../../utils/utilsQuickHelp.js";

describe("src/modules/quickHelp/utils/utilsQuickHelp.js", () => {
    describe("cloneObject", () => {
        it("should return false if the given param is not an object", () => {
            expect(cloneObject(undefined)).to.be.false;
            expect(cloneObject(null)).to.be.false;
            expect(cloneObject("string")).to.be.false;
            expect(cloneObject(1344)).to.be.false;
            expect(cloneObject(true)).to.be.false;
            expect(cloneObject(false)).to.be.false;
        });
        it("should return false if the given object can't be cloned", () => {
            const a = {};

            a.a = a;
            expect(cloneObject(a)).to.be.false;
        });
        it("should return an cloned object of given object", () => {
            const expected = {
                    foo: "bar"
                },
                a = {
                    foo: "bar"
                },
                b = cloneObject(a);

            b.foo = "foobar";

            expect(a).to.deep.equal(expected);
        });
    });
    describe("addKeysToContent", () => {
        it("should return an empty object if given param is not an array", () =>{
            expect(addKeysToContent({})).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent(123)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent("")).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent(true)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent(null)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent(undefined)).to.be.an("object").and.to.be.empty;
        });
        it("should return an empty object if second param is not a function", () => {
            expect(addKeysToContent([], undefined)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], 1234)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], true)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], {})).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], null)).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], [])).to.be.an("object").and.to.be.empty;
            expect(addKeysToContent([], "")).to.be.an("object").and.to.be.empty;
        });
        it("should return an object with keys in order of array", () => {
            let id = 0;
            const list = ["foo", "bar"],
                expected = {
                    1: "foo",
                    2: "bar"
                };

            expect(addKeysToContent(list, () => {
                return ++id;
            })).to.deep.equal(expected);
        });
    });
    describe("getNormalizedStringEntry", () => {
        it("should return a normalized text entry for the given translatable string with \":\"", () => {
            const entry = "common:foo",
                expected = {
                    text: "common:foo",
                    type: "text/plain"
                };

            expect(getNormalizedStringEntry(entry)).to.deep.equal(expected);
        });
        it("should return a normalized image with the given entry as image name and the given imgPath as image path", () => {
            const entry = "imgName",
                expected = {
                    imgName: "imgName",
                    imgPath: "imgPath"
                };

            expect(getNormalizedStringEntry(entry, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
    });
    describe("getNormalizedObjectEntry", () => {
        it("should return a normalized object as image object if the given object has a imgName key", () => {
            const entry = {
                    imgName: "foo",
                    imgPath: "img"
                },
                expected = {
                    imgName: "foo",
                    imgPath: "img"
                };

            expect(getNormalizedObjectEntry(entry, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
        it("should return a normalized object as image object if the given object has an imgName key and use the given imgPath", () => {
            const entry = {
                    imgName: "foo"
                },
                expected = {
                    imgName: "foo",
                    imgPath: "imgPath"
                };

            expect(getNormalizedObjectEntry(entry, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
        it("should return a normalized object as text object if the given object has no imgName key", () => {
            const entry = {
                    text: "foo",
                    type: "text/html"
                },
                expected = {
                    text: "foo",
                    type: "text/html"
                };

            expect(getNormalizedObjectEntry(entry)).to.deep.equal(expected);
        });
        it("should return a normalized object as text object with default type if the given object has no imgName key and no type", () => {
            const entry = {
                    text: "foo"
                },
                expected = {
                    text: "foo",
                    type: "text/plain"
                };

            expect(getNormalizedObjectEntry(entry)).to.deep.equal(expected);
        });
    });
    describe("getNormalizedSectionList", () => {
        it("should return an empty array if anything but an array is given as list", () => {
            expect(getNormalizedSectionList(undefined)).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList(null)).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList(1234)).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList("string")).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList(true)).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList(false)).to.be.an("array").and.to.be.empty;
            expect(getNormalizedSectionList({})).to.be.an("array").and.to.be.empty;
        });
        it("should normalize the given list only for entry types string and objects", () => {
            const list = [
                    "common:foo",
                    "foo",
                    {
                        imgName: "bar"
                    },
                    1234
                ],
                expected = [
                    {
                        text: "common:foo",
                        type: "text/plain"
                    },
                    {
                        imgName: "foo",
                        imgPath: "imgPath"
                    },
                    {
                        imgName: "bar",
                        imgPath: "imgPath"
                    }
                ];

            expect(getNormalizedSectionList(list, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
    });
    describe("getNormalizeSection", () => {
        it("should return an normalized object based on given section", () => {
            const section = {
                    title: "foo",
                    list: [
                        "common:bar",
                        "baz"
                    ]
                },
                expected = {
                    title: "foo",
                    list: [
                        {
                            text: "common:bar",
                            type: "text/plain"
                        },
                        {
                            imgName: "baz",
                            imgPath: "imgPath"
                        }
                    ]
                };

            expect(getNormalizeSection(section, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
        it("should return an normalized object based on given section with an empty title if no title is given", () => {
            const section = {
                    list: []
                },
                expected = {
                    title: "",
                    list: []
                };

            expect(getNormalizeSection(section)).to.deep.equal(expected);
        });
    });
    describe("getContentByConfigRules", () => {
        it("should return and empty object if anything but an object is given as content", () => {
            expect(getContentByConfigRules(undefined)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules(null)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules(1234)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules("string")).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules(true)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules(false)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules([])).to.be.an("object").and.to.be.empty;
        });
        it("should return an empty object if anything but a function is given as getUniqueId", () => {
            expect(getContentByConfigRules({}, [], "", undefined)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", null)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", 1234)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", "string")).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", true)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", false)).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", {})).to.be.an("object").and.to.be.empty;
            expect(getContentByConfigRules({}, [], "", [])).to.be.an("object").and.to.be.empty;
        });
        it("should return the given content if anything but an array is given as config", () => {
            expect(getContentByConfigRules({foo: "bar"}, undefined, "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, null, "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, 1234, "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, "string", "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, true, "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, false, "", () => false)).to.deep.equal({foo: "bar"});
            expect(getContentByConfigRules({foo: "bar"}, {}, "", () => false)).to.deep.equal({foo: "bar"});
        });
        it("should return a normalized object for correct params", () => {
            const content = {
                    foo: {
                        title: "fooTitle",
                        list: [
                            "common:foo"
                        ]
                    },
                    bar: {
                        title: "barTitle",
                        list: [
                            "bar"
                        ]
                    },
                    quez: {
                        title: "quezTitle",
                        list: [
                            {
                                text: "this is quez",
                                type: "text/html"
                            }
                        ]
                    }
                },
                config = [
                    {
                        title: "foobarTitle",
                        list: [
                            "common:foobar"
                        ],
                        before: "foo"
                    },
                    {
                        title: "bazTitle",
                        list: [
                            "baz"
                        ],
                        after: "foo"
                    },
                    {
                        hide: "bar"
                    },
                    {
                        title: "peroTitle",
                        list: [
                            {
                                imgName: "pero",
                                imgPath: "peroPath"
                            }
                        ]
                    }
                ],
                expected = {
                    1: {
                        title: "foobarTitle",
                        list: [
                            {
                                text: "common:foobar",
                                type: "text/plain"
                            }
                        ]
                    },
                    foo: {
                        title: "fooTitle",
                        list: [
                            {
                                text: "common:foo",
                                type: "text/plain"
                            }
                        ]
                    },
                    2: {
                        title: "bazTitle",
                        list: [
                            {
                                imgName: "baz",
                                imgPath: "imgPath"
                            }
                        ]
                    },
                    quez: {
                        title: "quezTitle",
                        list: [
                            {
                                text: "this is quez",
                                type: "text/html"
                            }
                        ]
                    },
                    3: {
                        title: "peroTitle",
                        list: [
                            {
                                imgName: "pero",
                                imgPath: "peroPath"
                            }
                        ]
                    }
                };
            let id = 0;

            expect(getContentByConfigRules(content, config, {imgPath: "imgPath"}, () => {
                return ++id;
            })).to.deep.equal(expected);
        });
    });
    describe("createContent", () => {
        it("should return an empty object if anything but an object is given as config", () => {
            expect(createContent(undefined)).to.be.an("object").and.to.be.empty;
            expect(createContent(null)).to.be.an("object").and.to.be.empty;
            expect(createContent(1234)).to.be.an("object").and.to.be.empty;
            expect(createContent("string")).to.be.an("object").and.to.be.empty;
            expect(createContent(true)).to.be.an("object").and.to.be.empty;
            expect(createContent(false)).to.be.an("object").and.to.be.empty;
            expect(createContent([])).to.be.an("object").and.to.be.empty;
        });
        it("should return empty content with keys title and content if an empty config is given", () => {
            const expected = {
                title: "",
                content: {}
            };

            expect(createContent({})).to.deep.equal(expected);
        });
        it("should create an content object with keys by getUniqueId function if the content of the given config is an array", () => {
            let id = 0;
            const config = {
                    title: "foo",
                    content: [
                        {
                            title: "bar",
                            list: [
                                "common:bar"
                            ]
                        },
                        {
                            title: "foobar",
                            list: [
                                "foobar"
                            ]
                        }
                    ]
                },
                expected = {
                    title: "foo",
                    content: {
                        1: {
                            title: "bar",
                            list: [
                                {
                                    text: "common:bar",
                                    type: "text/plain"
                                }
                            ]
                        },
                        2: {
                            title: "foobar",
                            list: [
                                {
                                    imgName: "foobar",
                                    imgPath: "imgPath"
                                }
                            ]
                        }
                    }
                };

            expect(createContent(config, {imgPath: "imgPath"}, () => {
                return ++id;
            })).to.deep.equal(expected);
        });
        it("should create a normalized result if a config object is given with keys to use", () => {
            const config = {
                    title: "foo",
                    content: {
                        foo: {
                            title: "bar",
                            list: [
                                "common:bar"
                            ]
                        },
                        foobar: {
                            title: "baz",
                            list: [
                                "baz"
                            ]
                        }
                    }
                },
                expected = {
                    title: "foo",
                    content: {
                        foo: {
                            title: "bar",
                            list: [
                                {
                                    text: "common:bar",
                                    type: "text/plain"
                                }
                            ]
                        },
                        foobar: {
                            title: "baz",
                            list: [
                                {
                                    imgName: "baz",
                                    imgPath: "imgPath"
                                }
                            ]
                        }
                    }
                };

            expect(createContent(config, {imgPath: "imgPath"})).to.deep.equal(expected);
        });
    });
    describe("applyConfig", () => {
        it("it should return an internal default result if empty objects as content and config are given", () => {
            const expected = {
                title: "",
                content: {}
            };

            expect(applyConfig({}, {})).to.deep.equal(expected);
        });
        it("should return a result object with given title and default content if no content is given", () => {
            const defaultContent = {
                    title: "default"
                },
                config = {
                    title: "New Title"
                },
                expected = {
                    title: "New Title",
                    content: {}
                };

            expect(applyConfig(defaultContent, config)).to.deep.equal(expected);
        });
        it("should return a result object with given content and default title if no title is given", () => {
            const defaultContent = {
                    title: "default"
                },
                expected = {
                    title: "default",
                    content: {}
                };

            expect(applyConfig(defaultContent, {})).to.deep.equal(expected);
        });
        it("should take the given config content and normalize it", () => {
            const config = {
                    title: "foo",
                    content: {
                        foo: {
                            title: "bar",
                            list: [
                                "common:bar"
                            ]
                        }
                    }
                },
                expected = {
                    title: "foo",
                    content: {
                        foo: {
                            title: "bar",
                            list: [
                                {
                                    text: "common:bar",
                                    type: "text/plain"
                                }
                            ]
                        }
                    }
                };

            expect(applyConfig({}, config)).to.deep.equal(expected);
        });
        it("should use the config as rules for the content if config is an array", () => {
            const defaultContent = {
                    title: "foo",
                    content: {
                        bar: {
                            title: "bar",
                            list: [
                                "common:baz"
                            ]
                        }
                    }
                },
                config = {
                    title: "qwez",
                    content: [
                        {
                            title: "foobar",
                            list: [
                                "foobar"
                            ],
                            before: "bar"
                        }
                    ]
                },
                expected = {
                    title: "qwez",
                    content: {
                        uniqueKey: {
                            title: "foobar",
                            list: [
                                {
                                    imgName: "foobar",
                                    imgPath: "imgPath"
                                }
                            ]
                        },
                        bar: {
                            title: "bar",
                            list: [
                                {
                                    text: "common:baz",
                                    type: "text/plain"
                                }
                            ]
                        }
                    }
                };

            expect(applyConfig(defaultContent, config, {imgPath: "imgPath"}, () => "uniqueKey")).to.deep.equal(expected);
        });
    });
    describe("applyQuickHelpConfigsToDefaultContents", () => {
        it("should return an empty object if anything but a clonable object is given as defaultContents", () => {
            const a = {};

            a.a = a;
            expect(applyQuickHelpConfigsToDefaultContents(a)).to.be.an("object").and.to.be.empty;

            expect(applyQuickHelpConfigsToDefaultContents(undefined)).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents(null)).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents(1234)).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents("string")).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents(true)).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents(false)).to.be.an("object").and.to.be.empty;
            expect(applyQuickHelpConfigsToDefaultContents([])).to.be.an("object").and.to.be.empty;
        });
        it("should return the defaultContents if anything but an object is given as extConfigs", () => {
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, undefined)).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, null)).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, 1234)).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, "string")).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, true)).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, false)).to.deep.equal({foo: "bar"});
            expect(applyQuickHelpConfigsToDefaultContents({foo: "bar"}, [])).to.deep.equal({foo: "bar"});
        });
        it("should apply quick help configs to default contents", () => {
            const defaultContents = {
                    search: {
                        title: "foo",
                        content: {
                            bar: {
                                title: "bar",
                                list: [
                                    "common:baz"
                                ]
                            }
                        }
                    }
                },
                extConfigs = {
                    tree: {
                        title: "foobar",
                        content: {
                            fooquez: {
                                title: "qwez",
                                list: [
                                    "common:qwez"
                                ]
                            }
                        }
                    },
                    search: {
                        content: [
                            {
                                title: "bam",
                                list: [
                                    "bas"
                                ],
                                before: "bar"
                            }
                        ]
                    }
                },
                expected = {
                    search: {
                        title: "foo",
                        content: {
                            uniqueKey: {
                                title: "bam",
                                list: [
                                    {
                                        imgName: "bas",
                                        imgPath: "imgPath"
                                    }
                                ]
                            },
                            bar: {
                                title: "bar",
                                list: [
                                    {
                                        text: "common:baz",
                                        type: "text/plain"
                                    }
                                ]
                            }
                        }
                    },
                    tree: {
                        title: "foobar",
                        content: {
                            fooquez: {
                                title: "qwez",
                                list: [
                                    {
                                        text: "common:qwez",
                                        type: "text/plain"
                                    }
                                ]
                            }
                        }
                    }
                };

            expect(applyQuickHelpConfigsToDefaultContents(defaultContents, extConfigs, {imgPath: "imgPath"}, () => {
                return "uniqueKey";
            })).to.deep.equal(expected);
        });
    });
});
