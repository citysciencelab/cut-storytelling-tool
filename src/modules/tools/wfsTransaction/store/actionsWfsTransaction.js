const actions = {
    setActive ({commit}, active) {
        commit("setActive", active);

        if (active) {
            // TODO(roehlipa): Do needed setup
        }
        else {
            // TODO(roehlipa): Reset module
        }
    }
};

export default actions;
