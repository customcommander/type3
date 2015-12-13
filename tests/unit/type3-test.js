/* global type3 */
/* global chai */

var expect = chai.expect;

describe('type3', function () {

    var doc;

    function createDocument(html) {
        var doc  = document.implementation.createHTMLDocument();
        doc.body.outerHTML = html;
        return doc;
    }

    beforeEach(function () {
        doc = createDocument([
            '<div>',
            '    <p>Some text here</p>',
            '    <div>',
            '        <p>Some text here</p>',
            '        <div>',
            '            <p>Some text here</p>',
            '        </div>',
            '    </div>',
            '</div>',
            '<p>',
            '    <ul>',
            '        <li>aaa bbb ccc</li>',
            '        <li>aaa bbb ccc</li>',
            '        <li>aaa bbb ccc</li>',
            '        <ul>',
            '            <li id="xyz1">xxx yyy zzz</li>',
            '            <li id="xyz2">xxx yyy zzz</li>',
            '            <li id="xyz3">xxx yyy zzz</li>',
            '        </ul>',
            '    </ul>',
            '</p>'
        ].join(''));
    });

    it('should be defined', function () {
        expect(type3).not.to.be.undefined;
    });

    describe('.hasText(node, pattern)', function () {

        it('should return true if a node matches given text', function () {
            expect(type3.hasText(doc.body, 'xxx')).to.be.true;
            expect(type3.hasText(doc.body, /xxx/)).to.be.true;
        });

        it('should return false if a node does not match given text', function () {
            expect(type3.hasText(doc.body, 'unknown text')).to.be.false;
            expect(type3.hasText(doc.body, /unknown text/)).to.be.false;
        });

        it('should throw if node is not an element', function () {
            expect(function () {
                type3.hasText({ nodeType: 1 }, 'xxx');
            }).to.throw(TypeError);
        });

        it('should throw if `pattern` is neither a string nor a regular expression', function () {
            expect(function () {
                type3.hasText(doc.body, []);
            }).to.throw(TypeError);
        });
    });

    describe('.queryText()', function () {

        it('should return null if a node does not contain given text', function () {
            expect(type3.queryText(doc.body, 'unknown text')).to.be.null;
            expect(type3.queryText(doc.body, /unknown text/)).to.be.null;
        });

        it('should return the first text node that matches given text', function () {
            var expected = doc.body.querySelector('#xyz1').firstChild;
            expect(type3.queryText(doc.body, 'yyy')).to.eq(expected);
            expect(type3.queryText(doc.body, /yyy/)).to.eql(expected);
        });

        it('should throw if node is not an element', function () {
            expect(function () {
                type3.queryText({ nodeType: 1 }, 'xxx');
            }).to.throw(TypeError);
        });

        it('should throw if `txt` is neither a string nor a regular expression', function () {
            expect(function () {
                type3.queryText(doc.body, []);
            }).to.throw(TypeError);
        });
    });

    describe('.queryTextAll()', function () {

        it('should return an empty array if a node does not contain given text', function () {
            expect(type3.queryTextAll(doc.body, 'unknown text')).to.deep.eq([]);
            expect(type3.queryTextAll(doc.body, /unknown text/)).to.deep.eq([]);
        });

        it('should return an array of all text nodes matching given text', function () {
            var expected = [];
            expected.push( doc.body.querySelector('#xyz1').firstChild );
            expected.push( doc.body.querySelector('#xyz2').firstChild );
            expected.push( doc.body.querySelector('#xyz3').firstChild );
            expect(type3.queryTextAll(doc.body, 'yyy')).to.deep.eq(expected);
            expect(type3.queryTextAll(doc.body, /yyy/)).to.deep.eq(expected);
        });

        it('should throw if node is not an element', function () {
            expect(function () {
                type3.queryTextAll({ nodeType: 1 }, 'xxx');
            }).to.throw(TypeError);
        });

        it('should throw if `txt` is neither a string nor a regular expression', function () {
            expect(function () {
                type3.queryTextAll(doc.body, []);
            }).to.throw(TypeError);
        });
    });

});
