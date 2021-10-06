import axios from "axios";
import routingOrsAvoidOption from "../avoidoptions/routing-ors-avoidoptions";
import {RoutingIsochrones} from "../classes/routing-isochrones";
import {RoutingIsochronesArea} from "../classes/routing-isochrones-area";
import routingOrsSpeedProfile from "../speedprofiles/routing-ors-speedprofiles";
import state from "./../../store/stateRouting";

/**
 * Translates the Optimization in the corresponding value for the service
 * @param {string} optimization set by the user
 * @returns {string} translated service value
 */
function routingOrsOptimization (optimization) {
    switch (optimization) {
        case "TIME": return "time";
        case "DISTANCE": return "distance";
        default: throw new Error("Fehlende rangeType Übersetzung");
    }
}

/**
 * Translates the Optimization in the corresponding multiplicator value for the service
 * @param {string} optimization set by the user
 * @returns {number} multiplicator for the specified optimization
 */
function routingOrsOptimizationMultiplicator (optimization) {
    switch (optimization) {
        case "TIME": return 60;
        case "DISTANCE": return 1000;
        default: throw new Error("Fehlende optimization - multiplicator Übersetzung");
    }
}

/**
 * Requests isochrones from ors service.
 * @param {[number, number]} coordinates in wgs84 projection
 * @param {string} speedProfile which is used to request the isochrones for.
 * @param {function} transformCoordinatesToLocal function to transform result coordinates to local projection.
 * @returns {RoutingIsochrones} routingIsochrones
 */
async function fetchRoutingOrsIsochrones ({
    coordinates,
    transformCoordinatesToLocal,
    speedProfile,
    optimization,
    avoidSpeedProfileOptions,
    transformCoordinates
}) {

    const serviceUrl = Radio.request("RestReader", "getServiceById", state.isochronesSettings.serviceId).get("url"),
        url = `${serviceUrl}/v2/isochrones/${routingOrsSpeedProfile(speedProfile)}`,
        rangeValue = optimization === "TIME" ? state.isochronesSettings.timeValue : state.isochronesSettings.distanceValue,
        optimizationMultiplicator = routingOrsOptimizationMultiplicator(optimization),
        range = rangeValue * optimizationMultiplicator,
        interval = state.isochronesSettings.intervalValue * optimizationMultiplicator;
    let result = null,
        first = null,
        second = null,
        isochrones = null,
        response = null;

    try {
        response = await axios.post(url, {
            interval: interval, // 15 Min * 60 Sek || 15km * 1000m // Zwischenintervalle
            locations: [coordinates],
            location_type: "start", // start || destination
            range_type: routingOrsOptimization(optimization),
            range: [range], // 30Min * 60 Sek || 30km * 1000m // maximale reichweite
            options: {
                ...avoidSpeedProfileOptions.length > 0 && {avoid_features: avoidSpeedProfileOptions.map(o => routingOrsAvoidOption(o.id))}
            },

            area_units: "m",
            units: "m"
        });
    }
    catch (e) {
        throw new Error(i18next.t("common:modules.tools.routing.errors.errorIsochronesFetch"));
    }


    result = response.data;
    if (transformCoordinates) {
        first = await transformCoordinatesToLocal([
            result.bbox[0],
            result.bbox[1]
        ]);
        second = await transformCoordinatesToLocal([
            result.bbox[2],
            result.bbox[3]
        ]);
    }
    else {
        first = [
            result.bbox[0],
            result.bbox[1]
        ];
        second = [
            result.bbox[2],
            result.bbox[3]
        ];
    }

    isochrones = new RoutingIsochrones([first[0], first[1], second[0], second[1]]);
    for (let i = result.features.length - 1; i >= 0; i--) {
        const feature = result.features[i],
            localCoordinates = transformCoordinates ? [] : feature.geometry.coordinates[0];

        if (transformCoordinates) {
            for (const coordinate of feature.geometry.coordinates[0]) {
                localCoordinates.push(await transformCoordinatesToLocal(coordinate));
            }
        }
        isochrones.addArea(
            new RoutingIsochronesArea(
                [localCoordinates],
                feature.properties.group_index,
                feature.properties.value,
                range,
                interval,
                speedProfile,
                optimization,
                avoidSpeedProfileOptions.map(option => option.id),
                feature.properties.value / optimizationMultiplicator
            )
        );
    }
    return isochrones;
}

export {fetchRoutingOrsIsochrones};
