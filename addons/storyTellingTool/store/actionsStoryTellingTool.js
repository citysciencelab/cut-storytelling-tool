import storyCreatorActions from "./actions/storyCreatorActions";
import stateStoryTellingTool from "./stateStoryTellingTool";

const initialState = JSON.parse(JSON.stringify(stateStoryTellingTool)),
    actions = {
        ...storyCreatorActions,

        /**
         * Resets the Story Telling Tool.
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        resetModule ({commit}) {
            // Reset store data
            commit("setStoryConf", initialState.storyConf);
            commit("setHtmlContents", initialState.htmlContents);
            commit("setHtmlContentsImages", initialState.htmlContentsImages);
            commit("setInitialWidth", initialState.initialWidth);
        },

        /**
         * Resets the Story Telling Tool without deleting loaded stories
         *
         * @param {Object} context actions context object.
         * @returns {void}
         */
        resetCreatorContent ({commit}) {
            commit("setHtmlContents", initialState.htmlContents);
            commit("setHtmlContentsImages", initialState.htmlContentsImages);
            commit("setInitialWidth", initialState.initialWidth);
        }
    };

export default actions;
