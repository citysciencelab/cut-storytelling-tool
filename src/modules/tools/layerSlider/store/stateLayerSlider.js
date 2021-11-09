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
    sliderType: "player",
    layerIds: [],
    activeLayer: {layerId: ""},
    title: "common:modules.tools.layerSlider.title"
};

export default state;
