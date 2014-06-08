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
        Y.Assert.isInstanceOf(type3, type3()    , 'a function call should return an instance of type3');
        Y.Assert.isInstanceOf(type3, new type3(), 'a constructor call should return an instance of type3');
    }
}));

Y.Test.Runner.add(suite);

});