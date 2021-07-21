import Layer from "@modules/core/modelList/layer/model.js";
import {expect} from "chai";
import sinon from "sinon";

describe("core/modelList/layer/model", function () {
    let model;

    before(function () {
        model = new Layer();
    });

    describe("toggleIsSelected", function () {
        let secondModel;

        before(function () {
            secondModel = new Layer({channel: Radio.channel("ThisDoesNotExist")});

            // Somehow some errors occur if the attributes for the models are set differently
            model.set("isSelected", false);
            model.set("id", "model1");
            model.set("parentId", "Baselayer");
            model.set("layerSource", {});
            model.set("id", "modelOne");
            model.createLayerSource = sinon.stub();
            secondModel.attributes.isSelected = true;
            secondModel.attributes.parentId = "Baselayer";
            secondModel.attributes.layerSource = {};
            secondModel.attributes.id = "modelTwo";
            secondModel.attributes.id = "model2";
            secondModel.createLayerSource = sinon.stub();

            Radio.trigger("ModelList", "addModel", model);
            Radio.trigger("ModelList", "addModel", secondModel);
        });

        after(function () {
            model = new Layer();
        });

        afterEach(function () {
            model.set("isSelected", false);
            secondModel.attributes.isSelected = true;
        });

        it("should deselect all other baselayers if the option singleBaselayer is set to true", function () {
            model.set("singleBaselayer", true);
            setTimeout(function () {
                Radio.trigger("Layer", "toggleIsSelected");

                expect(model.attributes.isSelected).to.be.true;
                expect(secondModel.attributes.isSelected).to.be.false;
            }, 30000);
        });

        it("should lead to multiple baselayers being active if the option singleBaselayer is set to false", function () {
            model.set("singleBaselayer", false);
            setTimeout(function () {
                Radio.trigger("Layer", "toggleIsSelected");

                expect(model.attributes.isSelected).to.be.true;
                expect(secondModel.attributes.isSelected).to.be.true;
            }, 30000);
        });

        it("should increase the transparency by 10 percent", function () {
            model.setTransparency("30");
            model.incTransparency();

            expect(model.get("transparency")).to.be.a("number");
            expect(model.get("transparency")).equals(40);
        });

        it("should decreases the transparency by 10 percent", function () {
            model.setTransparency("30");
            model.decTransparency();

            expect(model.get("transparency")).to.be.a("number");
            expect(model.get("transparency")).equals(20);
        });
    });
});
