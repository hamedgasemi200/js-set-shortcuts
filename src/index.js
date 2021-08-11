module.exports = (shortcuts, block = document, is_focused = true, prevent_default = true) => {

    // ####################
    // ## Initialization ##
    // ####################

    let pressed_keys = [];

    // ####################
    // ## Event Handlers ##
    // ####################

    let handlers = {
        add_event_listeners: (except = []) => {
            // Add listeners to events
            Object.keys(events).forEach(function (event, index) {
                // Add listener
                if (!except.includes(event)) {
                    console.log(`added: ${event}`);
                    document.addEventListener(event, events[event], {capture: true});
                }
            });
        },
        remove_event_listeners: (except = []) => {
            // Remove Listeners
            Object.keys(events).forEach(function (event, index) {
                if (!except.includes(event)) {
                    console.log(`removed: ${event}`);
                    document.removeEventListener(event, events[event], {capture: true});
                }
            });
        },
        update_focus: (e) => {
            // Keep the previous state
            let was_focused = is_focused;
            let target_element = e.target; // clicked element

            // Get parents till reaching the end
            do {
                // If the target is the the block || block is the document
                is_focused = target_element === block || block === document;

                // If is focused stop the loop.
                if (is_focused) break;

                // Go up the DOM
                target_element = target_element.parentNode;
            } while (target_element);

            // If focus has changed.
            if (was_focused !== is_focused) {
                // Has been focused
                if (is_focused) handlers.add_event_listeners();
                else handlers.remove_event_listeners(['click']);
            }
        },
        run_shortcut: (e, current, depth = 1) => {
            // Iterate through the shortcuts
            keys = Object.keys(current);

            // If something has been pressed && it's not * && keys don't have the pressed key
            if (pressed_keys.length && !keys.includes('*') && !keys.includes(pressed_keys[depth - 1])) return pressed_keys = [];

            // Iterate through the keys
            keys.every(function (key, i) {
                // If shortcut key is pressed, or it's *
                if (depth <= pressed_keys.length && (pressed_keys[depth - 1] === key || key === '*')) {
                    if (typeof current[key] == 'function') {
                        // Prevent Default
                        if (prevent_default) e.preventDefault();

                        // Run the function
                        current[key](e);

                        // If it's not the *, stop iteration for searching.
                        if (key !== '*') return false;
                    }
                    // If it needs multiple keys
                    else if (typeof current[key] == 'object') {
                        // If the next depth, is lower than or equal to pressed keys length
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
            if (pressed_keys.indexOf(e.code) === -1) pressed_keys.push(e.code);

            // Listen to keys
            handlers.run_shortcut(e, shortcuts);
        },
        'keyup': (e) => {
            // Get key index
            let index = pressed_keys.indexOf(e.code);

            // If exists, remove the key.
            if (index !== -1) pressed_keys.splice(index, 1);
        },
        'click': (e) => {
            // Update focus
            handlers.update_focus(e);
        },
    };

    // Add liteners to events
    handlers.add_event_listeners(is_focused ? [] : ['keydown', 'keyup']);
};