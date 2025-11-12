import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import { Download, Search } from 'lucide-react'
import { Table as UITable, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import { Input } from '../ui/input'
import { FilterableTableHead } from './FilterableTableHead'
import { getAllUniqueColumnValues, applyColumnFilters, applySearchFilter } from '../../lib/tableUtils'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { useAppSelector } from '../../redux/hooks'

export interface SelectOption {
  label: string
  value: string
}

export interface TableFilter {
  name: string
  placeholder: string
  options: SelectOption[]
}

export interface ColumnDef<T> {
  key: keyof T | 'actions' | 'info'
  label: string
  render?: (row: T) => ReactNode
}

interface CommonTableProps<T extends Record<string, any>> {
  data: T[]
  columns: ColumnDef<T>[]
  filters?: TableFilter[]
  searchPlaceholder?: string
  userRole?: string // Add userRole prop
}

const downloadAsExcel = <T extends Record<string, unknown>>(data: T[], filename: string = 'exported-data') => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Format header row with proper capitalization
  const headerRow = headers.map(h => h.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(',');
  
  // Format data rows - handle special characters and quotes
  const rows = data.map((item) => {
    return headers.map(header => {
      const value = item[header];
      // Handle null/undefined
      if (value == null) return '';
      // Convert to string and escape quotes
      const stringValue = String(value).replace(/"/g, '""');
      // Wrap in quotes if contains comma, newline, or quotes
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue}"`;
      }
      return stringValue;
    }).join(',');
  });
  
  const csv = [headerRow, ...rows].join('\n');

  // Add BOM for proper Excel UTF-8 encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function CommonTable<T extends Record<string, any>>({ data, columns, filters = [], searchPlaceholder = 'Search', userRole }: CommonTableProps<T>) {
  const sidebarExpanded = useAppSelector((state) => state.sidebarExpanded.isExpanded)
  const [searchQuery, setSearchQuery] = useState('')
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})
  const [sortConfig, setSortConfig] = useState<{
    column: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)

  // Get unique values for each column
  const uniqueColumnValues = useMemo(() => {
    return getAllUniqueColumnValues(
      data,
      columns.map((col) => col.key)
    )
  }, [data, columns])

  // Handle filter changes
  const handleFilterChange = (column: string, selectedValues: string[]) => {
    setColumnFilters((prev) => ({
      ...prev,
      [column]: selectedValues
    }))
  }

  // Handle sort
  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortConfig({
      column: column as keyof T,
      direction
    })
  }

  // Apply filters and sorting to data
  const filteredData = useMemo(() => {
    // First apply search filter
    const searchFiltered = applySearchFilter(data, searchQuery)

    // Then apply column filters
    let result = applyColumnFilters(searchFiltered, columnFilters, uniqueColumnValues)

    // Apply sorting if configured
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.column]
        const bValue = b[sortConfig.column]

        if (sortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    return result
  }, [data, searchQuery, columnFilters, uniqueColumnValues, sortConfig])

  return (
    <>
      {/* Common Filters and Search Bar For Table */}
      <div className="grid grid-cols-12 gap-3 py-2">
        {filters.length > 0 && (
          <div className="col-span-12 grid grid-cols-12 gap-4 justify-center">
            {filters.map((filter) => (
              <div key={filter.name} className="col-span-12 flex justify-center items-center">
                <Select defaultValue={filter.options[0].value}>
                  <SelectTrigger className="w-100 py-5 text-md">
                    <SelectValue placeholder={filter.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option, index) => (
                      <SelectItem key={index} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {/* Search and Export Section */}
        <div className="col-span-12 flex items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 py-2.5 text-base border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Export Button - Only for Main Admin */}
          {userRole === "admin" && (
            <Button onClick={() => downloadAsExcel(filteredData)} className="bg-green-500 hover:bg-green-600 text-white gap-2">
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
          )}
        </div>
      </div>

      {/*Common Table */}
      <div className="border rounded-lg mt-6 overflow-hidden">
        <div
          className={`max-h-[calc(100vh-230px)] overflow-y-auto overflow-x-auto w-full
            ${sidebarExpanded ? 'lg:max-w-[calc(100vw-170px)]' : 'lg:max-w-[calc(100vw-140px)]'}
          `}
        >
          <table className="w-full caption-bottom text-sm min-w-max">
            <thead 
              className="bg-white z-50 shadow-sm [&_tr]:border-b"
              style={{
                position: 'sticky',
                top: 0
              }}
            >
              <tr className="hover:bg-muted/50 bg-gray-100 border-b transition-colors">
                {columns.map((column) => (
                  <th key={column.key.toString()} className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap">
                    <FilterableTableHead
                      column={column.label}
                      uniqueValues={uniqueColumnValues[column.key]}
                      selectedValues={columnFilters[column.key.toString()] || []}
                      onFilterChange={(_, values) => handleFilterChange(column.key.toString(), values)}
                      onSort={(_, direction) => handleSort(column.key.toString(), direction)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                    {columns.map((column) => (
                      <td key={column.key.toString()} className="p-2 align-middle whitespace-nowrap">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4 p-2 align-middle">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
