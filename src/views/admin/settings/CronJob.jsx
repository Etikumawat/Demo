import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";

import { toast } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";

const CronJob = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 5,
  });


  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(
        new URL("/api/v1/admin/cronJob/list", themeConfig.backendUrl),
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
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
      });
  };

  useEffect(() => {
    request();
  }, []);

  const basicColumns = [
    {
      name: "No.",
      width: "80px",
      column: "index",
      selector: (row) => row.sr_no,
    },
    {
      name: "Time Unit",
      width: "130px",
      column: "time unit",
      selector: (row) =>
        row.time_unit
          ? row.time_unit.charAt(0).toUpperCase() + row.time_unit.slice(1)
          : "NA",
    },
    {
      name: "Date",
      width: "130px",
      column: "date",
      selector: (row) => (row.date ? row.date.slice(0, 10) : "NA"),
    },
    {
      name: "Day",
      width: "130px",
      column: "day",
      selector: (row) => (row.day ? row.day : "NA"),
    },
    {
      name: "Time",
      width: "130px",
      column: "time",
      selector: (row) => (row.time ? row.time : "NA"),
    },
    {
      name: "URL",
      width: "250px",
      column: "url",
      cell: (row) => (row.url ? row.url : "NA"),
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
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center mb-2">
            <h4>Cron Job</h4>
          </div>
          <ToastContainer />

          {data !== null ? (
            <>
              {loading ? (
                <Stack spacing={2}>
                  <LinearProgress
                    sx={{ width: "100%", color: "#fc6c13" }}
                    className="mb-1"
                    color="inherit"
                  />
                </Stack>
              ) : (
                ""
              )}
             

              <div className="react-dataTable mt-2">
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
              {loading ? <Spinner /> : "There are no records to display"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CronJob;
