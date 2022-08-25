/**
 * tries to translate the given value, factors in unwanted and known mistakes with translation if mixed value and/or keys are handed over
 * @info if you pass a string with a : in it, the string may be misleadingly interpreted as key by i18next (e.g. $t("Test:Test") => "Test")
 * @info if you pass a string with multiple : in it, the string will cut the term before the first : and replace all other : with . (e.g. $(Test:Test:test) => "Test.Test")
 * @param {String} key the value or key to translate, if this is not a translation key, it will return the value as it is
 * @param {Function} translateFunction the function to use for translation
 * @returns {String} the translation
 */
export function translateKeyWithPlausibilityCheck (key, translateFunction) {
    if (typeof key !== "string" || typeof translateFunction !== "function") {
        return "";
    }
    const translation = translateFunction(key),
        doublepointSplit = key.split(":");

    if (doublepointSplit.length > 2) {
        // this is not a valid i18next key
        return key;
    }
    else if (doublepointSplit.length === 2 && doublepointSplit[1] === translation) {
        // second term equals translation, so we assume a cut off key and thereby key as value and not a translation key
        return key;
    }
    return translation;
}
