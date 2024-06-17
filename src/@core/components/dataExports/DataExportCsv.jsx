import Papa from "papaparse";
import { Button } from "reactstrap";
import DownloadingIcon from "@mui/icons-material/Downloading";
import toast from "react-hot-toast";

const DataExportCsv = ({ data, selectedRows }) => {
  const handleExportAllData = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "all_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSelectedData = () => {
    if (selectedRows?.length === 0 || selectedRows === undefined) {
      // toast("No rows selected!");
      toast("No rows selected!", { position: "top-center" });

      // alert("No rows selected!");
      return;
    }

    console.log(data, "data");
    console.log(selectedRows, "selected rows");
    const selectedData = selectedRows?.map((index) => data[index]);

    if (!selectedData || selectedData?.length === 0) {
      toast(<p>No data found for selected rows!</p>, {
        position: "top-center",
      });
      // alert("No data found for selected rows!");
      return;
    }

    console.log("Selected Data:", selectedData); // Add this line for logging

    const csv = Papa.unparse(selectedRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex" }} className="d-flex gap-1">
      <Button
        style={{ height: `40px`, padding: "8px", gap: "5px" }}
        className="d-flex justify-content-center align-items-center"
        color="primary"
        caret
        outline
        onClick={handleExportAllData}
      >
        <DownloadingIcon size={15} />
        <span>Export All Data</span>
      </Button>
      <Button
        style={{ height: `40px`, padding: "8px", gap: "5px" }}
        className="d-flex justify-content-center align-items-center"
        color="primary"
        caret
        outline
        onClick={handleExportSelectedData}
      >
        <DownloadingIcon size={15} />
        Export Selected Data
      </Button>
    </div>
  );
};

export default DataExportCsv;
