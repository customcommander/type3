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
        Y.later(200, null, function () {
            var i;
            for ( i = 0; i < window.frames.length; i++ ) {
                if ( window.frames[i].name === ifrm_name ) {
                    resolve( window.frames[i] );
                    break;
                }
            }
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
    },

    'type3(text, scope) - should throw an error if scope is not a node': function () {
        Y.Assert.throwsError(TypeError, function () {
            type3('foo', {});
        });
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

    'if a scope is not given, returns all matching text nodes': function () {

        var test = this;

        dropIframe('assets/nodes-tests.html').then(function (frm) {
            test.resume(function () {
                var nodes = frm.type3('foo').nodes();
                Y.ArrayAssert.itemsAreSame(nodes, [
                    frm.document.getElementById('txt1').firstChild,
                    frm.document.getElementById('txt2').firstChild,
                    frm.document.getElementById('txt3').firstChild,
                    frm.document.getElementById('txt4').firstChild,
                    frm.document.getElementById('txt5').firstChild,
                    frm.document.getElementById('txt6').firstChild,
                    frm.document.getElementById('txt7').firstChild,
                    frm.document.getElementById('txt8').firstChild,
                    frm.document.getElementById('txt9').firstChild
                ]);
            });
        });

        this.wait();
    },

    'if a scope is given, returns the matching text nodes within that scope only': function () {

        var test = this;

        dropIframe('assets/nodes-tests.html').then(function (frm) {
            test.resume(function () {
                var nodes = frm.type3('foo', frm.document.getElementById('txtset2')).nodes();
                Y.ArrayAssert.itemsAreSame(nodes, [
                    frm.document.getElementById('txt6').firstChild,
                    frm.document.getElementById('txt7').firstChild,
                    frm.document.getElementById('txt8').firstChild,
                    frm.document.getElementById('txt9').firstChild
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
    },

    'should wrap a text with a string': function () {

        var test = this;

        dropIframe('assets/wrap-tests.html').then(function (frm) {
            test.resume(function () {
                var scope = frm.document.getElementById('text2');
                frm.type3('world', scope).wrap('@@{text}@@');
                Y.Assert.areSame('hello @@world@@', scope.textContent);
            });
        });

        this.wait();
    },

    'should be able to wrap multiple matches within a text node': function () {

        var test = this;

        dropIframe('assets/wrap-tests.html').then(function (frm) {
            test.resume(function () {
                var scope = frm.document.getElementById('text3');
                frm.type3('bbb', scope).wrap('<b class="multi">{text}</b>');
                Y.Assert.areSame(2, Y.one(scope).all('.multi').size());
            });
        });

        this.wait();
    },

    'multiple matches should update the return value of nodes()': function () {

        var test = this;

        dropIframe('assets/wrap-tests.html').then(function (frm) {
            test.resume(function () {
                var scope = frm.document.getElementById('text3');
                var search = frm.type3('bbb', scope);
                var nodes1 = search.nodes();                       // only one text node with two occurences
                var nodes2 = search.wrap('<b>{text}</b>').nodes(); // two text nodes with one occurence each
                Y.Assert.areNotSame(nodes1.length, nodes2.length);
            });
        });

        this.wait();
    },

    'test multiple matches on a node with mixed types children': function () {

        var test = this;

        dropIframe('assets/wrap-tests.html').then(function (frm) {
            test.resume(function () {
                var scope = frm.document.getElementById('text4');
                var child;

                frm.type3('bar', scope).wrap('<b class="bar">{text}</b>');

                Y.Assert.isTrue(/^\s+foo\s+bar\s+foo\s+bar\s+bar\s+$/.test(scope.textContent),
                    'node text should not have changed');

                Y.Assert.areSame(3, Y.one(scope).all('.bar').size(),
                    'expected all "bar" occurences to have been properly wrapped');
            });
        });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: '.remove()',

    setUp: function () {
        removeIframes();
    },

    tearDown: function () {
        removeIframes();
    },

    'should remove all occurences': function () {

        var test = this;

        dropIframe('assets/remove-tests.html').then(function (frm) {
            test.resume(function () {
                var para = frm.document.getElementById('para1');
                frm.type3('foo').remove();
                Y.Assert.isTrue( para.textContent.indexOf('foo') < 0 );
            });
        });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: '.replace(substitute)',

    setUp: function () {
        removeIframes();
    },

    tearDown: function () {
        removeIframes();
    },

    'throws an error if substitute is not a string': function () {
        Y.Assert.throwsError(TypeError, function () {
            type3('foo').replace([]);
        });
    },

    'should replace all occurences with a string': function () {

        var test = this;

        dropIframe('assets/replace-tests.html').then(function (frm) {
            test.resume(function () {
                var para   = Y.one(frm.document).one('#text1');
                var re_txt = new RegExp(
                        '\^' +
                        '\\s+bar xxx xxx xxx xxx xxx xxx' +
                        '\\s+xxx bar xxx xxx xxx xxx xxx' +
                        '\\s+xxx xxx bar xxx xxx xxx xxx' +
                        '\\s+xxx xxx xxx bar xxx xxx xxx' +
                        '\\s+xxx xxx xxx xxx bar xxx xxx' +
                        '\\s+xxx xxx xxx xxx xxx bar xxx' +
                        '\\s+xxx xxx xxx xxx xxx xxx bar' +
                        '\\s+\$'
                    );
                frm.type3('foo').replace('bar');
                Y.Assert.isTrue( re_txt.test( para.get('text') ) );
            });
        });

        this.wait();
    },

    'should replace all occurences with some html': function () {

        var test = this;

        dropIframe('assets/replace-tests.html').then(function (frm) {
            test.resume(function () {
                var para = Y.one(frm.document).one('#text1');
                var re_txt = new RegExp(
                        '\^' +
                        '\\s+<b>bar</b> xxx xxx xxx xxx xxx xxx' +
                        '\\s+xxx <b>bar</b> xxx xxx xxx xxx xxx' +
                        '\\s+xxx xxx <b>bar</b> xxx xxx xxx xxx' +
                        '\\s+xxx xxx xxx <b>bar</b> xxx xxx xxx' +
                        '\\s+xxx xxx xxx xxx <b>bar</b> xxx xxx' +
                        '\\s+xxx xxx xxx xxx xxx <b>bar</b> xxx' +
                        '\\s+xxx xxx xxx xxx xxx xxx <b>bar</b>' +
                        '\\s+\$'
                    );
                frm.type3('foo').replace('<b>bar</b>');
                Y.Assert.isTrue( re_txt.test( para.get('innerHTML') ), 'expected a different innerHTML' );
                Y.Assert.isTrue( 7 === para.all('b').size()          , 'expected 7 <b> nodes' );
            });
        });

        this.wait();
    },

    'should delete all occurences if substitute is an empty string': function () {

        var test = this;

        dropIframe('assets/replace-tests.html').then(function (frm) {
            test.resume(function () {
                var para       = Y.one(frm.document).one('#text1');
                var re_content = new RegExp(
                        '\^' +
                        '\\s+ xxx xxx xxx xxx xxx xxx' +
                        '\\s+xxx  xxx xxx xxx xxx xxx' +
                        '\\s+xxx xxx  xxx xxx xxx xxx' +
                        '\\s+xxx xxx xxx  xxx xxx xxx' +
                        '\\s+xxx xxx xxx xxx  xxx xxx' +
                        '\\s+xxx xxx xxx xxx xxx  xxx' +
                        '\\s+xxx xxx xxx xxx xxx xxx ' +
                        '\\s+\$'
                    );
                    frm.type3('foo').replace('');
                    Y.Assert.isTrue( re_content.test( para.get('text') ) );
            });
        });

        this.wait();
    }
}));

suite.add(new Y.Test.Case({

    name: '.count()',

    'returns the number of occurences': function () {

        var test = this;

        dropIframe('assets/count-tests.html').then(function (frm) {
            test.resume(function () {
                Y.Assert.areSame(19, frm.type3('foo').count());
            });
        });

        this.wait();
    },

    'returns 0 if not found': function () {

        var test = this;

        dropIframe('assets/count-tests.html').then(function (frm) {
            test.resume(function () {
                Y.Assert.areSame(0, frm.type3('not_found').count());
            });
        });

        this.wait();
    }
}));

Y.Test.Runner.add(suite);

});