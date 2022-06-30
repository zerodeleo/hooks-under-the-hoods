# useState
Author: <br>
https://github.com/zerodeleo/

### QUESTION: 
#### How does Hooks work under the Hoods?

<hr>

### INTRO
- Run "npm i"
- Run "npm start"

### STEP 1 - Introduction to useState

- Consider the following **codesnippet** and its **console**. <br>
- If we log **useState**, without calling it, we'll notice that it returns a **dispatcher**.<br>
- The **question** is: <br>
      - What does the **dispatcher** do? <br>
- Lets try to create the **resolver** of the dispatcher.

###### CODESNIPPET:
```javascript
import { useState } from 'react';
console.log(useState);
```

###### CONSOLE:
```javascript
ƒ useState(initialState) {
      const dispatcher = resolveDispatcher();
      return dispatcher.useState(initialState);
    }
```

**Later on, we will notice that the resolver is necessary because without it we can't update the state variable. <br> 
Without the resolver, we would need to make a getter out of the state variable which is not a part of the React API.
To solve this, the useState function is returned from a resolver**

<hr>

### STEP 2 - Resolving the Dispatcher for useState

- Consider the following **codesnippet** <br>
      - We already know (by looking at above console) that the **resolver** of the dispatcher **returns** the **useState function** in an object. <br>

```javascript
const resolveDispatcher = () => {
    return {
        useState: (initialState) => {
            // ...?
        },
        // ...
    }
}
```


- So **what** does the useState function do?  <br>
- Lets **log** the useState call and consider the **console**: <br>

###### LOG THE USESTATE CALL:
```javascript
import { useState } from 'react';
const Component = () => {
    console.log(useState());
    // ...
}
```

###### CONSOLE:
```javascript
(2) [undefined, ƒ]
      0: undefined
      1: ƒ ()
            length: 1
            name: "bound dispatchSetState"
            arguments: (...)
            caller: (...)
            [[Prototype]]: ƒ ()
            [[TargetFunction]]: ƒ dispatchSetState(fiber, queue, action)
            [[BoundThis]]: null
            [[BoundArgs]]: Array(2)
            length: 2
```

- We now know that the useState function returns an array:   <br> 
      - index 0: the **argument** being passed in <br>
      - index 1: a **f** which is a reference pointing at a **dispatcher** of **setState** with arguments **fiber**, **queue** and **action**

<hr>

### STEP 3 - Understanding the arguments of a **Hook setter dispatch**

- Consider following codesnippet and lets look at the **arguments** to a **dispatcher** of **setAnyHook**<br>
```javascript
const dispatchSetAnyHook = (fiber, queue, action) => {
      // ...
}
```

- **the Hook fiber**<br>
      - The React element (the Component that called the setter)<br>
- **the Hook queue**<br>
      - The **state** below is actually a nested **queue**:<br>
```javascript
const state: 
{
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
}
const stateAsQueue:
{
      memoizedState: 'foo',
      next: {
            memoizedState: 'bar',
            next: {
                  memoizedState: 'bar',
                  next: null
            }
      }
}
```

- **the Hook action**<br>
      - If we call the setAnyHook with a second argument being a **callback** *referred to as* **action**<br>
      What's happening **under the hoods** is that the **action** is doing something with the state object<br>
      This **action** is returning the previous state from the **queue**, see below:

```javascript
const basicHookReducer = (newState, action) => {
  return typeof action === 'function' ? action(newState) : newState
}
```

### STEP 4 - Resolving the Dispatcher for setState

- Now we know that the **setState** function takes two arguments, **newState** and **action**<br>

```javascript
const resolveDispatcher = () => {
      const useState = (initialState) => {
          const state = {
              memoizedState: initialState,
              next: null
          };
          const setState = (newState, action) => {
            // ..?
          }
          return [state, setState]
      }
}
```
- Consider the codesnippet below:
###### LOG THE SETSTATE CALL:
```javascript
import { useState } from 'react';
const Component = () => {
    console.log(setState('foo'));
    // ...
}
```

###### CONSOLE:
```javascript
undefined
```

- We now know that the setState doesn't return anything. So what does the setState do?
- We know that the dispatch of the setState does most of the job

*thank you*<br>
*https://www.the-guild.dev/blog/react-hooks-system*<br>
*https://www.youtube.com/watch?v=RnwqU9dqTr4*