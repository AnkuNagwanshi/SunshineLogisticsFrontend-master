// components/shared/TimeInput.tsx

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

export interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const TimeInput = ({
  value,
  onChange,
  label = "Time",
  error,
  required = false,
  disabled = false,
}: TimeInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatTimeForAPI = (timeString: string): string => {
    try {
      const cleanTime = timeString.trim();
      const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
      if (timeRegex.test(cleanTime)) return cleanTime;

      const match = cleanTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        const hours = match[1].padStart(2, "0");
        const minutes = match[2];
        const ampm = match[3].toUpperCase();
        return `${hours}:${minutes} ${ampm}`;
      }

      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const validateTime = (time: string): boolean => {
    if (!time) return !required;
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i;
    return timeRegex.test(time.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const valid = validateTime(newValue);
    setIsValid(valid);

    if (valid && newValue) {
      const formattedTime = formatTimeForAPI(newValue);
      onChange(formattedTime);
    } else {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (inputValue && validateTime(inputValue)) {
      const formattedTime = formatTimeForAPI(inputValue);
      setInputValue(formattedTime);
      onChange(formattedTime);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 11; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        options.push(`${hourStr}:${minuteStr} AM`);
      //  options.push(`${hourStr}:${minuteStr} PM`);
      }
    }
    options.push('12:00 PM')
        options.push('12:30 PM')

    for (let hour = 1; hour < 8; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
       // options.push(`${hourStr}:${minuteStr} AM`);
       options.push(`${hourStr}:${minuteStr} PM`);
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-2">
      <Label htmlFor="time">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Clock className="h-4 w-4 text-gray-400" />
        </div>

        <Input
          id="time"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="09:30 AM"
          className={`pl-10 ${
            !isValid || error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
          }`}
          list="time-options"
        />

        <datalist id="time-options">
          {timeOptions.map((time) => (
            <option key={time} value={time} />
          ))}
        </datalist>
      </div>

      {!isValid && (
        <p className="text-sm text-red-600">
          Please enter time in format: HH:MM AM/PM (e.g., 09:30 AM)
        </p>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-gray-500">
        Format: HH:MM AM/PM (e.g., 09:30 AM, 02:15 PM)
      </p>
    </div>
  );
};
