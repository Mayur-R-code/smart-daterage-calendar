import  {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isWithinInterval,
  isAfter,
  setYear,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import "./DatePicker.css";
import type { DatePickerProps, DateRange } from "./types";


// ForwardRef version
export const SimpleDatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      isRange = false,
      value,
      onChange,
      placeholder = "Select date",
      name,
      onBlur,
      disabledDates,
      disableFuture = false,
      dateFormat = "MMM d, yyyy",
      disabled,
      className,
      icon
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthDirection, setMonthDirection] = useState<"next" | "prev">(
      "next"
    );
    const [tempDate, setTempDate] = useState<Date | null>(
      value instanceof Date ? value : null
    );
    const [tempRange, setTempRange] = useState<DateRange>(
      !(value instanceof Date) && value ? value : { start: null, end: null }
    );
    const [isOpen, setIsOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const [openDirection, setOpenDirection] = useState<"up" | "down">("down");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);

    // expose inputRef to parent via forwardRef
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const validatedDateFormat = dateFormat.replace(/\bmm\b/g, "MM");

    // detect open direction
    useEffect(() => {
      if (isOpen && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const calendarHeight = 320;
        if (spaceBelow < calendarHeight && rect.top > calendarHeight) {
          setOpenDirection("up");
        } else {
          setOpenDirection("down");
        }
      }
    }, [isOpen]);

    useEffect(() => {
      setTempDate(value instanceof Date ? value : null);
      setTempRange(
        !(value instanceof Date) && value ? value : { start: null, end: null }
      );
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsYearDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDayClick = (day: Date) => {
      if (!isRange) {
        setTempDate(day);
        return;
      }
      if (!tempRange.start || tempRange.end) {
        setTempRange({ start: day, end: null });
      } else if (tempRange.start && !tempRange.end) {
        if (day < tempRange.start) {
          setTempRange({ start: day, end: tempRange.start });
        } else {
          setTempRange({ ...tempRange, end: day });
        }
      }
    };

    const handleOk = () => {
      if (!isRange) {
        if (tempDate) onChange(tempDate);
      } else {
        if (tempRange.start && tempRange.end) {
          onChange({ start: tempRange.start, end: tempRange.end });
        } else if (tempRange.start) {
          onChange({ start: tempRange.start, end: null });
        }
      }
      setIsOpen(false);
      setIsYearDropdownOpen(false);
    };

    const handleCancel = () => {
      setTempDate(value instanceof Date ? value : null);
      setTempRange(
        !(value instanceof Date) && value ? value : { start: null, end: null }
      );
      setIsOpen(false);
      setIsYearDropdownOpen(false);
    };

    const handleMonthChange = (direction: "next" | "prev") => {
      setMonthDirection(direction);
      setCurrentMonth((prev) =>
        direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
      );
    };

    const handleYearSelect = (year: number) => {
      setCurrentMonth(setYear(currentMonth, year));
      setIsYearDropdownOpen(false);
    };

    const renderYears = () => {
      const startYear = 1900;
      const endYear = 2090;
      const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
      );
      return years.map((year) => (
        <div
          key={year}
          className={`year-item ${
            year === currentMonth.getFullYear() ? "selected" : ""
          }`}
          onClick={() => handleYearSelect(year)}
        >
          {year}
        </div>
      ));
    };

    const renderDays = (month: Date) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);

      const days = [];
      let day = startDate;
      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }

      return days.map((day) => {
        const isCurrentMonth = day >= monthStart && day <= monthEnd;
        const isDisabled =
          (disabledDates && disabledDates.some((d) => isSameDay(d, day))) ||
          (disableFuture && isAfter(day, new Date()));
        const isSelected = !isRange
          ? tempDate && isSameDay(day, tempDate)
          : tempRange.start && tempRange.end
          ? isWithinInterval(day, {
              start: tempRange.start,
              end: tempRange.end,
            })
          : tempRange.start && isSameDay(day, tempRange.start);
        const isStart = tempRange.start && isSameDay(day, tempRange.start);
        const isEnd = tempRange.end && isSameDay(day, tempRange.end);

        return (
          <div
            key={day.toString()}
            className={`day ${isCurrentMonth ? "" : "disabled"} ${
              isSelected ? "selected" : ""
            } ${isStart ? "start" : ""} ${isEnd ? "end" : ""} ${
              isDisabled ? "disabled" : ""
            }`}
            onClick={() => isCurrentMonth && !isDisabled && handleDayClick(day)}
          >
            {format(day, "d")}
          </div>
        );
      });
    };

    const displayValue = !isRange
      ? tempDate
        ? format(tempDate, validatedDateFormat)
        : ""
      : tempRange.start && tempRange.end
      ? `${format(tempRange.start, validatedDateFormat)} - ${format(
          tempRange.end,
          validatedDateFormat
        )}`
      : tempRange.start
      ? `${format(tempRange.start, validatedDateFormat)} - Select end date`
      : "";

    const variants = {
      enter: (direction: "next" | "prev") => ({
        x: direction === "next" ? 100 : -100,
        opacity: 0,
      }),
      center: { x: 0, opacity: 1 },
      exit: (direction: "next" | "prev") => ({
        x: direction === "next" ? -100 : 100,
        opacity: 0,
      }),
    };

    return (
      <div className="date-picker" ref={wrapperRef}>
        <div className="date-picker-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            readOnly
            name={name}
            disabled={disabled}
            value={displayValue}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={className}
          />
          <span className="date-picker-icon" onClick={() => setIsOpen(!isOpen)}>
           {icon || "📅"} 
          </span>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`calendar calendar-${openDirection}`}
              initial={{
                opacity: 0,
                scale: 0.95,
                y: openDirection === "up" ? 20 : -20,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: openDirection === "up" ? 20 : -20,
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="header">
                <button onClick={() => handleMonthChange("prev")}>&lt;</button>
                <div className="month-year" ref={yearDropdownRef}>
                  <span
                    className="month-year-text"
                    onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  >
                    {format(currentMonth, "MMMM yyyy")}
                    <span className="dropdown-icon">▼</span>
                  </span>
                  <AnimatePresence>
                    {isYearDropdownOpen && (
                      <motion.div
                        className="year-dropdown"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {renderYears()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => handleMonthChange("next")}>&gt;</button>
              </div>

              <div className="days-header">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="days-container">
                <AnimatePresence custom={monthDirection} mode="wait">
                  <motion.div
                    key={currentMonth.toISOString()}
                    variants={variants}
                    custom={monthDirection}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="days"
                  >
                    {renderDays(currentMonth)}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="simple-calendar-footer">
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="ok-button" onClick={handleOk}>
                  OK
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

