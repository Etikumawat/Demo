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

const Transactional = () => {
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState({
    offset: 0,
    limit: 50,
    sort: "timestamp",
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
      .post(new URL("/api/v1/admin/logs/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setLoading(false);
        setTotal(res.data.total);
        setData(res.data.data);
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
                <h5>Old Value</h5>
                <hr />
                <Row>
                  {editData?.old_value &&
                    Object.entries(editData.old_value).map(([key, value]) => (
                      <Col className="mb-1" md={4} key={key}>
                        <div>
                          <strong>{key}:</strong> {value}
                        </div>
                      </Col>
                    ))}
                </Row>
                <h5 className="mt-2">New Value</h5>
                <hr />
                <Row>
                  {editData?.new_value &&
                    Object.entries(editData.new_value).map(([key, value]) => (
                      <Col className="mb-1" md={4} key={key}>
                        <div>
                          <strong>{key}:</strong> {value}
                        </div>
                      </Col>
                    ))}
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
      selector: (row) => row.srno,
    },

    {
      name: "Transaction Type",
      column: "Transaction",
      sortable: true,
      width: "200px",
      selector: (row) => row.transaction_type,
      cell: (row) => <div>{row.transaction_type}</div>,
    },
    {
      name: "Table Name",
      column: "Tabke name",
      sortable: true,
      width: "200px",
      selector: (row) => row.table_name,
      cell: (row) => <div>{row.table_name}</div>,
    },
    {
      name: "Username",
      column: "Username",
      sortable: true,
      width: "150px",
      selector: (row) => row.username,
      cell: (row) => <div>{row.username}</div>,
    },
    {
      name: "Changes",
      column: "Changes",
      sortable: true,
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
      name: "Formatted Sentence",
      column: "formattedSentence",
      sortable: true,
      width: "250px",
      selector: (row) => row.formattedSentence,
      cell: (row) => <div>{row.formattedSentence}</div>,
    },
    {
      name: "Date",
      minWidth: "220px",
      sortable: true,
      column: "date",
      cell: (row) => {
        const timestamp = row.timestamp;
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
            <span> Transactional</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Transactional Logs</h4>
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

export default Transactional;
