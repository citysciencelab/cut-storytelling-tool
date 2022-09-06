import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import initialState from "./stateDraw";

const mutations = {
    ...generateSimpleMutations(initialState),
    setDownloadDataString: (state, payload) => {
        state.download.dataString = payload;
    },
    setDownloadEnabled: (state) => {
        state.download.enabled = !state.download.enabled;
    },
    setDownloadFeatures: (state, payload) => {
        state.download.features = payload;
    },
    setDownloadFile: (state, payload) => {
        state.download.file = payload;
    },
    setDownloadFileName: (state, payload) => {
        state.download.fileName = payload;
    },
    setDownloadFileUrl: (state, payload) => {
        state.download.fileUrl = payload;
    },
    setDownloadSelectedFormat: (state, payload) => {
        state.download.selectedFormat = payload;
    },
    addSymbol: (state, payload) => {
        state.iconList.push(payload);
    },
    setDrawSymbolSettings: (state, styleSettings) => {
        state.drawSymbolSettings.color = styleSettings.color;
        state.drawSymbolSettings.opacity = styleSettings.opacity;
    },
    setDrawCurveSettings: (state, styleSettings) => {
        state.drawCurveSettings.color = styleSettings.color;
        state.drawCurveSettings.colorContour = styleSettings.colorContour;
        state.drawCurveSettings.opacityContour = styleSettings.opacityContour;
        state.drawCurveSettings.strokeWidth = styleSettings.strokeWidth;
    },
    setDrawLineSettings: (state, styleSettings) => {
        state.drawLineSettings.color = styleSettings.color;
        state.drawLineSettings.opacity = styleSettings.opacity;
        state.drawLineSettings.colorContour = styleSettings.colorContour;
        state.drawLineSettings.opacityContour = styleSettings.opacityContour;
        state.drawLineSettings.strokeWidth = styleSettings.strokeWidth;
    },
    setDrawAreaSettings: (state, styleSettings) => {
        state.drawAreaSettings.colorContour = styleSettings.colorContour;
        state.drawAreaSettings.color = styleSettings.color;
        state.drawAreaSettings.opacityContour = styleSettings.opacityContour;
        state.drawAreaSettings.strokeWidth = styleSettings.strokeWidth;
    },
    setDrawCircleSettings: (state, styleSettings) => {
        state.drawCircleSettings.unit = styleSettings.unit;
        state.drawCircleSettings.circleRadius = styleSettings.circleRadius;
        state.drawCircleSettings.circleOuterRadius = styleSettings.circleOuterRadius;
        state.drawCircleSettings.color = styleSettings.color;
        state.drawCircleSettings.colorContour = styleSettings.colorContour;
        state.drawCircleSettings.outerColorContour = styleSettings.outerColorContour;
        state.drawCircleSettings.opacity = styleSettings.opacity;
        state.drawCircleSettings.opacityContour = styleSettings.opacityContour;
        state.drawCircleSettings.strokeWidth = styleSettings.strokeWidth;
    }
};

export default mutations;
