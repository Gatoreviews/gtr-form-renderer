# GTR Form Renderer

## Overview

GTR Form Renderer is a project specifically designed to build compatible forms for all contexts and environments, whether they are GTRSuite specific or directly included on a client website.
Until now all forms were managed manually one by one and leads stored in different places. With GTR Form Renderer all forms are now centralized in the GTR Suite Platform.

Here are the main features of this project:

- Generate a lot of typed fields.
- Apply validation rules for all field.
- Condition the display of specific fields by the value of others.
- Customize the layout with a responsive column system.
- Organize fields and columns with a stepper system.

## Installation

Install dependencies:

```
yarn install
```

Start development server:

```
yarn serve
```

Build web component for production:

```
yarn build
```

## Configuration

You can initialize web component with the following parameters

| Name    | Type    | Default   | Description                                                                           |
| ------- | ------- | --------- | ------------------------------------------------------------------------------------- |
| formId  | String  | undefined | Form identifier, return 404 error if doest not exist.                                 |
| storeId | String  | undefined | Store identifier, if defined, leads are directly linked to this store.                |
| locale  | String  | undefined | Form language, used to display field label, fields errors, date format, file size...  |
| devMode | Boolean | false     | Enable dev mode, it use development URL and avoid saving leads on production.         |
| color   | String  | #449afd   | Color used for inputs border, datepicker, buttons, stepper, primary color elements... |
| dark    | Boolean | false     | Enable dark mode, usefull for website with dark background.                           |
| font    | String  | Poppins   | Allows to change the font family. **Only Google Font can be used.**                   |
| lpeUrl  | String  | null      | Provide the URL of the associated LPE to enable last viewed location sharing          |

## Fields components

### Checkbox

This component is used to display one or many checboxes.

```ts
// Field prop
{
  slug: String,
  label: String,
  options?: [{
    label: String,
    value: String | Number
  }]
}
```

If there are `options` it will generate multiple checkbox, root `label` parameter will be used as checkbox group title and option `label` and option `value` will be used for each checkbox.

```js
// Result
slug_name: Array
```

If there is no option, it will generate a unique checkbox, with root `label` as checkbox label and value will be a boolean.

```js
// Result
slug_name: Boolean
```

### DatePicker

This component is used to display datepickers.

```ts
// Field prop
{
  slug: String,
  label: String,
  placeholder?: String,
  multiple: Boolean,
  rules?: {
    minDate: String,
    maxDate: String
  }
}
```

Root `label` and `placeholder` parameter will be used for the textfield.

```js
// Result
slug_name: String //YYYY-MM-DD format
```

If `multiple` is true, it will convert simple date picker to a date range picker.

```js
// Result
slug_name: [
  String, //YYYY-MM-DD format
  String, //YYYY-MM-DD format
]
```

Rules `minDate` and `maxDate` can be set as YYYY-MM-DD format to include only some specific date.

### File

This component is used to display drag and drop area for file upload.

```ts
// Field prop
{
  slug: String,
  label: String,
  rules?: {
    fileExtensions: Array,
    fileSize: Number
  }
}
```

Root `label` parameter will be used for the name of the drag & drop area.

```js
// Result
slug_name: String //UUID format
```

`fileExtensions` rule will restrict file upload based on its extension (JPEG, JPG, PNG, PDF and GIF by default).

`fileSize` rule will restrict file upload based on its size (10485760 bytes by default or 10MB).

### Phone

This component is used to display phone field with country selector.

```ts
// Field prop
{
  slug: String,
  label: String,
  placeholder?: String,
}
```

Root `label` and `placeholder` parameter will be used for the phone number textfield.

On component initialization, it will try to get user country code from IP.

```js
// Result
slug_name: String //International phone number
```

### Radio

This component is used to display radio buttons.

```ts
// Field prop
{
  label: String,
  options: [{
    label: String,
    value: String | Number
  }]
}
```

Root `label` parameter will be used as radio group title, and option `label` and `value` will be used for each radio input.

