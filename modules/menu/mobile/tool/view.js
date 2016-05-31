define([
    "backbone",
    "eventbus",
    "text!modules/menu/mobile/tool/template.html"
], function () {

    var Backbone = require("backbone"),
        EventBus = require("eventbus"),
        ItemTemplate = require("text!modules/menu/mobile/tool/template.html"),
        ItemView;

    ItemView = Backbone.View.extend({
        tagName: "li",
        className: "list-group-item",
        template: _.template(ItemTemplate),
        events: {
            "click": "checkItem"
        },
        render: function () {
            var attr = this.model.toJSON();

            this.$el.html(this.template(attr));
            return this;
        },
        checkItem: function () {
            if (this.model.getName() === "legend") {
                EventBus.trigger("toggleLegendWin");
            }
            else {
                this.model.setIsActive(true);
            }
            // Navigation wird geschlossen
            $("div.collapse.navbar-collapse").removeClass("in");
        }
    });

    return ItemView;
});
