import React, { useMemo, useState, useRef, useEffect } from 'react';

type CalendarProps = {
  selected?: Date | undefined;
  onSelect: (date: Date) => void;
  minDate?: Date | undefined;
  placeholder?: string;
  id?: string;
};

const formatDate = (d?: Date) => {
  if (!d) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const parseDate = (text: string): Date | null => {
  // Accept dd/mm/yyyy or yyyy-mm-dd
  const trimmed = text.trim();
  if (!trimmed) return null;
  // dd/mm/yyyy
  const dm = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dm) {
    const d = Number(dm[1]);
    const m = Number(dm[2]) - 1;
    const y = Number(dm[3]);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) return date;
  }
  // yyyy-mm-dd
  const ym = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (ym) {
    const y = Number(ym[1]);
    const m = Number(ym[2]) - 1;
    const d = Number(ym[3]);
    const date = new Date(y, m, d);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
};

const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, minDate, placeholder = 'Select date', id }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(formatDate(selected));
  const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : new Date().getMonth());
  const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : new Date().getFullYear());

  useEffect(() => {
    setInputValue(formatDate(selected));
    if (selected) {
      setViewMonth(selected.getMonth());
      setViewYear(selected.getFullYear());
    }
  }, [selected]);

  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

  const monthOptions = useMemo(
    () => [
      'January','February','March','April','May','June','July','August','September','October','November','December'
    ],
    []
  );

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    const list = [] as number[];
    for (let y = now - 10; y <= now + 10; y++) list.push(y);
    return list;
  }, []);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const calendarGrid: Array<(Date | null)> = [];
  const totalDays = daysInMonth(viewYear, viewMonth);
  // Fill leading nulls
  for (let i = 0; i < firstDayOfMonth; i++) calendarGrid.push(null);
  for (let d = 1; d <= totalDays; d++) calendarGrid.push(new Date(viewYear, viewMonth, d));

  const isDisabled = (date: Date) => {
    if (!minDate) return false;
    // compare only date portion
    const a = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const b = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime();
    return a < b;
  };

  const handleDayClick = (date: Date | null) => {
    if (!date) return;
    if (isDisabled(date)) return;
    onSelect(date);
    // small delay so UI doesn't feel abrupt and to avoid focus flicker
    setTimeout(() => setOpen(false), 150);
  };

  const handleInputBlur = () => {
    // parse input value
    const parsed = parseDate(inputValue);
    // if focus moved to an element inside the popover, don't close (user is interacting with selects)
    if (rootRef.current && document.activeElement && rootRef.current.contains(document.activeElement as Node)) {
      return;
    }
    if (parsed) {
      if (!minDate || parsed.getTime() >= new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime()) {
        onSelect(parsed);
      }
    }
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative inline-block" id={id}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={() => {
          // use timeout so click on calendar doesn't trigger before selection
          setTimeout(handleInputBlur, 150);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />

      {open && (
        <div
          className="absolute z-50 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <select
              aria-label="Month"
              value={viewMonth}
              onChange={(e) => setViewMonth(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              {monthOptions.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>

            <select
              aria-label="Year"
              value={viewYear}
              onChange={(e) => setViewYear(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-7 gap-1 text-xs text-center text-gray-500 mb-1">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarGrid.map((d, idx) => {
              if (!d) return <div key={`n-${idx}`} className="h-8" />;
              const disabled = isDisabled(d);
              const isSelected = selected && d.getFullYear() === selected.getFullYear() && d.getMonth() === selected.getMonth() && d.getDate() === selected.getDate();
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => handleDayClick(d)}
                  disabled={disabled}
                  className={`h-8 flex items-center justify-center text-sm rounded ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 dark:hover:bg-blue-900/50'} ${isSelected ? 'bg-blue-600 text-white' : ''}`}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

