import { useState, useEffect } from "react";
import { ListFilter, Search, X, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface ColumnFilterProps {
  column: string;
  uniqueValues: string[];
  selectedValues: string[];
  onFilterChange: (column: string, values: string[]) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
}

export function ColumnFilter({
  column,
  uniqueValues,
  selectedValues,
  onFilterChange,
  onSort,
}: ColumnFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [tempSelectedValues, setTempSelectedValues] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  // Initialize temp selected values when popover opens
  useEffect(() => {
    if (isOpen) {
      setTempSelectedValues([...selectedValues]);
      setSelectAllChecked(
        selectedValues.length === uniqueValues.length && uniqueValues.length > 0
      );
    }
  }, [isOpen, selectedValues, uniqueValues]);

  // Handle individual checkbox change
  const handleCheckboxChange = (value: string) => {
    setTempSelectedValues((prev) => {
      const newValues = prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value];

      // Update select all checkbox state
      setSelectAllChecked(
        newValues.length === uniqueValues.length && uniqueValues.length > 0
      );

      return newValues;
    });
  };

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAllChecked(checked);
    setTempSelectedValues(checked ? [...uniqueValues] : []);
  };

  // Apply filters
  const handleApply = () => {
    onFilterChange(column, tempSelectedValues);
    setIsOpen(false);
  };

  // Reset filters
  const handleReset = () => {
    setTempSelectedValues([]);
    setSelectAllChecked(false);
    onFilterChange(column, []);
    setIsOpen(false);
  };

  // Handle sort
  const handleSort = (direction: "asc" | "desc") => {
    if (onSort) {
      onSort(column, direction);
    }
    setIsOpen(false);
  };

  // Filter unique values based on search input
  const filteredValues = valueSearch
    ? uniqueValues.filter((value) =>
        value.toLowerCase().includes(valueSearch.toLowerCase())
      )
    : uniqueValues;

  // Check if filter is active
  const isFilterActive =
    selectedValues.length > 0 && selectedValues.length < uniqueValues.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={
            "p-1 h-auto w-auto ml-1 " +
            (isFilterActive ? "text-white bg-blue-600" : "text-gray-500")
          }
          aria-label={"Filter " + column}
        >
          <ListFilter size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="flex flex-col">
          {/* Header with sort options */}

          <div className="p-2 border-b flex justify-between items-center">
            <div className="">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleSort("asc")}
                title="Sort A to Z"
              >
                <ArrowUpAZ size={14} />
              </Button>
              Sort A to Z
            </div>
          </div>

          <div className="p-2 border-b flex justify-between items-center">
            <div className="">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleSort("desc")}
                title="Sort Z to A"
              >
                <ArrowDownAZ size={14} />
              </Button>
              Sort Z to A
            </div>
          </div>

          {/* Search box */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <Input
                placeholder="Search values..."
                className="w-full pl-7 pr-7 py-1 h-7 text-sm"
                value={valueSearch}
                onChange={(e) => setValueSearch(e.target.value)}
              />
              {valueSearch && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setValueSearch("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="p-2 border-b flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Checkbox
                id={"select-all-" + column}
                checked={selectAllChecked}
                onCheckedChange={(checked) =>
                  handleSelectAllChange(checked as boolean)
                }
              />
              <label
                htmlFor={"select-all-" + column}
                className="text-xs font-medium cursor-pointer"
              >
                Select All
              </label>
            </div>
          </div>

          {/* Checkbox list */}
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredValues.length > 0 ? (
              filteredValues.map((value) => (
                <div key={value} className="flex items-center py-1">
                  <Checkbox
                    id={column + "-" + value}
                    checked={tempSelectedValues.includes(value)}
                    onCheckedChange={() => handleCheckboxChange(value)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={column + "-" + value}
                    className="text-sm text-gray-700 truncate cursor-pointer"
                  >
                    {value}
                  </label>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 py-2 text-center">
                No matching values
              </div>
            )}
          </div>

          {/* Footer with Apply/Reset buttons */}
          <div className="p-2 border-t flex justify-between items-center">
            <div className="text-xs text-gray-500">
              {tempSelectedValues.length} of {uniqueValues.length} selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="h-7 text-xs"
                onClick={handleApply}
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-orange-600 hover:text-orange-700"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
