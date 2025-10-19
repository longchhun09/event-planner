/**
 * Date and Time Utility Functions
 * Centralized date/time operations for consistent formatting and manipulation
 */

/**
 * Time validation pattern for HH:MM format (24-hour)
 */
export const TIME_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Date Format Options
 */
export const DATE_FORMAT_OPTIONS = {
  SHORT: {
    weekday: 'short' as const,
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const
  },
  LONG: {
    weekday: 'long' as const,
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const
  },
  MONTH_YEAR: {
    month: 'long' as const,
    year: 'numeric' as const
  },
  NUMERIC: {
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const
  }
} as const;

/**
 * Get current date with time set to midnight
 * Useful for date comparisons without time component
 */
export function getTodayAtMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get current date (with time)
 */
export function getCurrentDate(): Date {
  return new Date();
}

/**
 * Normalize date to midnight (removes time component)
 * @param date - Date to normalize
 */
export function normalizeToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 * Used for HTML input[type="date"] values
 * This uses local timezone to avoid date shifting issues
 * @param date - Date to format
 */
export function formatDateToISO(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display using locale
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions (default: SHORT format)
 */
export function formatDateForDisplay(
  date: Date,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = DATE_FORMAT_OPTIONS.SHORT
): string {
  return new Date(date).toLocaleDateString(locale, options);
}

/**
 * Format date to month and year (e.g., "October 2025")
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 */
export function formatMonthYear(date: Date, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, DATE_FORMAT_OPTIONS.MONTH_YEAR);
}

/**
 * Parse date from string
 * @param dateString - Date string to parse
 */
export function parseDate(dateString: string | Date): Date {
  return new Date(dateString);
}

/**
 * Check if two dates are the same day (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * Check if date is today
 * @param date - Date to check
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, getTodayAtMidnight());
}

/**
 * Check if date is in the past (before today)
 * @param date - Date to check
 */
export function isPastDate(date: Date): boolean {
  const today = getTodayAtMidnight();
  const compareDate = normalizeToMidnight(date);
  return compareDate < today;
}

/**
 * Check if date is in the future (after today)
 * @param date - Date to check
 */
export function isFutureDate(date: Date): boolean {
  const today = getTodayAtMidnight();
  const compareDate = normalizeToMidnight(date);
  return compareDate > today;
}

/**
 * Check if date is upcoming (today or future)
 * @param date - Date to check
 */
export function isUpcoming(date: Date): boolean {
  const today = getTodayAtMidnight();
  const compareDate = normalizeToMidnight(date);
  return compareDate >= today;
}

/**
 * Get first day of month
 * @param date - Reference date
 */
export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Get last day of month
 * @param date - Reference date
 */
export function getLastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

/**
 * Get number of days in month
 * @param date - Reference date
 */
export function getDaysInMonth(date: Date): number {
  return getLastDayOfMonth(date).getDate();
}

/**
 * Add months to a date
 * @param date - Starting date
 * @param months - Number of months to add (can be negative)
 */
export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
}

/**
 * Add days to a date
 * @param date - Starting date
 * @param days - Number of days to add (can be negative)
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get date range between two dates
 * @param startDate - Start date
 * @param endDate - End date
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  const checkDate = normalizeToMidnight(date);
  const start = normalizeToMidnight(startDate);
  const end = normalizeToMidnight(endDate);
  return checkDate >= start && checkDate <= end;
}

/**
 * Sort dates in ascending order
 * @param dates - Array of dates to sort
 */
export function sortDatesAscending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Sort dates in descending order
 * @param dates - Array of dates to sort
 */
export function sortDatesDescending(dates: Date[]): Date[] {
  return [...dates].sort((a, b) => b.getTime() - a.getTime());
}

/**
 * Validate time string format (HH:MM)
 * @param timeString - Time string to validate
 */
export function isValidTimeFormat(timeString: string): boolean {
  return TIME_PATTERN.test(timeString);
}

/**
 * Format time to HH:MM format
 * @param hours - Hours (0-23)
 * @param minutes - Minutes (0-59)
 */
export function formatTime(hours: number, minutes: number): string {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Parse time string to hours and minutes
 * @param timeString - Time string in HH:MM format
 * @returns Object with hours and minutes, or null if invalid
 */
export function parseTime(timeString: string): { hours: number; minutes: number } | null {
  if (!isValidTimeFormat(timeString)) {
    return null;
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Get min date (today) for date pickers
 */
export function getMinDate(): Date {
  return getTodayAtMidnight();
}

/**
 * Get min date as ISO string for HTML date inputs
 */
export function getMinDateISO(): string {
  return formatDateToISO(getTodayAtMidnight());
}

/**
 * Convert object with date strings to Date objects
 * Useful when loading from localStorage
 * @param obj - Object with date string properties
 * @param dateFields - Array of field names that should be converted to Date
 */
export function parseDateFields<T>(obj: any, dateFields: string[]): T {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  });
  return result as T;
}

/**
 * Get week day name
 * @param date - Date to get weekday from
 * @param locale - Locale string (default: 'en-US')
 * @param format - 'long', 'short', or 'narrow' (default: 'long')
 */
export function getWeekdayName(
  date: Date,
  locale: string = 'en-US',
  format: 'long' | 'short' | 'narrow' = 'long'
): string {
  return date.toLocaleDateString(locale, { weekday: format });
}

/**
 * Get array of weekday names
 * @param locale - Locale string (default: 'en-US')
 * @param format - 'long', 'short', or 'narrow' (default: 'short')
 */
export function getWeekdayNames(
  locale: string = 'en-US',
  format: 'long' | 'short' | 'narrow' = 'short'
): string[] {
  const baseDate = new Date(2025, 0, 5); // A Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    return getWeekdayName(date, locale, format);
  });
}

/**
 * Calculate difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days (can be negative if date2 is before date1)
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const normalized1 = normalizeToMidnight(date1);
  const normalized2 = normalizeToMidnight(date2);
  const diffTime = normalized2.getTime() - normalized1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get relative time string (e.g., "Today", "Tomorrow", "In 3 days")
 * @param date - Date to compare
 * @param referenceDate - Reference date (default: today)
 */
export function getRelativeDateString(date: Date, referenceDate: Date = getTodayAtMidnight()): string {
  const daysDiff = getDaysDifference(referenceDate, date);

  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff === -1) return 'Yesterday';
  if (daysDiff > 1 && daysDiff <= 7) return `In ${daysDiff} days`;
  if (daysDiff < -1 && daysDiff >= -7) return `${Math.abs(daysDiff)} days ago`;
  if (daysDiff > 7) return formatDateForDisplay(date);
  return formatDateForDisplay(date);
}

/**
 * Format time from 24-hour format (HH:MM) to 12-hour format with am/pm (e.g., "2pm")
 * @param timeString - Time string in HH:MM format
 * @returns Formatted time string like "2pm" or "10:30am"
 */
export function formatTimeTo12Hour(timeString: string): string {
  const parsed = parseTime(timeString);
  if (!parsed) {
    return timeString; // Return original if invalid
  }

  const { hours, minutes } = parsed;
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12; // Convert 0 to 12 for midnight

  // If minutes are 0, just show the hour
  if (minutes === 0) {
    return `${hour12}${period}`;
  }

  // Otherwise show hour:minutes
  return `${hour12}:${minutes.toString().padStart(2, '0')}${period}`;
}

