import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import featureListerState from "./stateFeatureLister";

const getters = {
    ...generateSimpleGetters(featureListerState),
    /**
     * Gets the currently available layers.
     * @param {Object} state context object.
     * @returns {void}
     */
    featureProperties: state => {
        const featuresWithProperties = [],
            sortedProperties = [];

        state.gfiFeaturesOfLayer.forEach(feature => {
            featuresWithProperties.push(feature.getProperties());
        });

        featuresWithProperties.forEach(properties => {
            const attvalue = [];

            state.headers.forEach(header => {
                if (!Object.prototype.hasOwnProperty.call(properties, header.key)) {
                    Object.entries(properties).forEach(() => {
                        properties[header.key] = "";
                    });
                }

                Object.entries(properties).forEach(([key, value]) => {
                    if (header.key === key) {
                        attvalue.push(value);
                    }
                });
            });
            sortedProperties.push(attvalue);
        });
        return sortedProperties;
    },
    /**
     * The v-for calls this function for every property of the selected feature and returns pairs of header and
     * value as an array
     * @param {Object} state context object.
     * @returns {Array} [header, value] for each property of the selected feature
     */
    featureDetails: state => {
        const featureDetail = [],
            attributesToShow = state.selectedFeature.getAttributesToShow(),
            featureProperties = state.selectedFeature.getProperties();

        if (attributesToShow === "showAll") {
            Object.entries(featureProperties).forEach(([propkey, propvalue]) => {
                if (propvalue && Config.ignoredKeys.indexOf(propkey.toUpperCase()) === -1) {
                    featureDetail.push([propkey, propvalue]);
                }
            });
        }
        Object.entries(attributesToShow).forEach(([key, value]) => {
            Object.entries(featureProperties).forEach(([propkey, propvalue]) => {
                if (propkey === key && propvalue) {
                    featureDetail.push([value, propvalue]);
                }
            });
        });
        return featureDetail;
    },
    /**
     * Gets the currently available layers.
     * @param {Object} state context object.
     * @returns {void}
     */
    headers: state => {
        const headers = [],
            lengths = [];
        let indexOfFeatureWithMostAttributes = "";

        Object.values(state.gfiFeaturesOfLayer).forEach(element => {
            lengths.push(Object.keys(element.getAttributesToShow()).length);
        });
        indexOfFeatureWithMostAttributes = lengths.indexOf(Math.max(...lengths));

        if (state.gfiFeaturesOfLayer[indexOfFeatureWithMostAttributes].getAttributesToShow() === "showAll") {
            Object.entries(state.gfiFeaturesOfLayer[indexOfFeatureWithMostAttributes].getProperties()).forEach(([key]) => {
                headers.push({key: key, value: key});
            });
        }
        else {
            Object.entries(state.gfiFeaturesOfLayer[indexOfFeatureWithMostAttributes].getAttributesToShow()).forEach(([key, value]) => {
                headers.push({key, value});
            });
        }
        state.headers = headers;
        return headers;
    }
};

export default getters;
