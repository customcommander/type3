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
