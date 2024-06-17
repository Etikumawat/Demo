import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Label,
  CardHeader,
  Badge,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2 } from "react-feather";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);
const countries = () => {
  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };

  const [addModal, setAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });
  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL("/api/v1/admin/country/list", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setTotal(res.data.data.total);
        setLoading(false);
        setData(res.data.data.rows);
      });
  };

  const deleteCategory = (row) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },
      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .delete(
            new URL(
              `/api/v1/admin/country/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            }
            MySwal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Deleted Successfully!",
              customClass: {
                confirmButton: "btn btn-success",
              },
            });
          });
        request();
      }
    });
  };

  useEffect(() => {
    request();
  }, []);

  const AddModal = () => {
    const [form, setForm] = useState({
      country_id: "",
      capital: "",
      currency_code: "",
      domain: "",
      emoji: "",
      country_key: "",
      iso3: "",
      latitude: "",
      longitude: "",
      name: "",
      native: "",
      phonecode: "",
      region: "",
      subregion: "",
    });

    const onSubmit = (e) => {
      e.preventDefault();
      axios
        .post(
          new URL("/api/v1/admin/country/create", themeConfig.backendUrl),
          form
        )
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          }
          request();
          setAddModal(false);
          return toast.success(res.data.message);
        });
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={addModal}
          toggle={() => setAddModal(!addModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setAddModal(!addModal)}>
            Create
          </ModalHeader>
          <Form onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Country<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="country_id"
                      value={form.country_id}
                      onChange={(e) => {
                        setForm({ ...form, country_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. India"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Capital<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="capital"
                      value={form.capital}
                      onChange={(e) => {
                        setForm({ ...form, capital: e.target.value });
                      }}
                      className="form-control"
                      placeholder="capital"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Currency code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="currency_code"
                      value={form.currency_code}
                      onChange={(e) => {
                        setForm({ ...form, currency_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. IND"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Domain<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="domain"
                      value={form.domain}
                      onChange={(e) => {
                        setForm({ ...form, domain: e.target.value });
                      }}
                      className="form-control"
                      placeholder="domain"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Emoji<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="emoji"
                      value={form.emoji}
                      onChange={(e) => {
                        setForm({ ...form, emoji: e.target.value });
                      }}
                      className="form-control"
                      placeholder="emoji"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Country key<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="country_key"
                      value={form.country_key}
                      onChange={(e) => {
                        setForm({ ...form, country_key: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Eg. 123"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      iso3<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="iso3"
                      value={form.iso3}
                      onChange={(e) => {
                        setForm({ ...form, iso3: e.target.value });
                      }}
                      className="form-control"
                      placeholder="iso3"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Latitude<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={form.latitude}
                      onChange={(e) => {
                        setForm({ ...form, latitude: e.target.value });
                      }}
                      className="form-control"
                      placeholder="latitude"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Longitude<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={form.longitude}
                      onChange={(e) => {
                        setForm({ ...form, longitude: e.target.value });
                      }}
                      className="form-control"
                      placeholder="longitude"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Name<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Native<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="native"
                      value={form.native}
                      onChange={(e) => {
                        setForm({ ...form, native: e.target.value });
                      }}
                      className="form-control"
                      placeholder="native"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Phonecode<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="phonecode"
                      value={form.phonecode}
                      onChange={(e) => {
                        setForm({ ...form, phonecode: e.target.value });
                      }}
                      className="form-control"
                      placeholder="phonecode"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Region<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={form.region}
                      onChange={(e) => {
                        setForm({ ...form, region: e.target.value });
                      }}
                      className="form-control"
                      placeholder="region"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Subregion<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="subregion"
                      value={form.subregion}
                      onChange={(e) => {
                        setForm({ ...form, subregion: e.target.value });
                      }}
                      className="form-control"
                      placeholder="subregion"
                      required
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Create
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };
  const EditModal = () => {
    const [form, setForm] = useState({
      id: editData.id,
      country_id: editData.country_id,
      capital: editData.capital,
      currency_code: editData.currency_code,
      domain: editData.domain,
      emoji: editData.emoji,
      country_key: editData.country_key,
      iso3: editData.iso3,
      latitude: editData.latitude,
      longitude: editData.longitude,
      name: editData.name,
      native: editData.native,
      phonecode: editData.phonecode,
      region: editData.region,
      subregion: editData.subregion,
    });
    const onSubmitEdit = (e) => {
      e.preventDefault();

      axios
        .put(
          new URL("/api/v1/admin/country/update", themeConfig.backendUrl),
          form
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          }
          request();
          setEditModal(false);
          return toast.success(res.data.message);
        });
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Country<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="country_id"
                      value={form.country_id}
                      onChange={(e) => {
                        setForm({ ...form, country_id: e.target.value });
                      }}
                      className="form-control"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Capital<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="capital"
                      value={form.capital}
                      onChange={(e) => {
                        setForm({ ...form, capital: e.target.value });
                      }}
                      className="form-control"
                      placeholder="capital"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>Currency </label>
                    <input
                      type="text"
                      name="currency_code"
                      value={form.currency_code}
                      onChange={(e) => {
                        setForm({ ...form, currency_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>Domain</label>
                    <input
                      type="text"
                      name="domain"
                      value={form.domain}
                      onChange={(e) => {
                        setForm({ ...form, domain: e.target.value });
                      }}
                      className="form-control"
                      placeholder="domain"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Emoji<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="emoji"
                      value={form.emoji}
                      onChange={(e) => {
                        setForm({ ...form, emoji: e.target.value });
                      }}
                      className="form-control"
                      placeholder="emoji"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Country <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="country_key"
                      value={form.country_key}
                      onChange={(e) => {
                        setForm({ ...form, country_key: e.target.value });
                      }}
                      className="form-control"
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      iso3<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="iso3"
                      value={form.iso3}
                      onChange={(e) => {
                        setForm({ ...form, iso3: e.target.value });
                      }}
                      className="form-control"
                      placeholder="iso3"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="text"
                      name="latitude"
                      value={form.latitude}
                      onChange={(e) => {
                        setForm({ ...form, latitude: e.target.value });
                      }}
                      className="form-control"
                      placeholder="latitude"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Longitude<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={form.longitude}
                      onChange={(e) => {
                        setForm({ ...form, longitude: e.target.value });
                      }}
                      className="form-control"
                      placeholder="longitude"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Name<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="name"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Native<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="native"
                      value={form.native}
                      onChange={(e) => {
                        setForm({ ...form, native: e.target.value });
                      }}
                      className="form-control"
                      placeholder="native"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Phonecode<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="phonecode"
                      value={form.phonecode}
                      onChange={(e) => {
                        setForm({ ...form, phonecode: e.target.value });
                      }}
                      className="form-control"
                      placeholder="phonecode"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Region<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={form.region}
                      onChange={(e) => {
                        setForm({ ...form, region: e.target.value });
                      }}
                      className="form-control"
                      placeholder="region"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Subregion<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="subregion"
                      value={form.subregion}
                      onChange={(e) => {
                        setForm({ ...form, subregion: e.target.value });
                      }}
                      className="form-control"
                      placeholder="subregion"
                      required
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };
  const basicColumns = [
    {
      name: "No",
      maxWidth: "50px",
      column: "id",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "Name",
      column: "name",
      selector: (row) => row.name,
    },
    {
      name: "Status",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        if (row.status == 1) {
          return <Badge color="success">Active</Badge>;
        } else {
          return <Badge color="danger">Deactive</Badge>;
        }
      },
    },
    {
      name: "Action",
      maxWidth: "150px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            {/* <Edit
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                setEditData(row);
                setEditModal(true);
              }}
            /> */}
            <Trash2
              style={{ cursor: "pointer", color: "#D2042D" }}
              onClick={() => deleteCategory(row)}
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
            <span> Countries </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <AddModal />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Countries</h4>
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
              <EditModal />
              <div className="d-flex justify-content-between mb-1">
                <div></div>
                <div className="row">
                  <div className="col-md">
                    <div className="form-group">
                      <label>Status</label>
                      <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      onChange={(selectedOption) => {
                        if (selectedOption) {
                          query.status = selectedOption.value;
                          setQuery(query);
                          request();
                        }
                      }}
                      options={[
                        { value: "", label: "All" },
                        { value: "1", label: "Active" },
                        { value: "0", label: "Deactive" },
                      ]}
                    />
                    </div>
                  </div>
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

export default countries;
