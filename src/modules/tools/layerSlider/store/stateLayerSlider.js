const state = {
    active: false,
    id: "layerSlider",
    name: "common:menu.tools.layerSlider",
    glyphicon: "glyphicon-film",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false,

    timeInterval: 2000,
    windowsInterval: null,
    progressBarWidth: 0,
    currentProgressBarWidth: "width: 0%; margin-left: 0%",
    sliderType: "player",
    layerIds: [],
    activeLayer: {
        layerId: "",
        index: -1
    },
    title: "common:modules.tools.layerSlider.title"
};

export default state;
