import { useState, useEffect } from "react";
import {
  Badge,
  Input,
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Select from "react-select";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { selectThemeColors } from "@utils";
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

import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);
// const font600 = { fontSize: "600" };
const headerText = {
  fontWeight: "bold",
};
const selectOptions = [
  {
    value: "TextField",
    label: "TextField",
  },
  { value: "Number", label: "Number" },
  { value: "Password", label: "Password" },
  {
    value: "Email",
    label: "Email",
  },
];
const prFields = () => {
  const [inputValue, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editFieldType, setEditFieldType] = useState(null);
  const [data, setData] = useState(null);
  //   const [total, setTotal] = useState(null);
  const [editData, setEditData] = useState({});
  const [showEditSection, setShowEditSection] = useState(false);
  const [showFormViewControl, setShowFormViewControl] = useState(false);

  const [fieldsData, setFieldsData] = useState({
    key: "",
    fieldtype: "",
    displayName: "",
    required: "",
    display: "",
    is_primary: "1",
    status: "1",
  });

  const setAllFieldsDataDefault = () => {
    setFieldsData({
      key: "",
      fieldtype: "",
      displayName: "",
      required: "",
      display: "",
      is_primary: "1",
      status: "1",
    });
    setInput(null);
  };

  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    // status: ""
  });

  const inputChange = (selectedOption) => {
    setInput(selectedOption);
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122)
    ) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFieldsData((prevData) => ({
      ...prevData,
      display: checked,
    }));
    if (name === "display") {
      setFieldsData((prevData) => ({
        ...prevData,
        display: checked,
        required: false,
      }));
    } else if (name === "required") {
      // Update the state for the Required Field checkbox
      setFieldsData((prevData) => ({
        ...prevData,
        required: checked,
        display: true,
      }));
    } else {
      // Update the state for text input fields (Display Name and Key Name)
      setFieldsData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };
  const onSubmit = () => {
    const data = {
      moduleName: "pr",
      status: "1",
      fields: [
        {
          key: fieldsData.key,
          fieldtype: inputValue.value,
          displayName: fieldsData.displayName,
          required: fieldsData.required && fieldsData.display ? "1" : "0",
          display: fieldsData.display ? "1" : "0",
          is_primary: "1",
          status: "1",
        },
      ],
    };
    axios
      .post(
        themeConfig.backendUrl + "v1/configuration/form_fields/create",
        data
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        toast.success(res.data.message);
        request();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(
        new URL(
          "/api/v1/configuration/form_fields/list",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        // setTotal(res.data);
        setLoading(false);
        setData(res?.data?.data[1]?.fields);
        console.log(res?.data?.data[1]?.fields);
      });
  };

  // const changeFieldType = (selectedOption) => {
  //   setEditFieldType(selectedOption);
  // };

  const EditSection = () => {
    const [form, setForm] = useState({
      key: editData.key,
      fieldtype: editFieldType
        ? { value: editFieldType.value, label: editFieldType.value }
        : { value: editData.fieldtype, label: editData.fieldtype },
      displayName: editData.displayName,
      required: editData.required == 1 ? true : false,
      display: editData.display == 1 ? true : false,
    });

    const changeFieldType = (selectedOption) => {
      setForm((prevForm) => ({
        ...prevForm,
        fieldtype: selectedOption
          ? { value: selectedOption.value, label: selectedOption.value }
          : { value: editData.fieldtype, label: editData.fieldtype },
      }));
    };

    const onSubmitEdit = (e) => {
      console.log(form, "FORM");
      e.preventDefault();
      const data = {
        moduleName: "pr",
        status: "1",
        fields: [
          {
            key: form.key,
            fieldtype: form.fieldtype.value,
            displayName: form.displayName,
            required: form.required && form.display ? "1" : "0",
            display: form.display ? "1" : "0",
            is_primary: "1",
            status: "1",
          },
        ],
      };
      axios
        .put(
          new URL(
            "v1/configuration/form_fields/update",
            themeConfig.backendUrl
          ),
          data
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          }
          request();
          // setEditModal(false);
          return toast.success(res.data.message);
        });
    };

    return (
      <div className="card">
        <div className="card-body pb-1">
          <div className="d-flex justify-content-between align-center">
            <h3 style={{ color: "#E06522" }}>PR View Control</h3>
            <Button
              onClick={() => setShowEditSection(false)}
              color="primary"
              size="sm"
            >
              Back
            </Button>
          </div>
          <hr />
        </div>
        <Card>
          <CardHeader style={{ paddingTop: "0rem" }}>
            <CardTitle tag="h4">Edit PR Field</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col className="mb-1" md="4" sm="12">
                <label className="pb-0 mb-1" style={headerText}>
                  Key Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Key name"
                  disabled={true}
                  name="key"
                  value={form.key}
                />
              </Col>
              <Col className="mb-1" md="4" sm="12">
                <label className="pb-0 mb-1" style={headerText}>
                  Display Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter display name"
                  name="displayName"
                  value={form.displayName}
                  onChange={(e) => {
                    setForm({ ...form, displayName: e.target.value });
                  }}
                  required
                />
              </Col>
              <Col>
                <label className="pb-0 mb-1" style={headerText}>
                  Field Type <span className="text-danger">*</span>
                </label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={selectOptions}
                  name="fieldtype"
                  value={form.fieldtype}
                  onChange={(selectedOption) => {
                    changeFieldType(selectedOption);
                  }}
                  className="react-select"
                  classNamePrefix="select"
                  required
                />
              </Col>
            </Row>
            <div className="demo-inline-spacing">
              <div className="form-check form-check-inline">
                <Input
                  id="display"
                  name="display"
                  checked={form.display}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      display: e.target.checked,
                      required: false,
                    });
                  }}
                  type="checkbox"
                />
                <label
                  htmlFor="display"
                  className="pb-0 mb-1"
                  style={headerText}
                >
                  Display Field
                </label>
              </div>
              <div className="form-check form-check-inline">
                <Input
                  id="required"
                  name="required"
                  checked={form.required && form.display}
                  onChange={(e) => {
                    setForm({ ...form, required: e.target.checked });
                  }}
                  disabled={!form.display}
                  type="checkbox"
                />
                <label
                  htmlFor="required"
                  className="pb-0 mb-1"
                  style={headerText}
                >
                  Required Field
                </label>
              </div>
            </div>
            <Button
              color="success"
              onClick={(e) => {
                onSubmitEdit(e);
                setShowEditSection(false);
              }}
              className="mt-2"
            >
              Update
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  };

  const deleteCategory = (row) => {
    const data = {
      moduleName: "pr",
      key: row.key,
    };
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
              `/api/v1/configuration/form_fields/delete/`,
              themeConfig.backendUrl
            ),
            {
              data: data,
            }
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
  const basicColumns = [
    {
      name: "No.",
      column: "no",
      width: "100px",
      selector: (row, index) => index + 1,
    },
    {
      name: "Display Name",
      width: "200px",
      column: "display name",
      selector: (row) => row.displayName,
    },
    {
      name: "Field Type",
      width: "200px",
      column: "field type",
      selector: (row) => row.fieldtype,
    },
    {
      name: "Key",
      width: "150px",
      column: "key",
      selector: (row) => row.key,
    },
    {
      name: "Display",
      maxWidth: "150px",
      column: "display",
      selector: (row) => row.display,
      cell: (row) => {
        if (row.display == 1) {
          return (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <TaskAltIcon size={20} sx={{ color: "#28c76f" }} />
            </div>
          );
        } else {
          return (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <HighlightOffIcon size={20} sx={{ color: "red" }} />
            </div>
          );
        }
      },
    },
    {
      name: "Required",
      maxWidth: "200px",
      column: "required",
      selector: (row) => row.required,
      cell: (row) => {
        if (row.required == 1) {
          return (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <TaskAltIcon size={20} sx={{ color: "#28c76f" }} />
            </div>
          );
        } else {
          return (
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
              <HighlightOffIcon size={20} sx={{ color: "red" }} />
            </div>
          );
        }
      },
    },
    {
      name: "Status",
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
                console.log(row);
                setEditData(row);
                setEditFieldType({
                  value: row.fieldtype,
                  label: row.fieldtype,
                });
                setShowEditSection(true);
              }}
            />

            <Trash2
              style={{ cursor: "pointer", color: "#D2042D" }}
              onClick={() => {
                deleteCategory(row);
                console.log("DELETE CLICKED!!");
              }}
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

            {/* <div className="col-sm-1">Total: {total}</div> */}
          </div>
        </div>

        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={Math.floor(query.offset / query.limit)}
          onPageChange={(page) => handlePagination(page)}
          //   pageCount={Math.ceil(total / query.limit)}
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

  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> PR Field</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {showFormViewControl && (
        <div className="card">
          <div className="card-body pb-1">
            <div className="d-flex justify-content-between align-center">
              <h3 style={{ color: "#E06522" }}>PR View Control</h3>
              <Button
                color="primary"
                size="sm"
                onClick={() => {
                  setShowFormViewControl(false);
                  setAllFieldsDataDefault();
                }}
              >
                Back
              </Button>
            </div>
            <hr />
          </div>
          <Card>
            <CardHeader style={{ paddingTop: "0rem" }}>
              <CardTitle tag="h4">Create PR Field</CardTitle>
            </CardHeader>
            <CardBody>
              <Row>
                <Col className="mb-1" md="4" sm="12">
                  <label className="pb-0 mb-1" style={headerText}>
                    Key Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Key name"
                    name="key"
                    onKeyPress={handleKeyPress}
                    value={fieldsData.key}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col className="mb-1" md="4" sm="12">
                  <label className="pb-0 mb-1" style={headerText}>
                    Display Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter display name"
                    name="displayName"
                    value={fieldsData.displayName}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
                <Col>
                  <label className="pb-0 mb-1" style={headerText}>
                    Field Type <span className="text-danger">*</span>
                  </label>
                  <Select
                    isClearable={false}
                    theme={selectThemeColors}
                    options={selectOptions}
                    name="fieldtype"
                    value={inputValue}
                    onChange={inputChange}
                    className="react-select"
                    classNamePrefix="select"
                    required
                  />
                </Col>
              </Row>
              <div className="demo-inline-spacing">
                <div className="form-check form-check-inline">
                  <Input
                    id="display"
                    name="display"
                    checked={fieldsData.display}
                    onChange={handleInputChange}
                    type="checkbox"
                  />

                  <label
                    htmlFor="display"
                    className="pb-0 mb-1"
                    style={headerText}
                  >
                    Display Field
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <Input
                    id="required"
                    name="required"
                    checked={fieldsData.required && fieldsData.display}
                    onChange={handleInputChange}
                    disabled={!fieldsData.display}
                    type="checkbox"
                  />
                  <label
                    htmlFor="required"
                    className="pb-0 mb-1"
                    style={headerText}
                  >
                    Required Field
                  </label>
                </div>
              </div>
              <Button
                color="primary"
                onClick={() => {
                  onSubmit();
                  setShowFormViewControl(false);
                }}
                className="mt-2"
              >
                Create
              </Button>
            </CardBody>
          </Card>
        </div>
      )}

      {showEditSection && <EditSection />}

      {!showFormViewControl &&
        (!showEditSection ? (
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-center">
                <h4>PR Fields</h4>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => setShowFormViewControl(true)}
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
        ) : (
          ""
        ))}
    </>
  );
};

export default prFields;
