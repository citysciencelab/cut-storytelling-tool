
import {expect} from "chai";
import TabIndexUtils from "../../../../modules/core/tabIndexUtils";

describe("core/TabIndexUtil", function () {

    it("should set all tabindices with increment and offset", function () {

        // eslint-disable-next-line quotes
        const selector = $('<div><span id="id1"></span><span id="id2"></span></div>');

        TabIndexUtils.setAllTabIndicesWithIncrementAndInitialValue(selector.find("span"), 10, 10, 10);

        expect(selector.find("#id1").attr("tabindex")).to.equal("30");
        expect(selector.find("#id2").attr("tabindex")).to.equal("40");
    });

    describe("getTreeRootItemId", function () {

        it("should stop at the tree item", function () {

            const rootItem = TabIndexUtils.getTreeRootItemId("tree");

            expect(rootItem).to.equal("tree");
        });

        it("should retrieve the root node of the model ", function () {

            // mock getParentItem functiom
            TabIndexUtils.getParentItem = function () {
                return {
                    id: 1,
                    parentId: "tree"
                };
            };

            // eslint-disable-next-line one-var
            const rootItem = TabIndexUtils.getTreeRootItemId(2);

            expect(rootItem).to.equal(1);
        });
    });
});
