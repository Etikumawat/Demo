import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";

const Datatable = (props) => {
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [columns, setColumns] = useState([]);
  const [serverSide, setServerSide] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setTitle(props.title);
    setColumns(props.columns);
    setData(props.data);
    setCount(props.count);
    setRowsPerPage(props.rowsPerPage);
    if (props.serverSide) {
      setServerSide(true);
    }
    if (props.rowsPerPage) {
      setRowsPerPage(props.rowsPerPage);
    }
  }, [
    props.title,
    props.columns,
    props.data,
    props.count,
    props.rowsPerPage,
    props.serverSide,
    props.rowsPerPage,
  ]);

  const options = {
    search: true,
    viewColumns: true,
    filterType: props.filter === "checkbox" ? "checkbox" : "dropdown",
    filter: true,
    selectableRows: props.filter === "checkbox" ? "multiple" : "none",
    download: true,
    print: false,
    serverSide: serverSide,
    count: count,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 20, 50],
    onTableChange: props.onTableChange,
  };

  return (
    <div>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default Datatable;
