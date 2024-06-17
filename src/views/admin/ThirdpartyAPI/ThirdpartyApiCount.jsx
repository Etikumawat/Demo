import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Card, Button, Breadcrumb, BreadcrumbItem } from "reactstrap";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import { IoCloseCircleOutline } from "react-icons/io5";
import moment from "moment";
import { FilterAlt, Input } from "@mui/icons-material";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);

const PoList = () => {
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "asc",
    sort: "controller",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    // console.log("Start Date:", startDate, "End Date", endDate);
    if (startDate === "Invalid Date" || startDate === null) {
      setQuery((prev) => {
        return {
          ...prev,
          filter: {
            startdate: "",
            enddate: "",
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
        filter: {
          startdate: moment(startDate).format("YYYY-MM-DD"),
          enddate: moment(endDate).format("YYYY-MM-DD"),
        },
      });
    }
    // console.log(query);
  }, [startDate, endDate]);

  const handleFilterReset = () => {
    setStartDate(null);
    setEndDate(null);
    query.filter.startdate = "";
    query.filter.enddate = "";
    setQuery(query);
    request();
  };

  const request = () => {
    setLoading(true);

    axios
      .post(
        new URL("/api/v1/admin/api/countapicalls", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setLoading(false);
        setData(res?.data?.data);
        setTotal(res?.data?.total);
      });
  };

  useEffect(() => {
    request();
  }, []);

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "150px",
      column: "sr",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "API",
      maxWidth: "200px",
      column: "API",
      sortable: true,
      cell: (row) => (
        <span style={{ color: "#f26c13", fontSize: "15px", fontWeight: "500" }}>
          {row.controller}
        </span>
      ),
    },
    {
      name: "Service Name",
      maxWidth: "200px",
      column: "Service Name",
      sortable: true,
      cell: (row) => (
        <span style={{ color: "#00cfe8", fontSize: "15px", fontWeight: "500" }}>
          {row.serviceName ? row.serviceName : "N/A"}
        </span>
      ),
    },
    {
      name: "Count",
      maxWidth: "150px",
      column: "Count",
      sortable: true,
      cell: (row) => (
        <span style={{ color: "purple", fontSize: "15px", fontWeight: "500" }}>
          {row.count}
        </span>
      ),
    },
  ];

  const handleSort = () => {};
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
  return (
    <>
    <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> 3rd Party API Counts</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-center">
          <h4>Third Party API Counts</h4>
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
            <div className="row d-flex justify-content-end mb-1">
              <div className="col-md-2 mt-1 d-flex gap-1 align-items-center">
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
              </div>
              <div className="col-md col-sm-12 mt-1 d-flex gap-1 align-items-center">
                {startDate && endDate && (
                  <div
                    style={{
                      backgroundColor: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "8px",
                      gap: "4px",
                    }}
                  >
                    <div className="d-flex gap-1">
                      <p style={{ margin: "0px" }}>
                        {moment(startDate).format("DD-MM-YYYY")}
                      </p>
                      <p style={{ margin: "0px" }}>-</p>
                      <p style={{ margin: "0px" }}>
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
                )}
              </div>
              {/* <div>
                <div className="col-md">
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
              </div> */}

              <div className="col-md-2">
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

              <div className="col-md-1">
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

            <Card>
              <div
                className={`${isFilterModalOpen ? "d-flex" : "d-none"}
                  flex-column gap-2 p-1 bg-white border border-secondary rounded shadow w-md-50 w-sm-25`}
                style={{
                  position: `absolute`,
                  top: `3rem`,
                  zIndex: 50,
                }}
              >
                <div
                  style={{ gap: "8px" }}
                  className="d-flex justify-content-center align-items-center w"
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
                <div className="d-flex gap-2 justify-content-between mt-1">
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
              <DataTable
                noHeader
                data={data}
                columns={basicColumns}
                className="react-dataTable"
                sortIcon={<ChevronDown size={10} />}
                onSort={handleSort}
                pagination
                paginationServer
                paginationComponent={CustomPagination}
                paginationDefaultPage={query.offset + 1}
              />
            </Card>
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
    </>
  );
};

export default PoList;
