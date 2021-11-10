/**
 * Translates the SpeedProfile in the corresponding value for the service
 * @param {String} speedProfile set by the user
 * @returns {String} translated service value
 */
export default function routingOrsSpeedProfile (speedProfile) {
    switch (speedProfile) {
        case "CAR": return "driving-car";
        case "HGV": return "driving-hgv";
        case "CYCLING": return "cycling-regular";
        case "FOOT": return "foot-walking";
        case "WHEELCHAIR": return "wheelchair";
        default: throw new Error("Missing speedProfil translation");
    }
}
