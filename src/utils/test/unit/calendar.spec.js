import {
    publicHolidayMatrix,
    getPublicHolidays,
    getGaussianEasterMoment,
    getFirstAdventMoment
} from "../../calendar.js";
import {expect} from "chai";

describe("src/utils/calendar.js", () => {
    describe("publicHolidayMatrix", () => {
        it("should be an object with holiday keys as strings containing objects with translationKey and getMoment function", () => {
            expect(publicHolidayMatrix).to.be.an("object");

            Object.entries(publicHolidayMatrix).forEach(([holidayKey, obj]) => {
                expect(holidayKey).to.be.a("string");
                expect(obj).to.be.an("object");
                expect(obj.translationKey).to.be.a("string");
                expect(obj.getMoment).to.be.a("function");
            });
        });
    });
    describe("getFirstAdventMoment", () => {
        it("should return the first advent of a given year", () => {
            const calendarMoment = getFirstAdventMoment(2021);

            expect(calendarMoment).to.be.an("object");
            expect(calendarMoment.format).to.be.a("function");
            expect(calendarMoment.format("YYYY-MM-DD")).to.equal("2021-11-28");
        });
    });
    describe("getGaussianEasterMoment", () => {
        it("should return easter sunday of a given year", () => {
            const calendarMoment = getGaussianEasterMoment(2021);

            expect(calendarMoment).to.be.an("object");
            expect(calendarMoment.format).to.be.a("function");
            expect(calendarMoment.format("YYYY-MM-DD")).to.equal("2021-04-04");
        });
    });
    describe("getPublicHolidays", () => {
        it("should return a list of CalendarMoment for the given year and holiday keys", () => {
            const publicHolidays = getPublicHolidays(2021, ["epiphany", "ascensionDay", "penanceDay"]);

            expect(publicHolidays).to.be.an("array").and.to.have.lengthOf(3);

            expect(publicHolidays[0]).to.be.an("object");
            expect(publicHolidays[0].moment).to.be.an("object");
            expect(publicHolidays[0].moment.format).to.be.a("function");
            expect(publicHolidays[0].moment.format("YYYY-MM-DD")).to.equal("2021-01-06");
            expect(publicHolidays[0].holidayKey).to.equal("epiphany");
            expect(publicHolidays[0].translationKey).to.equal("common:utils.calendar.epiphany");

            expect(publicHolidays[1]).to.be.an("object");
            expect(publicHolidays[1].moment).to.be.an("object");
            expect(publicHolidays[1].moment.format).to.be.a("function");
            expect(publicHolidays[1].moment.format("YYYY-MM-DD")).to.equal("2021-05-13");
            expect(publicHolidays[1].holidayKey).to.equal("ascensionDay");
            expect(publicHolidays[1].translationKey).to.equal("common:utils.calendar.ascensionDay");

            expect(publicHolidays[2]).to.be.an("object");
            expect(publicHolidays[2].moment).to.be.an("object");
            expect(publicHolidays[2].moment.format).to.be.a("function");
            expect(publicHolidays[2].moment.format("YYYY-MM-DD")).to.equal("2021-11-17");
            expect(publicHolidays[2].holidayKey).to.equal("penanceDay");
            expect(publicHolidays[2].translationKey).to.equal("common:utils.calendar.penanceDay");
        });
    });
});
