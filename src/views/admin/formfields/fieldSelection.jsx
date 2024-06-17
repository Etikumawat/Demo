import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Label,
  Badge,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Select from "react-select";
import { selectThemeColors } from "@utils";
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
import { LinearProgress } from "@mui/material";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);
const FieldSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [displayValue, setDisplayValue] = useState();
  const [requiredValue, setRequiredValue] = useState();
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
    status: "",
  });
  const [module, setModule] = useState({
    module_name: "all",
    group_name: "all",
  });
  const request = () => {
    setLoading(true);
    console.log(query, "query");
    axios
      .post(
        new URL(
          "/api/v1/workFlow/fieldConfig/getfieldnames",
          themeConfig.backendUrl
        ),
        module,
        query
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        }
        setTotal(res.data.data.length);
        setLoading(false);
        setData(res.data.data);
      });
  };
  const Update = (value) => {
    axios
      .put(
        new URL("v1/workFlow/fieldConfig/update", themeConfig.backendUrl),
        value
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        toast.success(res.data.message);
        request();
      });
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
            <span>Field Selection </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-column justify-content-between align-center">
            <h4>Field Selection</h4>
            <p>Choose Fields To Be Appeared On Supplier Registration Form</p>
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
                      <label>Group Name</label>
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        onChange={(e) => {
                          module.group_name = e.value;
                          const list = {
                            module_name:
                              module.group_name === "all"
                                ? "all"
                                : "supplier_registration",
                            group_name:
                              module.group_name === "all"
                                ? "all"
                                : module.group_name,
                          };
                          console.log(list, list);
                          axios
                            .post(
                              new URL(
                                "/api/v1/workFlow/fieldConfig/getfieldnames",
                                themeConfig.backendUrl
                              ),
                              list
                            )
                            .then((res) => {
                              if (res.data.error) {
                                toast.error(res.data.message);
                              }
                              console.log(res.data);
                              setTotal(res.data.data.length);
                              setData(res.data.data);
                            });
                          setModule(list);
                        }}
                        options={[
                          { value: "all", label: "All" },
                          { value: "companyDetails", label: "Company Details" },
                          {
                            value: "businessDetails",
                            label: "Business Details",
                          },
                          { value: "taxDetails", label: "Tax Details" },
                          {
                            value: "financialDetails",
                            label: "Finance Details",
                          },
                          {
                            value: "additionalDetails",
                            label: "Additional Details",
                          },
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
              <Card>
                <CardBody>
                  <Row>
                    {data.map((item, index) => (
                      <>
                        <Col md={4}>
                          <div className="mt-1 mb-1 pb-1">
                            <label
                              className="pb-0"
                              style={{ fontSize: "16px" }}
                            >
                              {item.display_name}
                            </label>
                            <div className="demo-inline-spacing">
                              <div className="form-check form-check-inline">
                                <label className="pb-0 mb-1">
                                  <Input
                                    id="isPrimary"
                                    name="isPrimary"
                                    type="checkbox"
                                    checked={item.display == 1 ? true : false}
                                    onChange={(e) => {
                                      const newValue = e.target.checked
                                        ? "1"
                                        : "0";
                                      const data = {
                                        id: item.id,
                                        display: newValue,
                                        required:
                                          newValue == 0 ? "0" : item.required,
                                      };
                                      Update(data);
                                    }}
                                  />
                                  Display
                                </label>
                              </div>
                              <div className="form-check form-check-inline">
                                <label className="pb-0 mb-1">
                                  <Input
                                    id="displayField"
                                    name="displayField"
                                    checked={
                                      item.display == 1 && item.required == 1
                                        ? true
                                        : false
                                    }
                                    disabled={item.display == 1 ? false : true}
                                    onChange={(e) => {
                                      const newValue = e.target.checked
                                        ? "1"
                                        : "0";
                                      const data = {
                                        id: item.id,
                                        display: item.display,
                                        required: newValue,
                                      };
                                      Update(data);
                                    }}
                                    type="checkbox"
                                  />
                                  Required
                                </label>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </>
                    ))}
                  </Row>
                  <Button
                    color="primary"
                    className="mt-2"
                    onClick={() => toast.success("Saved Successfully")}
                  >
                    Save
                  </Button>
                </CardBody>
              </Card>
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

export default FieldSettings;
