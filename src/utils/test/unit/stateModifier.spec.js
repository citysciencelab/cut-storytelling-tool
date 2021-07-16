import {expect} from "chai";
import setValueToState from "../../stateModifier.js";

describe("src/utils/stateModifier.js", () => {
    describe("setValueToState", () => {
        it("setValueToState does not react if key is not an array", () => {
            const state = {
                    Tools: {
                        Measure: {
                            active: false
                        }
                    }
                },
                value = "true";

            setValueToState(state, null, value);
            expect(state.Tools.Measure.active).to.be.equals(false);

            setValueToState(state, undefined, value);
            expect(state.Tools.Measure.active).to.be.equals(false);

            setValueToState(state, {}, value);
            expect(state.Tools.Measure.active).to.be.equals(false);
        });
        it("setValueToState sets a boolean", () => {
            const key = "Tools/Measure/active",
                state = {
                    Tools: {
                        Measure: {
                            active: false
                        }
                    }
                };

            setValueToState(state, key, "true");
            expect(state.Tools.Measure.active).to.be.equals(true);

            state.Tools.Measure.active = false;
            setValueToState(state, key, "1");
            expect(state.Tools.Measure.active).to.be.equals(true);

            state.Tools.Measure.active = false;
            setValueToState(state, key, true);
            expect(state.Tools.Measure.active).to.be.equals(true);

            setValueToState(state, key, "false");
            expect(state.Tools.Measure.active).to.be.equals(false);

            state.Tools.Measure.active = true;
            setValueToState(state, key, "0");
            expect(state.Tools.Measure.active).to.be.equals(false);

            state.Tools.Measure.active = true;
            setValueToState(state, key, false);
            expect(state.Tools.Measure.active).to.be.equals(false);

            state.Tools.Measure.active = true;
            setValueToState(state, key, null);
            expect(state.Tools.Measure.active).to.be.equals(false);
        });

        /**
        * These kinds of params are possible for starting tool draw:
        * It doesn't matter if it is controlled by vuex state or by backbone.
        *  ?Tools/Draw/active=true
        *  ?tools/Draw/active=true
        *  ?tools/draw/active=true
        *  ?Draw/active=true
        *  ?draw/active=true
        *  ?Draw/active
        *  ?draw/active
        *  ?isinitopen=draw
        *  ?isinitopen=Draw
        *  ?startupmodul=Draw
        *  ?startupmodul=draw
        */
        describe("test start tool by urlparams", () => {
            it("setValueToState sets tool active with param without incomplete key, no value or key has not expected case", () => {
                let key = "Tools/Measure/active";
                const state = {
                    Tools: {
                        Measure: {
                            active: false
                        }
                    }
                };

                setValueToState(state, key, "true");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "tools/Measure/active";
                setValueToState(state, key, "true");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "tools/measure/active";
                setValueToState(state, key, "true");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "Measure/active";
                setValueToState(state, key, "true");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "measure/active";
                setValueToState(state, key, "true");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "Measure/active";
                setValueToState(state, key, "");
                expect(state.Tools.Measure.active).to.be.equals(true);

                state.Tools.Measure.active = false;
                key = "measure/active";
                setValueToState(state, key, "");
                expect(state.Tools.Measure.active).to.be.equals(true);

            });
            it("setValueToState with isinitopen, tool is in state", () => {
                const key = "isinitopen",
                    state = {
                        Tools: {
                            Measure: {
                                active: false
                            }
                        }
                    };
                let value = "measure";

                setValueToState(state, key, value);
                expect(state.Tools.Measure.active).to.be.equals(true);
                expect(state[key]).to.be.equals(undefined);

                state.Tools.Measure.active = false;
                state.isinitopen = undefined;
                value = "Measure";
                setValueToState(state, key, value);
                expect(state.Tools.Measure.active).to.be.equals(true);
                expect(state[key]).to.be.equals(undefined);

            });
            it("setValueToState with isinitopen, tool is not in state", () => {
                const key = "isinitopen",
                    state = {
                        Tools: {
                        }
                    };
                let value = "print";

                setValueToState(state, key, value);
                expect(state.Tools.Print).to.be.equals(undefined);
                expect(state[key]).to.be.equals("print");

                state.Tools.Print = undefined;
                state.isinitopen = undefined;
                value = "Print";
                setValueToState(state, key, value);
                expect(state.Tools.Print).to.be.equals(undefined);
                expect(state[key]).to.be.equals("Print");
            });


            it("setValueToState with startupmodul, tool is in state", () => {
                const key = "startupmodul",
                    state = {
                        Tools: {
                            Measure: {
                                active: false
                            }
                        }
                    };
                let value = "measure";

                setValueToState(state, key, value);
                expect(state.Tools.Measure.active).to.be.equals(true);
                expect(state.isinitopen).to.be.equals(undefined);

                state.Tools.Measure.active = false;
                state.startupmodul = undefined;
                value = "Measure";
                setValueToState(state, key, value);
                expect(state.Tools.Measure.active).to.be.equals(true);
                expect(state.isinitopen).to.be.equals(undefined);

            });
            it("setValueToState with startupmodul, tool is not in state", () => {
                const key = "startupmodul",
                    state = {
                        Tools: {
                        }
                    };
                let value = "print";

                setValueToState(state, key, value);
                expect(state.Tools.Print).to.be.equals(undefined);
                expect(state.isinitopen).to.be.equals("print");

                state.Tools.Print = undefined;
                state.isinitopen = undefined;
                value = "Print";
                setValueToState(state, key, value);
                expect(state.Tools.Print).to.be.equals(undefined);
                expect(state.isinitopen).to.be.equals("Print");
            });
        });
    });
});
