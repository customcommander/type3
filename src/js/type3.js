(function () {

/**
 * @class type3
 * @constructor
 * @param text {String} The string to look for in text nodes.
 */
function type3(text) {
    if ( !(this instanceof type3) ) {
        return new type3(text);
    }
}

window.type3 = type3;

}());