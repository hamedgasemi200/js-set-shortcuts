A javascript package to set shortcuts, and callbacks.

+ Supports nested key order.
+ Supports focus mode.

## installation

```
npm i td-set-shortcuts
```

And:

```
window.setShortcut = require('td-set-shortcuts');
```

## Usage

```
// Set shortcuts
let shortcuts = {
   'ControlLeft': {
      'KeyH': () => {
         console.log("Hello World!");
      },
      '*': (e) => {
         if(e.key !== 'h') console.log("You pressed [control + other keys]!");
      },
   }
};

// Set the block in which commands should be executed (default: document).
let block = document;

// Set if the block is focused by default or not. (default: true).
let is_focused = true;

// Set if preventDefault should be executed (default: true)
let prevent_default = true;

// Run the package.
setShortcut(shortcuts, block, is_focused, prevent_default);
```

> Note: Do not use alert in callback functions. When alert is executed, the keyup won't get fired, and the library won't work correctly.
