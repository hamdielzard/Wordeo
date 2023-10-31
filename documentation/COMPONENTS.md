# Components

- [Components](#components)
- [Button](#button)
  - [Creating button](#creating-button)
  - [Parameters](#parameters)
- [Achievement](#achievement)

# Button
## Creating button
```js
import Button from ../Components/Button.js;

<Button 
    label="text on button"
    onClick={() => {function}}
    type="primary"
    size="medium"
    transparent={false}
    scale=1
/>
```
## Parameters
- `label` - (string) (required) - Text shown on button
- `onClick` - (JSX Function) (required) - Function called on click, can be left empty if passed an empty function `() => {}`
- `type` - (string) (optional, defaults to `primary`) - Changes the colours between the Wordeo button schemes based on this enum:
  - `primary` - Blue button
  - `secondary` - Green button
  - `ternary` - Red button
  - `toggles` - Used for toggling between active and inactive states
- `size` - (string) (optional, defaults to `medium`) - Changes the text size of the button based on this enum:
  - `small` - Text size: 16
  - `medium` - Text size: 32
  - `large` - Text size: 48
  - **NOTE:** Try using `scale` instead.
- `transparent` - (JSX Boolean) (optional, defaults to `false`) - True sets the opacity to 50%. Example is shown at homepage when signed in/out.
- `scale` - (Number) (optional, defaults to `1`) - Scales the button. Commonly used to scale down.

# Achievement
