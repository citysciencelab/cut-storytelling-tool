
const IdGenerator = Backbone.Model.extend({

    defaults: {
        menuItemTabIndex: 0,
        menuLayerItemId: 0
    },

    getNextMenuItemTabindex: function () {
        let menuItemTabIndex = this.get("menuItemTabIndex");

        menuItemTabIndex = menuItemTabIndex + 1;
        this.set("menuItemTabIndex", menuItemTabIndex);
        return menuItemTabIndex;
    },

    getNextMenuLayerItemId: function () {
        let menuLayerItemId = this.get("menuLayerItemId");

        menuLayerItemId = menuLayerItemId + 1;
        this.set("menuLayerItemId", menuLayerItemId);
        return menuLayerItemId;
    }
});

export default new IdGenerator();
