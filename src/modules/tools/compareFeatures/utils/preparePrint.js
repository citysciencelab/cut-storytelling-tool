import state from "../store/stateCompareFeatures";

/**
 * Helper Function to prepare the Pdf file from currently selected layer and its features on the comparison list.
 * @returns {void}
 */
async function preparePrint () {
    const tableBody = await prepareTableBody(),
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
 * It takes the preparedList from the state and converts it to a format, that is printable.
 * All fields that are undefined get changed to "-".
 * @returns {Array} tableBody with selected features from comparison list
 */
function prepareTableBody () {
    const tableBody = [],
        rowsToShow = state.numberOfAttributesToShow,
        features = state.preparedList;

    if (!state.hasMultipleLayers) {
        Object.values(features).forEach(feature => {
            Object.entries(feature).forEach(key => {
                tableBody.push(Object.values(key[1]).map(value => value === undefined ? "-" : value));
            });
        });
    }
    else {
        Object.values(features[state.selectedLayer]).forEach(feature => {
            tableBody.push(Object.values(feature).map(value => value === undefined ? "-" : value));
        });
    }
    if (!state.showMoreInfo) {
        return tableBody.slice(0, rowsToShow);
    }
    return tableBody;
}

export default preparePrint;
