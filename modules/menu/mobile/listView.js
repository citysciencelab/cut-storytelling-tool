import FolderView from "./folder/view";
import LayerView from "./layer/view";
import LayerViewLight from "./layer/viewLight";
import ToolView from "./tool/view";
import StaticLinkView from "./staticlink/view";
import BreadCrumbListView from "./breadCrumb/listView";
import "jquery-ui/ui/effects/effect-slide";
import "jquery-ui/ui/effect";
import Dropdown from "bootstrap/js/dist/dropdown";
import "bootstrap/js/dist/collapse";
import store from "../../../src/app-store";


const MobileMenu = Backbone.View.extend({
    initialize: function () {
        this.collection = Radio.request("ModelList", "getCollection");
        Radio.on("Autostart", "startModul", this.startModul, this);
        this.listenTo(this.collection, {
            "traverseTree": this.traverseTree,
            "changeSelectedList": function () {
                if (Radio.request("Parser", "getTreeType") === "light") {
                    this.updateLightTree();
                }
                else {
                    this.renderSelection(false);
                }
            }
        });
        this.render();
        this.breadCrumbListView = new BreadCrumbListView();
    },
    collection: {},
    el: "nav#main-nav",
    attributes: {role: "navigation"},
    breadCrumbListView: {},
    rootModelsOrder: [],
    render: function () {
        const rootModels = this.collection.where({parentId: "root"});

        $("div.collapse.navbar-collapse ul.nav-menu").removeClass("nav navbar-nav desktop");
        $("div.collapse.navbar-collapse ul.nav-menu").addClass("list-group mobile");
        rootModels.forEach(model => this.rootModelsOrder.push(model.get("id")));
        this.addViews(rootModels);
        store.dispatch("Legend/setShowLegendInMenu", true);
        return this;
    },
    traverseTree: function (model) {
        if (model.get("isExpanded")) {
            if (model.get("id") === "SelectedLayer") {
                this.renderSelection(true);
            }
            else {
                this.descentInTree(model);
            }
            this.breadCrumbListView.collection.addItem(model);
        }
        else {
            this.ascentInTree(model);
        }
    },

    updateLightTree: function () {
        const lightModels = Radio.request("Parser", "getItemsByAttributes", {parentId: "tree"});
        let models = [];

        models = this.collection.add(lightModels);

        models.sort((layerA, layerB) => layerA.get("selectionIDX") - layerB.get("selectionIDX")).reverse();

        models.forEach(model => {
            model.setIsVisibleInTree(false);
        });

        this.addViews(models);
    },

    renderSelection: function (withAnimation) {
        const models = this.collection.where({isSelected: true, type: "layer"});

        if (withAnimation) {
            this.slideModels("descent", models, "tree", "Selection");
        }
        else {
            // Views löschen um doppeltes Zeichnen zu vermeiden
            models.forEach(model => {
                model.setIsVisibleInTree(false);
            });

            models.sort((layerA, layerB) => layerA.get("selectionIDX") - layerB.get("selectionIDX")).reverse();

            this.addViews(models);
        }
    },

    descentInTree: function (model) {
        const lightModels = Radio.request("Parser", "getItemsByAttributes", {parentId: model.get("id")}),
            models = this.collection.add(lightModels);

        this.slideModels("descent", models, model.get("parentId"));
    },

    ascentInTree: function (model) {
        const models = this.collection.where({parentId: model.get("parentId")});

        model.setIsVisibleInTree(false);
        this.slideModels("ascent", models, model.get("id"));
    },

    slideModels: function (direction, modelsToShow, parentIdOfModelsToHide, currentList) {
        const that = this;
        let slideIn,
            slideOut,
            groupedModels;

        if (direction === "descent") {
            slideIn = "right";
            slideOut = "left";
        }
        else {
            slideIn = "left";
            slideOut = "right";
        }

        $("div.collapse.navbar-collapse ul.nav-menu").effect("slide", {direction: slideOut, duration: 200, mode: "hide"}, function () {

            that.collection.setModelsInvisibleByParentId(parentIdOfModelsToHide);
            if (currentList === "Selection") {
                modelsToShow.sort((layerA, layerB) => layerA.get("selectionIDX") - layerB.get("selectionIDX")).reverse();
                that.addViews(modelsToShow);
            }
            else {
                let modelsSorted = [];

                // group by folder und other
                groupedModels = Radio.request("Util", "groupBy", modelsToShow, function (model) {
                    return model.get("type") === "folder" ? "folder" : "other";
                });
                // in default-Tree folder and layer are sorted alphabetical
                if (Radio.request("Parser", "getTreeType") === "default" && modelsToShow[0].get("parentId") !== "tree") {
                    if (groupedModels.folder) {
                        groupedModels.folder.sort((itemA, itemB) => itemA.get("name") - itemB.get("name"));
                    }
                    if (groupedModels.other) {
                        groupedModels.other.sort((itemA, itemB) => itemA.get("name") - itemB.get("name"));
                    }
                    modelsSorted = groupedModels.folder ? groupedModels.folder.concat(groupedModels.other) : [].concat(groupedModels.other);
                }
                else {
                    const allModels = groupedModels.folder ? groupedModels.folder.concat(groupedModels.other) : [].concat(groupedModels.other);

                    if (modelsToShow[0].get("parentId") === "root") {
                        that.rootModelsOrder.forEach(id => {
                            modelsSorted.push(allModels.find(model => model.id === id));
                        });
                    }
                    else {
                        modelsSorted = allModels;
                    }
                }
                that.addViews(modelsSorted);
                if (modelsToShow.length > 0 && modelsToShow[0].get("parentId") === "root") {
                    store.dispatch("Legend/setShowLegendInMenu", true);
                }
                else {
                    store.dispatch("Legend/setShowLegendInMenu", false);
                }
            }
        });
        $("div.collapse.navbar-collapse ul.nav-menu").effect("slide", {direction: slideIn, duration: 200, mode: "show"});
    },

    doRequestTreeType: function () {
        return Radio.request("Parser", "getTreeType");
    },

    doAppendNodeView: function (nodeView) {
        $("div.collapse.navbar-collapse ul.nav-menu").append(nodeView.render().el);
    },

    /**
     * separates by modelType and add Views
     * add only tools that have the attribute "isVisibleInMenu" === true
     * @param {Item[]} models - all models
     * @returns {void}
     */
    addViews: function (models) {
        const treeType = this.doRequestTreeType(),
            newModels = models.filter(model => !(model.get("onlyDesktop") === true));

        let nodeView,
            attr;

        newModels.forEach(model => {
            model.setIsVisibleInTree(true);

            switch (model.get("type")) {
                case "folder": {
                    attr = model.toJSON();

                    if (attr.isExpanded && !attr.isFolderSelectable) {
                        // if the selectAll-checkbox should be hidden: don't add folder-view
                        // for expanded leaf-folder -> omit empty group item.
                        return;
                    }

                    nodeView = new FolderView({model: model});

                    break;
                }
                case "tool": {
                    if (model.get("isVisibleInMenu")) {
                        nodeView = new ToolView({model: model});
                    }
                    else {
                        return;
                    }
                    break;
                }
                case "staticlink": {
                    nodeView = new StaticLinkView({model: model});
                    break;
                }
                case "layer": {
                    if (!model.get("isNeverVisibleInTree")) {
                        nodeView = treeType === "light" ? new LayerViewLight({model: model}) : new LayerView({model: model});
                        break;
                    }
                    else {
                        return;
                    }
                }
                default: {
                    return;
                }
            }
            this.doAppendNodeView(nodeView);
        });
    },

    /**
     * Entfernt diesen ListView und alle subViews
     * @returns {void}
     */
    removeView: function () {
        this.$el.find("ul.nav-menu").html("");

        this.breadCrumbListView.removeView();
        this.remove();
        this.collection.setAllModelsInvisible();
        this.$("#map").before(this.el);
    },
    startModul: function (modulId) {
        const modul = this.collection.find(function (model) {
            return model.get("id").toLowerCase() === modulId;
        });

        if (modul.get("type") === "tool") {
            modul.setIsActive(true);
        }
        else {
            // Upgrade to BT5, use JS method instead of class addition
            const dropdown = Dropdown.getOrCreateInstance($("#" + modulId).parent().children(".dropdown-toggle").get(0));

            dropdown.show();
        }
    }
});

export default MobileMenu;
