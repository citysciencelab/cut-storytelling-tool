import moment from "moment";

/**
 * library for calendar functions
 *   public holidays
 */

/**
 * CalendarMoment is a date object returned by functions of this library with start and end date and translation
 * @typedef {Object} CalendarMoment
 * @property {Object} moment the representation of the date as moment object
 * @property {Object} [momentEnd=null] in case of a range of days (e.g. school vacations) the representation of the end date as moment object
 * @property {String} holidayKey the config key of the holiday (see key list below)
 * @property {String} translationKey the key to request the translation for the holiday/vacation
 */

/**
 * set of public holidays - to extent add anchor day to getMoment function
 * use locals/xx/common.json to add translations
 * getMoment is a function (Number year, Object easterMoment, Object adventMoment) returning a moment object
 */
const publicHolidayMatrix = {
    newYearsDay: {
        translationKey: "common:utils.calendar.newYearsDay",
        getMoment: (year) => {
            return moment(year + "-01-01", "YYYY-MM-DD");
        }
    },
    epiphany: {
        translationKey: "common:utils.calendar.epiphany",
        getMoment: (year) => {
            return moment(year + "-01-06", "YYYY-MM-DD");
        }
    },
    goodFriday: {
        translationKey: "common:utils.calendar.goodFriday",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).subtract(2, "days");
        }
    },
    easterSunday: {
        translationKey: "common:utils.calendar.easterSunday",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment);
        }
    },
    easterMonday: {
        translationKey: "common:utils.calendar.easterMonday",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).add(1, "days");
        }
    },
    laborDay: {
        translationKey: "common:utils.calendar.laborDay",
        getMoment: (year) => {
            return moment(year + "-05-01", "YYYY-MM-DD");
        }
    },
    ascensionDay: {
        translationKey: "common:utils.calendar.ascensionDay",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).add(39, "days");
        }
    },
    pentecostSunday: {
        translationKey: "common:utils.calendar.pentecostSunday",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).add(49, "days");
        }
    },
    pentecostMonday: {
        translationKey: "common:utils.calendar.pentecostMonday",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).add(50, "days");
        }
    },
    corpusChristi: {
        translationKey: "common:utils.calendar.corpusChristi",
        getMoment: (year, easterMoment) => {
            return moment(easterMoment).add(60, "days");
        }
    },
    peaceFestival: {
        translationKey: "common:utils.calendar.peaceFestival",
        getMoment: (year) => {
            return moment(year + "-08-08", "YYYY-MM-DD");
        }
    },
    assumptionDay: {
        translationKey: "common:utils.calendar.assumptionDay",
        getMoment: (year) => {
            return moment(year + "-08-15", "YYYY-MM-DD");
        }
    },
    germanUnityDay: {
        translationKey: "common:utils.calendar.germanUnityDay",
        getMoment: (year) => {
            return moment(year + "-10-03", "YYYY-MM-DD");
        }
    },
    reformationDay: {
        translationKey: "common:utils.calendar.reformationDay",
        getMoment: (year) => {
            return moment(year + "-10-31", "YYYY-MM-DD");
        }
    },
    allSaintsDay: {
        translationKey: "common:utils.calendar.allSaintsDay",
        getMoment: (year) => {
            return moment(year + "-11-01", "YYYY-MM-DD");
        }
    },
    penanceDay: {
        translationKey: "common:utils.calendar.penanceDay",
        getMoment: (year, easterMoment, firstAdvent) => {
            return moment(firstAdvent).subtract(11, "days");
        }
    },
    firstAdvent: {
        translationKey: "common:utils.calendar.firstAdvent",
        getMoment: (year, easterMoment, firstAdvent) => {
            return moment(firstAdvent);
        }
    },
    secondAdvent: {
        translationKey: "common:utils.calendar.secondAdvent",
        getMoment: (year, easterMoment, firstAdvent) => {
            return moment(firstAdvent).add(7, "days");
        }
    },
    thirdAdvent: {
        translationKey: "common:utils.calendar.thirdAdvent",
        getMoment: (year, easterMoment, firstAdvent) => {
            return moment(firstAdvent).add(14, "days");
        }
    },
    fourthAdvent: {
        translationKey: "common:utils.calendar.fourthAdvent",
        getMoment: (year, easterMoment, firstAdvent) => {
            return moment(firstAdvent).add(21, "days");
        }
    },
    christmasEve: {
        translationKey: "common:utils.calendar.christmasEve",
        getMoment: (year) => {
            return moment(year + "-12-24", "YYYY-MM-DD");
        }
    },
    christmasDay: {
        translationKey: "common:utils.calendar.christmasDay",
        getMoment: (year) => {
            return moment(year + "-12-25", "YYYY-MM-DD");
        }
    },
    secondDayOfChristmas: {
        translationKey: "common:utils.calendar.secondDayOfChristmas",
        getMoment: (year) => {
            return moment(year + "-12-26", "YYYY-MM-DD");
        }
    },
    newYearsEve: {
        translationKey: "common:utils.calendar.newYearsEve",
        getMoment: (year) => {
            return moment(year + "-12-31", "YYYY-MM-DD");
        }
    }
};

