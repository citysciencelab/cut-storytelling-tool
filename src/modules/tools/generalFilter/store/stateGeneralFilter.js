/**
 * User type definition
 * @typedef {Object} generalFilter
 * @property {Boolean}  active - if true, component is rendered
 * @property {Boolean}  deactivateGFI - if true, component activation deactivates gfi component
 * @property {String}   glyphicon - icon next to title
 * @property {String}   id - internal id of component
 * @property {String}   name - Module name
 * @property {Boolean}  renderToWindow - if true, component is rendered in a window pane instead of sidebar
 * @property {Boolean}  resizableWindow - if true and if rendered to window pane, the pane is resizable
 */

export default {
    active: false,
    glyphicon: "glyphicon-filter",
    id: "generalFilter",
    name: "common:menu.tools.filter",
    renderToWindow: false,
    resizableWindow: true,
    deactivateGFI: false
};
