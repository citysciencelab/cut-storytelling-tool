export const defaultInteractionConfig = {
        LineString: {
            available: false,
            icon: "bi-slash-lg",
            multi: false,
            text: "common:modules.tools.wfsTransaction.interactionSelect.line"
        },
        Point: {
            available: false,
            icon: "bi-record-circle",
            multi: false,
            text: "common:modules.tools.wfsTransaction.interactionSelect.point"
        },
        Polygon: {
            available: false,
            icon: "bi-hexagon-fill",
            multi: false,
            text: "common:modules.tools.wfsTransaction.interactionSelect.polygon"
        },
        update: {
            available: false,
            icon: "bi-pencil-square",
            text: "common:modules.tools.wfsTransaction.interactionSelect.update"
        },
        delete: {
            available: false,
            icon: "bi-trash",
            text: "common:modules.tools.wfsTransaction.interactionSelect.delete"
        }
    },
    exceptionCodes = [
        "InvalidParameterValue",
        "InvalidValue",
        "MissingParameterValue",
        "OperationNotSupported",
        "OperationParsingFailed",
        "OperationProcessingFailed"
    ];
