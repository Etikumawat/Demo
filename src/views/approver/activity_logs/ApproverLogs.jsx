import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Breadcrumb, BreadcrumbItem, Button } from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link } from "react-router-dom";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { FilterAlt } from "@mui/icons-material";

const ApproverActivityLogs = () => {
  let userdata = localStorage.getItem("userData");
  const d = JSON.parse(userdata);
  const userId = d?.id ? d.id : "";
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    sort: "user_id",
    order: "desc",
    search: "",
  });

  const request = (reset_offset = true) => {
    setLoading(true);

    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(
        new URL(
          "/api/v1/admin/users/individualactivity/" + userId,
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          console.log(res.data.message,"msggg");
          setLoading(false);
        }
        setLoading(false);
        setTotal(res.data.total);
        setData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
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
            dateField: isDispatchDate ? "dispatchDate" : "timestamp",
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
            dateField: isDispatchDate ? "dispatchDate" : "timestamp",
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

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "100px",
      column: "id",
      sortable: true,
      selector: (row) => row.srNo,
    },
    {
      name: "Routes",
      column: "route",
      sortable: true,
      width: "300px",
      selector: (row) => row.route,
      cell: (row) => <div>{row.route}</div>,
    },
    {
      name: "Response Message",
      column: "response",
      sortable: true,
      width: "350px",
      selector: (row) => row.response.message,
      cell: (row) => <div>{row.response.message}</div>,
    },

    {
      name: "User",
      column: "username",
      sortable: true,
      width: "200px",
      selector: (row) => row.username,
      cell: (row) => <div>{row.username}</div>,
    },
    {
      name: "Date",
      column: "Date",
      width: "250px",
      sortable: true,
      selector: (row) => row.timestamp,
      cell: (row) => {
        return (
          <div>
            {" 📅 " + moment(row.timestamp).format("DD-MM-YYYY")}
            {" 🕜 " + row.timestamp.slice(11, 16)}
          </div>
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
            <span> Logs </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>User Activities</h4>
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="col-md-2">
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

export default ApproverActivityLogs;
