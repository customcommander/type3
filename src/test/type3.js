var expect = window.chai.expect;

describe('type3', function () {

    describe('called as a constructor', function () {
        it('should return an instance of type3', function () {
            expect(new type3('foo')).to.be.instanceOf(type3);
        });
    });

    describe('called as a function call', function () {
        it('should return an instance of type3', function () {
            expect(type3('foo')).to.be.instanceOf(type3);
        });
    });
});