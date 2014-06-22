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

