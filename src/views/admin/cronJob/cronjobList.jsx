import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FilterAlt } from "@mui/icons-material";
import { Link } from "react-router-dom";

const CronJob = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
  });

  const toggleAddModal = () => {
    setAddModal(!addModal);
  };

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
        setData(res?.data?.data?.rows);
        setTotal(res?.data?.data?.total);
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
            dateField: isDispatchDate ? "dispatchDate" : "created_at",
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
            dateField: isDispatchDate ? "dispatchDate" : "created_at",
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

  const AddModal = () => {
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectDay, setSelectDay] = useState("");
    const [selectDate, setSelectDate] = useState("");
    const [selectTime, setSelectTime] = useState("");
    const [selectUrl, setSelectUrl] = useState("");
    const [urlError, setUrlError] = useState("");

    const handleSelectChange = (selected) => {
      setSelectedOption(selected);
    };

    const handleDayChange = (selected) => {
      setSelectDay(selected);
    };

    const handleDateChange = (event) => {
      setSelectDate(event.target.value);
    };

    const handleTimeChange = (event) => {
      setSelectTime(event.target.value);
    };
    const handleUrlChange = (event) => {
      const { value } = event.target;
      setSelectUrl(value);
      const isValidUrl = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value);
      if (!isValidUrl) {
        setUrlError("Please enter a valid URL. Eg: http://");
      } else {
        setUrlError("");
      }
    };

    const onSubmit = (event) => {
      event.preventDefault();
      setLoading(true);
      const requestBody = {};
      if (!selectedOption || !selectUrl) {
        setLoading(false);
        return toast.error("Please fill in all required fields.");
      }
      if (urlError) {
        setLoading(false);
        return toast.error("Enter Valid URL! E.g. http://aeonx.digital");
      }
      if (selectedOption?.value === "weekly" && (!selectDay || !selectTime)) {
        setLoading(false);
        return toast.error("Please select both a day and a time.");
      }
      if (selectedOption?.value === "daily" && !selectTime) {
        setLoading(false);
        return toast.error("Please fill in all required fields.");
      }

      if (
        selectedOption?.value === "monthly" ||
        selectedOption?.value === "yearly"
      ) {
        if (!selectTime || !selectDate) {
          setLoading(false);
          return toast.error("Please fill in all required fields.");
        }
      }

      requestBody.time_unit = selectedOption?.value;
      requestBody.url = selectUrl;
      if (
        selectedOption?.value === "daily" ||
        selectedOption?.value === "weekly" ||
        selectedOption?.value === "monthly" ||
        selectedOption?.value === "yearly"
      ) {
        requestBody.time = selectTime;
      }
      if (selectedOption?.value === "weekly") {
        requestBody.day = selectDay?.value;
      }

      if (
        selectedOption?.value === "monthly" ||
        selectedOption?.value === "yearly"
      ) {
        requestBody.day = selectDay?.value;
        requestBody.date = selectDate;
      }

      axios
        .post(
          new URL("/api/v1/admin/cronJob/create", themeConfig.backendUrl),
          requestBody
        )
        .then((res) => {
          if (res.error) {
            setLoading(false);
            console.log(res, "error");
            return toast.error(res.message);
          }
          setLoading(false);
          setSelectedOption(null);
          setSelectDay("");
          setSelectDate("");
          setSelectTime("");
          setSelectUrl("");
          request();
          setAddModal(false);
          console.log(res.data.message);
          const toastContent = `${res.data.message}\n${res.data.details}`;
          return toastify.success(toastContent, {
            position: "top-center",
            autoClose: false,
          });
        })
        .catch((err) => {
          setLoading(false);
          setAddModal(false);
          return toast.error(err.message);
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
          <hr />
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              {loading && (
                <Stack spacing={2}>
                  <LinearProgress
                    sx={{ width: "100%", color: "#fc6c13" }}
                    className="mb-1"
                    color="inherit"
                  />
                </Stack>
              )}
              <div className="row mb-3">
                <div className="row mb-3 ">
                  <div className="form-group col-md-6">
                    <label>Select Time line</label>
                    <Select
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      onChange={handleSelectChange}
                      options={[
                        { value: "", label: "Select" },
                        { value: "hourly", label: "Hourly" },
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "yearly", label: "Yearly" },
                      ]}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="form-group col-md-6">
                    <label>
                      Select Day
                      {selectedOption?.value === "weekly" && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    <Select
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      onChange={handleDayChange}
                      options={[
                        { value: "", label: "Select" },
                        { value: "Monday", label: "Monday" },
                        { value: "Tuesday", label: "Tuesday" },
                        { value: "Wednesday", label: "Wednesday" },
                        { value: "Thursday", label: "Thursday" },
                        { value: "Friday", label: "Friday" },
                        { value: "Saturday", label: "Saturday" },
                        { value: "Sunday", label: "Sunday" },
                      ]}
                      isDisabled={
                        !selectedOption ||
                        selectedOption?.value === "daily" ||
                        selectedOption?.value === "hourly" ||
                        selectedOption?.value === "monthly" ||
                        selectedOption?.value === "yearly"
                      }
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>
                      Select Date
                      {(selectedOption?.value === "monthly" ||
                        selectedOption?.value === "yearly") && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    <input
                      type="date"
                      name="from_date"
                      className="form-control"
                      value={selectDate}
                      onChange={handleDateChange}
                      disabled={
                        !selectedOption ||
                        selectedOption?.value === "daily" ||
                        selectedOption?.value === "hourly" ||
                        selectedOption?.value === "weekly"
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="form-group col-md-4">
                    <label>
                      Select Time{" "}
                      {(selectedOption?.value === "monthly" ||
                        selectedOption?.value === "yearly" ||
                        selectedOption?.value === "daily" ||
                        selectedOption?.value === "weekly") && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    <input
                      type="time"
                      name="from_date"
                      className="form-control"
                      value={selectTime}
                      onChange={handleTimeChange}
                      disabled={
                        !selectedOption || selectedOption?.value === "hourly"
                      }
                    />
                  </div>
                  <div className="form-group col-md-8">
                    <label>
                      Enter URL
                      {selectedOption && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="text"
                      value={selectUrl}
                      placeholder="http://localhost:8881/api/setting/cron%22"
                      className="form-control"
                      required
                      onChange={handleUrlChange}
                      disabled={!selectedOption}
                    />
                    {urlError && <div className="text-danger">{urlError}</div>}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                disabled={!selectedOption || loading ? true : false}
                color="primary"
                type="submit"
              >
                Create
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "100px",
      column: "index",
      selector: (row) => row.sr_no,
    },
    {
      name: "Time Unit",
      width: "200px",
      column: "time unit",
      selector: (row) =>
        row.time_unit
          ? row.time_unit.charAt(0).toUpperCase() + row.time_unit.slice(1)
          : "NA",
    },

    {
      name: "Day",
      width: "200px",
      column: "day",
      selector: (row) => (row.day ? row.day : "NA"),
    },

    {
      name: "URL",
      width: "350px",
      column: "url",
      cell: (row) => (
        <div style={{ color: "#f26c13" }}>{row.url ? row.url : "NA"}</div>
      ),
    },
    {
      name: "Date",
      width: "200px",
      column: "date",

      selector: (row) =>
        row.date
          ? ` 📅 ${moment(row.dispatchDate).format("DD-MM-YYYY")}`
          : "NA",
    },
    {
      name: "Time",
      width: "200px",
      column: "time",
      selector: (row) => (row.time ? ` 🕜  ${row.time.slice(0, 10)}` : "NA"),
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
            <span> CronJob List </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <AddModal />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Cron Job</h4>
            <Button
              disabled={loading ? true : false}
              color="primary"
              size="sm"
              onClick={toggleAddModal}
            >
              Create
            </Button>
          </div>
          <ToastContainer />

          <hr />

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
              <div className="d-flex justify-content-between mb-1">
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
                <div className="row">
                  <div className="col-md-2">
                    <div className="form-group">
                      <label>&nbsp;</label>
                      <button
                        className="btn btn-primary btn-sm"
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
              {loading ? <Spinner /> : "There are no records to display"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CronJob;
