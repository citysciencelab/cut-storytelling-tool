
export default {

    register: ({commit}, {key, getter, setter}) => {
        commit("addObserver", {key, getter, setter});
    }
};
