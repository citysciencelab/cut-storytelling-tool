import {generateSimpleGetters} from "../../../app-store/utils/generators";
import initialState from "./stateWmsTime";
import createTimeRange from "../utils/createTimeRange";
import findCurrentTimeSliderObject from "../utils/findCurrentTimeSliderObject";

const getters = {
    ...generateSimpleGetters(initialState),
    // TimeSlider getters
    currentTimeSliderObject ({timeSlider: {objects, currentLayerId}}) {
        return findCurrentTimeSliderObject(objects, currentLayerId);
    },
    defaultValue (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject.defaultValue;
    },
    min (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject.min;
    },
    max (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject.max;
    },
    step (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject.step;
    },
    timeRange (_, {min, max, step}) {
        if (!min || !max || !step) {
            return [];
        }
        if (min > max) {
            throw Error(i18next.t("common:modules.wmsTime.timeSlider.invalidTimeParameters"));
        }

        return createTimeRange(min, max, step);
    }
};

export default getters;
