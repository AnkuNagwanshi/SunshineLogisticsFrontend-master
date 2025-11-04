import { TableHead } from "../ui/table";
// import { ColumnFilter } from "./ColumnFilter";

interface FilterableTableHeadProps {
  column: string;
  uniqueValues: string[];
  selectedValues: string[];
  onFilterChange: (column: string, values: string[]) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
}

export function FilterableTableHead({
  column,
  // uniqueValues,
  // selectedValues,
  // onFilterChange,
  // onSort,
}: FilterableTableHeadProps) {
  return (
    <TableHead className="bg-gray-100">
      <div className="flex items-center">
        <span>{column}</span>
        {/* <ColumnFilter
          column={column}
          uniqueValues={uniqueValues}
          selectedValues={selectedValues}
          onFilterChange={onFilterChange}
          onSort={onSort}
        /> */}
      </div>
    </TableHead>
  );
}