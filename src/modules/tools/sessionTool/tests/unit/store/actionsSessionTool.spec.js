import testAction from "../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsSessionTool";

const {register} = actions;

describe("src/modules/tools/sessionTool/store/actionsSessionTool", function () {
    describe("register", () => {
        it("should register an observer", done => {
            testAction(register, {getter: true, setter: true, key: "foo"}, {}, {}, [
                {type: "addObserver", payload: {getter: true, setter: true, key: "foo"}, commit: true}
            ], {}, done);
        });
    });
});
