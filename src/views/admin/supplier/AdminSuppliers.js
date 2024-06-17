import DataTable from "react-data-table-component";
import { useState, useEffect, forwardRef, useCallback } from "react";
import { CircularProgress, LinearProgress, Typography } from "@mui/material";
import { Tooltip } from "@mui/material";
import ErrorPic from "@src/assets/images/404Pic.png";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import {
  Check,
  Dangerous,
  DoNotDisturbAltOutlined,
  FilterAlt,
} from "@mui/icons-material";
import Stack from "@mui/material/Stack";

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Button,
  Badge,
  Input,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import {
  RefreshCw,
  ChevronDown,
  Trash2,
  Plus,
  Eye,
  ArrowUpRight,
  AlertCircle,
  X,
  Clock,
} from "react-feather";
import "@styles/react/pages/page-account-settings.scss";
import { Link, useNavigate } from "react-router-dom";
import DataExportCsv from "../../../@core/components/dataExports/DataExportCsv";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { IoCloseCircleOutline } from "react-icons/io5";
import Downloading from "@mui/icons-material/Downloading";
import { supplierExportSettings } from "../../../@core/layouts/components/exports/exportSettings";
import ExportXLS from "../../../@core/components/sidebar/ExportXLS";

const MySwal = withReactContent(Swal);

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const Suppliers = () => {
  const navigate = useNavigate();
  const navigateToOnboarding = () => {
    navigate("/supplier/register");
  };
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [noRecord, setNoRecord] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [total, setTotal] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState();

  // export xls states
  const [openSidebar, setOpenSidebar] = useState(false);
  const [isExportSelectedData, setIsExportSelectedData] = useState(false);
  const handleToggle = (e) => {
    e.preventDefault();
    setOpenSidebar(!openSidebar);
  };
  const [exportFields, setExportFields] = useState(null);
  const storedSelectedFields =
    JSON.parse(localStorage.getItem("selectedFields")) || {};
  const [selectedFields, setSelectedFields] = useState(storedSelectedFields);

  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "created_at",
  });

  useEffect(() => {
    // console.log("Start Date:", startDate, "End Date", endDate);
    if (startDate === "Invalid Date" || startDate === null) {
      setQuery((prev) => {
        return {
          ...prev,
          filter: {
            startDate: "",
            endDate: "",
            dateField: "created_at",
          },
        };
      });
    } else {
      setQuery({
        offset: 0,
        limit: 25,
        search: "",
        order: "desc",
        sort: "id",
        status: "all",
        filter: {
          startDate: moment(startDate).format("YYYY-MM-DD"),
          endDate: moment(endDate).format("YYYY-MM-DD"),
          dateField: "created_at",
        },
      });
    }
    // console.log(query);
  }, [startDate, endDate]);

  const request = () => {
    setLoading(true);
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/listsupplier",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setData(null);
          setNoRecord(true);
        } else {
          setTotal(res.data.total);
          setData(res.data.data);
          setLoading(false);
        }
      });
  };

  // debounce function for search query
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  const debouncedSearch = useCallback(debounce(request, 600), [query]);

  const handleFilterReset = () => {
    setStartDate(null);
    setEndDate(null);
    query.filter.startDate = "";
    query.filter.endDate = "";
    setQuery(query);
    request();
  };

  const deleteCategory = (row) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .delete(
            new URL(
              `/api/v1/supplier/supplier/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              MySwal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Deleted Successfully!",
                customClass: {
                  confirmButton: "btn btn-success",
                },
              });
            }
            request();
          });
      }
    });
  };
  const deactivate = (row) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .post(
            new URL(
              `/api/v1/supplier/supplier/deactive/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              return toast.success(response.data.message);
            }
          });
        request();
      }
    });
  };

  useEffect(() => {
    request();
    setExportFields(supplierExportSettings.fields);
  }, []);

  const AddModal = () => {
    const [form, setForm] = useState({
      code: "",
      name: "",
    });

    const onSubmit = (e) => {
      e.preventDefault();

      axios
        .post(new URL("/api/v1/admin/bpg/create", themeConfig.backendUrl), form)
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          }
          request();
          setAddModal(false);
          return toast.success(res.data.message);
        });
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            Create
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="query"
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="ZV01"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-12 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Business Partner Group
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Transport Vendors"
                      required
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Create
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };

  const handleEdit = (id) => {
    navigate(`/suppliers-details`, { state: { id: id } });
  };

  const basicColumns = [
    {
      name: "No.",
      width: "100px",
      column: "sr",
      sortable: true,
      selector: (row) => row.sr,
      cell: (row) => <div style={{ marginLeft: "20px" }}>{row.sr}</div>,
    },
    {
      name: "Suppliers",
      width: "350px",
      column: "suppliers",
      sortable: true,
      cell: (row) => (
        <Typography style={{ marginTop: "10px" }}>
          <Link
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleEdit(row.id);
            }}
          >
            {row.supplier_name}
          </Link>
        </Typography>
      ),
    },
    {
      name: "Gst/Pan No",
      width: "250px",
      column: "gstNo",
      sortable: true,
      cell: (row) => (
        <h6 style={{ marginTop: "10px" }}>
          {row.gstNo ? (
            <>
              <span style={{ color: "#0e98ba" }}>{row.gstNo}</span>
            </>
          ) : (
            <>
              <span style={{ color: "#bc6c25" }}>{row.panNo}</span>
            </>
          )}
        </h6>
      ),
    },
    {
      name: "SAP Code",
      column: "sap_code",
      width: "200px",
      selector: (row) => {
        if (row.sap_code != null) {
          return <h6>{row.sap_code}</h6>;
        } else {
          return <h6 className="text-danger">NA</h6>;
        }
      },
    },
    {
      name: "Email ID",
      column: "emailID",
      width: "280px",
      selector: (row) => {
        if (row.emailID != null) {
          return <h6>{row.emailID}</h6>;
        } else {
          return <h6 className="text-danger">NA</h6>;
        }
      },
    },
    {
      name: "Created At",
      column: "created_at",
      sortable: true,
      width: "200px",
      selector: (row) => {
        const timestamp = row.created_at;
        const date = new Date(timestamp);
        const formattedDateTime =
          " 🗓️ " +
          date.toISOString().slice(8, 10) +
          "/" + // Extract dd
          date.toISOString().slice(5, 7) +
          "/" + // Extract mm
          date.toISOString().slice(0, 4) +
          " 🕜 " +
          date.toISOString().slice(11, 16); // Extract
        return formattedDateTime;
      },
    },
    {
      name: "status",
      column: "status",
      sortable: true,
      width: "200px",
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          width: "100px",
          padding: "8px",
        };
        if (row.status == "pending") {
          return (
            <Badge style={badgeStyle} color="warning">
              <Clock /> Pending
            </Badge>
          );
        } else if (row.status == "approved") {
          return (
            <Badge style={badgeStyle} color="success">
              <Check />
              Approved
            </Badge>
          );
        } else if (row.status == "verified") {
          return (
            <Badge style={badgeStyle} color="info">
              <ArrowUpRight />
              Verified
            </Badge>
          );
        } else if (row.status == "queried") {
          return (
            <Badge style={badgeStyle} color="primary">
              <AlertCircle /> Queried
            </Badge>
          );
        } else if (row.status == "deactive") {
          return (
            <Badge color="dark" style={badgeStyle}>
              <Dangerous /> Deactive
            </Badge>
          );
        } else if (row.status == "rejected") {
          return (
            <Badge style={badgeStyle} color="danger">
              <X />
              Rejected
            </Badge>
          );
        }
      },
    },

    {
      name: "Action",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Eye
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                handleEdit(row.id);
              }}
            />
            {row.status === "pending" || row.status === "rejected" ? (
              <Trash2
                className="text-danger me-1"
                style={{ cursor: "pointer", color: "#7367f0" }}
                onClick={() => deleteCategory(row)}
              />
            ) : (
              <Trash2 color="grey" className="text-danger me-1" />
            )}
            {row.sap_code ? (
              row.status === "deactive" ? (
                <Tooltip title="Activate"></Tooltip>
              ) : (
                <Tooltip title="Deactivate">
                  <DoNotDisturbAltOutlined
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => deactivate(row)}
                  />
                </Tooltip>
              )
            ) : (
              <Tooltip title="Activate"></Tooltip>
            )}
          </>
        );
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
    }
  };
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(data[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  function downloadCSV(array) {
    const link = document.createElement("a");
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  }

  const handleRowSelected = (rows) => {
    // console.log(rows.selectedRows);
    setSelectedRows(rows?.selectedRows.map((r) => r));
  };

  const handleRowDeselected = () => {
    setSelectedRows([]);
  };
  const exportAll = (selectedData = []) => {
    setDownloading(true);
    axios
      .post(
        new URL("/api/v1/export/export", themeConfig.backendUrl),
        {
          ...supplierExportSettings,
          fields: selectedFields,
          selected_ids: selectedData,
        },
        {
          responseType: "blob",
        }
      )
      .then((response) => {
        if (response.headers["content-type"].includes("application/json")) {
          // If the response is JSON, extract the error message
          const reader = new FileReader();
          reader.onload = () => {
            const jsonData = JSON.parse(reader.result);
            if (jsonData.error) {
              toast.error(jsonData.message);
            } else {
              // Proceed with file download
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const a = document.createElement("a");
              a.href = url;
              a.download = "SupplierList.xlsx";
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              toast.success("Data Exported");
            }
          };
          reader.readAsText(response.data);
        } else {
          // If the response is not JSON, handle as needed
          // Proceed with file download
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const a = document.createElement("a");
          a.href = url;
          a.download = "SupplierList.xlsx";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          toast.success("Data Exported");
        }
        setDownloading(false);
      })
      .catch((error) => {
        setDownloading(false);
        toast.error(error.message);
        console.error("Error exporting data:", error);
      });
  };
  const handleExportSelectedData = () => {
    if (!selectedRows || selectedRows.length === 0) {
      toast("No rows selected!", { position: "top-center" });
      return;
    }
    const selectedIds = selectedRows.map((index) => index.id);
    exportAll(selectedIds);
  };

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Supplier </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div>
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
        <AddModal />
        <div>
          <div className="d-flex justify-content-between align-center">
            <h4> Suppliers</h4>
            <div
              style={{ gap: "10px" }}
              className="d-flex justify-content-between align-items-end"
            >
              <div className="d-flex mt-md-0 mt-1 h-100"></div>
              <Button
                color="primary"
                style={{ height: "100%" }}
                size="sm"
                onClick={navigateToOnboarding}
              >
                {" "}
                <Plus size={15} />
                <span className="align-middle ms-50">Supplier</span>
              </Button>
            </div>
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

              <div className="d-flex justify-content-between align-items-end mb-1 row">
                {startDate && endDate && (
                  <div className="col-md-3 mb-1 mb-md-0 mb-lg-0">
                    <div
                      style={{
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px 4px",
                        borderRadius: "8px",
                        gap: "4px",
                      }}
                    >
                      <div className="d-flex gap-1">
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
                )}
              </div>

              <div className="row d-flex justify-content-between align-items-end mb-1 ">
                <div className="col-md mb-1 mb-md-0 mb-lg-0">
                  <Button
                    style={{ height: `40px` }}
                    className="d-flex button justify-content-center align-items-center w-100"
                    color="primary"
                    caret
                    outline
                    onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                  >
                    <FilterAlt size={15} />
                    <span className="align-middle ms-50">Filter</span>
                  </Button>
                </div>
                <div className="d-flex gap-2 col-md-6 mb-1 mb-md-0 mb-lg-0">
                  <Button
                    style={{ height: `40px`, padding: "8px", gap: "5px" }}
                    className="d-flex justify-content-center align-items-center "
                    color="primary"
                    caret
                    outline
                    onClick={(e) => {
                      setIsExportSelectedData(false);
                      handleToggle(e);
                    }}
                  >
                    <Downloading size={15} />
                    <span>Export All Data</span>
                  </Button>
                  <Button
                    style={{ height: `40px`, padding: "8px", gap: "5px" }}
                    className="d-flex justify-content-center align-items-center "
                    color="primary"
                    caret
                    outline
                    onClick={(e) => {
                      setIsExportSelectedData(true);
                      handleToggle(e);
                    }}
                  >
                    <Downloading size={15} />
                    Export Selected Data
                  </Button>
                </div>
                <div className="col-md">
                  <label>Status</label>
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`nameOfCompany`}
                    className={`react-select`}
                    classNamePrefix="select"
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        query.status = selectedOption.value;
                        setQuery(query);
                        request();
                      }
                    }}
                    options={[
                      { value: "all", label: "All" },
                      { value: "pending", label: "Pending" },
                      { value: "rejected", label: "Rejected" },
                      { value: "queried", label: "Queried" },
                      { value: "approved", label: "Approved" },
                      { value: "deactive", label: "Deactive" },
                    ]}
                  />
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
                      debouncedSearch();
                    }}
                  />
                  {/* </div> */}
                </div>
                <div className="col-md-1">
                  {" "}
                  {/* <div className="form-group"> */}
                  <label>&nbsp;</label>
                  <button
                    className="btn btn-primary btn-sm form-control"
                    onClick={request}
                  >
                    <RefreshCw size={15} />
                  </button>
                  {/* </div> */}
                </div>
              </div>

              <div className="react-dataTable position-relative">
                <div
                  className={` ${
                    isFilterModalOpen ? "d-flex" : "d-none"
                  } flex-column gap-2 p-1 bg-white border border-secondary rounded shadow w-md-50 w-sm-25`}
                  style={{
                    position: `absolute`,
                    top: `3rem`,
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{ gap: "8px" }}
                    className="d-flex justify-content-center align-items-center"
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
                    {/* <Button
                      color="primary"
                      size="md"
                      onClick={() => {
                        setIsDispatchDate(!isDispatchDate);
                      }}
                    >
                      {!isDispatchDate ? "Dispatch Date" : " Created At"}
                    </Button> */}
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
                <Modal
                  scrollable
                  isOpen={downloading}
                  className="modal-dialog-centered modal-sm"
                >
                  {downloading ? (
                    <Stack
                      sx={{
                        marginTop: "10px",
                        color: "#e06522",
                        marginBottom: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                      spacing={2}
                    >
                      <CircularProgress color="inherit" />
                      Exporting file.....
                    </Stack>
                  ) : (
                    ""
                  )}
                </Modal>
                <DataTable
                  noHeader
                  pagination
                  pageCount={
                    searchValue.length
                      ? Math.ceil(filteredData.length / 7)
                      : Math.ceil(data.length / 7) || 1
                  }
                  // data={data}
                  selectableRows
                  selectableRowsComponent={BootstrapCheckbox}
                  onSelectedRowsChange={handleRowSelected}
                  onRowDeselected={handleRowDeselected}
                  columns={basicColumns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  onSort={handleSort}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={query.offset + 1}
                  paginationServer
                  data={searchValue.length ? filteredData : data}
                />
              </div>
            </>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              {noRecord ? (
                <>
                  <img
                    src={ErrorPic}
                    className="img-fluid"
                    alt="Error"
                    width={450}
                  />
                  <h3>Couldn't Fetch Supplier List</h3>
                </>
              ) : (
                <Spinner />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Suppliers;
