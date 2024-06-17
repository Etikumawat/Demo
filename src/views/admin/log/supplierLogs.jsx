import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Form,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";

const Suppplierlogs = () => {
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
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
          "/api/v1/supplier/supplier/supplierLogs",
          themeConfig.backendUrl
        ),
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
        console.log(err);
      });
  };

  useEffect(() => {
    request();
  }, []);

  const EditView = () => {
    const updatedFields = editData?.updatedFields
      ? JSON.parse(editData?.updatedFields)
      : "";
    const oldFields = editData?.oldFields
      ? JSON.parse(editData?.oldFields)
      : "";
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
                <h4>Old Value</h4>
                <hr />
                <Row>
                  {oldFields ? (
                    Object.entries(oldFields).map(([category, values]) =>
                      Object.entries(values).map(([key, value]) => (
                        <Col className="mb-1" md={6} sm={12} key={key}>
                          <div key={category}>
                            <div>
                              <strong>{key}:</strong> {value}
                            </div>
                          </div>
                        </Col>
                      ))
                    )
                  ) : (
                    <Col className="mb-1" md={12}>
                       { console.log("no data")}
                      <div>Not data found</div>
                    </Col>
                  )}
                </Row>
                <h4 className="mt-2">New Value</h4>
                <hr />
                <Row>
                  {updatedFields ? (
                    Object.entries(updatedFields).map(([category, values]) =>
                      Object.entries(values).map(([key, value]) => (
                        <Col className="mb-1" md={6} sm={12} key={key}>
                          <div key={category}>
                            <div>
                              <strong>{key}:</strong> {value}
                            </div>
                          </div>
                        </Col>
                      ))
                    )
                  ) : (
                    <Col className="mb-1" md={12}>
                      <div>Not data found</div>
                    </Col>
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
      maxWidth: "100px",
      column: "id",
      sortable: true,
      selector: (row) => row.sr,
    },

    {
      name: "Supplier Name",
      column: "Supplier Name",
      sortable: true,
      width: "250px",
      selector: (row) => row.supplierName,
      cell: (row) => <div>{row.supplierName}</div>,
    },
    {
      name: "Email",
      column: "Email",
      sortable: true,
      width: "280px",
      selector: (row) => row.email,
      cell: (row) => <div>{row.email}</div>,
    },
    {
      name: "GST",
      column: "GST",
      sortable: true,
      width: "230px",
      selector: (row) => row.gstNo,
      cell: (row) => <div>{row.gstNo}</div>,
    },
    {
      name: "PAN",
      column: "PAN",
      sortable: true,
      width: "200px",
      selector: (row) => row.panNo,
      cell: (row) => <div>{row.panNo}</div>,
    },
    {
      name: "Change",
      column: "Change",
      sortable: true,
      width: "200px",
      selector: (row) => row.remarks,
      cell: (row) => <div>{row.remarks}</div>,
    },
    {
      name: "New value",
      column: "New value",
      sortable: true,
      width: "200px",
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
      name: "By",
      column: "By",
      sortable: true,
      width: "200px",
      selector: (row) => row.byWhom,
      cell: (row) => <div>{row.byWhom}</div>,
    },
    {
      name: "Date",
      column: "Date",
      sortable: true,
      width: "250px",
      cell: (row) => {
        const timestamp = row.onDate;
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
        return formattedDateTime;
      },
    },
    {
      name: "Status",
      column: "Status",
      sortable: true,
      width: "200px",
      selector: (row) => row.status,
      cell: (row) => <div>{row.status}</div>,
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
            <span> Supplier logs</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Supplier Logs</h4>
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
              <EditView />
              <div className="d-flex justify-content-between mb-1">
                <div></div>
                <div className="row">
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

                  <div className="col-md-4">
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
            </>
          ) : loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner />
            </div>
          ) : (
            <>Cant fetch Data.Something went wrong</>
          )}
        </div>
      </div>
    </>
  );
};

export default Suppplierlogs;
