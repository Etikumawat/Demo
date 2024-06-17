import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Label,
  Badge,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
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
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Stack } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
const MySwal = withReactContent(Swal);

const Plants = () => {
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "created_at",
  });

  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(new URL("/api/v1/admin/plants/list", themeConfig.backendUrl), query)
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
              `/api/v1/admin/plants/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              toast.success(response.data.message);
              request();
            }
          });
      }
    });
  };

  const [options, setOptions] = useState([]);
  const [country, setCountry] = useState([]);
  const [region, setRegion] = useState([]);

  const [selectedcountry, setSelectedcountry] = useState("");
  const [selectedregion, setSelectedregion] = useState("");
  const [selectCountryid, setSelectCountryid] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [form, setForm] = useState({
    code: "",
    street: "",
    po_box: "",
    postal_code: "",
    city: "",
    country_id: "",
    state_code: "",
    company_code: "",
    status: "",
  });
  const list = () => {
    axios
      .post(new URL("/api/v1/admin/company/list", themeConfig.backendUrl))
      .then((response) => {
        setOptions(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios
      .post(new URL("/api/v1/admin/country/list", themeConfig.backendUrl), {
        key: "all",
      })
      .then((response) => {
        setCountry(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  useEffect(() => {
    request();
    list();
  }, []);

  const handleCountry = (event) => {
    if (event) {
      axios
        .post(new URL("/api/v1/supplier/states/view", themeConfig.backendUrl), {
          countryKey: event.value,
        })
        .then((response) => {
          setRegion(response.data.data);
          setSelectedregion("");
        })
        .catch((error) => {
          console.error("Error fetching regions:", error);
        });
    } else {
      console.log("Fetching regions");
    }
    setSelectedcountry(event);
    const selectedCountryId = country.find(
      (c) => c.country_key === event.value
    ).id;
    console.log(selectedCountryId);
    setSelectCountryid(selectedCountryId);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log(selectCountryid, "countryid");
    axios
      .post(new URL("/api/v1/admin/plants/create", themeConfig.backendUrl), {
        ...form,
        company_code: selectedOption.value,
        country_id: selectCountryid,
        state_code: selectedregion.value,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        request();
        setAddModal(false);
        setForm({
          code: "",
          street: "",
          po_box: "",
          postal_code: "",
          city: "",
          country_id: "",
          state_code: "",
          company_code: "",
          status: "",
        });
        return toast.success(res.data.message);
      });
  };
  const EditModal = () => {
    const [selectedOption, setSelectedOption] = useState({
      label: editData.company_name,
      value: editData.company_code,
    });
    const [form, setForm] = useState({
      id: editData.id,
      code: editData.code,
      name: editData.name,
      company_code: editData.company_code,
      po_box: editData.po_box,
      country_id: editData.country_key,
      // country_name: editData.country_name,
      state_code: editData.state_code,
      // state_name: editData.state_name,
      city: editData.city,
      postal_code: editData.postal_code,
      street: editData.street,
      status: editData.status,
    });

    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(new URL("/api/v1/admin/plants/update", themeConfig.backendUrl), {
          ...form,
          company_code: selectedOption.value,
        })
        .then((res) => {
          // toast.success(res.data)
          // console.log(res);
          if (res.data.error) {
            setEditModal(true);
            toast.error(res.data.message);
          } else {
            setEditModal(false);
            console.log(res.data.data.message);
            toast.success("Updated successfully");
            request();
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error(error.data.message);
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
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>Plant Code</label>
                    <input
                      type="text"
                      name="code"
                      value={form.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="code"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>Plant Name</label>
                    <input
                      type="text"
                      name="code"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="code"
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>Company Name</label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={options}
                      value={selectedOption}
                      options={options.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => setSelectedOption(e)}
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>Po Box</label>
                    <input
                      type="text"
                      name="po_box"
                      value={form.po_box}
                      onChange={(e) => {
                        setForm({ ...form, po_box: e.target.value });
                      }}
                      className="form-control"
                      placeholder="--"
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country_key"
                      value={editData.country_name}
                      onChange={(e) => {
                        setForm({ ...form, country_name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="--"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="region_code"
                      value={editData.state_name}
                      onChange={(e) => {
                        setForm({ ...form, state_name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="--"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                      }}
                      className="form-control"
                      placeholder="city"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={(e) => {
                        setForm({ ...form, postal_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Postal code"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-8 mt-1">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={(e) => {
                        setForm({ ...form, street: e.target.value });
                      }}
                      className="form-control"
                      placeholder="street"
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div style={{ border: "0px" }}>
                    <label>Status</label>
                    <div className="d-flex">
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-active"
                          name="status"
                          value="1"
                          checked={form.status === "1"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label className="form-check-label" for="status-active">
                          Active
                        </Label>
                      </div>
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-deactive"
                          name="status"
                          value="0"
                          checked={form.status === "0"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label
                          className="form-check-label"
                          for="status-deactive"
                        >
                          Deactive
                        </Label>
                      </div>
                    </div>
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
      name: "No.",
      maxWidth: "50px",
      column: "sr",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "Plant Name",
      width: "160px",
      column: "name",
      sortable: true,
      cell: (row) => row.code + "-" + row.name,
    },
    {
      name: "Company Name",
      width: "250px",
      column: "name",
      sortable: true,
      cell: (row) => row.company_name,
    },
    {
      name: "Country",
      width: "180px",
      column: "name",
      sortable: true,
      cell: (row) => row.country_name,
    },
    {
      name: "City",
      column: "city",
      selector: (row) => row.city,
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
            <Edit
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                setEditData(row);
                setEditModal(true);
              }}
            />

            <Trash2
              style={{ cursor: "pointer" }}
              className="text-danger"
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
      {addModal ? (
        <Card>
          <div
            style={{
              display: "inline",
              marginBottom: "0.2rem",
              padding: "5px",
            }}
            className="d-flex custome-block justify-content-end"
          >
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                setAddModal(false);
              }}
            >
              <ArrowBack />
            </Button>
          </div>
          <CardHeader>
            <CardTitle tag="h3">Create Plant</CardTitle>
          </CardHeader>
          <CardBody>
            <Form onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>
                      Plant Code <span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={form?.code}
                      onChange={(e) => {
                        setForm({ ...form, code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="7874PT"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>
                      Plant Name<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="name"
                      name="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Ashapura"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>
                      Company Name<span className="text-danger"> *</span>
                    </label>
                    <Select
                      className={`react-select`}
                      classNamePrefix="select"
                      option={options}
                      value={selectedOption}
                      options={options.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => {
                        setSelectedOption(e);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-1">
                  <div className="form-group">
                    <label>
                      Po Box<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="po_box"
                      value={form.po_box}
                      onChange={(e) => {
                        setForm({ ...form, po_box: e.target.value });
                      }}
                      className="form-control"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>
                      Country<span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={country}
                      value={selectedcountry}
                      options={country.map((option) => {
                        return {
                          label: option.name,
                          value: option.country_key,
                        };
                      })}
                      onChange={(event) => handleCountry(event)}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>
                      State <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`nameOfBusiness`}
                      className={`react-select`}
                      classNamePrefix="select"
                      option={region}
                      value={selectedregion}
                      required
                      options={region.map((option) => {
                        return {
                          label: option.stateDesc,
                          value: option.id,
                        };
                      })}
                      onChange={(e) => {
                        setSelectedregion(e);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>
                      City<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={(e) => {
                        setForm({ ...form, city: e.target.value });
                      }}
                      className="form-control"
                      placeholder="Bhuj"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-1">
                  <div className="form-group">
                    <label>
                      Postal Code<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="number"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={(e) => {
                        setForm({ ...form, postal_code: e.target.value });
                      }}
                      className="form-control"
                      placeholder="370001"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-8 mt-1">
                  <div className="form-group">
                    <label>
                      Street<span className="text-danger"> *</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.street}
                      onChange={(e) => {
                        setForm({ ...form, street: e.target.value });
                      }}
                      className="form-control"
                      placeholder="street"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6 mt-2">
                  <div style={{ border: "0px" }}>
                    <label>
                      Status <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex">
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-active"
                          name="status"
                          value="1"
                          checked={form.status === "1"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label className="form-check-label" for="status-active">
                          Active
                        </Label>
                      </div>
                      <div className="form-check me-1">
                        <Input
                          type="radio"
                          required
                          id="status-deactive"
                          name="status"
                          value="0"
                          checked={form.status === "0"}
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                        />
                        <Label
                          className="form-check-label"
                          for="status-deactive"
                        >
                          Inactive
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-2" color="primary" type="submit">
                Create
              </Button>
            </Form>
          </CardBody>
        </Card>
      ) : (
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Plants</h4>
            <Button
              color="primary"
              size="sm"
              onClick={() => setAddModal(!addModal)}
            >
              Create
            </Button>
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
                      <select
                        className="form-select"
                        onChange={(e) => {
                          query.status = e.target.value;
                          setQuery(query);
                          request();
                        }}
                      >
                        <option value=""> All </option>
                        <option value="1"> Active </option>
                        <option value="0"> Deactive </option>
                      </select>
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
      )}
    </>
  );
};

export default Plants;
