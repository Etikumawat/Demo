import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { Button, Badge, Breadcrumb, BreadcrumbItem } from "reactstrap";
import moment from "moment";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import Flatpickr from "react-flatpickr";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2 } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { FilterAlt } from "@mui/icons-material";
import { LinearProgress, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import { IoCloseCircleOutline } from "react-icons/io5";

const SapInvoice = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDispatchDate, setIsDispatchDate] = useState();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    sort: "createdAt",
    order: "desc",
    status: "",
    type:""
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
      .post(
        new URL("/api/v1/supplier/grn/listallinvoices", themeConfig.backendUrl),
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
  // const deleteCategory = (row) => {
  //   MySwal.fire({
  //     title: "Are you sure?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     customClass: {
  //       confirmButton: "btn btn-primary",
  //       cancelButton: "btn btn-danger ms-1",
  //     },

  //     buttonsStyling: false,
  //   }).then(function (result) {
  //     if (result.value) {
  //       axios
  //         .delete(
  //           new URL(
  //             `/api/v1/admin/sapcreds/delete/${row.id}`,
  //             themeConfig.backendUrl
  //           )
  //         )
  //         .then((response) => {
  //           if (response.data.error) {
  //             return toast.error(response.data.message);
  //           } else {
  //             toast.success(response.data.message);
  //           }
  //         });
  //       request();
  //     }
  //   });
  // };

  useEffect(() => {
    request();
  }, [addModal]);

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "100px",
      column: "id",
      sortable: true,
      selector: (row) => row.srNo,
    },
    {
      name: "Invoice Code",
      width: "200px",
      column: "invoiceCode",
      selector: (row) => row.invoiceCode,
      cell: (row) => {
        if (row.invoiceCode) {
          const invoiceCodes = JSON.parse(row.invoiceCode);
          if (invoiceCodes.length > 0) {
            return (
              <div style={{ color: "#F4873F", marginTop: "10px" }}>
                <Typography>{invoiceCodes[0]}</Typography>{" "}
              </div>
            );
          } else {
            return (
              <div style={{ color: "#ea5455", marginTop: "10px" }}>
                <Typography>N/A</Typography>
              </div>
            );
          }
        } else {
          return (
            <div style={{ color: "#ea5455", marginTop: "10px" }}>
              <Typography>N/A</Typography>
            </div>
          );
        }
      },
    },
    {
      name: "Po Num",
      column: "poNo",
      sortable: true,
      width: "200px",
      selector: (row) => row.poNo,
    },

    {
      name: "Amount",
      column: "totalInvoiceAmount",
      sortable: true,
      width: "180px",
      selector: (row) => row.header.totalInvoiceAmount,
    },
    {
      name: "Invoiced Date",
      column: "created_at",
      sortable: true,
      width: "200px",
      selector: (row) => {
        const timestamp = row.createdAt;
        const date = new Date(timestamp);
        const formattedDateTime =
          " 📅 " +
          date.toISOString().slice(8, 10) +
          "/" + // Extract dd
          date.toISOString().slice(5, 7) +
          "/" + // Extract mm
          date.toISOString().slice(0, 4);
        return formattedDateTime;
      },
    },
    {
      name: "Invoice Type",
      width: "200px",
      sortable: true,
      column: "parkPostIndicator",
      selector: (row) => row.header.parkPostIndicator,
      cell: (row) => {
        if (row.header.parkPostIndicator == "park") {
          return (
            <Badge color="success" style={{ paddingBlock: "10px" }}>
              Park Invoice
            </Badge>
          );
        } else {
          return (
            <Badge color="info" style={{ paddingBlock: "10px" }}>
              Post Invoice
            </Badge>
          );
        }
      },
    },
    // {
    //   name: "Action",
    //   maxWidth: "150px",
    //   column: "status",
    //   selector: (row) => row.status,
    //   cell: (row) => {
    //     return (
    //       <>
    //         <Edit
    //           className="me-1"
    //           style={{ cursor: "pointer", color: "#7367f0" }}
    //           onClick={() => {
    //             setEditData(row);
    //             setEditModal(true);
    //           }}
    //         />

    //         <Trash2
    //           disabled
    //           style={{ cursor: "pointer", color: "#D2042D" }}
    //           onClick={() => deleteCategory(row)}
    //         />
    //       </>
    //     );
    //   },
    // },
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
            <span> ASN/SCR Invoice </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>ASN/SCR Invoice</h4>
            {/* <Button
              color="primary"
              size="sm"
              onClick={() => setAddModal(!addModal)}
            >
              Create
            </Button> */}
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
              <div className="d-flex justify-content-between">
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
                <div className="d-flex gap-2 mb-2">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Invoice Type</label>
                      <Select
                        className={`react-select`}
                        classNamePrefix="select"
                        onChange={(selectedOption) => {
                          query.type = selectedOption.value;
                          setQuery(query);
                          request();
                        }}
                        options={[
                          { value: "", label: "Select" },
                          { value: "post", label: "Post" },
                          { value: "park", label: "Park" },
                        ]}
                      ></Select>
                    </div>
                  </div>
                  <div className="col-md-4">
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
                <div className="react-dataTable">
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

export default SapInvoice;
