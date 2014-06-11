# type3

type3 is a library that allows you to manipulate occurences of strings
in your DOM tree.

```html
<!-- Before -->
<p>Hello World!</p>
```

```javascript
// Finds all occurences of 'World' and wrap them within some html
type3('World').wrap('<b>{text}</b>');
```

```html
<!-- After -->
<p>Hello <b>World</b>!</p>
```
