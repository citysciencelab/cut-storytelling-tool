const state = {
    // mandatory
    active: false,
    id: "searchByCoord",
    coordinatesEasting: {id: "easting", value: ""},
    coordinatesNorthing: {id: "northing", value: ""},
    coordinateSystems: [],
    currentSelection: "EPSG:8395",
    // currentSelection: "ETRS89",
    coordinatesEastingField: "",
    coordinatesNorthingField: "",
    coordinatesEastingExample: "",
    coordinatesNorthingExample: "",
    eastingNoCoord: false,
    eastingNoMatch: false,
    northingNoCoord: false,
    northingNoMatch: false,
    selectedCoordinates: [],
    transformedCoordinates: [],
    zoomLevel: 7,
    // mandatory defaults for config.json parameters
    name: "Koordinatensuche",
    glyphicon: "glyphicon-record",
    renderToWindow: true,
    resizableWindow: true,
    isVisibleInMenu: true,
    deactivateGFI: false
};

export default state;