```js
// Result
slug_name: String
```

### Select

This component is used to display single or multiple choices dropdown.

```ts
// Field prop
{
  slug: String,
  label: String,
  placeholder?: String,
  multiple: Boolean
  options: [{
    label: String,
    value: String | Number
  }]
}
```

Root `label` and `placeholder` parameter will be used for the select field.

`options` are used to fill the dropdown.

```js
// Result
slug_name: String //YYYY-MM-DD format
```

If `multiple` is true, it will convert simple choice dropdownto a multiple choice dropdown.

```js
// Result
slug_name: [
  String, //YYYY-MM-DD format
  String, //YYYY-MM-DD format
]
```

### Textarea

This component is used to display textarea field.

```ts
// Field prop
{
  slug: String,
  label: String,
  placeholder?: String,
}
```

Root `label` and `placeholder` parameter will be used for the textarea field.

```js
// Result
slug_name: String //International phone number
```

### TextField

This component is used to display textfield.

```ts
// Field prop
{
  slug: String,
  label: String,
  placeholder?: String,
  type: String
}
```

Root `label` and `placeholder` parameter will be used for the textfield.

```js
// Result
slug_name: String //International phone number
```

If `type` is 'number' then model value will be converted to Integer.

```js
// Result
slug_name: Number //International phone number
```

## Layout components

### Field

This component is a wrapper for all fields.

It will display the correct field depending of its type or conditional display.

### Grid

This component will generate rows and columns depending of the form layout configuration.

It's recursive because all elements can be nested.

### Stepper

This component will generate a stepper depending of the form configuration.

It's compatible with `Grid` component.

### Message

This component will display error or success messages for all API request (404, 500, 200, 422, etc...)

## Validation

All fields can have validation rules, some rules depend of its type.

| Name          | Meta parameters | Description                                                                                       |
| ------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| required      | none            | Requires non-empty data. Checks for empty arrays and strings containing only whitespaces.         |
| minLength     | min length      | Requires the input to have a minimum specified length, inclusive. Works with arrays.              |
| maxLength     | max length      | Requires the input to have a maximum specified length, inclusive. Works with arrays.              |
| min           | min value       | Requires entry to have a specified minimum numeric value.                                         |
| max           | max value       | Requires entry to have a specified maximum numeric value .                                        |
| minDate       | min date        | Requires entry to have a specified minimum date (YYYY-MM-DD format). **Works only for date type** |
| maxDate       | max date        | Requires entry to have a specified maximum date (YYYY-MM-DD format). **Works only for date type** |
| email         | none            | Accepts valid email addresses.                                                                    |
| url           | none            | Accepts only URLs.                                                                                |
| phone         | none            | Accepts only good formated phone number depending of it's country prefix code.                    |
| fileExtension | file extensions | Accepts only file whose extension matches those of the validator. **Works only for file type**    |
| fileSize      | file size       | Accepts only file that is smaller than the validator size. **Works only for file type**           |

## Conditionnal display

All can have a conditional display rule.

| Name            | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| exists          | Check if field has a value.                                           |
| equals          | Check if two strings or two arrays (order non-sensitive) are equal.   |
| not_equals      | Check if two strings are not equal.                                   |
| contains        | Check if a string is contain in an other string.                      |
| superior        | Check if a number is strictly greater than another.                   |
| superior_equals | Check if a number is greater or equal than another                    |
| inferior        | Check if a number is strictly smaller than another.                   |
| inferior_equals | Check if a number is smaller or equal than another.                   |
| in              | Check if a string or an array of string is included in a given array. |
| not_in          | Check if a string is not include in a given array.                    |
| all             | Check if all value of a given array is included in field value.       |

## Ressources

- Vue.js CLI [configuration reference](https://cli.vuejs.org/config/).
- Vue Custom Element [repository](https://github.com/karol-f/vue-custom-element)
- ShadowDOM [examples](https://github.com/bryanvaz/vue-custom-element-shadow-examples) (include Vuetify)
