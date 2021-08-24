import {expect} from "chai";
import getters from "../getters.js";

describe("src/app-store/getters.js", () => {
    describe("isSimpleStyle: checks if the simple style is set or not", () => {
        it("should return false if table style is set in the urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "table"
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.false;
        });

        it("should return true if simple style is set in urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "simple"
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.true;
        });

        it("should return false if simple style is set in config and table style in urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "table"
                },
                configJs: {
                    uiStyle: "simple"
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.false;
        });

        it("should return false if style is not set in urlParams and table style is set in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                    uiStyle: "table"
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.false;
        });

        it("should return true if style is undefined in urlParams and simple style is set in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                    uiStyle: "simple"
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.true;
        });

        it("should return false if style neither set in urlParams nor in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                }
            };

            expect(getters.isSimpleStyle(state)).to.be.false;
        });
    });

    describe("isTableStyle: checks if the table style is set or not", () => {
        it("should return false if simple style is set in the urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "simple"
                }
            };

            expect(getters.isTableStyle(state)).to.be.false;
        });

        it("should return true if table style is set in urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "table"
                }
            };

            expect(getters.isTableStyle(state)).to.be.true;
        });

        it("should return false if table style is set in config and simple style in urlParams", () => {
            const state = {
                urlParams: {
                    uiStyle: "simple"
                },
                configJs: {
                    uiStyle: "table"
                }
            };

            expect(getters.isTableStyle(state)).to.be.false;
        });

        it("should return false if style is undefined in urlParams and simple style is set in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                    uiStyle: "simple"
                }
            };

            expect(getters.isTableStyle(state)).to.be.false;
        });

        it("should return true if style is undefined in urlParams and table style is set in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                    uiStyle: "table"
                }
            };

            expect(getters.isTableStyle(state)).to.be.true;
        });

        it("should return false if style neither set in urlParams nor in the config", () => {
            const state = {
                urlParams: {
                },
                configJs: {
                }
            };

            expect(getters.isTableStyle(state)).to.be.false;
        });
    });

    describe("isDefaultStyle: checks if the default style is set or not", () => {
        it("should return false if table style is set", () => {
            const state = {},
                mockGetters = {
                    isTableStyle: true,
                    isSimpleStyle: false
                };

            expect(getters.isDefaultStyle(state, mockGetters)).to.be.false;
        });

        it("should return false if simple style is set", () => {
            const state = {},
                mockGetters = {
                    isTableStyle: false,
                    isSimpleStyle: true
                };

            expect(getters.isDefaultStyle(state, mockGetters)).to.be.false;
        });

        it("should return true if neither is set simple style nor table style", () => {
            const state = {},
                mockGetters = {
                    isTableStyle: false,
                    isSimpleStyle: false
                };

            expect(getters.isDefaultStyle(state, mockGetters)).to.be.true;
        });
    });
});
