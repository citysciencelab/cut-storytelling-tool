import {
    convertPhenomenonTime,
    isObservation,
    getQueryLink,
    convertObservationsToLinechart
} from "../../../utils/staTools";
import moment from "moment";
import {expect} from "chai";

describe("src/modules/tools/gfi/utils/staTools.js", () => {
    describe("convertPhenomenonTime", () => {
        it("should return false if the given phenomeononTime is not valid", () => {
            expect(convertPhenomenonTime(undefined)).to.be.false;
            expect(convertPhenomenonTime(null)).to.be.false;
            expect(convertPhenomenonTime("string")).to.be.false;
            expect(convertPhenomenonTime(1234)).to.be.false;
            expect(convertPhenomenonTime(true)).to.be.false;
            expect(convertPhenomenonTime(false)).to.be.false;
            expect(convertPhenomenonTime([])).to.be.false;
            expect(convertPhenomenonTime({})).to.be.false;
        });
        it("should convert the given phenomenonTime to the given format", () => {
            const phenomenonTime = "2021-08-05T04:15:00.000Z",
                format = "DD.MM.YYYY HH:mm:ss",
                expected = moment("2021-08-05T04:15:00.000Z").format(format);

            expect(convertPhenomenonTime(phenomenonTime, format)).to.equal(expected);
        });
        it("should convert a phenomenonTime range to the given format, using the first value", () => {
            const phenomenonTime = "2021-08-05T04:15:00.000Z/2021-08-05T04:29:59.000Z",
                format = "DD.MM.YYYY HH:mm:ss",
                expected = moment("2021-08-05T04:15:00.000Z").format(format);

            expect(convertPhenomenonTime(phenomenonTime, format)).to.equal(expected);
        });
    });
    describe("isObservation", () => {
        it("should return false if the given observation is not a valid STA observation", () => {
            expect(isObservation(undefined)).to.be.false;
            expect(isObservation(null)).to.be.false;
            expect(isObservation("string")).to.be.false;
            expect(isObservation(1234)).to.be.false;
            expect(isObservation(true)).to.be.false;
            expect(isObservation(false)).to.be.false;
            expect(isObservation([])).to.be.false;
            expect(isObservation({})).to.be.false;
        });
        it("should return true if the given observation is a valid STA observation", () => {
            const observation = {
                "@iot.id": 214030301,
                "phenomenonTime": "2021-08-05T04:15:00.000Z/2021-08-05T04:29:59.000Z",
                "result": 127.0
            };

            expect(isObservation(observation)).to.be.true;
        });
    });
    describe("getQueryLink", () => {
        it("should return false if anything but two strings are given", () => {
            expect(getQueryLink("string", undefined)).to.be.false;
            expect(getQueryLink("string", null)).to.be.false;
            expect(getQueryLink("string", 1234)).to.be.false;
            expect(getQueryLink("string", true)).to.be.false;
            expect(getQueryLink("string", false)).to.be.false;
            expect(getQueryLink("string", [])).to.be.false;
            expect(getQueryLink("string", {})).to.be.false;

            expect(getQueryLink(undefined, "string")).to.be.false;
            expect(getQueryLink(null, "string")).to.be.false;
            expect(getQueryLink(1234, "string")).to.be.false;
            expect(getQueryLink(true, "string")).to.be.false;
            expect(getQueryLink(false, "string")).to.be.false;
            expect(getQueryLink([], "string")).to.be.false;
            expect(getQueryLink({}, "string")).to.be.false;
        });
        it("should return a concatinated path of the two given strings", () => {
            expect(getQueryLink("selfLink", "query")).to.equal("selfLink/query");
        });
        it("should return a concatinated path of two given strings where the query string starts with /", () => {
            expect(getQueryLink("selfLink", "/query")).to.equal("selfLink/query");
        });
    });
    describe("convertObservationsToLinechart", () => {
        it("should convert observations into a ChartJS linechart data", () => {
            const observations = [
                    {
                        "@iot.id": 214030301,
                        "phenomenonTime": "2021-08-05T04:15:00.000Z/2021-08-05T04:29:59.000Z",
                        "result": 127,
                        "resultTime": "2021-08-05T04:43:17.582Z"
                    },
                    {
                        "@iot.id": 214051126,
                        "phenomenonTime": "2021-08-05T04:30:00.000Z/2021-08-05T04:44:59.000Z",
                        "result": 136,
                        "resultTime": "2021-08-05T04:58:12.552Z"
                    },
                    {
                        "@iot.id": 214071824,
                        "phenomenonTime": "2021-08-05T04:45:00.000Z/2021-08-05T04:59:59.000Z",
                        "result": 168,
                        "resultTime": "2021-08-05T05:13:03.290Z"
                    },
                    {
                        "@iot.id": 214095414,
                        "phenomenonTime": "2021-08-05T05:00:00.000Z/2021-08-05T05:14:59.000Z",
                        "result": 145,
                        "resultTime": "2021-08-05T05:28:17.440Z"
                    }
                ],
                format = "HH:mm",
                expected = {
                    datasets: [{
                        label: "label",
                        data: [
                            127,
                            136,
                            168,
                            145
                        ],
                        borderColor: "rgba(0, 92, 169, 1)",
                        backgroundColor: "rgba(0, 92, 169, 1)",
                        spanGaps: false,
                        fill: false,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 4,
                        lineTension: 0
                    }],
                    labels: [
                        moment("2021-08-05T04:15:00.000Z").format(format),
                        moment("2021-08-05T04:30:00.000Z").format(format),
                        moment("2021-08-05T04:45:00.000Z").format(format),
                        moment("2021-08-05T05:00:00.000Z").format(format)
                    ]
                };

            expect(convertObservationsToLinechart(observations, "label", format)).to.deep.equal(expected);
        });
    });
});
