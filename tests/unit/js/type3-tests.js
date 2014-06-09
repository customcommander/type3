YUI.add('type3-tests', function (Y) {

var suite = new Y.Test.Suite('type3 main tests suite');

/**
 * Drops an iframe on a page and resolves after 100 ms.
 *
 * @param src {String} The url of the iframe
 * @return {Promise} Resolves after 100ms and passes a reference to the iframe to the callback.
 */
function dropIframe(src) {

    var ifrm_name = Y.guid('ifrm');

    Y.one('body').append(
        Y.Lang.sub('<iframe src="{src}" name="{name}"></iframe>', {
            src: src,
            name: ifrm_name
        })
    );

    return new Y.Promise(function (resolve) {
        Y.later(100, null, function () {
            var i = 0, ifrm;
            do {
                ifrm = window.frames[i];
                i++;
            } while ( ifrm.name !== ifrm_name && i<window.frames.length );
            resolve(ifrm);
        });
    });
}

/**
 * Removes all iframes on the page.
 */
function removeIframes() {
    Y.all('iframe').remove();
}

suite.add(new Y.Test.Case({

    name: 'public exposure',

    'type3 library is available': function () {
        Y.Assert.isNotUndefined(window.type3);
    }
}));

suite.add(new Y.Test.Case({

    name: 'creating an instance',

    'creating an instance': function () {
        Y.Assert.isInstanceOf(type3, type3('foo')    , 'a function call should return an instance of type3');
        Y.Assert.isInstanceOf(type3, new type3('foo'), 'a constructor call should return an instance of type3');
    },

    'type3(text) - should throw an error if text is not a string': function () {

        function assert_it_throws(thing) {

            var msg = Y.Lang.sub('expected failure because text is a "{type}"', {
                type: Object.prototype.toString.call(thing)
            });

            Y.Assert.throwsError(TypeError, function () {
                type3(thing);
            }, msg);
        }

        assert_it_throws(99);
        assert_it_throws([]);
        assert_it_throws({});
        assert_it_throws(null);
    },

    'type3(text) - should throw an error if text is empty': function () {
        Y.Assert.throwsError(TypeError, function () {
            type3('');
        }, 'expected failure because text is an empty string ("")');
    }
}));

suite.add(new Y.Test.Case({

    name: '.texts()',

    init: function () {
        removeIframes();
    },

    destroy: function () {
        removeIframes();
    },

    'should return an array of matching texts': function () {

        var test = this;

        dropIframe('assets/search1.html').then(function (frm) {
            test.resume(function () {
                var texts = frm.type3('foo').texts();
                Y.ArrayAssert.itemsAreSame(texts, [ 'foo_1', 'foo_2', 'foo_3', 'foo_4' ]);
            });
        });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: '.nodes()',

    init: function () {
        removeIframes();
    },

    tearDown: function () {
        removeIframes();
    },

    'should return an array of matching text nodes': function () {

        var test = this;

        dropIframe('assets/nodes-tests.html').then(function (frm) {
            test.resume(function () {
                var nodes = frm.type3('foo').nodes();
                Y.ArrayAssert.itemsAreSame(nodes, [
                    frm.document.getElementById('txt1').firstChild,
                    frm.document.getElementById('txt2').firstChild,
                    frm.document.getElementById('txt3').firstChild,
                    frm.document.getElementById('txt4').firstChild,
                    frm.document.getElementById('txt5').firstChild
                ]);
            });
        });

        this.wait();
    },

    'should return null if there is no match': function () {

        var test = this;

        dropIframe('assets/nodes-tests.html').then(function (frm) {
            test.resume(function () {
                Y.Assert.isNull( frm.type3('unknown').nodes() );
            });
        });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: '.wrap(wrapper)',

    setUp: function () {
        removeIframes();
    },

    tearDown: function () {
        removeIframes();
    },

    'should throw if wrapper is not a string': function () {
        Y.Assert.throwsError(TypeError, function () {
            type3('xxx').wrap([]);
        });
    },

    'should wrap a text with html': function () {

        var test = this;

        dropIframe('assets/wrap-tests.html').then(function (frm) {
            test.resume(function () {
                frm.type3('bar').wrap('<strong id="wrapped1">{text}</strong>');
                Y.Assert.isNotNull( Y.one(frm.document).one('#wrapped1') );
            });
        });

        this.wait();
    }
}))

Y.Test.Runner.add(suite);

});