# type3

**type3** is a micro library aiming at processing occurences of strings in your DOM.

Example:

```html
<!-- Before -->
<p>
    fooxxx
    <strong>fooxxx fooxxx</strong>
</p>
```

```javascript
// search all occurences of 'xxx' and replace them with 'bar'
type3('xxx').replace('bar');
```

```html
<!-- After -->
<p>
    foobar
    <strong>foobar foobar</strong>
</p>
```
### API

##### .nodes()

Returns an array of matching text nodes.

##### .texts()

Returns an array of matching texts.

##### .count()

Returns the number of occurences in a set of matching texts.

```javascript

    // <p>
    //     foobar
    //     <strong>
    //         <em>foobar foobar</em>
    //     </strong>
    //     foobar
    // </p>

    type3('foo').count();
    //=> 4
```

##### .wrap(wrapper)

Wraps all occurences of a string.

The wrapper can have a `{text}` placeholder that will be replaced with the string.

```javascript

    // Before:
    // <p>Hello World</p>

    type3('World').wrap('<b>{text}</b>');

    // After:
    // <p>Hello <b>World</b></p>
```

##### .remove()

Removes all occurences of a string.

```javascript

    // Before:
    // <p>
    //     foo
    //     <span>foo bar</span>
    // </p>

    type3('foo').remove();

    // After:
    // <p>
    //     <span> bar</span>
    // </p>
```

##### .replace(substitute)

Replaces all occurences with given substitution string.

```javascript

    // Before:
    // <p>
    //     xxx
    //     <span>xxx bar</span>
    //     xxx
    // </p>

    type3('xxx').replace('foo');

    // After:
    // <p>
    //     foo
    //     <span>foo bar</span>
    //     foo
    // </p>
```

