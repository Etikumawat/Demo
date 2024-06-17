import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, ListItemIcon, MenuItem } from "@mui/material";
import { Badge, Button } from "reactstrap";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here
import { Trash2 } from "react-feather";
import { AccountCircle, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const MuiDataTable = ({
  data,
  basicColumns,
  deleteCategory,
  selectedRows,
  setSelectedRows,
  handleRowSelected,
  enableVerify = false,
}) => {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  let columns = basicColumns?.map((key) => ({
    accessorKey: key.column,
    header: key.name, // Convert key to title case
    size: 30,
    // Cell: ({ renderedCellValue, row }) => {
    //   let end = key.column
    //   return (
    //     <>
    //       {row?.original[end]}
    //       {/* {console.log(row?.original[end], "row data")} */}
    //       {/* {console.log(row?.original, "row")} */}
    //     </>
    //   );
    // },
  }));

  const [rowSelection, setRowSelection] = useState({});

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    // enableClickToCopy: true,
    enableRowActions: true,
    // enableColumnResizing: true,
    initialState: {
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    muiTableBodyProps: {
      sx: {
        "& td": {
          // Add styles for all cells
          padding: "12px",
          fontSize: "14px",
        },
        '& td[data-cell="Active]': {
          // Conditionally style cells in the "Status" column
          color: "green",
          fontWeight: "bold",
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        path: {
          color: "white",
        },
        input: {
          color: "white",
        },
        backgroundColor: "#3c322c",
        color: "white",
        fontWeight: "normal",
        fontSize: "16px",
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        {/* <Button
          //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          onClick={handleExportData}
          startIcon={<FileDownloadIcon />}
        >
          Export All Data
        </Button> */}
        <Button
          className="d-flex justify-content-center align-items-center gap-1"
          color="primary"
          caret
          outline
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          className="d-flex justify-content-center align-items-center gap-1"
          color="success"
          caret
          outline
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          className="d-flex justify-content-center align-items-center gap-1"
          color="info"
          caret
          outline
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
    renderRowActions: ({ row }) => {
      return (
        <>
          <Trash2
            style={{ cursor: "pointer", color: "#D2042D" }}
            onClick={() => deleteCategory(row.original)}
          />
        </>
      );
    },
  });

  if (enableVerify) {
    useEffect(() => {
      const selectedIndices = Object.keys(rowSelection)
        .filter((key) => rowSelection[key])
        .map((key) => parseInt(key));

      const newSelectedRows = selectedIndices.map((index) => {
        return data[index];
      });

      setSelectedRows(newSelectedRows);
    }, [data, rowSelection, setSelectedRows]);
  }

  return <MaterialReactTable table={table} />;
};

export default MuiDataTable;
