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
 * @property {Number} initialWidth Initial width of the tool window. (config-param)
 * @property {Object[]} clauses Array of clauses. (config-param)
 * @property {?String[]} remoteOptions Array of serviceIds. These services are prequeried for a field that doesn't have the parameter `options` set to make a suggestion for the input.
 * @property {?String} requestConfig The id of the service that is supposed to be requested. (config-param)
 * @property {?String} selectSource Optional Url leading to the expected options for the different inputs. (config-param)
 * @property {String} userHelp Information text regarding the search formular to be displayed to the user. (config-param)
 * @property {?JSON} parsedSource The requested and parsed selectSource.
 * @property {String[]} addedOptions List to keep track of the already added UI elements for the Literals.
 */
const state = {
    active: false,
    id: "wfsSearch",
    // defaults for config.json tool parameters
    name: "common:menu.tools.wfsSearch", // TODO: ADD ME
    glyphicon: "glyphicon-search",
    instances: [],
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: true,
    initialWidth: 300,
    clauses: [],
    remoteOptions: null,
    requestConfig: null,
    selectSource: null,
    userHelp: "",
    // state parameters
    parsedSource: null,
    addedOptions: []
};

export default state;
