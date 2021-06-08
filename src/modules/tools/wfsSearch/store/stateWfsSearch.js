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
 * @property {Object[]} instances Array of search configurations. Each object contains the parameters literals, requestConfig and title and may also contain the parameters selectSource and userHelp. More information in the documentation.
 * @property {Number} currentInstanceIndex Position of the current search instance in the instances array.
 * @property {?JSON} parsedSource The requested and parsed selectSource.
 * @property {?Object} requiredValues The key value pairs for the required fields.
 * @property {String} userHelp IInformation text regarding the search formular to be displayed to the user.
 * @property {ol.Feature[]} results Current results of the search query.
 * @property {Object} selectedOptions The values of options which the user has entered / selected a value. The options here present are only the fields which had the parameter "options" as a String. The values inserted, have its "options" parameter as the key and the input as the value.
 * @property {?Object} service An object containing information about the WFS service, which will later be filtered.
 * @property {Boolean} showResultList Whether the modal containing the results should be shown.
 * @property {Boolean} valuesReset If the values are reset, no values should be set on a select element.
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
    deactivateGFI: true,
    initialWidth: 400,
    instances: [],
    // state parameters
    currentInstanceIndex: 0,
    parsedSource: null,
    requiredValues: null,
    userHelp: "",
    results: [],
    selectedOptions: {},
    service: null,
    showResultList: false,
    valuesReset: false
};

export default state;
