/**
 * User type definition
 * @typedef {Object} FooterState
 * @property {Boolean} showFooter Indicates whether the footer is displayed.
 * @property {Object[]} urls Array of URL configuration objects
 * @property {String} urls[].alias Name of the link for desktop playout.
 * @property {String} urls[].alias_mobil Name of the link for mobile application.
 * @property {String} urls[].bezeichnung Name before the link.
 * @property {String} urls[].url The URL to be called.
 * @property {String} urls[].toolModelId The id of the model whose tool should be opened, an url is then not necessary.
 * @property {Boolean} showVersionFlag if the version number of the Master Portal should be displayed in the footer.
 * @property {Object[]} footerInfo Array of inormation objects
 * @property {String} footerInfo[].title Title of InfoTab
 * @property {String} footerInfo[].description description of InfoTab
 * @property {Object[]} footerInfo[].subtexts Array of subtext objects
 * @property {String} footerInfo[].subtexts[].subtitle subtitle of subtext
 * @property {String} footerInfo[].subtexts[].text text of subtext
 * @property {String[]} infoTitles Array of InfoTab titles
 * @property {Array[]} infoSubtexts Array of InfoTab subtexts
 * @property {Number} infoShownDiv index of InfoTab
 */
const state = {
    showFooter: false,
    urls: [],
    showVersion: false,
    footerInfo: [],
    infoTitles: [],
    infoSubtexts: [],
    infoShownDiv: -1,
    isShortMenuOpen: false,
    seperator: "&nbsp;|&nbsp;"
};

export default state;
