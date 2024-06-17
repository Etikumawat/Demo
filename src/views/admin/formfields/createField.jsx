import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Row,
  Col,
  Button,
  Input,
  Label,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Select, { components } from "react-select";
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
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);
const font600 = { fontSize: "600" };
const headerText = {
  fontWeight: "bold",
  // color: "#000",
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
const CreateFormField = () => {
  const [inputValue, setInput] = useState({});
  const [groupValue, setGroup] = useState({});
  const [groupOptions, setGroupOptions] = useState([]);
  const [formData, setFormData] = useState({
    displayName: "",
    keyName: "",
    inputType: "",
    moduleName: "",
    groupName: "",
    isPrimary: false,
    displayField: "",
    requiredField: "",
  });

  const inputChange = (e) => {
    setInput(e);
  };
  const groupChange = (e) => {
    setGroup(e);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      displayField: checked,
    }));
    if (name === "displayField") {
      setFormData((prevData) => ({
        ...prevData,
        displayField: checked,
      }));
    } else if (name === "requiredField") {
      // Update the state for the Required Field checkbox
      setFormData((prevData) => ({
        ...prevData,
        requiredField: checked,
      }));
    } else {
      // Update the state for text input fields (Display Name and Key Name)
      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  const formatGroupLabel = (data) => (
    <div className="d-flex justify-content-between align-center">
      <strong>
        <span>{data.label}</span>
      </strong>
      <span>{data.options.length}</span>
    </div>
  );

  const getGroupNames = () => {
    const data = {
      module_name: "supplier_registration",
    };
    axios
      .post(
        themeConfig.backendUrl + "v1/workFlow/fieldConfig/getgroupnames",
        data
      )
      .then((res) => {
        console.log(res.data);
        const options = res.data.data.map((item) => ({
          value: item.group_name,
          label: item.group_name,
        }));
        console.log(options);
        setGroupOptions(options);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };

  const onSubmit = () => {
    const data = {
      display_name: formData.displayName,
      keyname: formData.keyName,
      type: inputValue.value,
      module_name: "supplier_registration",
      group_name: "additionalDetails",
      is_primary: formData.isPrimary ? "1" : "0",
      display: formData.displayField ? "1" : "0",
      required: formData.requiredField ? "1" : "0",
      panel_id: "1",
    };
    axios
      .post(themeConfig.backendUrl + "v1/workFlow/fieldConfig/addfield", data)
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        toast.success(res.data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getGroupNames();
  }, []);

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Form View Control</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h3 style={{ color: "#E06522" }}>Form View Control</h3>
          </div>
          <hr />
        </div>
        <Card>
          <CardHeader>
            <CardTitle tag="h4">Create Form Field</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col className="mb-1" md="4" sm="12">
                <label className="pb-0 mb-1" style={headerText}>
                  Display Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter display name"
                  formatGroupLabel={formatGroupLabel}
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col className="mb-1" md="4" sm="12">
                <label className="pb-0 mb-1" style={headerText}>
                  Key Name(without_space) <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Key name"
                  formatGroupLabel={formatGroupLabel}
                  name="keyName"
                  value={formData.keyName}
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
                  formatGroupLabel={formatGroupLabel}
                  name="Input Type"
                  value={inputValue}
                  onChange={inputChange}
                  className="react-select"
                  classNamePrefix="select"
                  required
                />
              </Col>
              {/* <Col className="mb-1 mt-1" md="4" sm="12">
                <label class="pb-0 mb-1" style={headerText}>
                  Module Name <span className="text-danger">*</span>
                </label>
                <Select
                  isClearable={false}
                  theme={selectThemeColors}
                  options={selectOptions}
                  required
                  name="Module Name"
                  value={formData.moduleName}
                  onChange={handleInputChange}
                  formatGroupLabel={formatGroupLabel}
                  className="react-select"
                  classNamePrefix="select"
                />
              </Col> */}
            </Row>
            <div className="demo-inline-spacing">
              <div className="form-check form-check-inline">
                <Input
                  id="displayField"
                  name="displayField"
                  checked={formData.displayField}
                  onChange={handleInputChange}
                  type="checkbox"
                />

                <label
                  htmlFor="displayField"
                  className="pb-0 mb-1"
                  style={headerText}
                >
                  Display Field
                </label>
              </div>
              <div className="form-check form-check-inline">
                <Input
                  id="requiredField"
                  name="requiredField"
                  checked={formData.requiredField}
                  onChange={handleInputChange}
                  disabled={!formData.displayField}
                  type="checkbox"
                />
                <label
                  htmlFor="displayField"
                  className="pb-0 mb-1"
                  style={headerText}
                >
                  Required Field
                </label>
              </div>
            </div>
            <Button color="primary" onClick={onSubmit} className="mt-2">
              Create
            </Button>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default CreateFormField;
