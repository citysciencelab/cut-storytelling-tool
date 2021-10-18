/**
 * Print Tool
 * @typedef {Object} PrintState
 * @property {Boolean} active if true, print tool will rendered
 */
const state = {
    active: false,
    name: "common:menu.tools.print",
    id: "print",
    printSettings: "",
    renderToWindow: false,
    resizableWindow: true,
    deactivateGFI: false,
    // output filename
    filename: "report",
    // the id from the rest services json for the mapfish app
    mapfishServiceId: undefined,
    // the identifier of one of the available mapfish print configurations
    printAppId: "master",
    // available layouts of the specified print configuration
    layoutList: [],
    currentLayout: undefined,
    currentLayoutName: "",
    // available formats of the specified print configuration
    formatList: [],
    currentFormat: "pdf",
    scaleList: [],
    // current print scale
    currentScale: undefined,
    // title for the report
    title: "PrintResult",
    // is scale selected by the user over the view
    isScaleSelectedManually: false,
    // true if the current layout supports meta data
    isMetadataAvailable: false,
    metadataAttribute: null,
    // true if the current layout supports gfi
    isGfiAvailable: false,
    gfiAttribute: null,
    // true if gfi is to be printed
    isGfiSelected: false,
    // true if gfi is active
    isGfiActive: false,
    gfiForPrint: null,
    // true if the current layout supports legend
    isLegendAvailable: false,
    legendAttribute: null,
    // true if the legend is to be printed
    isLegendSelected: false,
    // true if the current layout supports scale
    isScaleAvailable: false,
    scaleAttribute: null,
    isMapAvailable: false,
    mapAttribute: null,
    layoutMapInfo: null,
    optimalScale: null,
    // the id from the rest services json for the plot app
    plotServiceId: undefined,
    DOTS_PER_INCH: 72,
    INCHES_PER_METER: 39.37,
    glyphicon: "glyphicon-print",
    eventListener: undefined,
    dpiForPdf: 300,
    layoutNameList: [],
    currentMapScale: "",
    optimalResolution: "",
    hintInfoScale: "",
    visibleLayer: [],
    invisibleLayer: [],
    visibleLayerList: [],
    zoomLevel: null,
    hintInfo: "",
    mapfishServiceUrl: "",
    printFileReady: false,
    printStarted: false,
    progressWidth: "width: 0%",
    fileDownloadUrl: "",
    /**
     * @deprecated in the next major-release!
     * useProxy
     */
    useProxy: false
};

export default state;
