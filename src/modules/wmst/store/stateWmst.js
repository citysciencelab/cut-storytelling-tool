const state = {
    timeSlider: {
        active: false,
        layerId: "",
        defaultValue: 0,
        min: 0,
        max: 0,
        step: 0
    },
    layerSwiper: {
        active: false,
        id: "layerSwiper",
        name: "controls.layerSwiper.title",
        isMoving: false,
        swiper: {},
        valueX: "",
        targetLayer: {},
        mapObject: {}
    }
};

export default state;
