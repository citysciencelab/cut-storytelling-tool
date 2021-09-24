/**
 * Translates the SpeedProfile in the corresponding value for the service
 * @param {string} speedProfile set by the user
 * @returns {string} translated service value
 */
export default function routingOrsSpeedProfile (speedProfile) {
    switch (speedProfile) {
        case "CAR": return "driving-car";
        case "HGV": return "driving-hgv";
        case "CYCLING": return "cycling-regular";
        case "FOOT": return "foot-walking";
        case "WHEELCHAIR": return "wheelchair";
        default: throw new Error("Fehlende SpeedProfil Übersetzung");
    }
}
