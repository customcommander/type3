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
            '            <li>xxx yyy zzz</li>',
            '            <li>xxx yyy zzz</li>',
            '            <li>xxx yyy zzz</li>',
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
});
