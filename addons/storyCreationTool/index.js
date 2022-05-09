import StoryCreationToolComponent from "./components/StoryCreationTool.vue";
import StoryCreationToolStore from "./store/StoryCreationTool";
import deLocale from "./locales/de/additional.json";
import enLocale from "./locales/en/additional.json";

export default {
    component: StoryCreationToolComponent,
    store: StoryCreationToolStore,
    locales: {
        de: deLocale,
        en: enLocale
    }
};
