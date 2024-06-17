import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Button,
  Badge,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormFeedback,
  Col,
  Row,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2 } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import Select from "react-select";
import { Avatar } from "@mui/material";
import {
  ApiOutlined,
  ArrowBack,
  Backspace,
  FireTruck,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);

const ThirdPartyApi = () => {
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
    sort: "createdAt",
    order: "desc",
    status: "",
  });

  const request = (reset_offset = true) => {
    setLoading(true);
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }

    axios
      .post(new URL("/api/v1/admin/api/list", themeConfig.backendUrl), query)
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
              `/api/v1/admin/api/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              toast.success(response.data.message);
            }
          });
        request();
      }
    });
  };

  useEffect(() => {
    request();
  }, [addModal]);

  const AddView = () => {
    const SignupSchema = yup.object().shape({
      name: yup.string().required("*Name required"),
      // username: yup.string().required("*Username required"),
      // password: yup.string().required("*Password required"),
      // clientSecret: yup.string().required("*Client Secret key required"),
      // grantType: yup.string().required("*Grant Type required"),

      // url: yup
      //   .string()
      //   .matches(
      //     /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      //     "Enter a valid URL starting with http:// or https://"
      //   )
      //   .required("Enter proper URL along with http:// or https://"),
      // authorization: yup.string().required("*Authorization required"),
      // apiKey: yup.string(),
      // secretKey: yup.string(),
      // apiVersion: yup.string(),
      // status: yup.string(),
    });

    // ** Hooks
    const {
      reset,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

    const onSubmit = (data) => {
      // if (Object.values(data).every((field) => field.length > 0)) {
      axios
        .post(new URL("/api/v1/admin/api/create", themeConfig.backendUrl), data)
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          } else {
            request();
            setAddModal(false);
            return toast.success(res.data.message);
          }
        });
      // }
    };

    const handleReset = () => {
      reset({
        name: "",
        username: "",
        password: "",
        clientSecret: "",
        grantType: "",
        apiKey: "",
        secretkey: "",
        url: "",
        authorization: "",
        apiVersion: "",
      });
    };

    return (
      <div>
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
            <CardTitle className="mb-1" tag="h4">
              Create Third Party API
            </CardTitle>
          </CardHeader>

          <CardBody>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-1">
                <Label className="form-label" for="name">
                  API Name <span className="text-danger"> *</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Api Name"
                      invalid={errors.name && true}
                    />
                  )}
                />
                {errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </div>
              <Row>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="name">
                      Username
                      {/* <span className="text-danger"> *</span> */}
                    </Label>
                    <Controller
                      id="username"
                      name="username"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Username"
                          invalid={errors.username && true}
                        />
                      )}
                    />
                    {errors.username && (
                      <FormFeedback>{errors.username.message}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="name">
                      Password
                      {/* <span className="text-danger"> *</span> */}
                    </Label>
                    <Controller
                      id="password"
                      name="password"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                          invalid={errors.password && true}
                        />
                      )}
                    />
                    {errors.password && (
                      <FormFeedback>{errors.password.message}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>

              <div className="mb-1">
                <Label className="form-label" for="URL">
                  URL
                  {/* <span className="text-danger"> *</span> */}
                </Label>
                <Controller
                  id="url"
                  name="url"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="https://www.example.com"
                      invalid={errors.url && true}
                    />
                  )}
                />
                {errors.url && (
                  <FormFeedback>{errors.url.message}</FormFeedback>
                )}
              </div>
              <Row>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="URL">
                      Client Secret Key
                      {/* <span className="text-danger"> *</span> */}
                    </Label>
                    <Controller
                      id="clientSecret"
                      name="clientSecret"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="ABC1234"
                          invalid={errors.clientSecret && true}
                        />
                      )}
                    />
                    {errors.clientSecret && (
                      <FormFeedback>{errors.clientSecret.message}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="URL">
                      Grant Type
                      {/* <span className="text-danger"> *</span> */}
                    </Label>
                    <Controller
                      id="grantType"
                      name="grantType"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="grantType"
                          invalid={errors.grantType && true}
                        />
                      )}
                    />
                    {errors.grantType && (
                      <FormFeedback>{errors.grantType.message}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="Authorization">
                      Authorization
                      {/* <span className="text-danger"> *</span> */}
                    </Label>
                    <Controller
                      id="authorization"
                      name="authorization"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Authorization"
                          invalid={errors.authorization && true}
                        />
                      )}
                    />
                    {errors.authorization && (
                      <FormFeedback>
                        {errors.authorization.message}
                      </FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="APIKey">
                      API Key
                    </Label>
                    <Controller
                      id="apiKey"
                      name="apiKey"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="API Key"
                          invalid={errors.apiKey && true}
                        />
                      )}
                    />
                    {errors.apiKey && (
                      <FormFeedback>{errors.apiKey.message}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="Secret Key">
                      Secret Key
                    </Label>
                    <Controller
                      id="secretKey"
                      name="secretKey"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Secret Key"
                          invalid={errors.secretKey && true}
                        />
                      )}
                    />
                    {errors.secretKey && (
                      <FormFeedback>{errors.secretKey.message}</FormFeedback>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="API Version">
                      API Version
                    </Label>
                    <Controller
                      id="apiVersion"
                      name="apiVersion"
                      defaultValue=""
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Version"
                          invalid={errors.apiVersion && true}
                        />
                      )}
                    />
                    {errors.apiVersion && (
                      <FormFeedback>{errors.apiVersion.message}</FormFeedback>
                    )}
                  </div>
                </Col>
              </Row>
              <div className="d-flex mt-2">
                <Button className="me-1" color="primary" type="submit">
                  Submit
                </Button>
                <Button
                  outline
                  color="secondary"
                  type="reset"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  };

  const EditView = () => {
    const [form, setForm] = useState({
      id: editData.id?.toString(),
      status: editData.status,
    });
    const SignupSchema = yup.object().shape({
      name: yup.string().required("*Name required"),
      // url: yup
      //   .string()
      //   .matches(
      //     /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      //     "Enter a valid URL starting with http:// or https://"
      //   )
      //   .required("Enter proper URL along with http:// or https://"),
      // authorization: yup.string().required("*Authorization required"),
      apiKey: yup.string(),
      secretKey: yup.string(),
      apiVersion: yup.string(),
      status: yup.string(),
    });
    // ** Hooks
    const {
      reset,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });
    const onSubmitEdit = (data) => {
      const body = {
        id: form.id,
        username: form.username,
        password: form.password,
        clientId: form.clientId,
        clientSecret: form.clientSecret,
        grantType: form.grantType,
        authorization: data.authorization,
        apiKey: data.apiKey,
        secretKey: data.secretKey,
        apiVersion: data.apiVersion,
        status: form.status,
        name: data.name,
        url: data.url,
      };
      axios
        .put(new URL("/api/v1/admin/api/update", themeConfig.backendUrl), body)
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            request();
            setEditModal(false);
            return toast.success(res.data.message);
          }
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
          <Form onSubmit={handleSubmit(onSubmitEdit)} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-12 me-1 mt-1">
                  <div className="mb-1">
                    <Label className="form-label" for="name">
                      API Name
                    </Label>
                    <Controller
                      id="name"
                      name="name"
                      defaultValue={editData.name}
                      onChange={(e) => {
                        setForm({ ...form, name: e.target.value });
                      }}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} invalid={errors.name && true} />
                      )}
                    />
                    {errors.name && (
                      <FormFeedback>{errors.name.message}</FormFeedback>
                    )}
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="name">
                          Username
                        </Label>
                        <Controller
                          id="username"
                          name="username"
                          defaultValue={editData.username}
                          onChange={(e) => {
                            setForm({ ...form, username: e.target.value });
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.username && true}
                            />
                          )}
                        />
                        {errors.username && (
                          <FormFeedback>{errors.username.message}</FormFeedback>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="name">
                          Password
                        </Label>
                        <Controller
                          id="password"
                          name="password"
                          defaultValue={editData.password}
                          onChange={(e) => {
                            setForm({ ...form, password: e.target.value });
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              type="password"
                              disabled
                              {...field}
                              invalid={errors.password && true}
                            />
                          )}
                        />
                        {errors.password && (
                          <FormFeedback>{errors.password.message}</FormFeedback>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-1">
                    <Label className="form-label" for="URL">
                      URL
                    </Label>
                    <Controller
                      id="url"
                      name="url"
                      defaultValue={editData.url}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} invalid={errors.url && true} />
                      )}
                    />
                    {errors.url && (
                      <FormFeedback>{errors.url.message}</FormFeedback>
                    )}
                  </div>
                  <Row>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="name">
                          Client Secret Key
                        </Label>
                        <Controller
                          id="clientSecret"
                          name="clientSecret"
                          defaultValue={editData.clientSecret}
                          onChange={(e) => {
                            setForm({ ...form, clientSecret: e.target.value });
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.clientSecret && true}
                            />
                          )}
                        />
                        {errors.clientSecret && (
                          <FormFeedback>
                            {errors.clientSecret.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="name">
                          Grant Type
                        </Label>
                        <Controller
                          id="grantType"
                          name="grantType"
                          defaultValue={editData.grantType}
                          onChange={(e) => {
                            setForm({ ...form, grantType: e.target.value });
                          }}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.grantType && true}
                            />
                          )}
                        />
                        {errors.grantType && (
                          <FormFeedback>
                            {errors.grantType.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="Authorization">
                          Authorization
                        </Label>
                        <Controller
                          id="authorization"
                          name="authorization"
                          defaultValue={editData.authorization}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.authorization && true}
                            />
                          )}
                        />
                        {errors.authorization && (
                          <FormFeedback>
                            {errors.authorization.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="APIKey">
                          API Key
                        </Label>
                        <Controller
                          id="apiKey"
                          name="apiKey"
                          defaultValue={editData.apiKey}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} invalid={errors.apiKey && true} />
                          )}
                        />
                        {errors.apiKey && (
                          <FormFeedback>{errors.apiKey.message}</FormFeedback>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="Secret Key">
                          Secret Key
                        </Label>
                        <Controller
                          id="secretKey"
                          name="secretKey"
                          defaultValue={editData.secretKey}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.secretKey && true}
                            />
                          )}
                        />
                        {errors.secretKey && (
                          <FormFeedback>
                            {errors.secretKey.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-1">
                        <Label className="form-label" for="API Version">
                          API Version
                        </Label>
                        <Controller
                          id="apiVersion"
                          name="apiVersion"
                          defaultValue={editData.apiVersion}
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              invalid={errors.apiVersion && true}
                            />
                          )}
                        />
                        {errors.apiVersion && (
                          <FormFeedback>
                            {errors.apiVersion.message}
                          </FormFeedback>
                        )}
                      </div>
                    </Col>
                  </Row>
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
                          onChange={(e) => {
                            setForm({ ...form, status: e.target.value });
                          }}
                          checked={form.status === "0"}
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
  const ExpandableTable = ({ data }) => {
    return (
      <div className="expandable-content p-2">
        <p className=" w-50">
          <span className="fw-bold">SAP Url:</span> {data.url}
        </p>
        <p className=" w-50">
          <span className="fw-bold">API Key:</span> {data.apiKey}
        </p>
        <p className="m-0 w-50">
          <span className="fw-bold">Authorization:</span> {data.authorization}
        </p>
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
      name: "Name",
      column: "name",
      sortable: true,
      width: "200px",
      selector: (row) => row.name,
      cell: (row) => <div>{row.name}</div>,
    },
    {
      name: "URL",
      column: "url",
      width: "400px",
      sortable: true,
      selector: (row) => row.url,
      cell: (row) => (
        <div style={{ color: "#f26c13" }}>{row.url ? row.url : "NA"}</div>
      ),
    },
    {
      name: "Api Key",
      column: "apiKey",
      width: "300px",
      sortable: true,
      selector: (row) => row.apiKey,
      cell: (row) => <div>{row.apiKey ? row.apiKey : "NA"}</div>,
    },
    // {
    //   name: "Authorization",
    //   column: "authorization",
    //   width: "500px",
    //   sortable: true,
    //   selector: (row) => row.authorization,
    //   cell: (row) => <div>{row.authorization}</div>,
    // },
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
            <span> Third Party API </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        {addModal ? (
          <AddView />
        ) : (
          <div className="card-body">
            <div className="d-flex justify-content-between align-center">
              <h4>Third Party API</h4>
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
                <EditView />
                <div className="d-flex justify-content-between mb-1">
                  <div></div>
                  <div className="row">
                    <div className="col-md">
                      <div className="form-group">
                        <label>Status</label>
                        <Select
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          onChange={(selectedOption) => {
                            query.status = selectedOption.value;
                            setQuery(query);
                            request();
                          }}
                          options={[
                            { value: "", label: "Select" },
                            { value: "1", label: "Active" },
                            { value: "0", label: "Deactive" },
                          ]}
                        ></Select>
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
                    expandableRows
                    noHeader
                    pagination
                    data={data}
                    columns={basicColumns}
                    expandOnRowClicked
                    expandableRowsComponent={ExpandableTable}
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
      </div>
    </>
  );
};

export default ThirdPartyApi;
