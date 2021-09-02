import {expect} from "chai";
import findCurrentTimeSliderObject from "../../../utils/findCurrentTimeSliderObject";

describe("src/modules/wmsTime/utils/findCurrentTimeSliderObject.js", () => {
    let objects,
        currentLayerId;

    beforeEach(() => {
        objects = [];
        currentLayerId = "";
    });

    it("should return an empty object if no objects are present", () => {
        expect(findCurrentTimeSliderObject(currentLayerId, objects)).to.eql({});
    });
    it("should return an empty object if no layer is selected", () => {
        objects.push({});

        expect(findCurrentTimeSliderObject(currentLayerId, objects)).to.eql({});
    });
    it("should return an empty object if the given layerId does not belong to an object", () => {
        currentLayerId = "firstId";
        objects.push({defaultValue: 420, layerId: "secondId", step: 2, timeRange: [2, 4, 42, 420, 9000]});

        expect(findCurrentTimeSliderObject(currentLayerId, objects)).to.eql({});
    });
    it("should return the currently selected timeSliderObject if an object with the given layerId is present", () => {
        const obj = {defaultValue: 420, layerId: "layerId", step: 2, timeRange: [2, 4, 42, 420, 9000]};

        currentLayerId = "layerId";
        objects.push({layerId: "wrongId"}, obj);
        expect(findCurrentTimeSliderObject(currentLayerId, objects)).to.eql(obj);
    });
});
