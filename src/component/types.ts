
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type DateValue = Date | DateRange;

export interface DatePickerProps {
  /** Enable selection of a date range instead of a single date */
  isRange?: boolean;

  /** The current selected date or date range */
  value?: DateValue;

  /** Callback fired when the date or date range changes */
  onChange: (value: DateValue) => void;

  /** Placeholder text shown in the input field */
  placeholder?: string;

  /** Name attribute of the input, useful for forms */
  name?: string;

  /** Blur event handler for the input */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /** Array of disabled dates that cannot be selected */
  disabledDates?: Date[];

  /** If true, prevents selecting future dates */
  disableFuture?: boolean;

  /** Date format used for display (uses `date-fns` format) */
  dateFormat?: string;

  /** If true, disables the input completely */
  disabled?: boolean;

  /** Custom className for the datepicker wrapper or input */
  className?: string;

  /** Icon for the datepicker */
  icon?: React.ReactNode; 

}
