# Developer Documentation for Wordeo

## Components
### Button
```js
// Example 1
<Button label="Print hello world" onClick={() => {console.log("hello world")}} type="secondary" size="medium" />
// Creates a green button in medium size that logs "hello world"

// Example 2
<Button label="Login" onClick={() => login()} type="ternary" size="large" />
// Creates a red button in large size that calls an external function
```
Wordeo-style buttons that accept the following parameters:
- `label`  
    - `string` *String to show in the button*
    - **Required**
- `onClick`
    - `function` *Function that is executed when the button is clicked*
    - **Required**
- `type`
    - `string` *String that determines the type of button*
    - **Options**: [primary, secondary, ternary, toggles]
    - **Default**: primary 
- `size`
    - `string` *String that determines the text size of the button
    - **Options**: [small, medium, large]
    - **Default**: medium
