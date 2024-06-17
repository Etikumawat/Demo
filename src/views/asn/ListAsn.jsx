/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef, forwardRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import dumyQr from "../../assets/images/qr.png";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Badge,
  Col,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  Row,
  Input,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { CircularProgress, Popover, Tooltip, Typography } from "@mui/material";
import { FileText, Trash2 } from "react-feather";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import * as htmlToImage from "html-to-image";
import { selectThemeColors } from "@utils";
import {
  ArrowBack,
  Cancel,
  Check,
  Checklist,
  Close,
  Delete,
  DoorBack,
  Download,
  Downloading,
  FilterAlt,
  LocalShipping,
  MoreVert,
  Print,
  Receipt,
  ReceiptOutlined,
  RemoveRedEyeSharp,
  Verified,
} from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import "./asn.scss";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { IoCloseCircleOutline } from "react-icons/io5";
import DataExportCsv from "../../@core/components/dataExports/DataExportCsv";
import { asnExportSettings } from "../../@core/layouts/components/exports/exportSettings";
import ExportXLS from "../../@core/components/sidebar/ExportXLS";

const MySwal = withReactContent(Swal);

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
));

const ASN = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [imageURL, setImageURL] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [showPrintData, setShowPrintData] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [cancelId, setCancelId] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRows, setSelectedRows] = useState();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const storedUserDataJSON = localStorage.getItem("userData");
  const storedUserData = storedUserDataJSON
    ? JSON.parse(storedUserDataJSON)
    : null;
  const userName = storedUserData.username;
  const email = storedUserData.email;
  const roleName = storedUserData.role_name;
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    type: "",
    status: "all",
    dropdown: roleName === "SuperAdmin" ? "all" : "supplier",
  });

  // states for export xls
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

  useEffect(() => {
    if (startDate === "Invalid Date" || startDate === null) {
      setQuery((prev) => {
        return {
          ...prev,
          filter: {
            startDate: "",
            endDate: "",
            dateField: isDispatchDate ? "dispatchDate" : "createdAt",
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
            dateField: isDispatchDate ? "dispatchDate" : "createdAt",
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
      .post(new URL("v1/supplier/asn/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          return toast.error(res.data.message);
        }
        setLoading(false);
        setTotal(res.data.data.total);
        setData(res.data.data.rows);
        setItemsData(res.data.data.rows[0].lineItems);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // console.log(error.response);
        // toast.error(error.message);
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
              `/api/v1/supplier/asn/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              toast.success("Deleted");
              request();
            }
          });
      }
    });
  };
  const cancelAsn = (id) => {
    setIsOpen(false);
    axios
      .delete(
        new URL(`v1/supplier/asn/cancelASN/` + id, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          request();
        }
      });
  };

  const qrCodeRef = useRef(null);

  const handleViewAsn = (id) => {
    navigate(`/supplier/viewasn/${id}`);
  };
  const handleGenerateAsn = (id) => {
    navigate(`/supplier/generateirn/${id}`);
  };
  const ViewQrCode = (qrcode) => {
    setViewModal(true);
    const params = {
      QrCode: qrcode?.toString(),
    };
    axios
      .post(
        new URL("v1/supplier/asn/getqrcode", themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setImageURL(res.data.data);
        }
      });
  };

  //pdf view
  const DownloadAsn = async () => {
    const elementId = "yourDivId"; // Replace with the actual ID of your div
    const margin = 20; // Adjust margin as needed

    // Get the HTML element by ID
    const element = document.getElementById(elementId);

    if (!element) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    // Apply printing styles
    element.classList.add("printing-styles");

    // Get the dimensions of the HTML element
    const elementRect = element.getBoundingClientRect();

    // Add margin to the dimensions
    const widthWithMargin = elementRect.width + 2 * margin;
    const heightWithMargin = elementRect.height + 2 * margin;

    // Create a canvas with adjusted dimensions
    const canvas = await html2canvas(element, {
      width: widthWithMargin,
      height: heightWithMargin,
      x: -margin,
      y: -margin,
    });

    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([widthWithMargin, heightWithMargin]);
    const { width, height } = page.getSize();

    // Embed the canvas image into the PDF
    const imgBytes = canvas.toDataURL("image/png");
    const img = await pdfDoc.embedPng(imgBytes);
    page.drawImage(img, {
      x: margin,
      y: margin,
      width: width - 2 * margin,
      height: height - 2 * margin,
    });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();

    // Remove printing styles after conversion
    element.classList.remove("printing-styles");

    // Create a blob from the PDF data
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab for viewing
    window.open(pdfUrl, "_blank");
  };

  const downloadImage = (data) => {
    setPrintData(data);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenPopover = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "id",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "Type",
      maxWidth: "150px",
      sortable: true,
      column: "",
      selector: (row) => row.type,
      cell: (row) => {
        if (row.type === "NB") {
          return <Badge color="primary">ASN</Badge>;
        } else {
          return <Badge color="info">SCR</Badge>;
        }
      },
    },
    {
      name: "Asn No/SCR",
      minWidth: "200px",
      maxWidth: "250px",
      sortable: true,
      selector: (row) => (
        <Typography>
          <Link
            style={{ color: row.type === "NB" ? "#f26c13" : "#00cfe8" }}
            to={`/supplier/viewasn/${row.id}`}
          >
            {row.asnNo}
          </Link>
        </Typography>
      ),
    },

    {
      name: "Po no",
      width: "145px",
      column: "type",
      selector: (row) => row.poNo,
    },
    {
      name: "Dispatch Date",
      minWidth: "180px",
      sortable: true,
      column: "dispatchDate",
      selector: (row) => row.dispatchDate,
      cell: (row) => {
        return (
          <div>{" 📅 " + moment(row.dispatchDate).format("DD-MM-YYYY")}</div>
        );
      },
    },
    {
      name: "status",
      column: "status",
      minWidth: "160px",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          minWidth: "120px",
          fontSize: "12px",
          padding: "8px", // Set the fixed width for the "Pending" badge
        };
        if (row.status == "materialShipped") {
          return (
            <Badge color="primary" style={badgeStyle}>
              <LocalShipping /> Shipped
            </Badge>
          );
        } else if (row.status == "materialGateInward") {
          return (
            <Badge color="warning" style={badgeStyle}>
              <DoorBack /> GateInward
            </Badge>
          );
        } else if (row.status == "cancelled") {
          return (
            <Badge color="danger" style={badgeStyle}>
              <Close /> Cancelled
            </Badge>
          );
        } else if (row.status == "requested") {
          return (
            <Badge color="secondary" style={badgeStyle}>
              <Check /> Requested
            </Badge>
          );
        } else if (row.status == "materialReceived") {
          return (
            <Badge
              color="none"
              style={{
                backgroundColor: "#3872e0ab",
                width: "130px",
                padding: "8px",
              }}
            >
              <Checklist /> Recieved
            </Badge>
          );
        } else if (row.status == "qualityApproved") {
          return (
            <Badge color="primary" style={badgeStyle}>
              <Verified /> QualityApproved
            </Badge>
          );
        } else if (row.status == "invoiced") {
          return (
            <Badge color="success" style={badgeStyle}>
              <ReceiptOutlined /> Invoiced
            </Badge>
          );
        } else if (row.status == "accepted") {
          return (
            <Badge color="info" style={badgeStyle}>
              <ReceiptOutlined /> Accepted
            </Badge>
          );
        } else if (row.status == "partiallyReceived") {
          return (
            <Badge color="info" style={badgeStyle}>
              <ReceiptOutlined /> Partially Received
            </Badge>
          );
        }
      },
    },
    {
      name: "Qr Code",
      column: "image",
      width: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <img
              src={dumyQr}
              alt="Image"
              style={{ maxWidth: "50px", height: "auto", cursor: "pointer" }}
              aria-disabled
              className="me-1"
              onClick={() => {
                ViewQrCode(row.qrcode);
              }}
            />
          </>
        );
      },
    },
    {
      name: "Action",
      column: "action",
      width: "150px",
      selector: (row) => row.action,
      cell: (row) => (
        <>
          <div
            className="d-flex justify-content-between align-center"
            style={{ gap: "10px" }}
          >
            {row.status === "materialShipped" || row.status === "requested" ? (
              <Tooltip title="Cancel ASN">
                <Cancel
                  style={{ cursor: "pointer", color: "orange" }}
                  onClick={() => {
                    setIsOpen(true), setCancelId(row.id);
                  }}
                />
              </Tooltip>
            ) : (
              <Cancel style={{ color: "primary" }} />
            )}
            <Tooltip title="View">
              <RemoveRedEyeSharp
                aria-disabled
                className="mb-1"
                style={{ cursor: "pointer", color: "#7367f0" }}
                onClick={() => {
                  handleViewAsn(row.id);
                }}
              />
            </Tooltip>
            {row.status == "cancelled" ? (
              <Tooltip title="Delete">
                <Trash2
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteCategory(row)}
                />
              </Tooltip>
            ) : (
              <Trash2 style={{ color: "primary" }} />
            )}

            <MoreVert
              style={{ cursor: "pointer", color: "#999" }}
              onClick={(event) => handleOpenPopover(event, row)}
            />
          </div>
        </>
      ),
    },
  ];
  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      htmlToImage
        .toPng(qrCodeRef.current)
        .then(function (dataUrl) {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "qr-code.png";
          link.click();
        })
        .catch(function (error) {
          console.error("Error generating QR code:", error);
        });
    } else {
      console.error("qrCodeRef is null or not assigned to an element");
    }
  };
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
      <>
        <div className="mt-2">
          <div className="container position-absolute">
            <div className="row custom-width">
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
      </>
    );
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
  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      request();
    }
  };

  const [printsetting, setPrintsetting] = useState();
  useEffect(() => {
    request();
    const supplier_id = "1";
    axios
      .post(new URL("v1/supplier/printsettings/get", themeConfig.backendUrl), {
        supplier_id: supplier_id,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setPrintsetting(res.data.data);
          // toast.success("Successfully");
        }
      });

    setExportFields(asnExportSettings.fields);
  }, []);

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
          ...asnExportSettings,
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
              a.download = "ASNList.xlsx";
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
          a.download = "ASNList.xlsx";
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
      {showPrintData ? (
        <>
          <hr />
          <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/"> Home </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Link to="/supplier/asn">List ASN/SCR </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span> Print </span>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Card>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div
                onClick={() => {
                  navigate("/supplier/asn");
                }}
                style={{
                  padding: "10px",
                  margin: "10px",
                  backgroundColor: "#f26c13",
                  borderRadius: "4px",
                }}
              >
                <ArrowBack size="20px" style={{ color: "#ffffff" }} />
              </div>
            </div>
            <div
              id="yourDivId"
              style={{
                padding: "20px",
                width: "50vw",
                height: "auto",
              }}
            >
              <h2
                style={{
                  color: "#f26c13",
                  textAlign: "center",
                  margin: "30px 0px",
                  fontWeight: "600",
                }}
              >
                {printData?.type === "NB"
                  ? "Advance Shipping Note"
                  : "Service Compliance Request"}
                {/* Advance Shipping Note */}
              </h2>
              <Row>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {printsetting?.asnHide === "1" ? (
                      <>
                        <p>
                          {printData?.type === "NB"
                            ? " ASN Number:"
                            : "SCR Number:"}
                          <span style={{ fontWeight: "400" }}>
                            {printData?.asnNo}
                          </span>
                        </p>
                        <hr />
                      </>
                    ) : null}
                    {printsetting.supplierHide === "1" ? (
                      <>
                        <p>
                          Supplier Name :
                          <span style={{ fontWeight: "400" }}>{userName}</span>{" "}
                        </p>
                        <hr />
                      </>
                    ) : null}
                    {printsetting.emailHide === "1" ? (
                      <>
                        <p>
                          Email :{" "}
                          <span style={{ fontWeight: "400" }}>{email}</span>{" "}
                        </p>
                        <hr />
                      </>
                    ) : null}
                    {printsetting.panHide === "1" ? (
                      <>
                        <p>
                          PAN No
                          <span style={{ fontWeight: "400" }}>
                            {printData?.pan || "Na"}
                          </span>
                        </p>
                        <hr />
                      </>
                    ) : null}
                    {printsetting.gstHide === "1" ? (
                      <>
                        <p>
                          GST No:{" "}
                          <span style={{ fontWeight: "400" }}>
                            {printData?.gst}
                          </span>
                        </p>
                        <hr />
                      </>
                    ) : null}
                    {printsetting.invoiceHide === "1" ? (
                      <>
                        <p>
                          GST Invoice Number{" "}
                          <span style={{ fontWeight: "400" }}>
                            {printData?.gstInvoiceNumber}
                          </span>
                        </p>
                        <hr />
                      </>
                    ) : null}
                  </div>
                  <div className="qrcode__container">
                    <div>
                      <img
                        src={dumyQr}
                        alt="Image"
                        style={{
                          maxWidth: "200px",
                          height: "auto",
                        }}
                        aria-disabled
                        className="me-1"
                        onClick={() => {
                          ViewQrCode(printData?.qrcode);
                        }}
                      />
                    </div>
                    <div>
                      {printsetting.ewayHide === "1" ? (
                        <>
                          {printData?.type === "NB" ? (
                            <p>
                              E-Way Bill:
                              <span style={{ fontWeight: "400" }}>
                                {printData?.eWayBillNo || "Na"}
                              </span>
                            </p>
                          ) : (
                            ""
                          )}

                          <hr />
                        </>
                      ) : null}
                      {printsetting.inrHide === "1" ? (
                        <>
                          <p>
                            IRN Number:
                            <span style={{ fontWeight: "400" }}>
                              {printData.irnNo || "Na"}
                            </span>
                          </p>
                          <hr />
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
                {printsetting.addressHide === "1" ? (
                  <>
                    <div style={{ marginTop: "30px" }} className="w-75">
                      <h4
                        style={{
                          fontWeight: "600",
                          color: "#3872e0",
                        }}
                      >
                        Ship to Address
                        <hr />
                      </h4>

                      <table>
                        <tbody>
                          <tr>
                            <td className="pe-1">Address:</td>
                            <td>
                              <span className="">
                                {printData?.shipToAddress}
                                {/* {poData?.PO_ADDRESS?.STREET +
                                "," +
                                poData?.PO_ADDRESS?.STR_SUPPL1 +
                                "," +
                                poData?.PO_ADDRESS?.STR_SUPPL2 || "Na"} */}
                              </span>
                            </td>
                          </tr>
                          {/* <tr>
                          <td className="pe-1">State:</td>
                          <td>{poData?.buyerState || "Na"}</td>
                        </tr>
                        <tr>
                          <td className="pe-1">City:</td>
                          <td>{poData?.PO_ADDRESS?.CITY1 || "Na"}</td>
                        </tr>
                        <tr>
                          <td className="pe-1">Pin No:</td>
                          <td>{poData?.PO_ADDRESS?.POST_CODE1 || "Na"}</td>
                        </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
                {/* {printsetting.supplieraddressHide === "1" ? (
                <>
                  <Col className="mt-2 w-75" md="6" xl="7">
                    <h4
                      style={{
                        fontWeight: "600",
                        color: "#3872e0",
                      }}
                    >
                      Supplier Address
                    </h4>
                    <hr />
                    <h6 className="mb-25">{supplierData?.streetNo}</h6>

                    <CardText className="mb-25">
                      {supplierData?.address1 +
                        "," +
                        supplierData?.address2 +
                        "," +
                        supplierData?.address3 || "Na"}
                    </CardText>
                  
                    <CardText className="mb-0">
                      {supplierData?.city || "Na"}
                    </CardText>
                    <CardText className="mb-0">
                      {"Pin : " + supplierData?.pin || "Na"}
                    </CardText>
                    <CardText className="mb-0">
                      {"State : " + supplierData?.state || "Na"}
                    </CardText>
                    <CardText className="mb-0">
                      {"Country : " + supplierData?.country || "Na"}
                    </CardText>
                  </Col>
                </>
              ) : null} */}
                {printsetting.billaddressHide === "1" ? (
                  <>
                    <div className="w-75">
                      <h4
                        style={{
                          fontWeight: "600",
                          color: "#3872e0",
                        }}
                        className="mt-2"
                      >
                        Bill to Address
                      </h4>
                      <hr />
                      <table>
                        <tbody>
                          <tr>
                            <td className="pe-1">Address:</td>
                            <td>
                              <span className="">
                                {printData?.billToAddress}
                                {/* {poData?.PO_ADDRESS?.STREET +
                                "," +
                                poData?.PO_ADDRESS?.STR_SUPPL1 +
                                "," +
                                poData?.PO_ADDRESS?.STR_SUPPL2 || "Na"} */}
                              </span>
                            </td>
                          </tr>
                          {/* <tr>
                          <td className="pe-1">State:</td>
                          <td>{poData?.buyerState || "Na"}</td>
                        </tr>
                        <tr>
                          <td className="pe-1">City:</td>
                          <td>{poData?.PO_ADDRESS?.CITY1 || "Na"}</td>
                        </tr>
                        <tr>
                          <td className="pe-1">Pin No:</td>
                          <td>{poData?.PO_ADDRESS?.POST_CODE1 || "Na"}</td>
                        </tr> */}
                          <tr>
                            <td className="pe-1">PAN No: </td>
                            <td>
                              <div>
                                <Input
                                  disabled
                                  className="mb-1 w-75"
                                  value={printData.companyPAN}
                                  required
                                ></Input>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pe-1">GST No: </td>
                            <td>
                              <div>
                                <Input
                                  disabled
                                  required
                                  className="mb-1 w-75"
                                  value={printData.companyGST}
                                ></Input>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : null}
              </Row>
            </div>
            <div className="d-flex justify-content-left m-1">
              <Button
                onClick={DownloadAsn}
                color="primary"
                style={{ alignItems: "center", margin: "10px 0px" }}
              >
                Print
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <div>
          <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/"> Home </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span>List ASN/SCR </span>
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
          <div className="card-body">
            <div className="d-flex justify-content-between align-center">
              <h4>ASN / SCR</h4>
              <div
                className="d-flex justify-content-between align-center"
                style={{ gap: "10px" }}
              >
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    navigate("/supplier/addasn");
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
            <hr />

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

            {data !== null ? (
              <>
                {loading ? (
                  <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
                    <LinearProgress className="mb-1" color="inherit" />
                  </Stack>
                ) : (
                  ""
                )}

                {/* Old Dropdown of Export CSV */}
                {/* <div className="col-md mt-1">
                      <UncontrolledButtonDropdown className="button">
                        <DropdownToggle color="success" caret outline>
                          <Share size={15} />
                          <span className="align-middle ms-50">Export</span>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            className="w-100 "
                            onClick={() => downloadCSV(data)}
                          >
                            <FileText size={15} />
                            <span className="align-middle ms-50">CSV</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div> */}

                {startDate && endDate && (
                  <div className="d-flex justify-content-between align-items-end mb-1 row">
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
                      }}
                    >
                      <Downloading size={15} />
                      Export Selected Data
                    </Button>
                  </div>
                  <div className="col-md">
                    <label>Type</label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      onChange={(selectedOption) => {
                        query.type = selectedOption.value;
                        setQuery(query);
                        request();
                      }}
                      options={[
                        { value: "", label: "Select" },
                        { value: "ASN", label: "ASN" },
                        { value: "SCR", label: "SCR" },
                      ]}
                    />
                  </div>
                  <div className="col-md center">
                    <label>Status</label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      onChange={(selectedOption) => {
                        query.status = selectedOption.value;
                        setQuery(query);
                        request();
                      }}
                      options={[
                        { value: "all", label: "All" },
                        { value: "materialShipped", label: "Shipped" },
                        {
                          value: "materialGateInward",
                          label: "GateInward",
                        },
                        { value: "materialReceived", label: "Received" },
                        { value: "qualityApproved", label: "Approved" },
                        { value: "invoiced", label: "Invoiced" },
                        {
                          value: "partiallyReceived",
                          label: "Partially Received",
                        },
                        { value: "partiallyPaid", label: "Partially Paid" },
                        { value: "fullyPaid", label: "Fully Paid" },
                        { value: "unpaid", label: "Unpaid" },
                        { value: "requested", label: "Requested" },
                        { value: "accepted", label: "Accepted" },
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
                      {/* <Button
                      color="primary"
                      size="md"
                      onClick={() => {
                        setIsDispatchDate(!isDispatchDate);
                      }}
                    >
                      {!isDispatchDate ? "Dispatch Date" : "Created At"}
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

                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClosePopover}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "10px",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Download QR">
                        <Download
                          ref={qrCodeRef}
                          aria-disabled={false}
                          className="mb-1"
                          style={{ cursor: "pointer", color: "#F26C13" }}
                          onClick={() => {
                            ViewQrCode(selectedRow.qrcode);
                          }}
                        />
                      </Tooltip>
                      {selectedRow?.type === "NB" && (
                        <>
                          <Tooltip title="Generate IRN">
                            <Receipt
                              aria-disabled
                              className="mb-1"
                              style={{ cursor: "pointer", color: "#28c76f" }}
                              onClick={() => {
                                handleGenerateAsn(selectedRow.id);
                              }}
                            />
                          </Tooltip>
                        </>
                      )}
                      <Tooltip
                        title={
                          selectedRow?.type === "NB" ? "Print ASN" : "Print SCR"
                        }
                      >
                        <Print
                          aria-disabled
                          style={{ cursor: "pointer", color: "#3872e0" }}
                          onClick={() => {
                            setShowPrintData(true);
                            downloadImage(selectedRow);
                          }}
                        />
                      </Tooltip>
                    </div>
                  </Popover>
                  <Card>
                    <DataTable
                      noHeader
                      pagination
                      data={data}
                      columns={basicColumns}
                      className="react-dataTable"
                      sortIcon={<ChevronDown size={10} />}
                      onSort={handleSort}
                      paginationComponent={CustomPagination}
                      paginationDefaultPage={query.offset + 1}
                      paginationServer
                      selectableRows
                      selectableRowsComponent={BootstrapCheckbox}
                      onSelectedRowsChange={handleRowSelected}
                      onRowDeselected={handleRowDeselected}
                    />
                  </Card>
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
            <div className="vertically-centered-modal">
              <Modal
                isOpen={viewModal}
                toggle={() => setViewModal(!viewModal)}
                className="modal-dialog-centered"
              >
                <ModalHeader toggle={() => setViewModal(!viewModal)}>
                  Qr Code
                </ModalHeader>
                <ModalBody>
                  <div className="row">
                    <div className="col-md-12 me-1 mt-1">
                      <div className="form-group text-center" ref={qrCodeRef}>
                        {/* <img src={dumyQr} width={100} alt="" /> */}
                        <img
                          style={{ width: "20rem" }}
                          src={"data:image/png;base64," + imageURL}
                          alt="Qrcode"
                        />
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <Button
                  color="primary"
                  style={{ alignItems: "center" }}
                  onClick={downloadQRCode}
                >
                  <Download />
                </Button>
                {/* </Form> */}
              </Modal>
              <div className="vertically-centered-modal">
                <Modal
                  className="modal-dialog-centered"
                  isOpen={isOpen}
                  toggle={() => setIsOpen(!isOpen)}
                >
                  <ModalHeader toggle={() => setIsOpen(!isOpen)}>
                    Cancel ASN
                  </ModalHeader>
                  <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
                    <span>
                      <Cancel
                        color="error"
                        className="font-large-2 me-sm-2 mb-2 mb-sm-0"
                      />
                    </span>
                    <h3 className="text-center mb-1 mt-1">Are you sure ?</h3>
                    <h5 className="text-center mb-3">
                      This will cancel the ASN
                    </h5>
                    <Col xs={12} className="text-center mt-2 pt-50">
                      <Button
                        type="submit"
                        onClick={() => {
                          cancelAsn(cancelId);
                        }}
                        className="me-1"
                        color="primary"
                      >
                        OK
                      </Button>
                      <Button
                        type="reset"
                        color="secondary"
                        outline
                        onClick={() => setIsOpen(false)}
                      >
                        Discard
                      </Button>
                    </Col>
                  </ModalBody>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ASN;
