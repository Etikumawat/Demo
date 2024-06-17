// ** React Imports
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactPaginate from "react-paginate";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import DataTable from "react-data-table-component";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Modal,
  Button,
  CardBody,
  ModalBody,
  Badge,
  ModalHeader,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// ** Third Party Components
import { Copy, RefreshCw, ChevronDown, Trash2 } from "react-feather";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import "@styles/react/libs/tables/react-dataTable-component.scss";

// ** Custom Components
import Spinner from "../../../@core/components/spinner/Loading-spinner";

// ** FAQ Illustrations
import illustration from "@src/assets/images/illustration/faq-illustrations.svg";
import { Edit } from "@mui/icons-material";
import {
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

// ** Vars
const MySwal = withReactContent(Swal);

const Roles = () => {
  // ** States
  const [show, setShow] = useState(false);
  const [total, setTotal] = useState(null);
  // const [modalType, setModalType] = useState("Add New");

  const [editData, setEditData] = useState({});
  const [dataFromApi, setDataFromApi] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // For Create New Role Permissions Only
  const [roleId, setRoleId] = useState();
  const [formData, setFormData] = useState({
    role_name: "",
    status: "",
    module_permissions: [],
  });

  const [modulePermissionsForCreateRole, setModulePermissionsForCreateRole] =
    useState();
  const createNewRole = () => {
    axios
      .post(new URL(`/api/v1/admin/module/list`, themeConfig.backendUrl))
      .then((res) => {
        console.log(res.data);
        const modulesArray = res.data.data.rows;
        // console.log("Modules Array: ", modulesArray);
        setModulePermissionsForCreateRole(
          modulesArray.map((module) => {
            return {
              id: module.id,
              module_key: module.module_key,
              permission: [0, 0, 0, 0],
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selectAllForCreateNewRole = (index) => {
    const newCheckedItems = [...isSelectAllText];
    newCheckedItems[index] = !newCheckedItems[index];
    setIsSelectAllText(newCheckedItems);

    if (isSelectAllText[index]) {
      setModulePermissionsForCreateRole((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 1 : p)),
          };
        });
      });
    } else if (!isSelectAllText[index]) {
      setModulePermissionsForCreateRole((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 0 : p)),
          };
        });
      });
    }
  };

  const togglePermissionForCreateData = (moduleId, permissionIndex) => {
    setModulePermissionsForCreateRole((prevPermissions) => {
      return prevPermissions.map((prevModule) => {
        if (prevModule.id === moduleId) {
          const updatedPermission = [...prevModule.permission]; // Copy the permission array
          updatedPermission[permissionIndex] =
            updatedPermission[permissionIndex] === 1 ? 0 : 1; // Toggle the permission
          return { ...prevModule, permission: updatedPermission }; // Return updated module object
        }
        return prevModule; // Return unchanged module object
      });
    });
    setFormData((prevData) => {
      return {
        ...prevData,
        module_permissions: modulePermissionsForCreateRole,
      };
    });
  };
  useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        module_permissions: modulePermissionsForCreateRole,
      };
    });
    console.log(formData);
  }, [modulePermissionsForCreateRole]);

  // For Edit Permissions Only
  const [isSelectAllText, setIsSelectAllText] = useState([
    true,
    true,
    true,
    true,
  ]);
  // const [roleNameList, setRoleNameList] = useState();
  const [modulePermissions, setModulePermissions] = useState();
  const [showPermissionsEditModal, setShowPermissionsEditModal] =
    useState(false);
  const [data, setData] = useState({
    role_id: undefined,
    key: 1,
    module_permissions: [],
  });

  useEffect(() => {
    request();

    // const fetchRoles = () => {
    //   axios
    //     .post(new URL(`v1/admin/roles/list`, themeConfig.backendUrl))
    //     .then((response) => {
    // setRoleNameList(response)
    //       const roleNames = response.data.data.rows.map((item) => ({
    //         label: item.role_name,
    //         value: item.id,
    //       }));
    // setRoleNameList(roleNames);
    //     })
    //     .catch((error) => console.log(error));
    // };
    // fetchRoles();
  }, []);

  const fetchRolePermissions = (roleId) => {
    axios
      .get(
        new URL(
          `v1/admin/rolesAndPermissions/view/${roleId}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        console.log(res.data.data);
        setData({
          role_id: res.data.data.role_id,
          module_permissions: res.data.data.module_permission,
        });
        setModulePermissions(res.data.data.module_permission);
      })
      .catch((error) => console.log(error));
  };

  const selectAll = (index) => {
    const newCheckedItems = [...isSelectAllText];
    newCheckedItems[index] = !newCheckedItems[index];
    setIsSelectAllText(newCheckedItems);

    if (isSelectAllText[index]) {
      setModulePermissions((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 1 : p)),
          };
        });
      });
    } else if (!isSelectAllText[index]) {
      setModulePermissions((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 0 : p)),
          };
        });
      });
    }
  };

  const submitData = () => {
    console.log(modulePermissions);

    axios
      .post(
        new URL(`v1/admin/rolesAndPermissions/update`, themeConfig.backendUrl),
        data
      )
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          setShowPermissionsEditModal(false);
        }
      })
      .catch((error) => {
        console.log(error);
        console.error("Error while setting the data", error);
      });
  };

  const togglePermission = (moduleId, permissionIndex) => {
    setModulePermissions((prevPermissions) => {
      return prevPermissions.map((prevModule) => {
        if (prevModule.id === moduleId) {
          const updatedPermission = [...prevModule.permission]; // Copy the permission array
          updatedPermission[permissionIndex] =
            updatedPermission[permissionIndex] === 1 ? 0 : 1; // Toggle the permission
          return { ...prevModule, permission: updatedPermission }; // Return updated module object
        }
        return prevModule; // Return unchanged module object
      });
    });
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      module_permissions: modulePermissions,
    }));
    console.log(data);
  }, [modulePermissions]);

  // ** Hooks
  const createRole = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post(
        new URL("/api/v1/admin/roles/create", themeConfig.backendUrl),
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          setShow(false);
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
          console.log(response.data);
          setShow(false);
          request();
        }
      })
      .catch((error) => {
        console.log(error);
        console.error("Error while setting the data", error);
        setShow(false);
      });
  };

  const editRole = () => {
    const params = {
      id: roleId,
      role_name: editData.role_name,
      status: editData.status,
    };
    axios
      .put(
        new URL(`/api/v1/admin/roles/update`, themeConfig.backendUrl),
        params
      )
      .then((response) => {
        if (!response.data.error) {
          toast.success("Data Edited");
          request();
        } else {
          console.log(response.data);
          toast.error(response.data.message);
        }
        setShowEditModal(false);
      })
      .catch((error) => {
        console.error("Error while setting the data", error);
        setShowEditModal(false);
      });
    // setFormData({
    //   role_name: editData.role_name,
    //   status: "1",
    // });
  };

  const deleteRole = (role_id) => {
    // console.log("deleteRole() is called");
    console.log(role_id);

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
              `/api/v1/admin/roles/delete/${role_id}`,
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
          })
          .catch((error) => {
            console.error("Error deleting:", error);
          });
      }
    });
  };

  const onResetAddModal = () => {
    // setFormData(null);
    setShow(false);
  };

  const onResetEditModal = () => {
    setShowEditModal(false);
  };

  // const handleModalClosed = () => {
  //   setModalType("Add New");
  //   // setValue("role_name");
  // };

  const [query, setQuery] = useState({
    offset: 0,
    limit: 10,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });
  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(new URL("/api/v1/admin/roles/list", themeConfig.backendUrl), query)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setTotal(res.data.data.total);
        setDataFromApi(res.data.data.rows);
      });
  };

  // useEffect(() => {
  // request();
  // }, []);

  const EditModal = () => {
    const [selectedOption, setSelectedOption] = useState({
      // label: editData.role_name,
      // value: editData.role,
    });
  };

  const basicColumns = [
    {
      name: "Sr.",
      maxWidth: "10px",
      column: "id",
      sortable: true,
      selector: (dataFromApi) => dataFromApi.sr,
    },
    {
      name: "Role Name",
      column: "role_name",
      sortable: true,
      selector: (dataFromApi) => dataFromApi.role_name,
    },
    {
      name: "Total Users",
      column: "totalUsers",
      sortable: true,
      selector: (dataFromApi) => dataFromApi.totalUsers + " Users",
    },
    {
      name: "Status",
      maxWidth: "150px",
      column: "status",
      selector: (dataFromApi) => dataFromApi.status,
      cell: (dataFromApi) => {
        if (dataFromApi.status == 1) {
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
      selector: (dataFromApi) => dataFromApi.status,
      cell: (dataFromApi) => {
        return (
          <>
            {/* <Edit
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                setShowEditModal(true);
                setRoleId(dataFromApi.id);
              }}
            /> */}
            <Trash2
              style={{ cursor: "pointer", color: "#D2042D" }}
              onClick={() => deleteRole(dataFromApi.id)}
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
    <Fragment>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>Roles </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {dataFromApi !== null ? (
        <>
          <Row>
            {dataFromApi?.map((item, index) => {
              return (
                <Col key={index} xl={4} md={6}>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <span>{`Total ${item.totalUsers} users`}</span>
                        {/* <AvatarGroup data={item.users} /> */}
                      </div>
                      <div className="d-flex justify-content-between align-items-end mt-1 pt-25">
                        <div className="role-heading">
                          <h4 className="fw-bolder">{item.role_name}</h4>
                          <Typography
                            // color="primary"
                            sx={{ color: "#f26c13" }}
                            className="cursor-pointer"
                            onClick={() => {
                              fetchRolePermissions(item.id);
                              console.log("ITEM", item);
                              setEditData(item);
                              setShowPermissionsEditModal(true);
                              setRoleId(item.id);
                            }}
                          >
                            Edit Permissions
                          </Typography>
                          {/* <Link
                            to="/"
                            className="role-edit-modal"
                            onClick={(e) => {
                              e.preventDefault();
                              setEditData(item);
                              console.log(dataFromApi, "datafrom upperedit");
                              setShowEditModal(true);
                              setRoleId(item.id);
                              request();
                              console.log(dataFromApi.id, "onclickupperedit");
                            }}
                          >
                            <small className="fw-bolder">Edit Role</small>
                          </Link> */}
                        </div>
                        {/* <Link
                          to=""
                          className="text-body"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Copy className="font-medium-5" />
                        </Link> */}
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
            <Col xl={4} md={6}>
              <Card>
                <Row>
                  <Col sm={5}>
                    <div className="d-flex align-items-end justify-content-center h-100">
                      <img
                        className="img-fluid mt-2"
                        src={illustration}
                        alt="Image"
                        width={85}
                      />
                    </div>
                  </Col>
                  <Col sm={7}>
                    <CardBody className="text-sm-end text-center ps-sm-0">
                      <Button
                        color="primary"
                        className="text-nowrap mb-1"
                        onClick={() => {
                          setFormData({
                            role_name: "",
                            status: "1",
                          });
                          createNewRole();
                          // setModalType("Add New");
                          setShow(true);
                        }}
                      >
                        Add New Role
                      </Button>
                      <p className="mb-0">
                        Add a new role, if it does not exist
                      </p>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <div
        // className="d-flex align-items-center justify-content-center"
        // style={{ minHeight: "400px" }}
        >
          <h4>Fetching Data</h4>
          <Col sm={5}>
            <div className="d-flex align-items-end justify-content-left h-100">
              <img
                className="img-fluid mt-2"
                src={illustration}
                alt="Image"
                width={100}
              />
            </div>
          </Col>
          {/* <Spinner /> */}
        </div>
      )}

      {/* Create New Role Model */}
      <Modal
        isOpen={show}
        scrollable={true}
        // fullscreen={true}
        // onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setIsSelectAllText([true, true, true, true]);
            setShow(!show);
          }}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>Add New Role</h1>
          </div>
          <Row>
            <Col xs={12}>
              <Label className="form-label" for="role_name">
                Role Name
              </Label>
              <Input
                id="role_name"
                placeholder="Enter role name"
                onChange={(e) => {
                  setFormData((prevData) => {
                    return {
                      ...prevData,
                      role_name: e.target.value,
                    };
                  });
                }}
              />
            </Col>
            <Col xs={12}>
              <div className="col-md-5 me-1 mt-1">
                <div className="form-control" style={{ border: "0px" }}>
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
                        checked
                        onChange={(e) => {
                          setFormData((prevData) => {
                            return {
                              ...prevData,
                              status: e.target.value,
                            };
                          });
                          console.log(formData.status);
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
                        checked={formData.status === "0"}
                        onChange={(e) => {
                          setFormData((prevData) => {
                            return {
                              ...prevData,
                              status: e.target.value,
                            };
                          });
                          // console.log(formData.status)
                        }}
                      />
                      <Label className="form-check-label" for="status-deactive">
                        Deactive
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={12}>
              <TableContainer className="p-2">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {/* <Typography variant="h5">Role Permissions</Typography> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* SelectAll Buttons */}
                    {modulePermissionsForCreateRole && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[0] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`0`}
                                defaultChecked={false}
                                onChange={() => selectAllForCreateNewRole(0)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[1] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`1`}
                                // checked={module.permission[0] === 1 ? true : false}
                                onChange={() => selectAllForCreateNewRole(1)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[2] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`2`}
                                // checked={module.permission[0] === 1 ? true : false}
                                onChange={() => selectAllForCreateNewRole(2)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[3] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`3`}
                                // checked={module.permission[0] === 1 ? true : false}
                                onChange={() => selectAllForCreateNewRole(3)}
                              />
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    {modulePermissionsForCreateRole ? (
                      modulePermissionsForCreateRole?.map((module, index) => {
                        const id = module.id;
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "& .MuiTableCell-root:first-of-type": {
                                pl: "0 !important",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                whiteSpace: "nowrap",
                                fontSize: "1.125rem",
                              }}
                            >
                              {module.module_key}
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Create"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-create`}
                                    defaultValue={false}
                                    checked={
                                      module.permission[0] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermissionForCreateData(
                                        module.id,
                                        0
                                      )
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Read"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-read`}
                                    defaultValue={false}
                                    checked={
                                      module.permission[1] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermissionForCreateData(
                                        module.id,
                                        1
                                      )
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Update"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-update`}
                                    defaultValue={false}
                                    checked={
                                      module.permission[2] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermissionForCreateData(
                                        module.id,
                                        2
                                      )
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Delete"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-delete`}
                                    defaultValue={false}
                                    checked={
                                      module.permission[3] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermissionForCreateData(
                                        module.id,
                                        3
                                      )
                                    }
                                  />
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <Spinner />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
            <Col className="text-center mt-2" xs={12}>
              <Button
                type="submit"
                onClick={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    module_permissions: modulePermissionsForCreateRole,
                  }));
                  createRole(e);
                  setIsSelectAllText([true, true, true, true]);
                }}
                color="primary"
                className="me-1"
              >
                Submit
              </Button>
              <Button
                type="reset"
                outline
                onClick={() => {
                  setIsSelectAllText([true, true, true, true]);
                  onResetAddModal();
                }}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/* Edit Modal */}

      <Modal
        isOpen={showEditModal}
        // onClosed={handleModalClosed}
        toggle={() => setShowEditModal(!showEditModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => setShowEditModal(!showEditModal)}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>Edit Role</h1>
          </div>
          <Row>
            <Col xs={12}>
              <Label className="form-label" for="role_name">
                Role Name
              </Label>
              <Input
                id="role_name"
                placeholder="Enter role name"
                defaultValue={editData?.role_name}
                // value={formData?.role_name}
                onChange={(e) => {
                  setFormData((prevData) => {
                    return {
                      ...prevData,
                      role_name: e.target.value,
                    };
                  });
                }}
              />
            </Col>
            <Col xs={12}>
              <div className="col-md-5 me-1 mt-1">
                <div className="form-control" style={{ border: "0px" }}>
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
                        checked={editData?.status === "1"}
                        onChange={(e) => {
                          setEditData((prevData) => {
                            return {
                              ...prevData,
                              status: e.target.value,
                            };
                          });
                          console.log(formData.status);
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
                        checked={editData?.status === "0"}
                        onChange={(e) => {
                          setEditData((prevData) => {
                            return {
                              ...prevData,
                              status: e.target.value,
                            };
                          });
                          console.log(formData.status);
                        }}
                      />
                      <Label className="form-check-label" for="status-deactive">
                        Deactive
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col className="text-center mt-2" xs={12}>
              <Button
                type="submit"
                onClick={editRole}
                color="primary"
                className="me-1"
              >
                Submit
              </Button>
              <Button type="reset" outline onClick={onResetEditModal}>
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/* Permissions Edit Modal */}
      <Modal
        scrollable={true}
        isOpen={showPermissionsEditModal}
        // onClosed={handleModalClosed}
        toggle={() => setShowPermissionsEditModal(!showPermissionsEditModal)}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={() => {
            setIsSelectAllText([true, true, true, true]);
            setShowPermissionsEditModal(!showPermissionsEditModal);
          }}
        ></ModalHeader>
        <ModalBody className="px-5 pb-5">
          <div className="text-center mb-4">
            <h1>Edit Permissions</h1>
          </div>
          <Row>
            <Col xs={12}>
              <Typography variant="h5" className="form-label" for="role_name">
                Role Name: {editData?.role_name}
              </Typography>
            </Col>
            <Col xs={12}>
              <TableContainer className="p-2">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {/* <Typography variant="h5">Role Permissions</Typography> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* SelectAll Buttons */}
                    {modulePermissions && (
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[0] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`0`}
                                checked={!isSelectAllText[0]}
                                onChange={() => selectAll(0)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[1] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`1`}
                                checked={!isSelectAllText[1]}
                                onChange={() => selectAll(1)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[2] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`2`}
                                checked={!isSelectAllText[2]}
                                onChange={() => selectAll(2)}
                              />
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            label={
                              isSelectAllText[3] === true
                                ? "Select All"
                                : "Deselect All"
                            }
                            sx={{
                              "& .MuiTypography-root": {
                                color: "text.secondary",
                              },
                            }}
                            control={
                              <Checkbox
                                size="small"
                                id={`3`}
                                checked={!isSelectAllText[3]}
                                onChange={() => selectAll(3)}
                              />
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )}
                    {modulePermissions ? (
                      modulePermissions?.map((module, index) => {
                        // const id = module.toLowerCase().split(" ").join("-");
                        const id = module.id;
                        return (
                          <TableRow
                            key={index}
                            sx={{
                              "& .MuiTableCell-root:first-of-type": {
                                pl: "0 !important",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                whiteSpace: "nowrap",
                                fontSize: "1.125rem",
                              }}
                            >
                              {module.name}
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Create"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-create`}
                                    checked={
                                      module.permission[0] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermission(module.id, 0)
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Read"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-read`}
                                    checked={
                                      module.permission[1] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermission(module.id, 1)
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Update"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-update`}
                                    checked={
                                      module.permission[2] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermission(module.id, 2)
                                    }
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <FormControlLabel
                                label="Delete"
                                sx={{
                                  "& .MuiTypography-root": {
                                    color: "text.secondary",
                                  },
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    id={`${id}-delete`}
                                    checked={
                                      module.permission[3] === 1 ? true : false
                                    }
                                    onChange={() =>
                                      togglePermission(module.id, 3)
                                    }
                                  />
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <Spinner />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Col>
            <Col className="text-center mt-2" xs={12}>
              <Button
                type="submit"
                onClick={() => {
                  submitData();
                  setIsSelectAllText([true, true, true, true]);
                }}
                color="primary"
                className="me-1"
              >
                Submit
              </Button>
              <Button
                type="reset"
                outline
                onClick={() => {
                  setShowPermissionsEditModal(false);
                  setIsSelectAllText([true, true, true, true]);
                }}
              >
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {/* Table */}

      {dataFromApi !== null ? (
        <>
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
              data={dataFromApi}
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
    </Fragment>
  );
};

export default Roles;
