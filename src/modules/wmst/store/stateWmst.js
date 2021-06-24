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
        isMoving: false,
        swiper: null,
        targetLayer: null,
        valueX: ""
    }
};

export default state;
