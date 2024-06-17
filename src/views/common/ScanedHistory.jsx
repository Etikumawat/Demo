/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Button,
  Badge,
  BreadcrumbItem,
  Breadcrumb,
} from "reactstrap";
import { Typography } from "@mui/material";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { useParams } from "react-router-dom";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import {
  Check,
  Checklist,
  Directions,
  FilterAlt,
  ReceiptOutlined,
  RemoveRedEyeSharp,
  StarHalf,
  Verified,
} from "@mui/icons-material";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IoCloseCircleOutline } from "react-icons/io5";

const ASN = () => {
  const navigate = useNavigate();
  const params = useParams();
  const company_id = params.id;
  const [loading, setLoading] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    company_id,
  });
  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL("v1/supplier/asn/userhistory", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          return toast.error(res.data.message);
        }
        setLoading(false);
        setTotal(res.data.data.total);
        setData(res.data.data);
      });
  };
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

  // gate Outward
  const EditModal = () => {
    const [form, setForm] = useState({
      asn_id: editData.asn_id,
      vehicalNo: "",
      status: "Outward",
    });

    const handleGateOutwardClick = (e) => {
      e.preventDefault();
      if (!form.vehicalNo) {
        toast.error("Please enter Vehicle No.");
        return;
      }

      axios
        .put(
          new URL(
            "/api/v1/supplier/asn/vehicalStatusUpdate",
            themeConfig.backendUrl
          ),
          { ...form }
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            return toast.success(res.data.message);
          }
          request();
          setEditModal(false);
        });
    };

    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Change Status
          </ModalHeader>
          <Form id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>ASN No.</label>
                    <input
                      disabled
                      type="text"
                      name="asnNo"
                      value={form.asn_id}
                      onChange={(e) => {
                        setForm({ ...form, asn_id: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label>Vehicle No.</label>
                    <input
                      required
                      type="text"
                      name="asnNo"
                      onChange={(e) => {
                        setForm({ ...form, vehicalNo: e.target.value });
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleGateOutwardClick}>
                Gate Outward
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };
  const handleViewAsn = (id) => {
    navigate(`/supplier/viewasn/${id}`);
  };

  const basicColumns = [
    {
      name: "No.",
      selector: (row) => row.sr,
      width: "100px",
    },
    {
      name: "Asn No/SCR",
      minWidth: "200px",
      maxWidth: "250px",
      sortable: true,
      selector: (row) => (
        <Typography>
          <Link
            style={{
              color: row.asnNo.startsWith("SCR") ? "#00cfe8" : "#f26c13",
            }}
            to={`/supplier/viewasn/${row.asn_id}`}
          >
            {row.asnNo}
          </Link>
        </Typography>
      ),
    },
    {
      name: "Accepted Date",
      column: "Time",
      width: "200px",
      cell: (row) => {
        return (
          <div>{" 📅 " + moment(row.dispatchDate).format("DD-MM-YYYY")}</div>
        );
      },
    },
    {
      name: "Accepted Time",
      column: "Time",
      width: "200px",
      selector: (row) => " 🕒 " + row.Time?.slice(11, 19),
    },

    {
      name: "status",
      column: "status",
      minWidth: "160px",
      sortable: true,
      selector: (row) => row.Status,
      cell: (row) => {
        const badgeStyle = {
          maxwidth: "100px",
          padding: "8px",
        };
        if (row.Status == "Material Gate Inward") {
          return (
            <Badge color="info" style={badgeStyle}>
              <Check /> GateInward
            </Badge>
          );
        } else if (row.Status == "partiallyReceived") {
          return (
            <Badge color="primary" style={badgeStyle}>
              <StarHalf /> Partially Received
            </Badge>
          );
        } else if (row.Status == "materialReceived") {
          return (
            <Badge color="info" style={badgeStyle}>
              <Checklist /> Recieved
            </Badge>
          );
        } else if (row.Status == "Quality Approved") {
          return (
            <Badge color="primary" style={badgeStyle}>
              <Verified /> QualityApproved
            </Badge>
          );
        } else if (row.Status == "Invoiced") {
          return (
            <Badge color="success" style={badgeStyle}>
              <ReceiptOutlined /> Invoiced
            </Badge>
          );
        } else if (row.Status == "Accepted") {
          return (
            <Badge color="info" style={badgeStyle}>
              <ReceiptOutlined /> Accepted
            </Badge>
          );
        }
      },
    },
    {
      name: "Action",
      column: "status",
      maxWidth: "150px",
      selector: (row) => row.Status,
      cell: (row) => {
        return (
          <>
            {row.Status === "Material Gate Inward" && (
              <Directions
                className="me-1"
                style={{
                  cursor: "pointer",
                  color: "#f26c13",
                }}
                onClick={() => {
                  setEditData(row);
                  setEditModal(true);
                }}
              />
            )}

            <RemoveRedEyeSharp
              aria-disabled
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                handleViewAsn(row.asn_id);
              }}
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

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <span> Scanned History </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Scanned History</h4>
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
              <EditModal />
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="col-md-1">
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
                <div className="d-flex gap-2">
                  <div className="col-md-8">
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
                  <div className="col-md-3">
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
      </div>
    </>
  );
};

export default ASN;
