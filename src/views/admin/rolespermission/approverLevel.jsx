import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
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
import { RefreshCw, ChevronDown, Edit, Trash2, Users } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);
const ApproverLevel = () => {
  const status = {
    0: { title: "pending", color: "light-warning" },
    1: { title: "Active", color: "light-success" },
    2: { title: "Deactive", color: "light-danger" },
  };

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
    sort: "id",
    status: "",
  });

  const request = () => {
    axios
      .post(
        new URL("v1/workFlow/approvalHierarchy/list", themeConfig.backendUrl),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        // setTotal(res.data.data.total);
        setData(res.data.data.rows);
        console.log(res.data.data);
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
            new URL(`/api/admin/users/delete/${row.id}`, themeConfig.backendUrl)
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            }
            else {
              toast.success(response.data.message)
              request();
            }
          });
      }
    });
  };
  const [options, setOptions] = useState([]);
  useEffect(() => {
    request();
    axios
      .post(new URL("/api/v1/admin/roles/list", themeConfig.backendUrl))
      .then((response) => {
        setOptions(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const AddModal = () => {
    const [selectedOption, setSelectedOption] = useState({
      label: "Approver",
      value: 3,
    });

    let userData = localStorage.getItem("userData");
    const data = JSON.parse(userData);

    const [form, setForm] = useState({
      role_id: selectedOption.value,
      subscriber_id: data.subscriber_id,
      approval_hierarchy_level: "1",
      approval_level_name: [{ level: 1, name: "", status: 1 }],
    });
    const handleHierarchyLevelChange = (e) => {
      const level = parseInt(e.target.value, 10);
      if (level > 4) {
        toast.error("Maximum hierarchy level allowed is 4.");
        return;
      }
      const approval_level_name = Array.from({ length: level }, (_, index) => ({
        level: index + 1,
        name: form.approval_level_name[index]
          ? form.approval_level_name[index].name
          : "",
        status: form.approval_level_name[index]
          ? form.approval_level_name[index].status
          : 1,
      }));

      setForm({
        ...form,
        approval_hierarchy_level: level,
        approval_level_name,
      });
    };

    const handleLevelNameChange = (e, index) => {
      const updatedLevels = [...form.approval_level_name];
      updatedLevels[index].name = e.target.value;
      setForm({ ...form, approval_level_name: updatedLevels });
    };
    const handleStatusToggle = (index, status) => {
      const updatedLevels = [...form.approval_level_name];
      updatedLevels[index].status = status ? 1 : 0;
      setForm({ ...form, approval_level_name: updatedLevels });
    };

    const onSubmit = (e) => {
      e.preventDefault();
      axios
        .post(
          new URL(
            "/api/v1/workFlow/approvalHierarchy/create",
            themeConfig.backendUrl
          ),
          {
            ...form,
            // role: selectedOption.value,
          }
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
            <h3>Create</h3>
          </ModalHeader>
          <Form autoComplete="off" onSubmit={onSubmit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Role<span className="text-danger"> *</span>
                    </label>
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
                          label: option.role_name,
                          value: option.id,
                        };
                      })}
                      isDisabled
                      onChange={(e) => setSelectedOption(e).toString()}
                    />
                  </div>
                </div>
                <div className="col-md-5 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Hierarchy Level
                      <span className="text-danger"> *</span>
                    </label>
                    <input
                      aria-autocomplete="off"
                      type="number"
                      name=""
                      value={form.approval_hierarchy_level}
                      onChange={handleHierarchyLevelChange}
                      className="form-control"
                      placeholder="Eg. 2"
                      required
                    />
                  </div>
                </div>

                {form.approval_level_name.map((level, index) => (
                  <div className="row align-items-center">
                    <div className="col-md-5 mt-1 " key={index}>
                      <div className="form-group">
                        <label>
                          Level {level.level}
                          <span className="text-danger"> *</span>
                        </label>
                        <input
                          type="text"
                          value={level.name}
                          onChange={(e) => handleLevelNameChange(e, index)}
                          className="form-control"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-5 mt-3">
                      <div className="form-group">
                        <div className="form-check form-switch">
                          <Input
                            type="switch"
                            name={`customSwitch${index}`}
                            id={`exampleCustomSwitch${index}`}
                            checked={level.status === 1}
                            onChange={(e) =>
                              handleStatusToggle(index, e.target.checked)
                            }
                          />
                          <Label
                            for={`exampleCustomSwitch${index}`}
                            className="form-check-label"
                          >
                            Status
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
  const [editable, setEditable] = useState(true);
  const [selectedOption, setSelectedOption] = useState({
    label: "Approver",
    value: 3,
  });
  return (
    <>
    <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Approver Level </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <AddModal />
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Approver Level</h4>
            <Button
              color="primary"
              size="sm"
              onClick={() => setAddModal(!addModal)}
            >
              Create
            </Button>
          </div>
          <hr />
          <>
            {/* <h2>{data ? data[0].role_name : "no"}</h2> */}
            <div className="row">
              {data ? (
                <>
                  {" "}
                  <div className="col-md-5 me-1 mt-1">
                    <div className="form-group">
                      <label>Role</label>
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
                            label: option.role_name,
                            value: option.id,
                          };
                        })}
                        isDisabled
                        onChange={(e) => setSelectedOption(e).toString()}
                      />
                    </div>
                  </div>
                  <div className="col-md-5 me-1 mt-1">
                    <div className="form-group">
                      <label>Hierarchy Level</label>
                      <input
                        disabled
                        aria-autocomplete="off"
                        type="number"
                        name=""
                        value={data ? data[0].approval_hierarchy_level : "No"}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h5>No Approver Level Found Create One</h5>
                </>
              )}

              {data
                ? data[0].approval_level_name.map((level, index) => (
                    <div className="row align-items-center">
                      <div className="col-md-5 mt-1 " key={index}>
                        <div className="form-group">
                          <label>Level {level.level}</label>
                          <input
                            type="text"
                            disabled={editable}
                            value={level.name}
                            onChange={(e) => handleLevelNameChange(e, index)}
                            className="form-control"
                            placeholder="Name"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-5 mt-3">
                        <div className="form-group">
                          <div className="form-check form-switch">
                            <Input
                              type="switch"
                              name={`customSwitch${index}`}
                              id={`exampleCustomSwitch${index}`}
                              disabled={editable}
                              checked={level.status === 1}
                              onChange={(e) =>
                                handleStatusToggle(index, e.target.checked)
                              }
                            />
                            <Label
                              for={`exampleCustomSwitch${index}`}
                              className="form-check-label"
                            >
                              Status
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
            {data ? (
              <Button
                onClick={() => setEditable(false)}
                color="primary"
                className="mt-4"
              >
                Edit
              </Button>
            ) : (
              ""
            )}

            {editable ? (
              ""
            ) : (
              <Button
                // onClick={() => setEditable(false)}
                color="success"
                className="mt-4"
                style={{ marginLeft: "40px" }}
              >
                Update
              </Button>
            )}
          </>
        </div>
      </div>
    </>
  );
};

export default ApproverLevel;
