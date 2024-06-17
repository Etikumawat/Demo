import DataTable from "react-data-table-component";
import { useState, useEffect, forwardRef } from "react";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Input } from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown, RefreshCw } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import DataExportCsv from "../../../@core/components/dataExports/DataExportCsv";
import { Link } from "react-router-dom";
import { FilterAlt } from "@mui/icons-material";
import { IoCloseCircleOutline } from "react-icons/io5";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import Downloading from "@mui/icons-material/Downloading";
// import '../../asn/asn.scss'

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const MsmeCompliance = () => {

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [selectedRows, setSelectedRows] = useState();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [selectedRowsForVerify, setSelectedRowsForVerify] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isExportSelectedData, setIsExportSelectedData] = useState(false);
  const [exportFields, setExportFields] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(false);
  const handleToggle = (e) => {
    e.preventDefault();
    setOpenSidebar(!openSidebar);
  };

  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    sort: "id",
    order: "asc",
    search: "",
    selected_ids: []
  });
  useEffect(() => {
    if (startDate === "Invalid Date" || startDate === null) {
      setQuery((prev) => {
        return {
          ...prev,
          filter: {
            startDate: "",
            endDate: "",
            dateField: isDispatchDate ? "dispatchDate" : "msmeTime",
          },
        };
      });
    } else {
      setQuery((prev) => {
        return {
          ...prev,
          filter: {
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
            dateField: isDispatchDate ? "dispatchDate" : "msmeTime",
          },
        };
      });
    }
  }, [startDate, endDate]);
  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(
        new URL(
          "/api/v1/services/masterIndia/msme/list",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setLoading(false);
        setTotal(res.data.total);
        setData(res.data.data);
      });
  };
  const handleFilterReset = () => {
    setStartDate(null);
    setEndDate(null);
    query.filter.startDate = "";
    query.filter.endDate = "";
    setQuery(query);
    request();
  };

  useEffect(() => {
    request();
  }, []);

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "100px",
      column: "id",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "Supplier Name",
      column: "supplierName",
      sortable: true,
      width: "500px",
      selector: (row) => row.supplierName,
      //   cell: (row) => <div>{row.supplierName ? row.supplierName : "NA"}</div>,
    },
    {
      name: "Sapcode",
      column: "sapcode",
      sortable: true,
      width: "200px",
      selector: (row) => row.sapcode,
      cell: (row) => <div>{row.sapcode ? row.sapcode : "NA"}</div>,
    },
    {
      name: "Msme No",
      column: "msmeNO",
      sortable: true,
      width: "200px",
      selector: (row) => row.msmeNO,

    },

    {
      name: "Old Time",
      column: "oldTime",
      sortable: true,
      width: "200px",
      selector: (row) => row.oldTime,
      cell: (row) => {
        const formatDate = (dateString) => {
          if (!dateString) return "NA";
          const parts = dateString.split("-");
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        };

        return <div>{" 📅 " + formatDate(row.oldTime?.slice(0, 10))}</div>;
      },
    },
    {
      name: "Time",
      column: "time",
      sortable: true,
      width: "200px",
      selector: (row) => row.time,
      cell: (row) => {
        const formatDate = (dateString) => {
          if (!dateString) return "NA";
          const parts = dateString.split("-");
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        };
        return <div>{" 📅 " + formatDate(row.time?.slice(0, 10))}</div>;
      },
    },
    {
      name: "Old Status",
      column: "oldStatus",
      sortable: true,
      width: "150px",
      selector: (row) => row.oldStatus,
      cell: (row) => {
        const badgeStyle = {
          width: "100px",
          padding: "8px",
        };
        if (!row.oldStatus) {
          return "NA";
        } else if (row.oldStatus === "Invalid") {
          return (
            <Badge color="danger" style={badgeStyle}>
              Invalid
            </Badge>
          );
        } else if (row.oldStatus === "Valid") {
          return (
            <Badge color="success" style={badgeStyle}>
              Valid
            </Badge>
          );
        } else if (row.status == "Pending") {
          return (
            <Badge color="info" style={badgeStyle}>
              Pending
            </Badge>
          );
        } else if (row.oldStatus === "Active") {
          return (
            <Badge color="success" style={badgeStyle}>
              Active
            </Badge>
          );
        }
      },
    },
    {
      name: "Status",
      column: "status",
      sortable: true,
      width: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          width: "100px",
          padding: "8px",
        };
        if (!row.status) {
          return "NA";
        } else if (row.status == "Invalid") {
          return (
            <Badge color="danger" style={badgeStyle}>
              Invalid
            </Badge>
          );
        } else if (row.status == "Active") {
          return (
            <Badge color="success" style={badgeStyle}>
              Active
            </Badge>
          );
        } else if (row.status == "Pending") {
          return (
            <Badge color="info" style={badgeStyle}>
              Pending
            </Badge>
          );
        } else if (row.status == "Valid") {
          return (
            <Badge color="success" style={badgeStyle}>
              Valid
            </Badge>
          );
        }
      },
    },
  ];

  const handlePagination = (page) => {
    query.offset = page.selected * query.limit;
    setQuery(query);
    request(false);
  };

  const CustomPagination = () => {
    const limit = [1, 10, 25, 50, 100];
    const updateLimit = (e) => {
      query.limit = parseInt(e.target.value);
      setQuery({ ...query });
      request();
    };

    return (
      <div className="mt-2">
        <div className="container position-absolute">
          <div className="row">
            <div className="col-sm-1">
              <select
                className="form-select form-select-sm"
                onChange={updateLimit}
                value={query.limit}
              >
                {limit.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-1">Total: {total}</div>
          </div>
        </div>

        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={Math.floor(query.offset / query.limit)}
          onPageChange={(page) => handlePagination(page)}
          pageCount={Math.ceil(total / query.limit)}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
        />
      </div>
    );
  };

  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      request();
    }
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows?.selectedRows.map((row) => row));

    setSelectedRowsForVerify(
      rows?.selectedRows.map((row) => ({
        gst: row.gst,
        supplierId: row.supplierId,
      }))
    );
    setSelectedRowIds((prev) => [...prev, rows.supplierId]);

    const newSelectedRowIds = rows?.selectedRows.map((row) => row.id);
    setSelectedRowIds(newSelectedRowIds);

    setQuery((prev) => ({
      ...prev,
      selected_ids: newSelectedRowIds
    }));
  };

  const handleRowDeselected = () => {
    setSelectedRows([]);
    setSelectedRowIds((prev) => prev.filter((id) => id !== row.supplierId));

  };

  const clearSelectedRows = () => {
    setToggleClearRows(!toggledClearRows);
  };

  const verify = async () => {
    const data = {
      gstNo: selectedRowsForVerify,
    };
    setLoading(true);
    await axios
      .post(
        new URL(
          "v1/services/masterIndia/gst/validateSelected",
          themeConfig.backendUrl
        ),
        data
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        } else {
          setLoading(false);
          setTotal(res.data.total);
          toast.success(res.data.message);
          request();
          <RefreshCw size={15} />;
        }
      })
      .catch((error) => {
        // Handle error if the request fails
        console.error("Error:", error);
      });

    clearSelectedRows();
    handleRowDeselected();
    setSelectedRowsForVerify([]);
  };

  const exportAll = (isExportSelectedData = []) => {
    setDownloading(true);
    axios.post(
      new URL("/api/v1/services/masterIndia/msme/excelExport", themeConfig.backendUrl),
      query,
      { responseType: "blob" }
    )
      .then((response) => {
        if (response.headers["content-type"].includes("application/json")) {
          const reader = new FileReader();
          reader.onload = () => {
            const jsonData = JSON.parse(reader.result);
            if (jsonData.error) {
              toast.error(jsonData.message);
            } else {

              downloadFile(response.data, "MSMEList.xlsx");
            }
          };
          reader.readAsText(response.data);

        } else {

          downloadFile(response.data, "MSMEList.xlsx");
        }
        setDownloading(false);
      })
      .catch((error) => {
        setDownloading(false);
        toast.error(error.message);
        console.error("Error exporting data:", error);
      });
  };


  const downloadFile = (data, filename) => {
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data Exported");
  };


  const handleExportSelectedData = () => {
    if (!selectedRows || selectedRows.length === 0) {
      toast("No rows selected!", { position: "top-center" });
      return;
    }

    const selectedIds = selectedRows.map((index) => index.id);
    exportAll(selectedIds);
    console.log(selectedIds);
  };
  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> MSME Compliance </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {exportFields !== null && (
        <ExportXLS
          exportFields={exportFields}
          setExportFields={setExportFields}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          isExportSelectedData={isExportSelectedData}
          handleExportSelectedData={handleExportSelectedData}
          exportAll={exportAll}
          handleToggle={handleToggle}
          selectedFields={selectedFields}
          setSelectedFields={setSelectedFields}
        />
      )}
      <div className="card">
        {addModal ? (
          ""
        ) : (
          <div className="card-body">
            <div className="d-flex justify-content-between align-center">
              <h4>MSME Compliance</h4>
              <Button
                color="primary"
                size="sm"
                onClick={verify}
                disabled={selectedRows?.length === 0 || !selectedRows?.length}
              >
                Verify
              </Button>
            </div>
            <hr />

            {data !== null ? (
              <>
                {loading ? (
                  <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
                    <LinearProgress className="mb-1" color="inherit" />
                  </Stack>
                ) : (
                  ""
                )}
                {startDate && endDate && (
                  <div className="d-flex justify-content-between align-items-end mb-1 row">
                    <div className="col-md-3 mb-1 mb-md-0 mb-lg-0">
                      <div
                        style={{
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 4px",
                          borderRadius: "8px",
                          gap: "4px",
                        }}
                      >
                        <div style={{ display: "flex" }} className="gap-1">
                          <p style={{ margin: "0px", whiteSpace: "nowrap" }}>
                            {moment(startDate).format("DD-MM-YYYY")}
                          </p>
                          <p style={{ margin: "0px" }}>-</p>
                          <p style={{ margin: "0px", whiteSpace: "nowrap" }}>
                            {moment(endDate).format("DD-MM-YYYY")}
                          </p>
                        </div>
                        <div
                          style={{ paddingBottom: "2px" }}
                          onClick={handleFilterReset}
                        >
                          <IoCloseCircleOutline size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row d-flex justify-content-between align-items-end mb-1">
                  <div className="col-md mb-1 mb-md-0 mb-lg-0">
                    <Button
                      style={{ height: `40px` }}
                      className="d-flex button justify-content-center align-items-center w-75"
                      color="primary"
                      caret
                      outline
                      onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                    >
                      <FilterAlt size={15} />
                      <span className="align-middle ms-50">Filter</span>
                    </Button>
                  </div>
                  <div className="d-flex gap-2 col-md-5 mb-1 mb-md-0 mb-lg-0">
                    <Button
                      style={{ height: `40px`, padding: "8px", gap: "5px" }}
                      className="d-flex justify-content-center align-items-center col-md-5 col-sm-12"
                      color="primary"
                      caret
                      outline
                      onClick={(e) => {
                        setIsExportSelectedData(false);
                        handleToggle(e);
                        exportAll();
                      }}
                    >
                      <Downloading size={15} />
                      <span>Export All Data</span>
                    </Button>
                    <Button
                      style={{ height: `40px`, padding: "8px", gap: "5px" }}
                      className="d-flex justify-content-center align-items-center col-md-5 col-sm-12"
                      color="primary"
                      caret
                      outline
                      onClick={(e) => {
                        setIsExportSelectedData(true);
                        handleToggle(e);
                        handleExportSelectedData();
                      }}
                    >
                      <Downloading size={15} />
                      Export Selected Data
                    </Button>
                  </div>
                  <div className="col-md">
                    <label>&nbsp;</label>
                    <input
                      type="text"
                      name=""
                      className="form-control mr-2"
                      id=""
                      placeholder="Search"
                      onChange={(e) => {
                        query.search = e.target.value;
                        setQuery(query);
                        request();
                      }}
                    />
                  </div>
                  <div className="col-md-1">
                    {" "}
                    <label>&nbsp;</label>
                    <button
                      className="btn btn-primary btn-sm form-control"
                      onClick={request}
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>


                <div className="react-dataTable position-relative">
                  <div
                    className={` ${isFilterModalOpen ? "d-flex" : "d-none"
                      } flex-column gap-2 p-1 bg-white border border-secondary rounded shadow w-md-50 w-sm-25`}
                    style={{
                      position: `absolute`,
                      top: `3rem`,
                      zIndex: 50,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginBottom: "5px",
                      }}
                      className=" justify-content-center align-items-center"
                    >
                      <Flatpickr
                        className="form-control clickable w-100"
                        style={{ width: "fit-content" }}
                        options={{
                          mode: "range",
                          dateFormat: "d-m-Y",
                        }}
                        placeholder="Select Dates"
                        value={[startDate, endDate]}
                        onChange={(dates) => {
                          if (dates) {
                            // console.log(dates);
                            setStartDate(() => dates[0]);
                            setEndDate(() => dates[1]);
                          } else {
                            setStartDate(null);
                            setEndDate(null);
                          }
                        }}
                      />
                      {startDate && (
                        <div onClick={handleFilterReset}>
                          <IoCloseCircleOutline size={18} />
                        </div>
                      )}
                    </div>
                    <div className="d-flex gap-2 justify-content-between">
                      <Button
                        className="w-100"
                        color="primary"
                        size="md"
                        onClick={() => {
                          request();
                          setIsFilterModalOpen(!isFilterModalOpen);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                  <DataTable
                    noHeader
                    pagination
                    data={data}
                    columns={basicColumns}
                    selectableRows
                    clearSelectedRows={toggledClearRows}
                    selectableRowsComponent={BootstrapCheckbox}
                    onSelectedRowsChange={(rows) => handleRowSelected(rows)}
                    onRowDeselected={handleRowDeselected}
                    className="react-dataTable"
                    sortIcon={<ChevronDown size={10} />}
                    onSort={handleSort}
                    paginationComponent={CustomPagination}
                    paginationDefaultPage={query.offset + 1}
                    paginationServer
                  />
                </div>
              </>
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "400px" }}
              >
                <Spinner />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MsmeCompliance;
