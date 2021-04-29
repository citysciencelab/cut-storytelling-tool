import state from "../store/stateCompareFeatures";

/**
 * Helper Function to prepare the Pdf file from currently selected layer and its features on the comparison list.
 * @returns {void}
 */
async function preparePrint () {
    const layerId = state.hasMultipleLayers ? state.selectedLayer : Object.keys(state.layerFeatures)[0],
        tableBody = await prepareTableBody(state.layerFeatures[layerId]),
        pdfDef = {
            layout: "A4 Hochformat",
            outputFormat: "pdf",
            attributes: {
                title: i18next.t("common:modules.tools.compareFeatures.title"),
                datasource: [
                    {
                        table: {
                            columns: ["attr", "feature1", "feature2", "feature3"],
                            data: tableBody
                        }
                    }
                ]
            }
        };

    Radio.trigger("Print", "createPrintJob", encodeURIComponent(JSON.stringify(pdfDef)), "compareFeatures", "pdf");
}

/**
 * Prepares the table body which is used for printing the pdf file from comparison list.
 * @param {Array} features - features from comparison list
 * @returns {Array} tableBody with selected features from comparison list
 */
function prepareTableBody (features) {
    const tableBody = [],
        rowsToShow = state.numberOfAttributesToShow;

    for (const feature of features) {
        Object.keys(feature.properties).forEach((key, index) => {
            if (features.indexOf(feature) === 0) {
                tableBody.push([key, Object.values(feature.properties)[index]]);
            }
            else {
                tableBody[index].push(Object.values(feature.properties)[index]);
            }
        });
    }
    if (!state.showMoreInfo) {
        return tableBody.slice(0, rowsToShow);
    }
    return tableBody;
}

export default preparePrint;
