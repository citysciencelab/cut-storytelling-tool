import sinon from "sinon";
import {expect} from "chai";

import {drawHatch} from "@modules/vectorStyle/polygonStyleHatch";

describe("polygonStyleHatches", function () {
    describe("drawHatch", function () {
        let context = null;

        beforeEach(function () {
            context = {
                stroke: sinon.spy(),
                translate: sinon.spy(),
                rotate: sinon.spy(),
                beginPath: sinon.spy(),
                rect: sinon.spy(),
                moveTo: sinon.spy(),
                lineTo: sinon.spy(),
                arc: sinon.spy(),
                lineWidth: 50
            };
        });

        it("should draw patterns from known names to the context object", function () {
            drawHatch(context, 100, "zig-line-horizontal");

            expect(context.stroke.callCount).to.equal(1);
            expect(context.translate.callCount).to.equal(2);
            expect(context.translate.calledWith(50, 50)).to.be.true;
            expect(context.translate.calledWith(-50, -50)).to.be.true;
            expect(context.rotate.callCount).to.equal(1);
            expect(context.rotate.firstCall.args).to.eql([1.5707963267948966]);
            expect(context.beginPath.callCount).to.equal(1);
            expect(context.rect.callCount).to.equal(0);
            expect(context.moveTo.callCount).to.equal(1);
            expect(context.moveTo.firstCall.args).to.eql([0, -25]);
            expect(context.lineTo.callCount).to.equal(2);
            expect(context.lineTo.firstCall.args).to.eql([75, 50]);
            expect(context.lineTo.secondCall.args).to.eql([0, 125]);
            expect(context.arc.callCount).to.equal(0);
        });

        it("should draw patterns from custom definitions to the context object", function () {
            drawHatch(context, 100, {
                "draw": [
                    {
                        "type": "arc",
                        "parameters": [
                            0.5, 0.5, 7.5, -4.14, 1.14
                        ]
                    },
                    {
                        "type": "arc",
                        "parameters": [
                            0.55, 0.5, 7.5, -2, 1.14
                        ]
                    },
                    {
                        "type": "line",
                        "parameters": [
                            [0.66, 0.75],
                            [1, 0.75]
                        ]
                    },
                    {
                        "type": "rect",
                        "parameters": [
                            [0, 0, 1, 1]
                        ]
                    }
                ]
            });

            expect(context.stroke.callCount).to.equal(4);
            expect(context.translate.callCount).to.equal(0);
            expect(context.rotate.callCount).to.equal(0);
            expect(context.beginPath.callCount).to.equal(4);
            expect(context.rect.callCount).to.equal(1);
            expect(context.rect.firstCall.args).to.eql([0, 0, 100, 100]);
            expect(context.moveTo.callCount).to.equal(1);
            expect(context.moveTo.firstCall.args).to.eql([66, 75]);
            expect(context.lineTo.callCount).to.equal(1);
            expect(context.lineTo.firstCall.args).to.eql([100, 75]);
            expect(context.arc.callCount).to.equal(2);
            expect(context.arc.firstCall.args).eql(
                [50, 50, 7.5, -4.14, 1.14, false]
            );
            expect(context.arc.secondCall.args).eql(
                [55.00000000000001, 50, 7.5, -2, 1.14, false]
            );
        });
    });
});
