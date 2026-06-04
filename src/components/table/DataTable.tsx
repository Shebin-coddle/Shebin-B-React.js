import { useState } from "react";

type TableColumn<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  rowsPerPage?: number;
};

function DataTable<T>({
  columns,
  data,
  rowsPerPage = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <div>
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.header}>
                  {column.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    
      <div className="pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DataTable;