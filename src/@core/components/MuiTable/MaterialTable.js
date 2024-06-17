import React, { useEffect, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Button, Box, TextField, TableCell, TableBody } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const MaterialTable = ({ column, data }) => {
  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data);
    download(csvConfig)(csv);
  };

  const [mappedData, setMappedData] = useState([]);

  // Update state when data prop changes
  useEffect(() => {
    // Map data to include additional fields if necessary
    const newMappedData = data?.map((item, index) => ({
      ...item,
      // sr: index + 1,
    }));

    setMappedData(newMappedData);
  }, [data]);

  // Dynamically generate columns based on the keys in the data objects
  const columns = Object.keys(mappedData.length > 0 ? mappedData[0] : {}).map(
    (key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1), // Convert key to title case
    })
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableClickToCopy: true,
    muiTableHeadCellProps: {
      sx: {
        path: {
          color: "white",
        },
        // svg: {
        //   color: "white",
        // },
        backgroundColor: "#3c322c",
        color: "white",
        fontWeight: "normal",
        fontSize: "14px",
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
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
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
  });

  return <MaterialReactTable table={table} />;
};

export default MaterialTable; // Export your component
