# useState
Author: <br>
https://github.com/zerodeleo/

### QUESTION: 
#### How does Hooks work under the Hoods?

<hr>

### **INTRO**
```shell
    npm i
    npm start
```
- Hooks under the Hoods is trying to simplify the way hooks work behind the scenes
- App.js is simulating a React component and its hooks by pure JS
- Read this README and consider it when following App.js
<br>

### **STEP 1** - Introduction to useState

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

### **STEP 2** - Resolving the Dispatcher for useState

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

### **STEP 3** - Understanding the arguments of a **Hook setter dispatch**

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

### **STEP 4** - Resolving the Dispatcher for setState

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
    - The answer has already been answered (in a simplified context), see summary

# SUMMARY
```shell
describe('resolveDispatcher')
    it('should return a dispatch object with all actions included')
    it('should prevent the state object from being a getter')
describe('useState (the resolver)')
    it('should return the state object and the setter for that state')
    it('should not return the state object as a getter')
describe('setState')
    it('should not return anything')
    it('should call on a hook reducer')
    it('should update the state through memoization')
describe('render (the resolver)')
    it('should run the component and render it')
describe('render (the dispatcher)')
    it('should call the render action from resolverDispatcher')
describe('useState (the dispatcher)')
    it('should call the useState action from resolverDispatcher')
```

*THANK YOU:*<br>
*https://www.the-guild.dev/blog/react-hooks-system*<br>
*https://www.youtube.com/watch?v=RnwqU9dqTr4*