/**
 * checks if there are holidays in the current week of the given date
 * @param {Date|String} date the date as JavaScript Date or a string (if string, use format parameter)
 * @param {String[]|Boolean} [holidayKeys=false] an array of names of holidays to receive (use keys of holidayMatrix above) or false for all
 * @param {String} [format=false] the format for moment if date is a string (e.g. "YYYY-MM-DD")
 * @returns {Boolean} true if the week of the given date has holiday, false if not
 */
export function hasHolidayInWeek (date, holidayKeys = false, format = false) {
    if (!(date instanceof Date) && typeof date !== "string") {
        return false;
    }
    const givenMoment = moment(date, format).startOf("isoWeek");

    if (!givenMoment.isValid()) {
        return false;
    }

    for (let i = 0; i <= 6; i++) {
        if (getPublicHoliday(givenMoment, holidayKeys)) {
            return true;
        }
        givenMoment.add(1, "days");
    }
    return false;
}

/**
 * returns false if this is not a holiday or an object CalendarMoment for the holiday if it is a holiday
 * @param {Date|String} date the date as JavaScript Date or a string (if string, use format parameter)
 * @param {String[]|Boolean} [holidayKeys=false] an array of names of holidays to receive (use keys of holidayMatrix above) or false for all
 * @param {String} [format=false] the format for moment if date is a string (e.g. "YYYY-MM-DD")
 * @returns {CalendarMoment|Boolean} a CalendarMoment or false if the given date is not a holiday
 */
function getPublicHoliday (date, holidayKeys = false, format = false) {
    const givenMoment = moment(date, format),
        year = givenMoment.format("YYYY"),
        easterMoment = getGaussianEasterMoment(year),
        adventMoment = getFirstAdventMoment(year),
        keys = Array.isArray(holidayKeys) ? holidayKeys : Object.keys(publicHolidayMatrix),
        len = keys.length;
    let i = 0,
        holidayKey = "",
        holidayMoment = null;

    for (i = 0; i < len; i++) {
        holidayKey = keys[i];

        if (!isCalendarMoment(publicHolidayMatrix[holidayKey])) {
            continue;
        }

        holidayMoment = publicHolidayMatrix[holidayKey].getMoment(year, easterMoment, adventMoment);
        if (givenMoment.format("YYYY-MM-DD") !== holidayMoment.format("YYYY-MM-DD")) {
            continue;
        }

        return {
            moment: holidayMoment,
            holidayKey,
            translationKey: publicHolidayMatrix[holidayKey].translationKey
        };
    }

    return false;
}

