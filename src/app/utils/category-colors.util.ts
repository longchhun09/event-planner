/**
 * Category Color Utility
 * Centralized color mapping for event categories
 */

/**
 * Color map for event categories
 * Used for consistent styling across the application
 */
export const CATEGORY_COLORS: { [key: string]: string } = {
  'Conference': '#667eea',
  'Meetup': '#f093fb',
  'Workshop': '#4facfe',
  'Seminar': '#43e97b',
  'Networking': '#fa709a',
  'Social': '#feca57',
  'Other': '#95a5a6'
} as const;

/**
 * Get color for a category with fallback to 'Other'
 * @param category - Event category name
 * @returns Hex color code
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'];
}

