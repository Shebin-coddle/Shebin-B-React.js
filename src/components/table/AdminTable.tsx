type TableColumn<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

type AdminTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
};

function AdminTable<T>({ columns, data }: AdminTableProps<T>) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.header}>{column.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.header}>{column.render(item)}</td>
            ))}
          </tr>
        ))}
        
      </tbody>
    </table>
  );
}

export default AdminTable;