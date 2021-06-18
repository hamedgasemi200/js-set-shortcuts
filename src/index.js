module.exports = (shortcuts, block = document, is_focused = true, prevent_default = true) => {

    // ####################
    // ## Initialization ##
    // ####################

    let pressed_keys = [];

    // ####################
    // ## Event Handlers ##
    // ####################

    let handlers = {
        add_event_listeners: () => {
            // Add listeners to events
            Object.keys(events).forEach(function (event, index) {
                // Add listener
                document.addEventListener(event, events[event]);
            });
        },
        update_focus: (e) => {
            if (block === document) return is_focused = true;

            // Update focus
            let was_focused = is_focused;
            is_focused = e.target === block || block === document.activeElement;

            // if focus has changed
            if (was_focused !== is_focused) {
                // if unfocused
                if (!is_focused) {
                    // Remove Listeners
                    Object.keys(events).forEach(function (event, index) {
                        if (event !== 'click') document.removeEventListener(event, events[event]);
                    });
                } else handlers.add_event_listeners();
            }
        },
        run_shortcut: (e, current, depth = 1) => {
            // Iterate through the shortcuts
            keys = Object.keys(current);
            if (pressed_keys.length && !keys.includes('*') && !keys.includes(pressed_keys[depth - 1])) return pressed_keys = [];

            // Iterate through the keys
            keys.every(function (key, i) {
                // If key is pressed, or it's *
                if (depth <= pressed_keys.length && (pressed_keys[depth - 1] === key || key === '*')) {
                    if (typeof current[key] == 'function') {
                        // Prevent Default
                        if (prevent_default) e.preventDefault();

                        // Run the function
                        current[key](e);
                        return false;
                    }
                    // If it needs multiple keys
                    else if (typeof current[key] == 'object') {
                        // If the next depth, is lower or equal to pressed keys
                        if (depth + 1 <= pressed_keys.length) handlers.run_shortcut(e, current[key], depth + 1);
                    }
                }

                return true;
            });
        },
    };

    // #####################
    // ## Document Events ##
    // #####################

    let events = {
        'keydown': (e) => {
            // If key not found, push to pressed keys
            if (pressed_keys.indexOf(e.key) === -1) pressed_keys.push(e.key);

            // Listen to keys
            handlers.run_shortcut(e, shortcuts);
        },
        'keyup': (e) => {
            // Get key index
            let index = pressed_keys.indexOf(e.key);

            // If exists, remove the key.
            if (index !== -1) pressed_keys.splice(index, 1);
        },
        'click': (e) => {
            // Update focus
            handlers.update_focus(e);
        },
        DOMContentLoaded: (e) => {
            if (document !== block) handlers.update_focus(e);
        },
    };

    // Add liteners to events
    handlers.add_event_listeners();
};
