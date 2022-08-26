import Template from "text-loader!./templateLight.html";
import SettingTemplate from "text-loader!./templateSettings.html";
import checkChildrenDatasets from "../../checkChildrenDatasets.js";
import store from "../../../../src/app-store/index";
import axios from "axios";

const LayerView = Backbone.View.extend(/** @lends LayerView.prototype */{
    events: {
        "click .layer-item": "preToggleIsSelected",
        "click .layer-info-item > .info-icon": "showLayerInformation",
        "click .selected-layer-item > div": "toggleIsVisibleInMap",
        "click .layer-info-item > .settings-icon": "toggleIsSettingVisible",
        "click .layer-info-item > .switch-icon": "toggleIsSettingVisible",
        "click .layer-sort-item > .up-icon": "moveModelUp",
        "click .layer-sort-item > .down-icon": "moveModelDown",
        "change select": "setTransparency",
        "click .style-icon": "openStyleWMS",
        "click .remove-layer": "removeLayer"
    },

    /**
     * @class LayerView
     * @extends Backbone.View
     * @memberof Menu.Mobile.Layer
     * @constructs
     * @listens Layer#changeIsSelected
     * @listens Layer#changeIsVisibleInMap
     * @listens Layer#changeIsSettingVisible
     * @listens Layer#changeIsVisibleInTree
     * @listens Layer#changeIsOutOfRange
     * @listens Map#RadioTriggerMapChange
     * @fires Map#RadioRequestMapGetMapMode
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @fires Parser#RadioTriggerParserRemoveItem
     * @fires Alerting#RadioTriggerAlertAlert
     */
    initialize: function () {
        const channel = Radio.channel("Menu");

        checkChildrenDatasets(this.model);
        this.listenTo(this.model, {
            "change:isSelected change:isVisibleInMap": this.render,
            "change:isSettingVisible": this.renderSetting,
            "change:isVisibleInTree": this.removeIfNotVisible,
            "change:isOutOfRange": this.toggleColor
        });
        channel.on({
            "renderSetting": this.renderSetting,
            "rerender": this.render,
            "change:isOutOfRange": this.toggleColor,
            "change:isVisibleInTree": this.removeIfNotVisible
        }, this);
        this.listenTo(Radio.channel("Map"), {
            "change": this.toggleByMapMode
        });

        // translates the i18n-props into current user-language. is done this way, because model's listener to languageChange reacts too late (after render, which ist riggered by creating new Menu)
        this.model.changeLang();
        this.toggleByMapMode(Radio.request("Map", "getMapMode"));
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },
    tagName: "li",
    className: "list-group-item",
    template: _.template(Template),
    templateSetting: _.template(SettingTemplate),


    /**
     * If the layer is outside its scale range,
     * if the view is grayed out and not clickable
     * @param {Backbone.Model} model - todo
     * @param {boolean} value - todo
     * @returns {void}
     */
    toggleColor: function (model, value) {
        // adaption to not backbone layers
        if (this.model.get("id") !== model.get("id")) {
            return;
        }
        if (model.has("minScale") === true) {
            if (value === true) {
                const statusCheckbox = this.$el.find(".bootstrap-icon > .bi-square").length;

                this.$el.addClass("disabled");
                this.$el.find("*").css("pointer-events", "none");
                if (statusCheckbox === 0) {
                    this.$el.find("div.float-start").css("pointer-events", "auto");
                }
            }
            else {
                this.$el.removeClass("disabled");
                this.$el.find("*").css("pointer-events", "auto");
            }
        }
    },

    /**
     * todo
     * @returns {void}
     */
    render: function () {
        const attr = this.model.toJSON();

        this.$el.html(this.template(attr));
        if (this.model.get("isSettingVisible") === true) {
            this.renderSetting();
        }
        return this;
    },

    /**
     * Draws the settings (transparency, metainfo, ...)
     * @param {String} layerId The layer id.
     * @returns {void}
     */
    renderSetting: function (layerId) {
        const attr = this.model.toJSON();

        // Animation cog
        if (layerId === attr.id) {
            this.$(".bi-gear").parent(".bootstrap-icon").toggleClass("rotate rotate-back");
        }
        this.$(".switch-icon").toggleClass("rotate rotate-back");
        this.$(".switch-icon").children("i").toggleClass("bi-dash-lg bi-plus-lg");
        // Slide-Animation templateSetting
        if (this.model.get("isSettingVisible") === false) {
            this.$el.find(".item-settings").slideUp("slow", function () {
                this.remove();
            });
        }
        else {
            this.$el.append(this.templateSetting(attr));
            this.$el.find(".item-settings").hide();
            this.$el.find(".item-settings").slideDown();
        }
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
     * todo
     * @returns {void}
     */
    toggleIsSelected: function () {
        this.model.toggleIsSelected();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },

    /**
     * todo
     * @returns {void}
     */
    toggleIsVisibleInMap: function () {
        this.model.toggleIsVisibleInMap();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },

    /**
     * todo
     * @returns {void}
     */
    showLayerInformation: function () {
        this.model.showLayerInformation();
        // Navigation wird geschlossen
        $("div.collapse.navbar-collapse").removeClass("show");
    },

    /**
     * todo
     * @returns {void}
     */
    toggleIsSettingVisible: function () {
        this.model.toggleIsSettingVisible();
    },

    /**
     * todo
     * @param {*} evt - todo
     * @returns {void}
     */
    setTransparency: function (evt) {
        this.model.setTransparency(parseInt(evt.target.value, 10));
    },

    /**
     * todo
     * @returns {void}
     */
    moveModelDown: function () {
        this.model.moveDown();
    },

    /**
     * todo
     * @returns {void}
     */
    moveModelUp: function () {
        this.model.moveUp();
    },

    /**
     * todo
     * @returns {void}
     */
    removeIfNotVisible: function () {
        if (!this.model.get("isVisibleInTree")) {
            this.remove();
        }
    },

    /**
     * todo
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @returns {void}
     */
    openStyleWMS: function () {
        Radio.trigger("StyleWMS", "openStyleWMS", this.model);
        $(".navbar-collapse").removeClass("show");
    },

    /**
     * todo
     * @fires Parser#RadioTriggerParserRemoveItem
     * @returns {void}
     */
    removeLayer: function () {
        Radio.trigger("Parser", "removeItem", this.model.get("id"));
        this.model.removeLayer();
        this.$el.remove();
    },

    /**
     * adds only layers to the tree that support the current mode of the map
     * e.g. 2D, 3D
     * @param {String} mapMode - current mode from map
     * @returns {void}
     */
    toggleByMapMode: function (mapMode) {
        if (this.model.get("supported").indexOf(mapMode) >= 0) {
            this.$el.show();
        }
        else {
            this.$el.hide();
        }
    }
});

export default LayerView;
