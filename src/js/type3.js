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
    var textnodes = [];
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
    var textnodes = get_textnodes(node);
    return array_filter(textnodes, function (textnode) {
        return textnode.textContent.indexOf(text) > -1;
    });
}

/**
 * Breaks a text node into small chunks so that each occurence of `str` is
 * contained in its own text node.
 *
 * @example
 *     // Before:
 *     // <p>
 *     //     <TextNode>foo bar foo bar</TextNode>
 *     // </p>
 *
 *     split_text(textnode, 'bar');
 *
 *     // After:
 *     // <p>
 *     //     <TextNode>foo </TextNode>
 *     //     <TextNode>bar</TextNode>
 *     //     <TextNode> foo </TextNode>
 *     //     <TextNode>bar</TextNode>
 *     // </p>
 *
 * @param txtn {Text} A text node to split
 * @param str {String} A string within a text node
 * @return {Text[]}
 * @private
 */
function split_text(txtn, str) {

    var ret = [];
    var idx = txtn.textContent.indexOf( str );

    while ( idx > -1 ) {
        txtn.splitText( idx );
        txtn.nextSibling.splitText( str.length );
        ret.push( txtn );
        ret.push( txtn.nextSibling );
        ret.push( txtn.nextSibling.nextSibling );
        txtn = txtn.nextSibling.nextSibling;
        idx  = txtn.textContent.indexOf( str );
    }

    return ret;
}

/**
 * @class type3
 * @constructor
 * @param text {String} The string to look for in text nodes.
 */
function type3(text, scope) {

    if ( !(this instanceof type3) ) {
        return new type3(text, scope);
    }

    if (typeof text !== 'string') {
        throw new TypeError('type3: text is not a string');
    } else if (!text) {
        throw new TypeError('type3: text is empty');
    }

    if ( typeof scope !== 'undefined' &&
        ( !(scope instanceof Node) || scope.nodeType !== Node.ELEMENT_NODE) ) {
        throw new TypeError('type3: scope is not an element node');
    }

    if (!scope) {
        scope = document.documentElement;
    }

    this._text      = text;
    this._textnodes = find_textnodes(text, scope);
}

type3.prototype = {

    /**
     * Returns an array of matching text nodes.
     *
     * @for type3
     * @method nodes
     * @returns {Text[]} Matching text nodes or null if there is no match.
     */
    nodes: function () {
        return this._textnodes.length ? this._textnodes : null;
    },

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
    },

    /**
     * Wraps all occurences of a string.
     *
     * The wrapper can have a `{text}` placeholder that will be replaced with the string.
     *
     * @example
     *     // Before:
     *     // <p>Hello World</p>
     * 
     *     type3('World').wrap('<b>{text}</b>');
     * 
     *     // After:
     *     // <p>Hello <b>World</b></p>
     *
     * @for type3
     * @method wrap
     * @param wrapper {String} e.g. '&lt;b&gt;{text}&lt;/b&gt;'
     * @chainable
     */
    wrap: function (wrapper) {

        var text = this._text;
        var new_textnodes = [];
        var wrapper_node;

        if (typeof wrapper !== 'string') {
            throw new TypeError('type3: wrapper is not a string');
        }

        wrapper_node = document.createElement('div');
        wrapper_node.innerHTML = wrapper.replace('{text}', text);
        wrapper_node = wrapper_node.firstChild;

        array_each(this._textnodes, function (txtn) {

            var parent = txtn.parentNode,
                to_wrap;

            to_wrap = array_filter(split_text(txtn, text), function (txtn) {
                return txtn.textContent === text;
            });

            array_each(to_wrap, function (txtn) {
                var new_node = wrapper_node.cloneNode(true);
                parent.replaceChild(new_node, txtn);
                new_textnodes.push( get_textnodes(new_node)[0] );
            });

            parent.normalize();
        });

        this._textnodes = new_textnodes;

        return this;
    },

    /**
     * Removes all occurences of a string.
     *
     * @example
     *     // Before:
     *     // <p>
     *     //     foo
     *     //     <span>foo bar</span>
     *     // </p>
     *
     *     type3('foo').remove();
     *
     *     // After:
     *     // <p>
     *     //     <span> bar</span>
     *     // </p>
     *
     * @for type3
     * @method remove
     */
    remove: function () {

        var txt = this._text;

        array_each(this._textnodes, function (txtn) {

            var del, parent = txtn.parentNode;

            del = array_filter(split_text(txtn, txt), function (txtn) {
                return txtn.textContent === txt;
            });

            array_each(del, function (txtn) {
                parent.removeChild(txtn);
            });

            parent.normalize();
        });

        delete this._textnodes;
    }
};

window.type3 = type3;

}());