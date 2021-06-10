const actions = {
    toggleSwiper ({commit, state}) {
        commit("setSwiperActive", !state.swiper.active);

        if (state.swiper.active) {
            // TODO: Add a second layer which will then be updated from the other tool
        }
    }
};

export default actions;
