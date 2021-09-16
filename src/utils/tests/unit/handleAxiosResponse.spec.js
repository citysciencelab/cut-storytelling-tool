import {Assertion, expect} from "chai";
import sinon from "sinon";

import handleAxiosResponse from "../../handleAxiosResponse";

describe("src/utils/handleAxiosResponse.js", () => {
    const callContext = "Unit Tests",
        ccString = `${callContext}, handleAxiosResponse:`,
        invalidResponse = `${ccString} The received response is not valid.`,
        errorResponse = `${ccString} The received status code indicates an error.`,
        teapot = `${ccString} The server refuses to brew coffee because it is, permanently, a teapot.`,
        data = "Some cool data.";
    let response,
        status,
        statusText,
        warn;

    beforeEach(() => {
        status = 200;
        statusText = "It worked!";
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });
    afterEach(sinon.restore);

    Assertion.addMethod("getAxiosErrorResponse", function (errMessage, res) {
        new Assertion(this._obj).to.throw(errMessage);
        expect(warn.calledOnce).to.be.true;
        expect(warn.firstCall.args).to.eql([ccString, res]);
    });

    it("throw an error and put a warning on the console if the response is null", () => {
        response = null;

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(invalidResponse, response);
    });
    it("throw an error and put a warning on the console if the response is no object", () => {
        response = "I'm no object! :o";

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(invalidResponse, response);
    });
    it("throw an error and put a warning on the console if the response does not contain the property 'status'", () => {
        response = {};

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(invalidResponse, response);
    });
    it("throw an error and put a warning on the console if the response does not contain the property 'statusText'", () => {
        response = {status};

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(invalidResponse, response);
    });
    it("throw an error and put a warning on the console if the response does not contain the property 'data'", () => {
        response = {status, statusText};

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(invalidResponse, response);
    });
    it("should refuse to brew coffee if the server is permanently a teapot", () => {
        status = 418;
        statusText = "Teapots don't brew coffee";
        response = {status, statusText, data};

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(teapot, response);
    });
    it("throw an error and put a warning on the console if the status code is not 200", () => {
        status = 503;
        response = {status, statusText, data};

        expect(() => {
            handleAxiosResponse(response, callContext);
        }).to.getAxiosErrorResponse(errorResponse, response);
    });
    it("should return the data from the response if it is a valid response", () => {
        response = {status, statusText, data};

        expect(handleAxiosResponse(response, callContext)).to.equal(data);
        expect(warn.notCalled).to.be.true;
    });
});
