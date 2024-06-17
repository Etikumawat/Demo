import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link } from "react-router-dom";
import { LinearProgress, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FilterAlt } from "@mui/icons-material";

const GIList = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: null,
    order: "desc",
    sort: "id",
    status: "",
    grnCodeExists: true,
    asnIdExists: true,
  });

  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(
        new URL("/api/v1/supplier/gi/listGI", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setLoading(false);
        setTotal(res.data.data.total);
        setData(res.data.data.rows);
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

  const EditView = () => {
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            View
          </ModalHeader>
          <Form id="form">
            <ModalBody>
              <div className="row">
                <h4>Item</h4>
                <hr />
                <Row>
                  {editData?.Item && (
                    <div className="row">
                      {editData.Item.map((item, index) => (
                        <div className="col-md-6" key={index}>
                          {Object.entries(item).map(([key, value]) => (
                            <div className="mb-1" key={key}>
                              <strong>{key}: </strong>
                              {value}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </Row>
              </div>
            </ModalBody>
          </Form>
        </Modal>
      </div>
    );
  };
  const basicColumns = [
    {
      name: "No.",
      width: "120px",
      column: "id",
      sortable: true,
      cell: (row) => row.sr,
    },
    {
      name: "PO No",
      width: "180px",
      column: "PO No",
      sortable: true,
      selector: (row) => (
        <Typography style={{ color: "#f26c13" }}>
          {row.poNo ? row.poNo : "NA"}
        </Typography>
      ),
    },
    {
      name: "ASN Id",
      width: "180px",
      column: "ASN Id",
      sortable: true,
      selector: (row) => (row.asnId ? row.asnId : "NA"),
    },
    {
      name: "GI Code",
      width: "180px",
      column: "GI Code",
      sortable: true,
      selector: (row) => (
        <Typography style={{ color: "#f26c13" }}>
          {row.giCode ? row.giCode : "NA"}
        </Typography>
      ),
    },

    {
      name: "Vendor Code",
      width: "200px",
      column: "Vendor Code",
      sortable: true,
      selector: (row) => (row.vendor ? row.vendor : "NA"),
    },
    {
      name: "Item",
      column: "Item",
      width: "150px",
      cell: (row) => (
        <div style={{}}>
          <h5
            onClick={() => {
              setEditData(row);
              setEditModal(true);
            }}
            style={{ cursor: "pointer", color: "#F26C13" }}
          >
            {" "}
            View
          </h5>
        </div>
      ),
    },
    {
      name: "Date",
      column: "created_at",
      sortable: true,
      width: "230px",
      selector: (row) => {
        const timestamp = row.giTime;
        if (timestamp) {
          const date = new Date(timestamp);
          const formattedDateTime =
            " 🗓️ " +
            date.toISOString().slice(8, 10) + 
            "/" +
            date.toISOString().slice(5, 7) + 
            "/" +
            date.toISOString().slice(0, 4) + 
            " 🕜 " +
            date.toISOString().slice(11, 16); 
          return <div>{formattedDateTime}</div>;
        } else {
          return <div>NA</div>;
        }
      },
    },
    {
      name: "Status",
      column: "Status",
      width: "180px",
      selector: (row) => row.giStatus,
      cell: (row) => {
        if (row.giStatus === null) {
          return (
            <Badge style={{ padding: "8px", width: "80px" }} color="danger">
              Null
            </Badge>
          );
        } else {
          return (
            <Badge style={{ padding: "8px", width: "80px" }} color="success">
              {row.giStatus}
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
  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> GI List </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
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
              <EditView />
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
          ) : loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner />
            </div>
          ) : (
            <>Can't fetch Data!!</>
          )}
        </div>
      </div>
    </>
  );
};

export default GIList;
