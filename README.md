# type3

type3 is a library that allows you to manipulate occurences of strings
in your DOM tree.

```html
<!-- Before -->
<p>Hello World!</p>
```

```javascript
type3('World').wrap('<b>{text}</b>');
```

```html
<!-- After -->
<p>Hello <b>World</b>!</p>
```
