import TemplateSettings from "text-loader!./templateSettings.html";
import Template from "text-loader!./templateLight.html";
import checkChildrenDatasets from "../../checkChildrenDatasets.js";
import store from "../../../../src/app-store";
import LayerBaseView from "./viewBase.js";

const LayerView = LayerBaseView.extend(/** @lends LayerView.prototype */{
    events: {
        "click .glyphicon-unchecked, .glyphicon-check, .title": function () {
            this.preToggleIsSelected();
            this.setFocus();
        },
        "keydown .layer-item": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "preToggleIsSelected")) {
                this.setFocus();
            }
        },
        "click .glyphicon-info-sign": "showLayerInformation",
        "keydown .glyphicon-info-sign": function (event) {
            this.handleKeyboardTriggeredAction(event, "showLayerInformation");
        },
        "click .glyphicon-cog": "toggleIsSettingVisible",
        "keydown .glyphicon-cog": function (event) {
            this.handleKeyboardTriggeredAction(event, "toggleIsSettingVisible");
        },
        "click .arrows > .glyphicon-arrow-up": "moveModelUp",
        "keydown .arrows > .glyphicon-arrow-up": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "moveModelUp")) {
                this.setFocus(".arrows > .glyphicon-arrow-up");
            }
        },
        "click .arrows > .glyphicon-arrow-down": "moveModelDown",
        "keydown .arrows > .glyphicon-arrow-down": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "moveModelDown")) {
                this.setFocus(".arrows > .glyphicon-arrow-down");
            }
        },
        "click .glyphicon-plus-sign": "incTransparency",
        "keydown .glyphicon-plus-sign": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "incTransparency")) {
                this.setFocus(".glyphicon-plus-sign");
            }
        },
        "click .glyphicon-minus-sign": "decTransparency",
        "keydown .glyphicon-minus-sign": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "decTransparency")) {
                this.setFocus(".glyphicon-minus-sign");
            }
        },
        "click .styleWMS": "openStyleWMS",
        "keydown .styleWMS": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "openStyleWMS")) {
                this.setFocus(".styleWMS");
            }
        },
        "click .styleVT": "openStyleVT",
        "keydown .styleVT": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "openStyleVT")) {
                this.setFocus(".styleVT");
            }
        },
        "click .remove-layer": "removeLayer",
        "keydown .remove-layer": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "removeLayer")) {
                this.setFocus();
            }
        }
    },
    /**
     * @class LayerView
     * @extends Backbone.View
     * @memberof Menu.Desktop.Layer
     * @constructs
     * @listens Layer#changeIsSelected
     * @listens Layer#changeIsSettingVisible
     * @listens Layer#changeTransparency
     * @listens Layer#changeIsOutOfRange
     * @listens Layer#changeCurrentLng
     * @listens Map#RadioTriggerMapChange
     * @listens LayerInformation#RadioTriggerLayerInformationUnhighlightLayerInformationIcon
     * @listens i18next#RadioTriggerLanguageChanged
     * @fires Map#RadioRequestMapGetMapMode
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @fires Parser#RadioTriggerParserRemoveItem
     * @fires Alerting#RadioTriggerAlertAlert
     */
    initialize: function () {
        checkChildrenDatasets(this.model);
        this.initializeDomId();
        this.listenTo(this.model, {
            "change:isSelected": this.rerender,
            "change:isSettingVisible": this.renderSetting,
            "change:transparency": this.rerender,
            "change:isOutOfRange": this.toggleColor,
            "change:currentLng": () => {
                this.render();
            }
        });
        this.listenTo(Radio.channel("Map"), {
            "change": this.toggleByMapMode
        });
        this.listenTo(Radio.channel("LayerInformation"), {
            "unhighlightLayerInformationIcon": this.unhighlightLayerInformationIcon
        });
        // TODO JG why is this necessary?
        // this.listenTo(Radio.channel("ModelList"), {
        //     "updatedSelectedLayerList": this.rerender
        // });
        this.$el.on({
            click: function (e) {
                e.stopPropagation();
            }
        });
        this.render();

        this.toggleColor(this.model, this.model.get("isOutOfRange"));
        this.toggleByMapMode(Radio.request("Map", "getMapMode"));
    },
    tagName: "li",
    className: "layer list-group-item",
    template: _.template(Template),
    templateSettings: _.template(TemplateSettings),

    /**
     * Renders the selection view.
     * @returns {Backbone.View} todo
     */
    render: function () {
        const attr = this.model.toJSON(),
            selector = $("#" + this.model.get("parentId"));

        selector.prepend(this.$el.html(this.template(attr)));
        if (this.model.get("isSettingVisible") === true) {
            this.$el.append(this.templateSettings(attr));
        }
        this.setAllTabIndices();
        return this;
    },

    /**
     * Rerenders the model with updated elements.
     * @returns {void}
     */
    rerender: function () {
        const attr = this.model.toJSON();

        this.$el.html(this.template(attr));
        if (this.model.get("layerInfoChecked")) {
            this.highlightLayerInformationIcon();
        }
        if (this.model.get("isSettingVisible")) {
            this.$el.append(this.templateSettings(attr));
        }
        this.setAllTabIndices();
    },

    /**
     * Draws the settings (transparency, metainfo, ...)
     * @return {void}
     */
    renderSetting: function () {
        const attr = this.model.toJSON();

        // Animation Zahnrad
        this.$(".glyphicon-cog").toggleClass("rotate rotate-back");
        // Slide-Animation templateSetting
        if (this.model.get("isSettingVisible") === false) {
            this.$el.find(".layer-settings").slideUp("slow", function () {
                $(this).remove();
            });
        }
        else {
            this.$el.append(this.templateSettings(attr));
            this.$el.find(".layer-settings").hide();
            this.$el.find(".layer-settings").slideDown();
        }
        this.setAllTabIndices();
    },

    /**
     * Executes toggleIsSettingVisible in the model
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
     * Executes moveDown in the model
     * @returns {void}
     */
    moveModelDown: function () {
        this.model.moveDown();
    },

    /**
     * Executes moveUp in the model
     * @returns {void}
     */
    moveModelUp: function () {
        this.model.moveUp();
    },

    /**
     * Executes incTransparency in the model
     * @returns {void}
     */
    incTransparency: function () {
        this.model.incTransparency(10);
    },

    /**
     * Executes decTransparency in the model
     * @returns {void}
     */
    decTransparency: function () {
        this.model.decTransparency(10);
    },

    /**
     * Triggers the styleWMS tool to open
     * Removes the class "open" from ".nav li:first-child"
     * @fires StyleWMS#RadioTriggerStyleWMSOpenStyleWMS
     * @returns {void}
     */
    openStyleWMS: function () {
        Radio.trigger("StyleWMS", "openStyleWMS", this.model);
        $(".nav li:first-child").removeClass("open");
    },

    /**
     * Activates the StyleVT Tool and commits the current layer model to the state.
     *
     * @returns {void}
     */
    openStyleVT: function () {
        store.dispatch("Tools/StyleVT/setActive", {active: true, layerModel: this.model}, {root: true});
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
    },

    /**
     * Highlights the Layer Information Icon in the layertree
     * @returns {void}
     */
    highlightLayerInformationIcon: function () {
        if (this.model.get("layerInfoChecked")) {
            this.$el.find("span.glyphicon-info-sign").addClass("highlightLayerInformationIcon");
        }
    },

    /**
     * Unhighlights the Layer Information Icon in the layertree
     * @returns {void}
     */
    unhighlightLayerInformationIcon: function () {
        this.$el.find("span.glyphicon-info-sign").removeClass("highlightLayerInformationIcon");
        this.model.setLayerInfoChecked(false);
    }
});

export default LayerView;
