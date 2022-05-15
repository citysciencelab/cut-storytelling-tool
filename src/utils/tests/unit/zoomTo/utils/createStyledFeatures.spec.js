import {expect} from "chai";
import Feature from "ol/Feature";
import {Icon, Style} from "ol/style";
import Point from "ol/geom/Point";
import sinon from "sinon";
import createStyledFeatures from "../../../../zoomTo/utils/createStyledFeatures";

describe("src/utils/zoomTo/utils/createStyledFeatures.js", () => {
    const createStyle = sinon.spy(),
        consoleSpy = sinon.spy();

    /**
     * Fakes the Radio.request call.
     *
     * @param {string} namespace Namespace requested.
     * @param {string} method Method inside the namespaced which is requested.
     * @param {any} args Given arguments.
     * @returns {object|undefined} A mocked styleModel or undefined.
     */
    function requestFake (namespace, method, args) {
        return namespace === "StyleList" && method === "returnModelById" && args !== undefined
            ? {createStyle}
            : undefined;
    }

    beforeEach(() => {
        sinon.stub(Radio, "request").callsFake(requestFake);
    });
    afterEach(sinon.restore);

    it("should return an array of Features using a Point as its geometry and containing a style", () => {
        const features = [{
                getGeometry: () => ({
                    getExtent: () => [567001.606, 5934414.862, 567085.524, 5934496.754]
                })
            }],
            styledFeatures = createStyledFeatures(features, undefined);

        expect(styledFeatures.length).to.equal(1);
        expect(styledFeatures[0] instanceof Feature).to.be.true;
        expect(styledFeatures[0].getGeometry() instanceof Point).to.be.true;
        expect(styledFeatures[0].getStyle() instanceof Style).to.be.true;
    });
    it("should return an array of Features using a Point as its geometry and containing a style created by the requested styleModel", () => {
        const features = [{
                getGeometry: () => ({
                    getExtent: () => [567001.606, 5934414.862, 567085.524, 5934496.754]
                })
            }],
            styleId = "myStyle",
            styledFeatures = createStyledFeatures(features, styleId);

        expect(styledFeatures.length).to.equal(1);
        expect(styledFeatures[0] instanceof Feature).to.be.true;
        expect(styledFeatures[0].getGeometry() instanceof Point).to.be.true;
        expect(createStyle.calledOnce).to.be.true;
        expect(createStyle.firstCall.args[0] instanceof Feature).to.be.true;
        expect(createStyle.firstCall.args[1]).to.equal(false);
    });
    it("should return an array of Features using a Point as its geometry and containing a style with an Icon", () => {
        sinon.stub(console, "warn").callsFake(consoleSpy);
        // NOTE: This test should be removed in v3.0.0!
        const features = [{
                getGeometry: () => ({
                    getExtent: () => [567001.606, 5934414.862, 567085.524, 5934496.754]
                })
            }],
            styleId = "https://myStyle.com",
            styledFeatures = createStyledFeatures(features, styleId);

        expect(styledFeatures.length).to.equal(1);
        expect(styledFeatures[0] instanceof Feature).to.be.true;
        expect(styledFeatures[0].getGeometry() instanceof Point).to.be.true;
        expect(styledFeatures[0].getStyle() instanceof Style).to.be.true;
        expect(styledFeatures[0].getStyle().getImage() instanceof Icon).to.be.true;
        expect(styledFeatures[0].getStyle().getImage().getSrc()).to.equal(styleId);
        expect(consoleSpy.calledOnce).to.be.true;
        expect(consoleSpy.firstCall.args.length).to.equal(1);
        expect(consoleSpy.firstCall.args[0]).to.equal("zoomTo: The usage of the configuration parameter 'imgLink' will be deprecated in v3.0.0. Please use 'styleId' instead.");
    });
});
