/**
 * WfsSearch tool state definition.
 * @typedef {Object} WfsSearchState
 * @property {Boolean} active if true, WfsSearch will be rendered.
 * @property {String} id id of the WfsSearch component.
 * @property {String} name Displayed as the title. (config-param)
 * @property {String} glyphicon Icon next to the title. (config-param)
 * @property {Boolean} renderToWindow If true, tool is rendered in a window, else in the sidebar. (config-param)
 * @property {Boolean} resizableWindow If true, window is resizable. (config-param)
 * @property {Boolean} isVisibleInMenu If true, tool is selectable in menu. (config-param)
 * @property {Boolean} deactivateGFI Flag if tool should deactivate GFI. (config-param)
 */
const state = {
    active: false,
    id: "wfsSearch",
    // defaults for config.json tool parameters
    name: "common:menu.tools.wfsSearch",
    glyphicon: "glyphicon-search",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true
};

export default state;
