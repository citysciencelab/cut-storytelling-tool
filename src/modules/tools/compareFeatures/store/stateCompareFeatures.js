/**
 * User type definition
 * @typedef {Object} CompareFeaturesState
 * @property {Boolean} active if true, compareFeatures will rendered
 * @property {String} id id of the CompareFeatures component
 * @property {String} name displayed as title (config-param)
 * @property {String} glyphicon icon next to title (config-param)
 * @property {Boolean} renderToWindow if true, tool is rendered in a window, else in sidebar (config-param)
 * @property {Boolean} resizableWindow if true, window is resizable (config-param)
 * @property {Boolean} isVisibleInMenu if true, tool is selectable in menu (config-param)
 * @property {Boolean} deactivateGFI flag if tool should deactivate gfi (config-param)
 */
const state = {
    active: false,
    id: "compareFeatures",
    layerFeatures: {},
    selectedLayer: "",
    showAlert: false,
    layerWithFeaturesToShow: [],
    hasMultipleLayers: false,
    showMoreInfo: false,
    preparedList: {},
    emptyStar: "<span class=\"glyphicon glyphicon-star-empty\"></span>",
    yellowStar: "<span class=\"glyphicon glyphicon-star\"></span>",
    // defaults for config.json parameters
    name: "common:menu.tools.compareFeatures",
    glyphicon: "glyphicon-th-list",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false
};

export default state;
