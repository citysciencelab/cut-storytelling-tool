import Template from "text-loader!./templateSelection.html";
import TemplateSettings from "text-loader!./templateSettings.html";
import checkChildrenDatasets from "../../checkChildrenDatasets.js";
import LayerBaseView from "./viewBase.js";
import TabIndexUtils from "../../../core/tabIndexUtils";

const LayerView = LayerBaseView.extend(/** @lends LayerView.prototype */{
    events: {
        "click .glyphicon-check, glyphicon-checked, .title": "toggleIsVisibleInMap",
        "keydown .layer-item": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "toggleIsVisibleInMap")) {
                this.setFocus();
            }
        },
        "click .glyphicon-info-sign": "showLayerInformation",
        "keydown .glyphicon-info-sign": function (event) {
            this.handleKeyboardTriggeredAction(event, "showLayerInformation");
        },
        "click .glyphicon-remove-circle": "removeFromSelection",
        "keydown .glyphicon-remove-circle": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "removeFromSelection")) {
                this.setFocus(".glyphicon-remove-circle");
            }
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
                this.setFocus(".transparency .glyphicon-plus-sign");
            }
        },
        "click .glyphicon-minus-sign": "decTransparency",
        "keydown .glyphicon-minus-sign": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "decTransparency")) {
                this.setFocus(".transparency .glyphicon-minus-sign");
            }
        },
        "click .glyphicon-tint": "openStyleWMS",
        "keydown .glyphicon-tint": function (event) {
            if (this.handleKeyboardTriggeredAction(event, "openStyleWMS")) {
                this.setFocus(".styleWMS");
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
     */
    initialize: function () {
        checkChildrenDatasets(this.model);
        this.initializeDomId();
        this.listenTo(this.model, {
            "change:isVisibleInMap": this.rerender,
            "change:isSettingVisible": this.renderSetting,
            "change:transparency": this.rerender,
            "change:isOutOfRange": this.toggleColor
        });
        // translates the i18n-props into current user-language. is done this way, because model's listener to languageChange reacts too late (after render, which ist riggered by creating new Menu)
        this.model.changeLang();
        this.render();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    },
    tagName: "li",
    className: "layer-item list-group-item",
    template: _.template(Template),
    templateSettings: _.template(TemplateSettings),

    /**
     * Sets the tabindices of all elements in the Selected Layer component.
     * @returns {void}
     */
    setAllTabIndices: function () {
        const parentTabIndexElement = $("a.SelectedLayer"),
            allElementsOfThisComponent = $("#SelectedLayer .tabable");

        TabIndexUtils.setAllTabIndicesFromParentWithIncrement(parentTabIndexElement, allElementsOfThisComponent, 1);
    },

    /**
     * Renders the selection view.
     * @returns {void}
     */
    render: function () {
        const selector = $("ul#SelectedLayer"),
            attr = this.model.toJSON();

        selector.prepend(this.$el.html(this.template(attr)));
        if (this.model.get("isSettingVisible") === true) {
            this.$el.append(this.templateSettings(attr));
        }
        if (this.model.get("layerInfoChecked")) {
            this.highlightLayerInformationIcon();
        }
        this.setAllTabIndices();
        return this;
    },

    /**
     * Rerenders the selection view.
     * @returns {void}
     */
    rerender: function () {
        const attr = this.model.toJSON();

        this.$el.html(this.template(attr));
        if (this.model.get("isSettingVisible") === true) {
            this.$el.append(this.templateSettings(attr));
        }
        if (this.model.get("layerInfoChecked")) {
            this.highlightLayerInformationIcon();
        }
        this.setAllTabIndices();
    },

    /**
     * Executes setIsSettingVisible and setIsSelected in the model
     * removes the element
     * @returns {void}
     */
    removeFromSelection: function () {
        this.model.setIsSettingVisible(false);
        this.model.setIsSelected(false);
        this.$el.remove();
    },

    /**
     * Executes toggleIsVisibleInMap in the model
     * @returns {void}
     */
    toggleIsVisibleInMap: function () {
        this.model.toggleIsVisibleInMap();
        this.toggleColor(this.model, this.model.get("isOutOfRange"));
    }
});

export default LayerView;
