import { expect } from "chai";
import mutations from "../../../store/mutationsStoryCreationTool";

const { applyTranslationKey } = mutations;

describe("addons/StoryCreationTool/store/mutationsStoryCreationTool", function() {
    describe("applyTranslationKey", function() {
        it("removes 'translate#' from name if present", function() {
            const state = {
                    name:
                        "translate#additional:modules.tools.StoryCreationTool.title"
                },
                payload =
                    "translate#additional:modules.tools.StoryCreationTool.title";

            applyTranslationKey(state, payload);
            expect(state.name).to.equals(
                "additional:modules.tools.StoryCreationTool.title"
            );
        });

        it("does nothing, if name not starts with 'translate#'", function() {
            const name = "dies ist ein StoryCreationTool",
                state = {
                    name: name
                },
                payload = name;

            applyTranslationKey(state, payload);
            expect(state.name).to.equals(name);
        });

        it("does nothing, if payload is undefined", function() {
            const name = "name",
                state = {
                    name: name
                },
                payload = undefined;

            applyTranslationKey(state, payload);
            expect(state.name).to.equals(name);
        });
    });
});
