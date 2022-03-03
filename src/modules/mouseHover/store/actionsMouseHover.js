
export default {
    /**
     * Sets the config-params of this MouseHover into state.
     * @returns {void}
     */
    initialize: ({commit}) => {
        const {numFeaturesToShow, infoText} = Config.mouseHover;

        commit("setNumFeaturesToShow", numFeaturesToShow);
        commit("setInfoText", infoText);
    }
};
