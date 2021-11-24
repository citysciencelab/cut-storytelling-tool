
/**
 * User type definition
 * @typedef {Object} QuickHelpState
 * @property {Boolean} active if true, quickhelp is rendered
 * @property {String} [quickHelpKey="search"] the key to use for the content (e.g. "search", "tree", or anything configured in config.json)
 * @property {Boolean|Object} search if true the default for search quickHelp is used, if false not, or an object activates internal override
 * @property {Boolean|Object} tree if true the default for tree quickHelp is used, if false not, or an object activates internal override
 */
const state = {
    active: false,
    quickHelpKey: "search",

    configs: {
        search: true,
        tree: true,
        routing: true
    }
};

export default state;
