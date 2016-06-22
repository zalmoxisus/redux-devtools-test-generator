Redux DevTools Test Generator
==============================

[Watch my presentation at React Europe](https://youtu.be/cbXLohVbzNI?t=392) to see how it works.

### Installation

```
npm install --save-dev redux-devtools-test-generator
```

### Usage

Use with [`redux-devtools`](https://github.com/gaearon/redux-devtools) and [`redux-devtools-inspector`](https://github.com/alexkuz/redux-devtools-inspector) (support for [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) will come later).

##### `containers/DevTools.js`

```js
import React from 'react';
import { createDevTools } from 'redux-devtools';
import Inspector from 'redux-devtools-inspector';
import TestGenerator from 'redux-devtools-test-generator';
import mochaTemplate from 'redux-devtools-test-generator/lib/redux/mocha'; // If using default tests.

export default createDevTools(
  <Inspector
    customTabs={{
      'Test': <TestGenerator expect={mochaTemplate.expect} wrap={mochaTemplate.wrap} />
    }}
  />
);
```

Instead of `mochaTemplate.expect` and `mochaTemplate.wrap` you can use your function templates.

Also include `codemirror/lib/codemirror.css` style and optionally themes from `codemirror/theme/`.

### Props

Name                  | Description
-------------         | -------------
`expect`              | Function with `action`, `prevState`, `curState` arguments, which returns a string representing the assertion ([see the example](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha.js#L1-L3)).
[`wrap`]              | Optional function which gets `expects` argument and returns a string ([see the example](https://github.com/zalmoxisus/redux-devtools-test-generator/blob/master/src/redux/mocha.js#L5-L14)).
[`theme`]             | Name of [the codemirror theme](https://codemirror.net/demo/theme.html) as a string.

### License

MIT

## Created By

If you like this, follow [@mdiordiev](https://twitter.com/mdiordiev) on twitter.
