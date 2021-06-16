
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
     * @returns {void}
     **/
    setAllTabIndicesFromParent: function (parentSelector, childrenSelector) {

        let runningTabindex = parseInt(parentSelector.attr("tabindex"), 10);

        childrenSelector.each(function () {
            $(this).attr("tabindex", ++runningTabindex);
        });
    },

    /**
     * Retrieves the current tabindex from the parent element. Starting with the value of the parents tabindex
     * the tabindex for all child elements is set by incrementing each with the given offset. The order of the elements
     * in the DOM is used.
     * @param {String} parentSelector - the $-selector for the parent element
     * @param {String} childrenSelector - the $-selector for all children which tabindices should be set
     * @param {Number} offset - the offset to use
     * @returns {void}
     */
    setAllTabIndicesFromParentByOffset: function (parentSelector, childrenSelector, offset) {

        let runningTabIndex = parseInt(parentSelector.attr("tabindex"), 10);

        childrenSelector.each(function () {
            runningTabIndex = runningTabIndex + offset;
            $(this).attr("tabindex", runningTabIndex);
        });
    },

    /**
     * Starting with the offset value the tabindex for all elements is set by incrementing each with the given offset. The order of the elements
     * in the DOM is used.
     * @param {String} elementsSelector - the $-selector for all children which tabindices should be set
     * @param {Number} offset - the offset to use
     * @returns {void}
     */
    setAllTabIndicesByOffset: function (elementsSelector, offset) {

        let runningTabindex = 0;

        elementsSelector.each(function () {
            runningTabindex = runningTabindex + offset;
            $(this).attr("tabindex", runningTabindex);
        });
    }
});

export default new TabIndexUtils();
