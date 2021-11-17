import TemplateSearch from "text-loader!./templateSearch.html";
import TemplateTree from "text-loader!./templateTree.html";
import TemplateMeasureTool from "text-loader!./templateMeasureTool.html";
import TemplateRoutingTool from "text-loader!./templateRoutingTool.html";
import QuickHelpModel from "./model";
import "jquery-ui/ui/widgets/draggable";
import store from "../../src/app-store";

/**
 * @member TemplateSearch
 * @description Template used to create the quickHelp for Search
 * @memberof QuickHelp
 */

/**
 * @member TemplateTree
 * @description Template used to create the quickHelp for Tree Search
 * @memberof QuickHelp
 */

/**
 * @member TemplateMeasureTool
 * @description Template used to create the quickHelp for the measure tool
 * @memberof QuickHelp
 */

/**
 * @member TemplateRoutingTool
 * @description Template used to create the quickHelp for the routing tool
 * @memberof QuickHelp
 */
const QuickHelpView = Backbone.View.extend(/** @lends QuickHelpView.prototype */{
    events: {
        "click .glyphicon-remove": "removeWindowClicked",
        "click .glyphicon-print": "printHelp"
    },

    /**
     * Initialises the QuickHelp
     * @class QuickHelpView
     * @extends Backbone.View
     * @memberof QuickHelp
     * @constructs
     * @param   {boolean | object} attr Configuration
     * @deprecated Boolean-Examines if true. Deprecated in Version 3.0 due to dedicated path pass
     * @listens QuickHelp#RadioTriggerQuickHelpShowWindowHelp
     * @listens QuickHelp#RadioRequestQuickHelpIsSet
     * @listens QuickHelp#render
     * @returns {void}
     */
    initialize: function (attr) {
        const channel = Radio.channel("QuickHelp");

        if (attr === true || attr instanceof Object) {
            this.model = new QuickHelpModel(attr);

            channel.on({
                "showWindowHelp": this.showWindow
            }, this);

            channel.on({
                "closeWindowHelp": this.removeWindow
            }, this);

            channel.reply({
                "isSet": true
            });

            this.render();

            this.$el.draggable({
                containment: "#map",
                handle: ".header"
            });
            this.listenTo(this.model, {
                "change:currentLng": function () {
                    this.rerender();
                }
            });
        }
    },
    templateSearch: _.template(TemplateSearch),
    templateTree: _.template(TemplateTree),
    templateMeasureTool: _.template(TemplateMeasureTool),
    templateRoutingTool: _.template(TemplateRoutingTool),
    className: "quick-help-window ui-widget-content",

    /**
     * Renders the data to DOM.
     * @return {QuickHelp} returns this
     */
    render: function () {
        $("body").append(this.$el);
        return this;
    },

    /**
     * rerenders the window
     * @returns {void}
     */
    rerender: function () {
        const value = this.model.get("currentHelpTopic"),
            attr = this.model.toJSON();

        switch (value) {
            case "search": {
                this.$el.html(this.templateSearch(attr));
                break;
            }
            case "tree": {
                this.$el.html(this.templateTree(attr));
                break;
            }
            case "measure": {
                this.$el.html(this.templateMeasureTool(attr));
                break;
            }
            case "routing": {
                this.$el.html(this.templateRoutingTool(attr));
                break;
            }
            default: {
                break;
            }
        }
    },

    /**
     * Remove the window
     * @return {void}
     */
    removeWindow: function () {
        this.$el.hide("slow");
        store.commit("QuickHelp/setActive", false);
    },

    /**
     * Handler for remove window click.
     * @return {void}
     */
    removeWindowClicked: function () {
        this.removeWindow();
        Radio.trigger("QuickHelp", "closeWindowHelp");
    },

    /**
     * showWindow
     * @param {String} value Type of window (search | tree | measure | routing)
     * @returns {void}
     */
    showWindow: function (value) {
        const attr = this.model.toJSON();

        switch (value) {
            case "search": {
                this.$el.html(this.templateSearch(attr));
                break;
            }
            case "tree": {
                this.$el.html(this.templateTree(attr));
                break;
            }
            case "measure": {
                this.$el.html(this.templateMeasureTool(attr));
                break;
            }
            case "routing": {
                this.$el.html(this.templateRoutingTool(attr));
                break;
            }
            default: {
                break;
            }
        }
        this.model.setCurrentHelpTopic(value);
        this.$el.show("slow");
        store.commit("QuickHelp/setActive", true);
    },

    /**
     * Opens the print window
     * @return {void}
     */
    printHelp: function () {
        const htmlToPrint = document.getElementsByClassName("quick-help-window")[0],
            newWin = window.open("");

        newWin.document.write(htmlToPrint.outerHTML);
        newWin.print();
    }
});

export default QuickHelpView;
