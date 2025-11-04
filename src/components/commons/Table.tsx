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
  key: keyof T | 'actions'
  label: string
  render?: (row: T) => ReactNode
}

interface CommonTableProps<T extends Record<string, any>> {
  data: T[]
  columns: ColumnDef<T>[]
  filters?: TableFilter[]
  searchPlaceholder?: string
}

const downloadAsExcel = <T extends Record<string, unknown>>(data: T[], filename: string = 'exported-data') => {
  // Convert data to CSV format
  const headers = Object.keys(data[0] || {}).join(',')
  const rows = data.map((item) => Object.values(item).join(','))
  const csv = [headers, ...rows].join('\n')

  // Create blob and download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function CommonTable<T extends Record<string, any>>({ data, columns, filters = [], searchPlaceholder = 'Search' }: CommonTableProps<T>) {
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
          <Button onClick={() => downloadAsExcel(filteredData)} className="bg-green-500 hover:bg-green-600 text-white gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/*Common Table */}
      <div className="border rounded-lg mt-6 ">
        <div
          className={`max-h-[calc(100vh-230px)] overflow-auto w-full
            ${sidebarExpanded ? 'lg:max-w-[calc(100vw-170px)]' : 'lg:max-w-[calc(100vw-140px)]'}
          `}
        >
          <div className="min-w-max">
            <UITable>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  {columns.map((column) => (
                    <FilterableTableHead
                      key={column.key.toString()}
                      column={column.label}
                      uniqueValues={uniqueColumnValues[column.key]}
                      selectedValues={columnFilters[column.key.toString()] || []}
                      onFilterChange={(_, values) => handleFilterChange(column.key.toString(), values)}
                      onSort={(_, direction) => handleSort(column.key.toString(), direction)}
                    />
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={column.key.toString()}>{column.render ? column.render(row) : row[column.key]}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-4">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </UITable>
          </div>
        </div>
      </div>
    </>
  )
}
