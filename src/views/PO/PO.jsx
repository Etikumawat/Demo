/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect, useRef } from "react";
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
} from "reactstrap";
import { Tooltip, Typography } from "@mui/material";
import { FileText } from "react-feather";
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
import { useParams } from "react-router-dom";
import Select from "react-select";
import * as htmlToImage from "html-to-image";
import { selectThemeColors } from "@utils";
import {
  Cancel,
  Check,
  Checklist,
  Close,
  Delete,
  DoorBack,
  Download,
  FilterAlt,
  LocalShipping,
  ReceiptOutlined,
  RemoveRedEyeSharp,
  Verified,
} from "@mui/icons-material";
import { Share } from "react-feather";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
// import { DatePicker } from "antd";
// import dayjs, { Dayjs } from "dayjs";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "./asn.scss";
const MySwal = withReactContent(Swal);
// const { RangePicker } = DatePicker;

const ASN = () => {
  const navigate = useNavigate();
  const params = useParams();
  const company_id = params.id;
  const [modal, setModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [itemsData, setItemsData] = useState([]);
  const [imageURL, setImageURL] = useState();
  const [viewModal, setViewModal] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelId, setCancelId] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();

  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    type: "",
    status: "all",
    dropdown: "supplier",
  });

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
      setQuery({
        offset: 0,
        limit: 25,
        search: "",
        order: "desc",
        type: "",
        status: "all",
        filter: {
          // startDate: dayjs(startDate).format("YYYY-MM-DD"),
          // endDate: dayjs(endDate).format("YYYY-MM-DD"),
          dateField: isDispatchDate ? "dispatchDate" : "createdAt",
        },
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
        console.log(error.response);
        toast.error(error.message);
      });
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

  const handleViewAsn = (id) => {
    navigate(`/supplier/viewasn/${id}`);
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
      selector: (row) => row.dispatchDate?.slice(0, 10),
    },
    {
      name: "status",
      column: "status",
      minWidth: "160px",
      sortable: true,
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          maxwidth: "100px",
          padding: "8px", // Set the fixed width for the "Pending" badge
        };
        if (row.status == "materialShipped") {
          return (
            <Badge color="warning" style={badgeStyle}>
              <LocalShipping /> Shipped
            </Badge>
          );
        } else if (row.status == "materialGateInward") {
          return (
            <Badge
              color="none"
              style={{
                backgroundColor: "darkred",
                maxWidth: "100px",
                padding: "8px",
              }}
            >
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
            <Badge color="primary" style={badgeStyle}>
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
      column: "status",
      width: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {row.status === "materialShipped" ? (
              <>
                <Tooltip title="Cancel ASN">
                  <Cancel
                    className="me-1"
                    style={{ cursor: "pointer", color: "orange" }}
                    onClick={() => {
                      setIsOpen(true), setCancelId(row.id);
                    }}
                  />
                </Tooltip>
              </>
            ) : (
              <Cancel className="me-1" style={{ color: "primary" }} />
            )}
            <Tooltip title="Download Qr">
              <Download
                ref={qrCodeRef}
                aria-disabled={false}
                className="me-1"
                style={{ cursor: "pointer", color: "#F26C13" }}
                onClick={() => {
                  ViewQrCode(row.qrcode);
                }}
              />
            </Tooltip>
            <Tooltip title="View">
              <RemoveRedEyeSharp
                aria-disabled
                className="me-1"
                style={{ cursor: "pointer", color: "#7367f0" }}
                onClick={() => {
                  handleViewAsn(row.id);
                }}
              />
            </Tooltip>

            <Delete
              className="text-danger"
              style={{ cursor: "pointer" }}
              onClick={() => deleteCategory(row)}
            />
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
  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Advanced Shipment Note</h4>
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
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="row">
                  <div className="col-md mt-1">
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
                  </div>
                  {/* <div className="col-md mt-1 d-flex gap-1 align-items-center">
                    <Button
                      style={{ height: `40px` }}
                      className="d-flex button justify-content-center align-items-center"
                      color="primary"
                      caret
                      outline
                      onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
                    >
                      <FilterAlt size={15} />
                      <span className="align-middle ms-50">Filter</span>
                    </Button>
                  </div> */}
                </div>
                <div className="row custom">
                  <div className="col-md">
                    <div className="form-group">
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
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
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
                          { value: "materialGateInward", label: "GateInward" },
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
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
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
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <button
                        className="btn btn-primary btn-sm form-control"
                        onClick={request}
                      >
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="react-dataTable position-relative">
                <div
                  className={` ${
                    isFilterModalOpen ? "d-flex" : "d-none"
                  } flex-column gap-2 p-1 bg-white border border-secondary rounded shadow`}
                  style={{
                    position: `absolute`,
                    top: `3rem`,
                    zIndex: 50,
                  }}
                >
                  {/* <RangePicker
                    style={{
                      height: `40px`,
                      width: `250px`,
                      border: `1px solid #f26c13`,
                    }}
                    onChange={(dates) => {
                      if (dates) {
                        console.log(dates);
                        setStartDate(() => dates[0]);
                        setEndDate(() => dates[1]);
                      } else {
                        setStartDate(null);
                        setEndDate(null);
                      }
                    }}
                  /> */}
                  <div className="d-flex gap-2 justify-content-between">
                    <Button
                      color="primary"
                      size="md"
                      onClick={() => {
                        setIsDispatchDate(!isDispatchDate);
                      }}
                    >
                      {!isDispatchDate ? "Dispatch Date" : " Created At"}
                    </Button>
                    <Button
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
                  <h5 className="text-center mb-3">This will cancel the ASN</h5>
                  <Col xs={12} className="text-center mt-2 pt-50">
                    <Button
                      type="submit"
                      onClick={() => {
                        cancelAsn(cancelId);
                      }}
                      className="me-1"
                      color="primary"
                    >
                      Submit
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
    </>
  );
};

export default ASN;
