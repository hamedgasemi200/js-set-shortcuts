A javascript package to set shortcuts, and callbacks.

+ Supports key orders
+ Supports focus mode.

## Usage

```
// Set shortcuts
let shortcuts = {
  'Control': {
    'h': () => {
      console.log("Hello World!");
    },
    '*': () => {
      console.log("You pressed other keys.");
    }
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
