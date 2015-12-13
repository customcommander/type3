(function (root, factory) {

    root.type3 = factory();

}(this, function () {

    var type3;

    function checkArguments(fn) {
        return function (node, pattern) {
            if (!(node instanceof Node) || node.nodeType !== Node.ELEMENT_NODE) {
                throw new TypeError('expected `node` to be an element node');
            }
            if (typeof pattern !== 'string' && !(pattern instanceof RegExp)) {
                throw new TypeError('expected `pattern` to be either a string or a regular expression');
            }
            return fn(node, pattern);
        };
    }

    function findTextNodes(node, pattern, lazy) {
        var txtNodes = [];
        var stop = false;
        var walker;

        if (typeof pattern === 'string') {
            pattern = new RegExp(pattern);
        }

        walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
            acceptNode: function (txtNode) {
                return pattern.test(txtNode.data) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        });

        while (walker.nextNode() && !stop) {
            txtNodes.push(walker.currentNode);
            stop = lazy === true;
        }

        return txtNodes;
    }

    type3 = {
        /**
         * Returns true if a node matches given pattern.
         *
         * Returns false if the pattern wasn't found.
         *
         * @method hasText
         * @param node {Element} The node to look into.
         * @param pattern {String|RegExp} The pattern to look for.
         * @return {Boolean}
         */
        hasText: checkArguments(function (node, pattern) {
            var res = findTextNodes(node, pattern, true);
            return res.length === 1;
        }),

        /**
         * Returns the first text node matching given pattern within given node.
         *
         * Returns null if the pattern wasn't found.
         *
         * @method queryText
         * @param node {Element} The node to look into.
         * @param pattern {String|RegExp} The pattern to look for.
         * @return {Text}
         */
        queryText: checkArguments(function (node, pattern) {
            var res = findTextNodes(node, pattern, true);
            return res.length === 1 ? res[0] : null;
        }),

        /**
         * Returns an array of all the text nodes matching given pattern within given node.
         *
         * Returns an empty array if the pattern wasn't found
         *
         * @method queryTextAll
         * @param node {Element} The node to look into.
         * @param pattern {String|RegExp} The pattern to look for.
         * @return {Text[]}
         */
        queryTextAll: checkArguments(function (node, pattern) {
            return findTextNodes(node, pattern);
        })
    };

    return type3;
}));