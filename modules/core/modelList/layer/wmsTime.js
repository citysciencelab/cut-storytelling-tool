import WMSLayer from "./wms";
import WMSCapabilities from "ol/format/WMSCapabilities";
import store from "../../../../src/app-store";
import axios from "axios";
import handleAxiosResponse from "../../../../src/utils/handleAxiosResponse";

const WmsTimeLayer = WMSLayer.extend({
    defaults () {
        return Object.assign(WMSLayer.prototype.defaults(), {
            keyboardMovement: 5,
            time: true
        });
    },
    initialize () {
        WMSLayer.prototype.initialize.apply(this);

        this.listenTo(Radio.channel("WmsTime"), {
            "updateTime": this.updateTime
        });
    },
    /**
     * Updates the time parameter of the WMS-T if the id of the layer is correct.
     *
     * @param {string} id Unique Id of the layer to update.
     * @param {string} newValue New TIME value of the WMS-T
     * @returns {void}
     */
    updateTime (id, newValue) {
        if (id === this.get("id")) {
            this.get("layerSource").updateParams({"TIME": newValue});
        }
    },
    /**
     * Creates the layer source for the WMS-T layer.
     * Also creates the WMS parameters including the time related values.
     *
     * @returns {void}
     */
    createLayerSource () {
        const params = Object.assign({TIME: this.prepareTime()}, WMSLayer.prototype.prepareLayerSourceParams.apply(this));

        WMSLayer.prototype.createLayerSource.apply(this, params);
    },
    /**
     * Creates an array with ascending values from min to max separated by step.
     *
     * @param {number} min Minimum value.
     * @param {number} max Maximum value.
     * @param {number} step Distance between each value inside the array.
     * @returns {number[]} Array of numbers between min and max with a distance of step to each neighbouring number.
     */
    createTimeRange (min, max, step) {
        return Array(Math.floor((max - min) / step) + 1)
            .fill(undefined)
            .map((_, index) => min + (index * step));
    },
    /**
     * Extracts the values from the time dimensional extent.
     * There are four different cases how the values may be present (as described in the [WMS Specification at Table C.1]{@link http://cite.opengeospatial.org/OGCTestData/wms/1.1.1/spec/wms1.1.1.html#dims.declaring}).
     * They can be determined based on the characters "," and '/'.
     *
     * - CASE 1: Single Value; neither ',' nor '/' are present. The returned Array will have only this value, the step will be 1.
     * - CASE 2: List of multiple values; ',' is present, '/' isn't. The returned Array will have exactly these values. The step is dependent on the minimal distances found inside this Array.
     * - CASE 3: Interval defined by its lower and upper bounds and its resolution; '/' is present, ',' isn't. The returned Array will cover all values between the lower and upper bounds with a distance of the resolution.
     *         The step is retrieved from the resolution.
     * - Case 4: List of multiple intervals; ',' and '/' are present. For every interval the process described in CASE 3 will be performed.
     *
     * @param {string} extent Time dimensional extent retrieved from the service.
     * @param {string} extent.values The values of the time dimensional extent.
     * @returns {object} An object containing the range of possible time values as well as the minimum step between these.
     */
    extractExtentValues ({values}) {
        const timeRange = [];
        let smallestStep = 1;

        // NOTE: This was implemented against a service that uses the syntax described in CASE 3. Might need adjustment to work for the others.
        timeRange.push(
            ...new Set(values.replace(" ", "").split(",")
                .map(entry => entry.split("/"))
                .map(entry => {
                    // CASE 1 & 2
                    if (entry.length === 1) {
                        return entry;
                    }
                    // CASE 3 & 4
                    const [min, max] = entry.map(Number),
                        resolution = entry[2],
                        step = Number([...resolution][1]);

                    // NOTE: This was implemented against a service that uses years. Might need adjustment to work for services that use months oder days.
                    if (step < smallestStep) {
                        smallestStep = step;
                    }

                    return this.createTimeRange(min, max, step);
                })
                .flat(1)
                .map(Number)
                .sort((first, second) => first - second)));

        return {step: smallestStep, timeRange};
    },
    /**
     * Finds the Element with the given name inside the given HTMLCollection.
     *
     * @param {HTMLCollection} element HTMLCollection to be found.
     * @param {String} nodeName Name of the Element to be searched for.
     * @returns {HTMLCollection} If found, the HTMLCollection with given name, otherwise undefined.
     */
    findNode (element, nodeName) {
        return [...element.children].find(el => el.nodeName === nodeName);
    },
    /**
     * Search for the time dimensional Extent in the given HTMLCollection returned from a request to a WMS-T.
     *
     * @param {HTMLCollection} element The root HTMLCollection returned from a GetCapabilities request to a WMS-T.
     * @returns {?Object} An object containing the needed Values from the time dimensional Extent for further usage.
     */
    findTimeDimensionalExtent (element) {
        const capability = this.findNode(element, "Capability"),
            outerLayer = this.findNode(capability, "Layer"),
            innerFirstLayer = this.findNode(outerLayer, "Layer"),
            extent = this.findNode(innerFirstLayer, "Extent");

        return extent ? this.retrieveExtentValues(extent) : null;
    },
    /**
     * Prepares the parameters for the WMS-T.
     * This includes creating the range of possible time values, the minimum step between these as well as the initial value set.
     *
     * @throws {Error} Will throw an Error if the given layer is not a valid time layer.
     * @returns {Promise<number>} If the functions resolves, the initial value for the time dimension is returned.
     */
    prepareTime () {
        const time = this.get("time");

        return this.requestCapabilities(this.get("url"))
            .then(result => {
                const {Dimension, Extent} = result.Capability.Layer.Layer[0];

                if (!Dimension || !Extent || Dimension[0].name !== "time" || Extent.name !== "time") {
                    throw Error(i18next.t("common:modules.core.modelList.layer.wms.invalidTimeLayer", {id: this.id}));
                }
                return Extent;
            })
            .then(extent => {
                const {step, timeRange} = this.extractExtentValues(extent),
                    defaultValue = typeof time === "object" && timeRange[0] <= time.default && time.default <= timeRange[timeRange.length - 1]
                        ? time.default
                        : Number(extent.default),
                    timeData = {defaultValue, step, timeRange};

                this.set("time", typeof time === "object" ? {...time, ...timeData} : timeData);
                timeData.layerId = this.get("id");
                store.commit("WmsTime/addTimeSliderObject", {keyboardMovement: this.get("keyboardMovement"), ...timeData});

                return defaultValue;
            })
            .catch(error => {
                this.removeLayer();
                // remove layer from project completely
                Radio.trigger("Parser", "removeItem", this.get("id"));
                Radio.trigger("Util", "refreshTree");

                console.error(i18next.t("common:modules.core.modelList.layer.wms.errorTimeLayer", {error, id: this.id}));
            });
    },
    /**
     * Requests the GetCapabilities document and parses the result.
     *
     * @param {String} url url to request.
     * @returns {Promise} A promise which will resolve the parsed GetCapabilities object.
     */
    requestCapabilities (url) {
        return axios.get(encodeURI(`${url}?service=WMS&version=${this.get("version")}&layers=${this.get("layers")}&request=GetCapabilities`))
            .then(response => handleAxiosResponse(response, "WMS, createLayerSource, requestCapabilities"))
            .then(result => {
                const capabilities = new WMSCapabilities().read(result);

                capabilities.Capability.Layer.Layer[0].Extent = this.findTimeDimensionalExtent(new DOMParser().parseFromString(result, "text/xml").firstElementChild);
                return capabilities;
            });
    },
    /**
     * Retrieves the attributes from the given HTMLCollection and adds the key value pairs to an Object.
     * Also retrieves its value.
     *
     * @param {HTMLCollection} extent The Collection of values for the time dimensional Extent.
     * @returns {Object} An Object containing the attributes of the time dimensional Extent as well as its value.
     */
    retrieveExtentValues (extent) {
        return [...extent.attributes]
            .reduce((acc, att) => ({...acc, [att.name]: att.value}), {values: extent.innerHTML});
    }
});

export default WmsTimeLayer;
