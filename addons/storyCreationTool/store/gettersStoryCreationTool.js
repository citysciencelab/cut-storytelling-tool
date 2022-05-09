import {generateSimpleGetters} from "../../../src/app-store/utils/generators";
import storyCreationToolState from "./stateStoryCreationTool";

const getters = {
    ...generateSimpleGetters(storyCreationToolState)
};

export default getters;
