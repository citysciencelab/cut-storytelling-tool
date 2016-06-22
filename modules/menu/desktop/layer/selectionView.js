define([
    "backbone",
    "text!modules/menu/desktop/layer/templateSelected.html",
    "text!modules/menu/desktop/layer/templateSetting.html"
], function () {

    var Backbone = require("backbone"),
        SelectedLayerTemplate = require("text!modules/menu/desktop/layer/templateSelected.html"),
        SettingTemplate = require("text!modules/menu/desktop/layer/templateSetting.html"),
        LayerView;

    LayerView = Backbone.View.extend({
        tagName: "li",
        className: " layer-item",
        //template: _.template(LayerTemplate),
        template: _.template(SelectedLayerTemplate),
        templateSetting: _.template(SettingTemplate),
        events: {
            "click .glyphicon-check": "toggleIsVisibleInMap",
            "click .glyphicon-unchecked": "toggleIsVisibleInMap",
            "click .glyphicon-info-sign": "showLayerInformation",
            "click .glyphicon-remove-circle": "removeFromSelection",
            "click .layer-info-item  .glyphicon-cog": "toggleIsSettingVisible",
            "click .arrows > .glyphicon-arrow-up": "moveModelUp",
            "click .arrows > .glyphicon-arrow-down": "moveModelDown",
            "change select": "setTransparence"
        },
        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html("");
            var selector = $("ul#SelectedLayer"),
                attr = this.model.toJSON(),
                template = this.template(attr);

            if (this.model.getIsSettingVisible() === true) {
                template = this.templateSetting(attr);
            }
            if (this.model.getIsSelected()) {
                selector.prepend(this.$el.html(template));
            }
        },
        rerender: function () {
            this.$el.html("");
            var attr = this.model.toJSON(),
                template = this.template(attr);

            if (this.model.getIsSettingVisible() === true) {
                template = this.templateSetting(attr);
            }
            this.$el.html(template);
        },

        toggleIsSelected: function () {
            this.model.toggleIsSelected();
        },

        removeFromSelection: function () {
            this.model.setIsSettingVisible(false);
            this.model.setIsSelected(false);
            this.$el.remove();
        },

        toggleIsVisibleInMap: function () {
            this.model.toggleIsVisibleInMap();
            this.rerender();
        },

        showLayerInformation: function () {
            this.model.showLayerInformation();
            // Navigation wird geschlossen
            $("div.collapse.navbar-collapse").removeClass("in");
        },

        toggleIsSettingVisible: function () {
            this.model.toggleIsSettingVisible();
            this.rerender();
        },

        setTransparence: function (evt) {
            this.model.setTransparence(parseInt(evt.target.value, 10));
        },

        moveModelDown: function () {
            this.model.moveDown();
        },

        moveModelUp: function () {
            this.model.moveUp();
        },
        updateSelectionView: function () {

        }
    });

    return LayerView;
});
