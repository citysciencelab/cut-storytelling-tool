import {generateSimpleGetters} from "../../../app-store/utils/generators";
import initialState from "./stateWmsTime";
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
    min (_, {timeRange}) {
        return timeRange.length > 0 ? timeRange[0] : 0;
    },
    max (_, {timeRange}) {
        return timeRange.length > 0 ? timeRange[timeRange.length - 1] : Number.MAX_SAFE_INTEGER;
    },
    step (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject.step;
    },
    timeRange (_, {currentTimeSliderObject}) {
        return currentTimeSliderObject?.timeRange ? currentTimeSliderObject.timeRange : [];
    }
};

export default getters;
