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
                if (!except.includes(event)) document.addEventListener(event, events[event], true);
            });
        },
        remove_event_listeners: (except = []) => {
            // Remove Listeners
            Object.keys(events).forEach(function (event, index) {
                if (!except.includes(event)) document.removeEventListener(event, events[event], true);
            });
        },
        update_focus: (e = true) => {
            // Keep the previous state
            let was_focused = is_focused;

            // If e is an event object.
            if (typeof e === 'object') {
                // Get the clicked dom element
                let target_element = e.target;

                // Get parents till reaching the end
                do {
                    // If the target is the the block || block is the document
                    is_focused = target_element === block || block === document;

                    // If is focused stop the loop.
                    if (is_focused) break;

                    // Go up the DOM
                    target_element = target_element.parentNode;
                } while (target_element && target_element !== document.body); // run till it exists, and is not the body
            } else is_focused = update_to;

            // If focus has changed.
            if (was_focused !== is_focused) {
                // Has been focused
                if (is_focused) handlers.add_event_listeners();
                else handlers.remove_event_listeners(['click']);
            }
        },
        run_shortcut: (e, current, depth = 1) => {
            // Iterate through the shortcuts
            shortcut_keys = Object.keys(current);

            // If something has been pressed && shortcuts don't have * && the pressed key is not in shortcuts
            if (pressed_keys.length && !shortcut_keys.includes('*') && !shortcut_keys.includes(pressed_keys[depth - 1])) return pressed_keys = [];

            // Iterate through the shortcut keys
            shortcut_keys.every(function (key, i) {
                // If the pressed key == shortcut key, or it's *
                if (pressed_keys[depth - 1] === key || key === '*') {

                    // If shortcut is a function
                    if (typeof current[key] == 'function') {
                        // Prevent Default
                        if (prevent_default) e.preventDefault();

                        // Run the function
                        current[key](e);

                        // If shortcut key is not '*'
                        if (key !== '*') {
                            // If after the pressed key, * exists
                            if (shortcut_keys.indexOf('*') > shortcut_keys.indexOf(key)) {
                                // Run * shortcut
                                current['*'](e);
                            }

                            // stop searching for other shortcut keys.
                            return false;
                        }
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
        clear_keys_on_popup: function (type, original) {
            // Update the previous popup
            window[type] = function () {
                // Run the original alert
                original.apply(window, arguments);

                // Remove all key pressed
                pressed_keys = [];
            };
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
        "visibilitychange": (e) => {
            // If tab is not focused, remove the pressed keys
            if (document.visibilityState != "visible") pressed_keys = [];
        },
        'click': (e) => {
            // Update focus
            handlers.update_focus(e);
        },
    };

    // Add liteners to events => If it's focused, add no exception, else, remove everything except 'click'.
    handlers.add_event_listeners(is_focused ? [] : Object.keys(events).filter(item => !['click'].includes(item)));

    // Clear keys on alert/prompt/confirm popups.
    handlers.clear_keys_on_popup('confirm', window.confirm);
    handlers.clear_keys_on_popup('prompt', window.prompt);
    handlers.clear_keys_on_popup('alert', window.alert);
};