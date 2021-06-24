import axios from "axios";
import store from "../../../../src/app-store";
import TabIndexUtils from "../../../core/tabIndexUtils";

/**
 * Base class for layer view that provides common functionality.
 */
const LayerBaseView = Backbone.View.extend(/** @lends LayerBaseView.prototype */{

    /**
     * Initializes the domId of this component with a fix prefix followed by a sequential number.
     * The id is needed for refocussing after the render-cycle.
     * The available id is a plain number and hence not a valid html id.
     * @param {String} prefix - optional prefix for the id
     * @returns {void}
     */
    initializeDomId: function (prefix) {
        let idPrexfix = "layer-list-group-item-";

        if (prefix) {
            idPrexfix = prefix;
        }
        this.model.set({
            domId: _.uniqueId(idPrexfix)
        });
    },

    /**
     * Sets all tabindices in the whole menu tree to enable keyboard navigation.
     * @returns {void}
     */
    setAllTabIndices: function () {

        // if we are part of a simple list (e.g. light menu) we are located under the root (id="tree") element
        if (this.model.get("parentId") === "tree") {
            const allComponentsSiblingTabIndexElements = $("#tree .tabable"),
                parentTabIndexElement = $("a.tree");

            TabIndexUtils.setAllTabIndicesFromParentWithIncrement(parentTabIndexElement, allComponentsSiblingTabIndexElements, 1);
        }
        else {
            // ... otherwise we are part of a menu tree and must find the root node of the tree and need an offset to reserve
            // some tabindex range for our our own actions
            const treeRootId = TabIndexUtils.getTreeRootItemId(this.model.get("parentId")),
                parentTabIndexElement = $("a." + treeRootId),
                allComponentsSiblingTabIndexElements = $("#" + treeRootId + " .tabable"),
                offset = 10;

            TabIndexUtils.setAllTabIndicesFromParent(parentTabIndexElement, allComponentsSiblingTabIndexElements, offset);
        }
    },

    /**
     * Wenn der Layer außerhalb seines Maßstabsberreich ist, wenn die view ausgegraut und nicht anklickbar
     * @param {Backbone.Model} model -
     * @param {boolean} value -
     * @returns {void}
     */
    toggleColor: function (model, value) {
        const mode = Radio.request("Map", "getMapMode");

        if (model.has("minScale") === true) {
            if (value === true) {
                this.disableComponent("Layer wird in dieser Zoomstufe nicht angezeigt");
            }
            else if (this.model.get("supported").indexOf(mode) >= 0) {
                this.enableComponent();
            }
            else if (mode === "2D") {
                this.disableComponent("Layer im 2D-Modus nicht verfügbar");
            }
            else {
                this.disableComponent("Layer im 3D-Modus nicht verfügbar");
            }
        }
    },

    /**
     * Init the LayerInformation window and inits the highlighting of the informationIcon.
     * @returns {void}
     */
    showLayerInformation: function () {
        this.model.showLayerInformation();
        this.highlightLayerInformationIcon();
        // Navigation wird geschlossen
        this.$("div.collapse.navbar-collapse").removeClass("in");
        // $("li.dropdown-folder.open").removeClass("open"); // TODO JG
    },

    /**
     * handles toggeling of secured and not-secured layers
     * @returns {void}
     */
    preToggleIsSelected: function () {
        const isErrorCalled = false;

        // if layer is secured and not selected
        if (this.model.get("isSecured") && !this.model.get("isSelected")) {
            this.triggerBrowserAuthentication(this.toggleIsSelected.bind(this), isErrorCalled);
        }
        else {
            this.toggleIsSelected();
        }
    },

    /**
     * triggers the browser basic authentication if the selected layer is secured
     * @param {Function} successFunction - Function called after triggering the browser basic authentication successfully
     * @param {Boolean} isErrorCalled - Flag if the function is called from error function
     * @returns {void}
     */
    triggerBrowserAuthentication: function (successFunction, isErrorCalled) {
        const that = this;

        axios({
            method: "get",
            url: this.model.get("authenticationUrl"),
            withCredentials: true
        }).then(function () {
            that.toggleIsSelected();
        }).catch(function () {
            that.errorFunction(successFunction, isErrorCalled);
        });
    },

    /**
     * Executes toggleIsSelected in the model
     * @returns {void}
     */
    toggleIsSelected: function () {
        this.model.toggleIsSelected();
        if (this.model.get("parentId")) {
            Radio.trigger("ModelList", "setIsSelectedOnParent", this.model);
        }
        this.rerender();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },

    /**
     * Error handling for triggering the browser basic authentication
     * @param {Function} successFunction - Function called after triggering the browser basic authentication successfully
     * @param {Number} isErrorCalled - Flag if the function is called from error function
     * @returns {void}
     */
    errorFunction: function (successFunction, isErrorCalled) {
        const isError = isErrorCalled,
            layerName = this.model.get("name"),
            authenticationUrl = this.model.get("authenticationUrl");

        if (isError === false) {
            this.triggerBrowserAuthentication(successFunction, !isError);
        }
        else if (isError === true) {
            store.dispatch("Alerting/addSingleAlert", {
                category: i18next.t("common:modules.alerting.categories.error"),
                displayClass: "error",
                content: i18next.t("common:modules.menu.layer.basicAuthError") + "\"" + layerName + "\"",
                kategorie: "alert-danger"
            });
            console.warn("Triggering the basic browser authentication for the secured layer \"" + layerName + "\" was not successfull. Something went wrong with the authenticationUrl (" + authenticationUrl + ")");
        }
    },

    /**
     * Executes the given function callback if a execution key has been triggered.
     * @param {Event} event - the dom event
     * @param {Function} callback - the callback function of the view to be executed
     * @returns {boolean} if the action has been triggered
     */
    handleKeyboardTriggeredAction: function (event, callback) {
        if (event.which === 32 || event.which === 13) {
            this[callback]();
            event.stopPropagation();
            event.preventDefault();
            return true;
        }
        return false;
    },

    /**
     * Sets the focus to an element of this component.
     * @param {String} selector - the selector to use to set focus (optional)
     * @returns {void}
     */
    setFocus: function (selector) {
        let focusElementSelector = null;

        if (selector) {
            focusElementSelector = this.$el.find(selector);
        }
        else {
            focusElementSelector = this.$el.find("#" + this.model.get("domId"));
        }
        if (focusElementSelector) {
            focusElementSelector.focus();
        }
    },

    /**
     * Disables the component for interaction, e.g. if the zoom level changes.
     * @param {string} text -
     * @returns {void}
     */
    disableComponent: function (text) {
        const statusCheckbox = this.$el.find("span.glyphicon.glyphicon-unchecked").length;

        this.$el.addClass("disabled");
        this.$el.find("*").css("cursor", "not-allowed");
        this.$el.find("*").css("pointer-events", "none");
        if (statusCheckbox === 0) {
            this.$el.find("span.pull-left").css({"pointer-events": "auto", "cursor": "pointer"});
        }
        this.$el.attr("title", text);

        this.$el.find(".tabable").addClass("disable-tabable");
        this.$el.find("*").removeClass("tabable");
        // no focus -> no keyboard events possible
        this.$el.find("*").removeAttr("tabindex");
    },

    /**
     * Enables the component for interaction.
     * @returns {void}
     */
    enableComponent: function () {
        this.$el.removeClass("disabled");
        this.$el.find("*").css("pointer-events", "auto");
        this.$el.find("*").css("cursor", "pointer");
        this.$el.attr("title", "");

        // toggle tabable class
        this.$el.find(".disable-tabable").addClass("tabable");
        this.$el.find("*").removeClass("disable-tabable");
        // activate tabindex
        this.setAllTabIndices();
    },

    /**
     * Highlights the Layerinformation Icon in the layertree
     * @returns {void}
     */
    highlightLayerInformationIcon: function () {
        if (this.model.get("layerInfoChecked")) {
            this.$el.find("span.glyphicon-info-sign").addClass("highlightLayerInformationIcon");
        }
    },

    /**
     * Unhighlights the Layerinformation Icon in the layertree
     * @returns {void}
     */
    unhighlightLayerInformationIcon: function () {
        this.$el.find("span.glyphicon-info-sign").removeClass("highlightLayerInformationIcon");
        this.model.setLayerInfoChecked(false);
    }
});

export default LayerBaseView;
