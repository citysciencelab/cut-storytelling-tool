/**
 * WfsTransaction tool state definition.
 * @typedef {object} WfsTransactionState
 * @type {object}
 * @property {string} id Unique identifier of the store.
 * @property {boolean} active Whether the tool is currently active.
 * @property {string} name Title of the tool.
 * @property {string} icon Icon used together with `name`.
 */
const state = {
    id: "wfsTransaction",
    // Configuration
    active: false,
    name: "WfsTransaction",
    icon: "bi-globe"
};

export default state;
