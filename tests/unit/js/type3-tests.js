YUI.add('type3-tests', function (Y) {

var suite = new Y.Test.Suite('type3 main tests suite');

suite.add(new Y.Test.Case({

    name: 'public exposure',

    'type3 library is available': function () {
        Y.Assert.isNotUndefined(window.type3);
    }
}));

Y.Test.Runner.add(suite);

});