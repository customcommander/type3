(function () {


var
    arrayify = function (thing) {
        return Array.prototype.slice.call(thing);
    },

    array_each = (Array.prototype.forEach ?
        function (arr, fn) {
            arr.forEach(fn);
        } :
        function (arr, fn) {
            var i;
            for (i=0; i<arr.length; i++) {
                fn( arr[i] );
            }
        }),

    array_map = (Array.prototype.map ?
        function (arr, fn) {
            return arr.map(fn);
        } :
        function (arr, fn) {
            var i, new_arr = [];
            for (i=0; i<arr.length; i++) {
                new_arr.push( fn(arr[i]) );
            }
            return new_arr;
        }),

    array_filter = (Array.prototype.filter ?
        function (arr, fn) {
            return arr.filter(fn);
        } :
        function (arr, fn) {
            var i, new_arr = [];
            for (i=0; i<arr.length; i++) {
                if ( fn(arr[i]) ) {
                    new_arr.push( arr[i] );
                }
            }
            return new_arr;
        });

/**
 * Returns all text nodes within a given element node.
 *
 * @private
 * @param node {HTMLElement} An element node
 * @return {Text[]}
 */
function get_textnodes(node) {
    var i, textnodes = [];
    array_each(arrayify(node.childNodes), function (child) {
        if ( child.nodeType === Node.ELEMENT_NODE ) {
            textnodes = textnodes.concat( get_textnodes(child) );
        } else if ( child.nodeType === Node.TEXT_NODE ) {
            textnodes.push( child );
        }
    });
    return textnodes;
}

/**
 * Returns all text nodes that contains a given text.
 *
 * @private
 * @param text {String} The string to look for.
 * @param node {HTMLElement} An element node with text nodes to inspect.
 * @return {Text[]}
 */
function find_textnodes(text, node) {
    var i, textnodes = get_textnodes(node);
    return array_filter(textnodes, function (textnode) {
        return textnode.textContent.indexOf(text) > -1;
    });
}

/**
 * @class type3
 * @constructor
 * @param text {String} The string to look for in text nodes.
 */
function type3(text) {

    if ( !(this instanceof type3) ) {
        return new type3(text);
    }

    if (typeof text !== 'string') {
        throw new TypeError('type3: text is not a string');
    } else if (!text) {
        throw new TypeError('type3: text is empty');
    }

    this._textnodes = find_textnodes(text, document.documentElement);
}

type3.prototype = {

    /**
     * Returns an array of matching texts.
     *
     * @for type3
     * @method texts
     * @return {String[]}
     */
    texts: function () {
        return array_map(this._textnodes, function (textnode) {
            return textnode.textContent;
        });
    }
};

window.type3 = type3;

}());