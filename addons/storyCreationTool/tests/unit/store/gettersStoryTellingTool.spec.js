import {expect} from "chai";
import getters from "../../../store/gettersStoryCreationTool";
import stateStoryCreationTool from "../../../store/stateStoryCreationTool";
import {emptyStoryConf} from "../../../store/constantsStoryCreationTool";

const {
    id,
    storyConf,
    htmlContents,
    htmlContentsImages,
    active,
    name,
    glyphicon,
    renderToWindow,
    resizableWindow,
    isVisibleInMenu,
    deactivateGFI,
    initialWidth,
    initialWidthMobile
} = getters;

describe("addons/StoryCreationTool/store/gettersStoryCreationTool", function () {
    it("returns the id from state", function () {
        expect(id(stateStoryCreationTool)).to.equals("storyCreationTool");
    });
    it("returns the storyConf from state", function () {
        expect(JSON.stringify(storyConf(stateStoryCreationTool))).to.equals(
            JSON.stringify(emptyStoryConf)
        );
    });
    it("returns the htmlContents from state", function () {
        expect(JSON.stringify(htmlContents(stateStoryCreationTool))).to.equals(
            JSON.stringify({})
        );
    });
    it("returns the htmlContentsImages from state", function () {
        expect(
            JSON.stringify(htmlContentsImages(stateStoryCreationTool))
        ).to.equals(JSON.stringify({}));
    });

    describe("testing default values", function () {
        it("returns the active default value from state", function () {
            expect(active(stateStoryCreationTool)).to.be.false;
        });
        it("returns the name default value from state", function () {
            expect(name(stateStoryCreationTool)).to.be.equals(
                "Story Telling Tool"
            );
        });
        it("returns the glyphicon default value from state", function () {
            expect(glyphicon(stateStoryCreationTool)).to.equals(
                "glyphicon-book"
            );
        });
        it("returns the renderToWindow default value from state", function () {
            expect(renderToWindow(stateStoryCreationTool)).to.be.true;
        });
        it("returns the resizableWindow default value from state", function () {
            expect(resizableWindow(stateStoryCreationTool)).to.be.true;
        });
        it("returns the isVisibleInMenu default value from state", function () {
            expect(isVisibleInMenu(stateStoryCreationTool)).to.be.true;
        });
        it("returns the deactivateGFI default value from state", function () {
            expect(deactivateGFI(stateStoryCreationTool)).to.be.true;
        });
        it("returns the initialWidth default value from state", function () {
            expect(initialWidth(stateStoryCreationTool)).to.equals(500);
        });
        it("returns the initialWidthMobile default value from state", function () {
            expect(initialWidthMobile(stateStoryCreationTool)).to.equals(300);
        });
    });
});
