const basicHookReducer = (newState, action) => {
    return typeof action === 'function' ? action(newState) : newState
  }

// 
const resolveDispatcher = (() => {
    // TODO: create hook array to accept more than 1 hook
    let _state;

    const useState = (initialState) => {
        let state = _state || initialState;
        const setState = (newState, action) => {
            // TODO: queueify the state
            _state = basicHookReducer(newState, action);
        }
        return [state, setState]
    }

    const render = (Component) => {
        const fiber = Component();
        fiber.render();
        return fiber;
    }

    return { useState, render };
})();

const useState = (initialState) => {
    const dispatcher = resolveDispatcher;
    return dispatcher.useState(initialState);
}

const render = (Component) => {
    const dispatcher = resolveDispatcher;
    return dispatcher.render(Component);
}

const App = () => {
    //TODO: setCount cannot be called with a second argument until 'action' is defined in basicHookReducer
    const [count, setCount] = useState(1);
    return {
        render: () => console.log(count),
        click: () => setCount(count + 1)
    }
}

// Simulating app on reload
var app = render(App);

// Simulating a click in the app and when it renders 
app.click();
var app = render(App);

// Simulating a click in the app and when it renders 
app.click();
var app = render(App);
