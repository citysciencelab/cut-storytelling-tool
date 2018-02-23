define(function (require) {

    var ThemeView = require("modules/tools/gfi/themes/view"),
        ElektroladesaeulenThemeTemplate = require("text!modules/tools/gfi/themes/elektroladesaeulen/template.html"),
        ElektroladesaeulenThemeView;

    ElektroladesaeulenThemeView = ThemeView.extend({
        tagName: "div",
        className: "ladesaeulen",
        template: _.template(ElektroladesaeulenThemeTemplate),
        events: {
            "click .tab-toggle": "toggleTab"
        },

        toggleTab: function (evt) {
            // delete all graphs
            $(".ladesaeulenVerfuegbar-graph svg").remove();
            $(".ladesaeulenBelegt-graph svg").remove();

            var contentId = $(evt.currentTarget).attr("value");

            // deactivate all tabs and their contents
            $(evt.currentTarget).parent().find("li").each(function (index, li) {
                var tabContentId = $(li).attr("value");

                $(li).removeClass("active");
                $("#" + tabContentId).removeClass("active");
                $("#" + tabContentId).removeClass("in");
            });

            // activate selected tab and its content
            $(evt.currentTarget).addClass("active");
            $("#" + contentId).addClass("active");
            $("#" + contentId).addClass("in");

            if (contentId === "diagrammVerfuegbar") {
                this.loadDiagramm("available", ".ladesaeulenVerfuegbar-graph");
            }
            else if (contentId === "diagrammBelegt") {
                this.loadDiagramm("charging", ".ladesaeulenBelegt-graph");
            }
        },

        loadDiagramm: function (state, graphTag) {
            this.model.createD3Document(state, graphTag);
        }
    });

    return ElektroladesaeulenThemeView;
});
