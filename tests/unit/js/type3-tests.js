YUI.add('type3-tests', function (Y) {

var suite = new Y.Test.Suite('type3 main tests suite');

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
        Y.one('body').append('<iframe src="assets/search1.html"></iframe>');
    },

    destroy: function () {
        Y.all('iframe').remove();
    },

    'should return an array of matching texts': function () {
        this.wait(function () {
            var texts = window.frames[0].type3('foo').texts();
            Y.ArrayAssert.itemsAreSame(texts, [ 'foo_1', 'foo_2', 'foo_3', 'foo_4' ]);
        }, 100);
    }
}));

Y.Test.Runner.add(suite);

});