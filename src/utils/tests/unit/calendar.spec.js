import {
    hasHolidayInWeek,
    publicHolidayMatrix,
    getPublicHoliday,
    getPublicHolidays,
    isCalendarMoment,
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
    it("should return easter sunday of a given year if a string year is given", () => {
        const calendarMoment = getGaussianEasterMoment("2021");

        expect(calendarMoment).to.be.an("object");
        expect(calendarMoment.format).to.be.a("function");
        expect(calendarMoment.format("YYYY-MM-DD")).to.equal("2021-04-04");
    });
    describe("isCalendarMoment", () => {
        it("should return false if the given param is not a CalendarMoment", () => {
            expect(isCalendarMoment(undefined)).to.be.false;
            expect(isCalendarMoment(null)).to.be.false;
            expect(isCalendarMoment("string")).to.be.false;
            expect(isCalendarMoment(12345)).to.be.false;
            expect(isCalendarMoment(true)).to.be.false;
            expect(isCalendarMoment(false)).to.be.false;
            expect(isCalendarMoment([])).to.be.false;
            expect(isCalendarMoment({})).to.be.false;
        });
        it("should return true if the given param is a CalendarMoment", () => {
            expect(isCalendarMoment({
                translationKey: "translationKey",
                getMoment: () => true
            })).to.be.true;
        });
    });
    describe("getPublicHoliday", () => {
        it("should return false if the given date is not a holiday", () => {
            const date = "2021-01-06",
                holidays = ["newYearsDay"],
                result = getPublicHoliday(date, holidays, "YYYY-MM-DD");

            expect(result).to.be.false;
        });
        it("should return a CalendarMoment if the given date is a holiday", () => {
            const date = "2021-01-06",
                holidays = ["epiphany"],
                result = getPublicHoliday(date, holidays, "YYYY-MM-DD");

            expect(result).to.be.an("object");
            expect(result.moment).to.be.an("object");
            expect(result.moment.format).to.be.a("function");
            expect(result.moment.format("YYYY-MM-DD")).to.equal("2021-01-06");
            expect(result.holidayKey).to.equal("epiphany");
            expect(result.translationKey).to.equal("common:utils.calendar.epiphany");
        });
    });
    describe("getPublicHolidays", () => {
        it("should return a list of CalendarMoment for the given year and holiday keys", () => {
            const publicHolidays = getPublicHolidays(2021, ["epiphany", "ascensionDay", "penanceDay", "newYearsEve"]);

            expect(publicHolidays).to.be.an("array").and.to.have.lengthOf(4);

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

            expect(publicHolidays[3]).to.be.an("object");
            expect(publicHolidays[3].moment).to.be.an("object");
            expect(publicHolidays[3].moment.format).to.be.a("function");
            expect(publicHolidays[3].moment.format("YYYY-MM-DD")).to.equal("2021-12-31");
            expect(publicHolidays[3].holidayKey).to.equal("newYearsEve");
            expect(publicHolidays[3].translationKey).to.equal("common:utils.calendar.newYearsEve");
        });
    });
    describe("hasHolidayInWeek", () => {
        it("should return false if anything but a date object or a date string is given", () => {
            expect(hasHolidayInWeek(undefined)).to.be.false;
            expect(hasHolidayInWeek(null)).to.be.false;
            expect(hasHolidayInWeek(12345)).to.be.false;
            expect(hasHolidayInWeek(true)).to.be.false;
            expect(hasHolidayInWeek(false)).to.be.false;
            expect(hasHolidayInWeek([])).to.be.false;
            expect(hasHolidayInWeek({})).to.be.false;
        });
        it("should return false if the given date and format are leading to an invalid date", () => {
            expect(hasHolidayInWeek("01.01.2021", false, "YYYY-MM-DD")).to.be.false;
        });
        it("should return false if no holiday is in the given week and the date is a monday", () => {
            expect(hasHolidayInWeek("2021-01-11", ["epiphany"], "YYYY-MM-DD")).to.be.false;
        });
        it("should return true if a holiday is in the given week and the date is a monday", () => {
            expect(hasHolidayInWeek("2021-01-04", ["epiphany"], "YYYY-MM-DD")).to.be.true;
        });
        it("should check a week with a holiday if the given date is not a monday", () => {
            expect(hasHolidayInWeek("2021-01-07", ["epiphany"], "YYYY-MM-DD")).to.be.true;
        });
    });
});
