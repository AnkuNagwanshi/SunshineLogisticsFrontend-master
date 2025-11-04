/**
 * Utility functions for table filtering and data manipulation
 */

/**
 * Get unique values from an array of objects for a specific key
 * @param data Array of objects
 * @param key The key to extract unique values from
 * @returns Array of unique values
 */
export function getUniqueValues<T extends Record<string, any>>(
  data: T[],
  key: keyof T
): string[] {
  const uniqueValues = new Set<string>();
  
  data.forEach((item) => {
    uniqueValues.add(String(item[key]));
  });
  
  return Array.from(uniqueValues).sort();
}

/**
 * Apply column filters to data
 * @param data Array of objects to filter
 * @param filters Object with column keys and arrays of selected values
 * @param uniqueValues Object with column keys and arrays of all possible values
 * @returns Filtered array of objects
 */
export function applyColumnFilters<T extends Record<string, any>>(
  data: T[],
  filters: Record<string, string[]>,
  uniqueValues: Record<keyof T, string[]>
): T[] {
  return data.filter((item) => {
    return Object.entries(filters).every(([column, selectedValues]) => {
      // If no values are selected or all values are selected, don't filter
      if (
        selectedValues.length === 0 ||
        selectedValues.length === uniqueValues[column as keyof T].length
      ) {
        return true;
      }
      return selectedValues.includes(String(item[column as keyof T]));
    });
  });
}

/**
 * Apply search filter to data
 * @param data Array of objects to filter
 * @param searchTerm Search term to filter by
 * @returns Filtered array of objects
 */
export function applySearchFilter<T extends Record<string, any>>(
  data: T[],
  searchTerm: string
): T[] {
  if (!searchTerm) return data;
  
  const term = searchTerm.toLowerCase();
  
  return data.filter((item) => {
    // Skip searching in the 'verified' field and ignore 'actions' field
    const searchableValues = Object.entries(item).filter(([key]) => 
      key !== 'verified' && key !== 'actions'
    );
    
    return searchableValues.some(([_, value]) => 
      String(value).toLowerCase().includes(term)
    );
  });
}

/**
 * Get all unique column values from data
 * @param data Array of objects
 * @param columns Array of column keys
 * @returns Object with column keys and arrays of unique values
 */
export function getAllUniqueColumnValues<T extends Record<string, any>>(
  data: T[],
  columns: (keyof T)[]
): Record<keyof T, string[]> {
  const result = {} as Record<keyof T, string[]>;
  
  columns.forEach((column) => {
    result[column] = getUniqueValues(data, column);
  });
  
  return result;
}