/**
 * Translates the AvoidOption in the corresponding value for the service
 * @param {string} avoidOption set by the user
 * @returns {string} translated service value
 */
export default function routingOrsAvoidOption (avoidOption) {
    switch (avoidOption) {
        case "HIGHWAYS": return "highways";
        case "TOLLWAYS": return "tollways";
        case "FERRIES": return "ferries";
        case "STEPS": return "steps";
        default: throw new Error("Fehlende AvoidOption Übersetzung");
    }
}
