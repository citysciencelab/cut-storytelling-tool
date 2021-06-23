
/**
 * This model provides utility-methods for creating tabindices. All tabindices are generated in the render phase of the
 * view-components. Therefore the methods of this model could be used to simplify the creation, especially for the complex
 * themes/layer-menu-tree.
 */

const TabIndexUtils = Backbone.Model.extend(/** @lends TabIndexUtils.prototype */{

    defaults: {
    },

    /**
     * @class TabIndexUtils
     * @extends Backbone.Model
     * @memberof Core
     **/
    initialize: function () {
        // intenionally left blank, nothing to initialize here...
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

        this.setAllTabIndicesWithIncrementAndInitialValue(childrenSelector, 1,
            parseInt(parentSelector.attr("tabindex"), 10), offset);
    },

    /**
     * Retrieves the current tabindex from the parent element. Starting with the value of the parents tabindex
     * the tabindex for all child elements is set by incrementing each with the given increment value. The order of the elements
     * in the DOM is used.
     * @param {String} parentSelector - the $-selector for the parent element
     * @param {String} childrenSelector - the $-selector for all elements which tabindices should be set
     * @param {Number} incrementValue - the increment value to use
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     */
    setAllTabIndicesFromParentWithIncrement: function (parentSelector, childrenSelector, incrementValue, offset) {

        this.setAllTabIndicesWithIncrementAndInitialValue(childrenSelector, incrementValue,
            parseInt(parentSelector.attr("tabindex"), 10), offset);
    },

    /**
     * Starting with the offset value the tabindex for all elements is set by incrementing each with the given increment value.
     * The order of the elements in the DOM is used.
     * @param {String} elementsSelector - the $-selector for all elements which tabindices should be set
     * @param {Number} incrementValue - the increment value to use
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     */
    setAllTabIndicesWithIncrement: function (elementsSelector, incrementValue, offset) {

        this.setAllTabIndicesWithIncrementAndInitialValue(elementsSelector, incrementValue, 0, offset);
    },

    /**
     * Sets the tabindex for all elements by incrementing each with the given increment value.
     * @param {String} elementsSelector - the $-selector for all elements which tabindices should be set
     * @param {Number} incrementValue - the increment value to use
     * @param {Number} initialValue - the initial value
     * @param {Number} offset - the initial offset value to use (optional)
     * @returns {void}
     */
    setAllTabIndicesWithIncrementAndInitialValue: function (elementsSelector, incrementValue, initialValue, offset) {

        let runningTabIndex = initialValue;

        if (offset) {
            runningTabIndex = runningTabIndex + offset;
        }

        elementsSelector.each(function () {
            runningTabIndex = runningTabIndex + incrementValue;

            $(this).attr("tabindex", runningTabIndex);
        });
    },

    /**
     * Finds the root menu entry starting from the given parent id, by retrieving the uppermost tree item
     * before the root item of the tree (id="tree") is reached.
     * @param {String} startingId - the parent id to start with
     * @returns {String} the last id found before the root item of the tree.
     */
    getTreeRootItemId: function (startingId) {

        let id = null,
            parentId = startingId;

        if (!parentId || parentId === "tree") {
            return parentId;
        }

        do {

            const parentItem = this.getParentItem(parentId);

            if (parentItem) {
                parentId = parentItem.parentId;
                id = parentItem.id;
            }
        } while (parentId && parentId !== "tree");

        return id;
    },

    /**
     * Retrieves the menu model item for the given item.
     * @param {*} itemId - ithe id of the item to be found
     * @returns {*} the item found for the given iten
     */
    getParentItem: function (itemId) {
        return Radio.request("Parser", "getItemByAttributes", {id: itemId});
    }

});

export default new TabIndexUtils();
