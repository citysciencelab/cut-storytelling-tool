import CatalogTemplate from "text-loader!./templateCatalog.html";
import store from "../../../../src/app-store";
import TabIndexUtils from "../../../core/tabIndexUtils";

/**
 * @member CatalogTemplate
 * @description Template used to create the Catalog View
 * @memberof Menu.Desktop.Folder
 */

const FolderCatalogView = Backbone.View.extend(/** @lends FolderCatalogView.prototype */{
    events: {
        "change select": "setSelection",
        "keydown .form-control": function (event) {
            event.stopPropagation();
        },

        "click .header > a > .glyphicon, .header > a > .control-label": "toggleIsExpanded",
        "keydown .header > a": "keyAction",

        "click .Baselayer .catalog_buttons .glyphicon-question-sign": function () {
            Radio.trigger("QuickHelp", "showWindowHelp", "tree");
            // TODO REFACTOR-384 Keyboard-nav: setFocus to help window
        },
        "keydown .Baselayer .catalog_buttons .glyphicon-question-sign": function (event) {
            if (event.which === 32 || event.which === 13) {
                Radio.trigger("QuickHelp", "showWindowHelp", "tree");
                // TODO REFACTOR-384 Keyboard-nav: setFocus to help window
                event.stopPropagation();
                event.preventDefault();
            }
        },

        "click .glyphicon-adjust": "toggleBackground",
        "keydown .glyphicon-adjust": function (event) {
            if (event.which === 32 || event.which === 13) {
                this.toggleBackground();
                event.stopPropagation();
                event.preventDefault();
            }
        },

        "click .rotate-pin": "unfixTree",
        "keydown .rotate-pin": function (event) {
            if (event.which === 32 || event.which === 13) {
                this.unfixTree();
                event.stopPropagation();
                event.preventDefault();
            }
        },

        "click .rotate-pin-back": "fixTree",
        "keydown .rotate-pin-back": function (event) {
            if (event.which === 32 || event.which === 13) {
                this.fixTree();
                event.stopPropagation();
                event.preventDefault();
            }
        },

        "click .layer-selection-save": function () {
            this.model.collection.setActiveToolsToFalse(this.model);
            this.model.collection.get("saveSelection").setIsActive(true);
            store.dispatch("Tools/setToolActive", {id: "saveSelection", active: true});
            // Schließt den Baum
            $(".nav li:first-child").removeClass("open");
            // Schließt die Mobile Navigation
            $(".navbar-collapse").removeClass("in");
            // Selektiert die URL
            $(".input-save-url").select();
        }
    },

    /**
     * @class FolderCatalogView
     * @extends Backbone.View
     * @memberof Menu.Desktop.Folder
     * @constructs
     * @listens Core#RadioTriggerMapChange
     * @listens Menu.Desktop.Folder#changeIsExpanded
     * @listens Menu.Desktop.Folder#isVisibleInTree
     * @fires Menu.Desktop.Folder#toggleIsExpanded
     * @fires Menu.Desktop.Folder#setSelection
     * @fires Menu.Desktop.Folder#toggleBackground
     * @fires Menu.Desktop.Folder#unfixTree
     * @fires Menu.Desktop.Folder#fixTree
     * @fires QuickHelp#RadioTriggerQuickHelpShowWindowHelp
     * @fires Core#RadioTriggerMapViewToggleBackground
     * @fires Core#RadioRequestMapGetMapMode
     * @fires Core.ConfigLoader#RadioRequestParserGetTreeType
     * @fires Core.ConfigLoader#RadioRequestParserGetCategory
     * @fires Core.ConfigLoader#RadioRequestParserGetCategories
     * @fires Core.ConfigLoader#RadioRequestParserGetItemByAttributes
     * @fires Core.ConfigLoader#RadioRequestParserSetCategory
     */
    initialize: function () {
        this.listenTo(Radio.channel("Map"), {
            "change": function (mode) {
                if (mode === "Oblique") {
                    this.model.setIsExpanded(false);
                }
                this.togle3dCatalog(mode);
            }
        });
        this.listenTo(this.model, {
            "change:isExpanded": this.toggleGlyphicon
        }, this);
        this.$el.on({
            click: function (e) {
                e.stopPropagation();
            }
        });
        this.render();
        this.togle3dCatalog(Radio.request("Map", "getMapMode"));
    },
    tagName: "li",
    className: "layer-catalog",
    template: _.template(CatalogTemplate),

    /**
     * Renders the data to DOM.
     * @fires Core.ConfigLoader#RadioRequestParserGetTreeType
     * @fires Core.ConfigLoader#RadioRequestParserGetCategory
     * @fires Core.ConfigLoader#RadioRequestParserGetCategories
     * @fires Core.ConfigLoader#RadioRequestParserGetItemByAttributes
     * @return {FolderCatalogView} returns this
     */
    render: function () {
        const attr = this.model.toJSON();

        attr.treeType = Radio.request("Parser", "getTreeType");
        attr.category = Radio.request("Parser", "getCategory");
        attr.categories = Radio.request("Parser", "getCategories");
        attr.backgroundImage = Radio.request("MapView", "getBackgroundImage");
        this.$el.find(".header").toggleClass("closed");
        $("#" + this.model.get("parentId")).append(this.$el.html(this.template(attr)));
        if (attr.isPinned) {
            this.fixTree();
        }
        if (attr.isExpanded) {
            // to provoke reaction of listener ModelList#ChangeIsExpanded
            this.model.setIsExpanded(false);
            this.model.setIsExpanded(true);
        }
        this.setAllTabIndices();
        return this;
    },

    /**
      * Handles all key action for open/close the layer list.
      * @param {*} event - the event
      * @returns {void}
      */
    keyAction: function (event) {
        if (event.which === 32 || event.which === 13) {
            this.model.toggleIsExpanded();
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.which === 37) {
            this.model.setIsExpanded(false);
            this.model.toggleCatalogs();
            event.stopPropagation();
            event.preventDefault();
        }
        else if (event.which === 39) {
            this.model.setIsExpanded(true);
            this.model.toggleCatalogs();
            event.stopPropagation();
            event.preventDefault();
        }
    },
    /**
     * Sets the tabindices of all layer catalog elements with an increment of 1000.
     * @returns {void}
     */
    setAllTabIndices: function () {
        const parentTabIndexElement = $("a." + this.model.get("parentId")),
            allElementsOfThisComponent = $("#" + this.model.get("parentId") + ">li.layer-catalog>div>a"),
            increment = 1000;
            // offset = 10;

        TabIndexUtils.setAllTabIndicesFromParentWithIncrement(parentTabIndexElement, allElementsOfThisComponent, increment);

        let runningTabindex = parseInt(this.$el.find("div>a").attr("tabindex"), 10);

        this.$el.find("div span .tabable, div form .tabable").each(function () {
            runningTabindex = runningTabindex + 1;
            $(this).attr("tabindex", runningTabindex);
        });
    },

    /**
     * Toogle Expanded
     * @return {void}
     */
    toggleIsExpanded: function () {
        this.model.toggleIsExpanded();
    },

    /**
     * Toogle Glyphicon
     * @return {void}
     */
    toggleGlyphicon: function () {
        const elem = $("ul#" + this.model.get("id")).prev().find(".glyphicon:first");

        if (!this.model.get("isExpanded")) {
            elem.removeClass("glyphicon-minus-sign");
            elem.addClass("glyphicon-plus-sign");
        }
        else {
            elem.removeClass("glyphicon-plus-sign");
            elem.addClass("glyphicon-minus-sign");
            // console.log(this.$el.find(".list-group-item").length)
            // console.log($("ul#" + this.model.get("id") + ">li").length)
            // $("ul#" + this.model.get("id") + " a").first().trigger("focusin");
        }
        // Hässlicher IE Bugfix, weil IE 11 mit overflow: auto und remove probleme macht (leerer Katalog wird sehr hoch und bekommt die Höhe -0.01)
        if (!this.model.get("isExpanded")) {
            this.$el.find(".LayerListMaxHeight").css("overflow", "visible");
        }
        else {
            this.$el.find(".LayerListMaxHeight").css("overflow", "auto");
        }
    },

    /**
     * Toogle Background
     * @return {void}
     */
    toggleBackground: function () {
        Radio.trigger("MapView", "toggleBackground");
        $(".glyphicon-adjust").toggleClass("rotate-adjust");
        $(".glyphicon-adjust").toggleClass("rotate-adjust-back");
    },

    /**
     * Toogle 3dCatalog
     * @param {*} mode todo
     * @return {void}
     */
    togle3dCatalog: function (mode) {
        if (mode === "3D" && this.model.get("id") === "3d_daten") {
            this.$el.show();
        }
        else if (mode !== "3D" && this.model.get("id") === "3d_daten") {
            this.$el.hide();
        }
    },

    /**
     * Fix tree
     * @return {void}
     */
    fixTree: function () {
        $("body").on("click", "#map", this.helpForFixing);
        $("body").on("click", "#searchbar", this.helpForFixing);
        $(".glyphicon-pushpin").addClass("rotate-pin");
        $(".glyphicon-pushpin").removeClass("rotate-pin-back");
        this.model.setIsPinned(true);
    },

    /**
     * unfix Tree
     * @return {void}
     */
    unfixTree: function () {
        $("body").off("click", "#map", this.helpForFixing);
        $("body").off("click", "#searchbar", this.helpForFixing);
        $(".glyphicon-pushpin").removeClass("rotate-pin");
        $(".glyphicon-pushpin").addClass("rotate-pin-back");
        this.model.setIsPinned(false);
    },

    /**
     * Help for fixing
     * @param {evt} evt todo
     * @return {void}
     */
    helpForFixing: function (evt) {
        evt.stopPropagation();
    },

    /**
    * Set Selection
    * @param {evt} evt todo
    * @fires Core.ConfigLoader#RadioRequestParserSetCategory
    * @return {void}
    */
    setSelection: function (evt) {
        Radio.trigger("Parser", "setCategory", evt.currentTarget.value);
        $("." + this.model.get("id") + " select.tabable").trigger("focus");
    }
});

export default FolderCatalogView;
