define([
    "backbone",
    "backbone.radio",
    "text!modules/menu/mobile/layer/template.html",
    "text!modules/menu/mobile/layer/templateSelection.html",
    "text!modules/menu/mobile/layer/templateSettings.html"
], function () {

    var Backbone = require("backbone"),
        Template = require("text!modules/menu/mobile/layer/template.html"),
        SelectionTemplate = require("text!modules/menu/mobile/layer/templateSelection.html"),
        SettingsTemplate = require("text!modules/menu/mobile/layer/templateSettings.html"),
        Radio = require("backbone.radio"),
        LayerView;

    LayerView = Backbone.View.extend({
        tagName: "li",
        className: "list-group-item",
        template: _.template(Template),
        templateSelected: _.template(SelectionTemplate),
        templateSetting: _.template(SettingsTemplate),
        events: {
            "click .layer-item": "toggleIsSelected",
            "click .layer-info-item > .glyphicon-info-sign": "showLayerInformation",
            "click .selected-layer-item > .glyphicon-remove": "removeFromSelection",
            "click .selected-layer-item > div": "toggleIsVisibleInMap",
            "click .layer-info-item > .glyphicon-cog": "toggleIsSettingVisible",
            "click .layer-sort-item > .glyphicon-triangle-top": "moveModelUp",
            "click .layer-sort-item > .glyphicon-triangle-bottom": "moveModelDown",
            "change select": "setTransparency",
            "click .glyphicon-picture": "openStyleWMS"
        },
        initialize: function () {
            this.listenTo(this.model, {
                 "change:isSelected change:isVisibleInMap": this.render,
                 "change:isSettingVisible": this.renderSetting,
                 "change:isVisibleInTree": this.removeIfNotVisible
            });
        },

        render: function () {
            var attr = this.model.toJSON();

            if (Radio.request("BreadCrumb", "getLastItem").getId() === "SelectedLayer") {
                this.$el.html(this.templateSelected(attr));
                if (this.model.getIsSettingVisible() === true) {
                    this.renderSetting();
                }
            }
            else {
                this.$el.html(this.template(attr));
            }

            return this;
        },

        /**
         * Zeichnet die Einstellungen (Transparenz, Metainfos, ...)
         */
        renderSetting: function () {
            var attr = this.model.toJSON();

            // Animation Zahnrad
            this.$(".glyphicon-cog").toggleClass("rotate rotate-back");
            // Slide-Animation templateSetting
            if (this.model.getIsSettingVisible() === false) {
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

        toggleIsSelected: function () {
            this.model.toggleIsSelected();
            Radio.trigger("ModelList", "setIsSelectedOnParent", this.model);
            this.render();
        },

        removeFromSelection: function () {
            this.model.setIsSettingVisible(false);
            this.model.setIsSelected(false);
            this.$el.remove();
        },

        toggleIsVisibleInMap: function () {
            this.model.toggleIsVisibleInMap();
        },

        showLayerInformation: function () {
            this.model.showLayerInformation();
            // Navigation wird geschlossen
            $("div.collapse.navbar-collapse").removeClass("in");
        },

        toggleIsSettingVisible: function () {
            this.model.toggleIsSettingVisible();
        },

        setTransparency: function (evt) {
            this.model.setTransparency(parseInt(evt.target.value, 10));
        },

        moveModelDown: function () {
            this.model.moveDown();
        },

        moveModelUp: function () {
            this.model.moveUp();
        },
        removeIfNotVisible: function () {
            if (!this.model.getIsVisibleInTree()) {
                this.remove();
            }
        },
        openStyleWMS: function () {
            Radio.trigger("StyleWMS", "openStyleWMS", this.model);
            $(".navbar-collapse").removeClass("in");
        }

    });

    return LayerView;
});