/**
 * returns an array of CalendarMoment for public holidays based on the given holidayKeys (all if empty)
 * @param {Number} year the year to receive public holidays for in format YYYY
 * @param {String[]|Boolean} [holidayKeys=false] an array of names of holidays to receive (use keys of holidayMatrix above) or false for all
 * @returns {CalendarMoment[]} a list of public holidays as array of CalendarMoment in order of given holidayKeys
 */
function getPublicHolidays (year, holidayKeys = false) {
    const easterMoment = getGaussianEasterMoment(year),
        adventMoment = getFirstAdventMoment(year),
        keys = Array.isArray(holidayKeys) ? holidayKeys : Object.keys(publicHolidayMatrix),
        result = [];

    keys.forEach(holidayKey => {
        if (isCalendarMoment(publicHolidayMatrix[holidayKey])) {
            result.push({
                moment: publicHolidayMatrix[holidayKey].getMoment(year, easterMoment, adventMoment),
                holidayKey,
                translationKey: publicHolidayMatrix[holidayKey].translationKey
            });
        }
    });

    return result;
}

/**
 * checks if the given var is of type CalendarMoment
 * @param {*} calendarMoment the var to check
 * @returns {Boolean} true if this is save a CalendarMoment, false if not
 */
function isCalendarMoment (calendarMoment) {
    return typeof calendarMoment === "object" && calendarMoment !== null
        && typeof calendarMoment.getMoment === "function" && typeof calendarMoment.translationKey === "string";
}

/**
 * calculates the easter date as day of march using Gaußsche Osterformel (be aware: 32 means first of april)
 * @link https://de.wikipedia.org/wiki/Gau%C3%9Fsche_Osterformel
 * @param {String|Number} year the year to get the easter date for
 * @returns {Object} the day of easter for the given year as moment representation
 */
function getGaussianEasterMoment (year) {
    const x = parseInt(year, 10),
        // 1.    "secular number     K(X) = X div 100"
        k = Math.floor(x / 100),
        // 2.    "secular lunar leap    M(K) = 15 + (3K + 3) div 4 − (8K + 13) div 25"
        m = 15 + Math.floor((3 * k + 3) / 4) - Math.floor((8 * k + 13) / 25),
        // 3.    "secular solar leap    S(K) = 2 − (3K + 3) div 4"
        s = 2 - Math.floor((3 * k + 3) / 4),
        // 4.    "lunar parameter    A(X) = X mod 19"
        a = x % 19,
        // 5.    "seed for first full moon in spring    D(A,M) = (19A + M) mod 30"
        d = (19 * a + m) % 30,
        // 6.    "calendaric correcting quantity    R(D,A) = (D + A div 11) div 29"
        r = Math.floor(Math.floor(d + a / 11) / 29),
        // 7.    "Easter barrier    OG(D,R) = 21 + D − R"
        og = 21 + d - r,
        // 8.    "first sunday in March    SZ(X,S) = 7 − (X + X div 4 + S) mod 7"
        sz = 7 - Math.floor(x + x / 4 + s) % 7,
        // 9.    "distance in days between Easter Sunday and Easter barrier
        //      (distance in days)    OE(OG,SZ) = 7 − (OG − SZ) mod 7"
        oe = 7 - (og - sz) % 7,
        // 10.    "date of Easter Sunday as if it was in March
        //      (32. March = 1. April usw.)    OS = OG + OE"
        os = Math.floor(og + oe);

    if (os > 31) {
        return moment(year + "-04-" + (os - 31), "YYYY-MM-D");
    }
    return moment(year + "-03-" + os, "YYYY-MM-D");
}

/**
 * calculates the first advent of the given year
 * @param {Number} year the year to get the first advent for
 * @returns {Object} the first advent as moment representation
 */
function getFirstAdventMoment (year) {
    return moment(year + "-12-25", "YYYY-MM-DD").startOf("isoWeek").subtract(22, "days");
}

export {
    publicHolidayMatrix,
    getPublicHoliday,
    getPublicHolidays,
    isCalendarMoment,
    getGaussianEasterMoment,
    getFirstAdventMoment
};
