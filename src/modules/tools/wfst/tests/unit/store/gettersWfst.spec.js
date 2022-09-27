import {expect} from "chai";
import sinon from "sinon";
import Feature from "ol/Feature";
import {defaultInteractionConfig} from "../../../constantsWfst";
import gettersWfst from "../../../store/gettersWfst";

describe("src/modules/tools/wfst/store/gettersWfst.js", () => {
    let state;

    describe("currentInteractionConfig", () => {
        const currentLayerId = "myLayer",
            basicGeometryConfig = {
                layerId: currentLayerId,
                available: true,
                multi: true,
                icon: "bi-globe",
                text: "My WFS-T"
            };
        let consoleSpy;

        beforeEach(() => {
            state = {};
            consoleSpy = sinon.spy();
            sinon.stub(console, "warn").callsFake(consoleSpy);
        });
        afterEach(sinon.restore);

        it("should return a parsed configuration for areaButton if both areaButton and polygonButton are configured", () => {
            state.areaButton = [basicGeometryConfig];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The configuration parameter 'areaButton' has been deprecated. Please use 'polygonButton' instead.");
            expect(interactionConfig.Polygon.available).to.be.true;
            expect(interactionConfig.Polygon.icon).to.equal("bi-globe");
            expect(interactionConfig.Polygon.multi).to.be.true;
            expect(interactionConfig.Polygon.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.update).to.eql(defaultInteractionConfig.update);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration for lineButton, if configured", () => {
            state.lineButton = [basicGeometryConfig];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.notCalled).to.be.true;
            expect(interactionConfig.LineString.available).to.be.true;
            expect(interactionConfig.LineString.icon).to.equal("bi-globe");
            expect(interactionConfig.LineString.multi).to.be.true;
            expect(interactionConfig.LineString.text).to.equal("My WFS-T");
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.update).to.eql(defaultInteractionConfig.update);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration for pointButton, if configured", () => {
            state.pointButton = [basicGeometryConfig];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.notCalled).to.be.true;
            expect(interactionConfig.Point.available).to.be.true;
            expect(interactionConfig.Point.icon).to.equal("bi-globe");
            expect(interactionConfig.Point.multi).to.be.true;
            expect(interactionConfig.Point.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.update).to.eql(defaultInteractionConfig.update);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration for update, if configured", () => {
            state.update = [{
                layerId: currentLayerId,
                available: true,
                icon: "bi-globe",
                text: "My WFS-T"
            }];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.notCalled).to.be.true;
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.icon).to.equal("bi-globe");
            expect(interactionConfig.update.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return the default configuration if nothing at all is configured for the respective interaction", () => {
            expect(gettersWfst.currentInteractionConfig(state, {currentLayerId})).to.eql(defaultInteractionConfig);
            expect(consoleSpy.notCalled).to.be.true;
        });
        it("should return a parsed configuration for edit with the parameter being a boolean", () => {
            state.edit = true;

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The parameter 'edit' has been deprecated in version 3.0.0. Please use 'update' instead.");
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.icon).to.equal(defaultInteractionConfig.update.icon);
            expect(interactionConfig.update.text).to.equal(defaultInteractionConfig.update.text);
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration for edit with the parameter being a string", () => {
            state.edit = "My WFS-T";

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The parameter 'edit' has been deprecated in version 3.0.0. Please use 'update' instead.");
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.text).to.equal("My WFS-T");
            expect(interactionConfig.update.icon).to.equal(defaultInteractionConfig.update.icon);
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration for edit if both edit and update are configured", () => {
            state.edit = true;
            state.update = [{
                layerId: currentLayerId,
                available: true,
                icon: "bi-globe",
                text: "My WFS-T"
            }];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledTwice).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The parameter 'edit' has been deprecated in version 3.0.0. Please use 'update' instead.");
            expect(consoleSpy.secondCall.args.length).to.equal(1);
            expect(consoleSpy.secondCall.args[0]).to.equal("WfsTransaction: Configuration for 'edit' has already been provided. Skipping configuration of 'update'.");
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.icon).to.equal(defaultInteractionConfig.update.icon);
            expect(interactionConfig.update.text).to.equal(defaultInteractionConfig.update.text);
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration if the respective interaction configuration is a string", () => {
            state.lineButton = "My WFS-T";

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: Please add the caption in an object as the parameter 'text'; adding it directly will be deprecated in version 3.0.0.");
            expect(interactionConfig.LineString.available).to.be.true;
            expect(interactionConfig.LineString.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString.icon).to.equal(defaultInteractionConfig.LineString.icon);
            expect(interactionConfig.LineString.multi).to.equal(defaultInteractionConfig.LineString.multi);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
            expect(interactionConfig.update).to.eql(defaultInteractionConfig.update);
        });
        it("should return a parsed configuration if the respective interaction configuration is a boolean", () => {
            state.lineButton = true;

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.notCalled).to.be.true;
            expect(interactionConfig.LineString.available).to.be.true;
            expect(interactionConfig.LineString.text).to.equal(defaultInteractionConfig.LineString.text);
            expect(interactionConfig.LineString.icon).to.equal(defaultInteractionConfig.LineString.icon);
            expect(interactionConfig.LineString.multi).to.equal(defaultInteractionConfig.LineString.multi);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
            expect(interactionConfig.update).to.eql(defaultInteractionConfig.update);
        });
        it("should return the default configuration if no configuration is given for the respective interaction for the given layerId", () => {
            state.update = [{
                layerId: "someDifferentId",
                available: true,
                icon: "bi-globe",
                text: "My WFS-T"
            }];

            expect(gettersWfst.currentInteractionConfig(state, {currentLayerId})).to.eql(defaultInteractionConfig);
            expect(consoleSpy.notCalled).to.be.true;
        });
        it("should return a parsed configuration utilising show instead of available, if show is given", () => {
            state.update = [{
                layerId: currentLayerId,
                show: true,
                icon: "bi-globe",
                text: "My WFS-T"
            }];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The parameter 'show' has been deprecated in version 3.0.0. Please use 'available' instead.");
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.icon).to.equal("bi-globe");
            expect(interactionConfig.update.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
        it("should return a parsed configuration utilising caption instead of text, if caption is given", () => {
            state.update = [{
                layerId: currentLayerId,
                available: true,
                icon: "bi-globe",
                caption: "My WFS-T"
            }];

            const interactionConfig = gettersWfst.currentInteractionConfig(state, {currentLayerId});

            expect(consoleSpy.calledOnce).to.be.true;
            expect(consoleSpy.firstCall.args.length).to.equal(1);
            expect(consoleSpy.firstCall.args[0]).to.equal("WfsTransaction: The parameter 'caption' has been deprecated in version 3.0.0. Please use 'text' instead.");
            expect(interactionConfig.update.available).to.be.true;
            expect(interactionConfig.update.icon).to.equal("bi-globe");
            expect(interactionConfig.update.text).to.equal("My WFS-T");
            expect(interactionConfig.LineString).to.eql(defaultInteractionConfig.LineString);
            expect(interactionConfig.Point).to.eql(defaultInteractionConfig.Point);
            expect(interactionConfig.Polygon).to.eql(defaultInteractionConfig.Polygon);
            expect(interactionConfig.delete).to.eql(defaultInteractionConfig.delete);
        });
    });
    describe("savingErrorMessage", () => {
        let feature;

        beforeEach(() => {
            feature = new Feature();
            state = {
                featureProperties: [
                    {
                        type: "integer",
                        required: true,
                        label: "Ma prop",
                        value: null
                    },
                    {
                        type: "geometry",
                        required: true,
                        value: null
                    }
                ]
            };
        });

        it("should return an error message indicating that no feature has been drawn if the feature given to the getter is not an ol/Feature", () => {
            feature = "somethingDifferent";

            expect(gettersWfst.savingErrorMessage(state)(feature)).to.equal("modules.tools.wfsTransaction.error.noFeature");
        });
        it("should return an error message indicating that at least one required property has not received a value", () => {
            expect(gettersWfst.savingErrorMessage(state)(feature)).to.equal("modules.tools.wfsTransaction.error.requiredPropertiesNotSet");
        });
        it("should return an empty string if the feature given to the getter is not undefined and all required properties have received a value", () => {
            state.featureProperties[0].value = 42;

            expect(gettersWfst.savingErrorMessage(state)(feature)).to.equal("");
        });
    });
});
