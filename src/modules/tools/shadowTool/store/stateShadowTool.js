/**
 * Shadow tool state definition.
 * @typedef {Object} ContactState
 * @property {Boolean} active If true, SaveSelection will be rendered.
 * @property {String} id Id of the Contact component.
 * @property {String} name Displayed as the title. (config-param)
 * @property {String} icon Icon next to the title. (config-param)
 * @property {Boolean} renderToWindow If true, tool is rendered in a window, else in the sidebar. (config-param)
 * @property {Boolean} resizableWindow If true, window is resizable. (config-param)
 * @property {Boolean} isVisibleInMenu If true, tool is selectable in menu. (config-param)
 * @property {Boolean} deactivateGFI Flag determining if the tool should deactivate GFI. (config-param)
 * @property {Boolean} isShadowEnabled Flag determining if the tool should have shadow enabled initially. (config-param)
 * @property {Object} shadowTime Object to define start date and time. (config-param)
 */
const state = {
    active: false,
    id: "shadow",
    name: "common:menu.shadow",
    icon: "bi-lamp-fill",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true,
    isShadowEnabled: false,
    shadowTime: {}
};

export default state;
