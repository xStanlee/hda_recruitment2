function lowercaseTransformator(el) {
    return el.toLocaleLowerCase();
}

function isEmpty(el) {
    return el === '' ? true : false;
}

function isNumber(el) {
    return isNaN(el) ? true : false;
}

export { lowercaseTransformator, isEmpty, isNumber }
