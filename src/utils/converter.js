
export function setValueToState (state, keySplitted, value, i, found = false) {
    Object.values(state).forEach( () => {
        if (!found && state.hasOwnProperty(keySplitted[i])) {
            if (i === keySplitted.length - 2) {
                if (state[keySplitted[i]].hasOwnProperty(keySplitted[i + 1])) {
                    state[keySplitted[i]][keySplitted[i + 1]] = convertStringToBoolean(value);
                    found = true;
                    console.log("set ", keySplitted.join("/"), " to ", value);
                }
            }
            else {
                setValueToState(state[keySplitted[i]], keySplitted, value, ++i, found);
            }
        }
    });
}

function convertStringToBoolean (string) {
    switch (string.toLowerCase().trim()) {
        case "yes": case "true": case "1": return true;
        case "no": case "false": case "0": case null: return false;
        default: string;
    }
}

function convertStringToArray (string) {
    if (string.charAt(0) === "[" && string.charAt(string.length - 1) === "]") {
        return JSON.parse(string);
    }
    return string;
}

export function convert (string) {
    let ret = convertStringToBoolean(string);

    if (typeof ret === "boolean") {
        return ret;
    }
    ret = convertStringToArray(string);
    if (Array.isArray(ret)) {
        return ret;
    }
    return string;
}
