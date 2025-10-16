# Simple Date Range Picker

A simple and customizable React date picker and date range picker component built with TypeScript, Vite, and `date-fns`.  
Supports **single date selection** or **date range selection**, with optional disabled dates, future date restriction, and custom icons.

[![npm version](https://badge.fury.io/js/react-simple-daterange-picker.svg)](https://www.npmjs.com/package/react-simple-daterange-picker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Installation

```bash
npm install react-simple-daterange-picker
# or
yarn add react-simple-daterange-picker

Single Date Picker

<SimpleDatePicker
  value={selectedDate}
  onChange={(val) => setSelectedDate(val as Date)}
  placeholder="Select a date"
/>

Date Range Picker

<SimpleDatePicker
  isRange={true}
  value={dateRange}
  onChange={(val) => setDateRange(val as { start: Date | null; end: Date | null })}
  placeholder="Select a date range"
/>

Disabled Dates & Future Dates Disabled

<SimpleDatePicker
  isRange={true}
  disabledDates={[new Date("2025-10-15"), new Date("2025-10-20")]}
  disableFuture={true}
  onChange={(val) => console.log(val)}
/>

Custom Icon & Styling

<SimpleDatePicker
  className="custom-datepicker"
  icon={<span>📆</span>}
  placeholder="Pick a date"
/>


| Prop            | Type                                                                  | Default         | Description                                                  |
| --------------- | --------------------------------------------------------------------- | --------------- | ------------------------------------------------------------ |
| `isRange`       | `boolean`                                                             | `false`         | Enable selection of a date range instead of a single date.   |
| `value`         | `Date \| { start: Date \| null; end: Date \| null }`                  | `undefined`     | The currently selected date or date range.                   |
| `onChange`      | `(value: Date \| { start: Date \| null; end: Date \| null }) => void` | —               | Callback fired when the date or date range changes.          |
| `placeholder`   | `string`                                                              | `"Select date"` | Placeholder text for the input field.                        |
| `name`          | `string`                                                              | `undefined`     | Name attribute for the input, useful in forms.               |
| `onBlur`        | `(event: React.FocusEvent<HTMLInputElement>) => void`                 | `undefined`     | Blur event handler for the input.                            |
| `disabledDates` | `Date[]`                                                              | `undefined`     | Array of dates that cannot be selected.                      |
| `disableFuture` | `boolean`                                                             | `false`         | Prevent selection of future dates.                           |
| `dateFormat`    | `string`                                                              | `"MMM d, yyyy"` | Format used to display selected date(s) (`date-fns` format). |
| `disabled`      | `boolean`                                                             | `false`         | Disable the input completely.                                |
| `className`     | `string`                                                              | `undefined`     | Custom class name for styling the input or wrapper.          |
| `icon`          | `React.ReactNode`                                                     | `"📅"`          | Custom icon to display inside the input field.               |


