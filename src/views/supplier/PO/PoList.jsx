import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress, Tooltip, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { FilterAlt, RemoveRedEyeSharp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Breadcrumb, BreadcrumbItem, Button, Card } from "reactstrap";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/flatpickr/flatpickr.scss";

const PoList = () => {
  const navigate = useNavigate();
  const vendorCodeJSON = localStorage.getItem("vendorCode");
  const user = JSON.parse(localStorage.getItem("userData"));
  const vendorCode = vendorCodeJSON ? JSON.parse(vendorCodeJSON) : null;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    type: "", //  service,material
    search: "",
    offset: "0",
    limit: "10",
    order: "desc",
    SUPPLIER:
      user.role_name === "SuperAdmin" ? "6200002540" : vendorCode?.toString(),
  });

  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL("/api/supplier/po/fetchPOList", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setLoading(false);
        setData(res.data.data.data);
        setTotal(res.data.data.total);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  const handleViewAsn = (poNumber) => {
    navigate(`/supplier/PoView/`, { state: { poNumber } });
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
      name: "PO Type",
      sortable: true,
      maxWidth: "200px",
      column: "PO_NUMBER",
      cell: (row) => {
        if (row.PO_NUMBER.startsWith("46")) {
          return <Badge color="info">Service</Badge>;
        } else {
          return <Badge color="primary">Material</Badge>;
        }
      },
    },
    {
      name: "PO Number",
      column: "PO_NUMBER",
      selector: (row) => (
        <Typography>
          <Link
            style={{
              color: row.PO_NUMBER.startsWith("46") ? "#00cfe8" : "#f26c13",
            }}
            onClick={(event) => {
              event.preventDefault();
              handleViewAsn(row.PO_NUMBER);
            }}
          >
            {row.PO_NUMBER}
          </Link>
        </Typography>
      ),
    },

    {
      name: "Action",
      width: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Tooltip title="View PO">
              <RemoveRedEyeSharp
                aria-disabled
                className="mb-1"
                style={{ cursor: "pointer", color: "#7367f0" }}
                onClick={() => {
                  handleViewAsn(row.PO_NUMBER);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      request();
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

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> List PO </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-center">
          <h4>Purchase Order</h4>
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

            <div className="d-flex justify-content-end align-items-end mb-2">
              <div className="d-flex  gap-2">
                <div className="col-md-4">
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
                      { value: "service", label: "Service" },
                      { value: "material", label: "Material" },
                    ]}
                  />
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
              <Card>
                <DataTable
                  noHeader
                  data={data}
                  columns={basicColumns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  onSort={handleSort}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={query.offset + 1}
                  paginationServer
                  pagination
                />
              </Card>
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
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <h3>Something Went Wrong</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default PoList;
