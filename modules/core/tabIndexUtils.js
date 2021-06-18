
/**
 * This model provides utility-methods for creating tabindices. All tabindices are generated in the render phase of the
 * view-components. Therefore the methods of this model could be used to simplify the creation, especially for the complex
 * themes/layer-menu-tree.
 */

const TabIndexUtils = Backbone.Model.extend({

    defaults: {
    },

    /**
     * Retrieves the current tabindex from the parent element. Starting with the value of the parents tabindex
     * the tabindex for all child elements is set by incrementing each with 1. The order of the elements
     * in the DOM is used.
     * @param {String} parentSelector - the $-selector for the parent element
     * @param {String} childrenSelector  - the $-selector  for all children which tabindices should be set
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     **/
    setAllTabIndicesFromParent: function (parentSelector, childrenSelector, offset) {

        let runningTabIndex = parseInt(parentSelector.attr("tabindex"), 10);

        if (offset) {
            runningTabIndex = runningTabIndex + offset;
        }
        childrenSelector.each(function () {
            $(this).attr("tabindex", ++runningTabIndex);
        });
    },

    /**
     * Retrieves the current tabindex from the parent element. Starting with the value of the parents tabindex
     * the tabindex for all child elements is set by incrementing each with the given increment value. The order of the elements
     * in the DOM is used.
     * @param {String} parentSelector - the $-selector for the parent element
     * @param {String} childrenSelector - the $-selector for all children which tabindices should be set
     * @param {Number} incrementValue - the increment value to use
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     */
    setAllTabIndicesFromParentWithIncrement: function (parentSelector, childrenSelector, incrementValue, offset) {

        let runningTabIndex = parseInt(parentSelector.attr("tabindex"), 10);

        if (offset) {
            runningTabIndex = runningTabIndex + offset;
        }

        childrenSelector.each(function () {
            runningTabIndex = runningTabIndex + incrementValue;
            $(this).attr("tabindex", runningTabIndex);
        });
    },

    /**
     * Starting with the offset value the tabindex for all elements is set by incrementing each with the given increment value. 
     * The order of the elements in the DOM is used.
     * @param {String} elementsSelector - the $-selector for all children which tabindices should be set
     * @param {Number} incrementValue - the increment value to use
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     */
    setAllTabIndicesWithIncrement: function (elementsSelector, incrementValue, offset) {

        let runningTabIndex = 0;

        if (offset) {
            runningTabIndex = runningTabIndex + offset;
        }

        elementsSelector.each(function () {
            runningTabIndex = runningTabIndex + incrementValue;
            $(this).attr("tabindex", runningTabIndex);
        });
    },

    /**
     * Retrieves the last tree item before the root item of the tree, starting by the given parent id. Walks through the tree in
     * the upper direction.
     * @param {String} startingParentId - the parent id to start with
     * @returns {String} the last id found before the root item of the tree.
     */
    getTreeRootItemId: function (startingParentId) {

        let id = null,
            parentId = startingParentId;

        do {

            const parentItem = Radio.request("Parser", "getItemByAttributes", {id: parentId});

            if (parentItem) {
                parentId = parentItem.parentId;
                id = parentItem.id;
            }
        } while (parentId && parentId !== "tree");

        return id;
    }
});

export default new TabIndexUtils();
