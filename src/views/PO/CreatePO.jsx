/* eslint-disable react/react-in-jsx-scope */
// import DataTable from "react-data-table-component";
// import Datatable from "../components/DataTables";
import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { useRef } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Alert,
  Form,
  Input,
  CardTitle,
  Button,
  Row,
  Table,
  FormGroup,
  Card,
  CardBody,
  CardText,
  CardHeader,
  Label,
  Badge,
  Col,
  InputGroup,
  Breadcrumb,
  BreadcrumbItem,
  FormFeedback,
} from "reactstrap";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import { toast } from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown, Plus, X } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import {
  LocalShippingOutlined,
  PinDrop,
  Print,
  Receipt,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
const customStyles = {
  rows: {
    style: {
      minHeight: "60px",
    },
  },
  columns: {
    style: {
      maxWidth: "300px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "50px",
      paddingRight: "8px",
    },
  },
};
const vendorCodeJSON = localStorage.getItem("vendorCode");
const storedUserDataJSON = localStorage.getItem("userData");
const vendorCode = vendorCodeJSON ? JSON.parse(vendorCodeJSON) : null;
const storedUserData = storedUserDataJSON
  ? JSON.parse(storedUserDataJSON)
  : null;
const userName = storedUserData.username;
const email = storedUserData.email;

const CreatePO = () => {
  // Calculate total amount of subtotals

  const [picker, setPicker] = useState(new Date(null));
  const [selectedOption, setSelectedOption] = useState("");
  const [errorss, setErrorss] = useState({
    dispatchDate: false,
  });
  const storedValue = localStorage.getItem("supplierId");
  const id = storedValue;
  let idx = 0;
  const [form, setForm] = useState({});
  const [data, setData] = useState(null);
  const [poType, setPOType] = useState();
  const [printsetting, setPrintsetting] = useState();

  const [supplierData, setSupplierData] = useState(null);
  const [invoice, setInvoice] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState(null);
  const [loadingPoList, setLoadingPoList] = useState(false);
  const [unitsOption, setUnitsOption] = useState();
  const [orderlineData, setOrderLineData] = useState();
  const [orderlineDataCopy, setOrderLineDataCopy] = useState();
  const [currentUnit, setCurrentUnit] = useState(1);

  const [lineItems, setLineItems] = useState([
    { taxType: "1", taxCode: "RE", recipientType: "JH", wtSubjct: "JK" },
  ]);
  const handleChange = (i, field, value) => {
    const newFormValues = lineItems.map((item, index) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setLineItems(newFormValues);
  };

  let addFormFields = () => {
    setLineItems([
      ...lineItems,
      { taxType: null, taxCode: null, recipientType: null, wtSubjct: false },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = lineItems.filter((item, index) => index !== i);
    setLineItems(newFormValues);
  };

  const handleUnitChange = (rowIndex, value) => {
    console.log(value);
    // setToUnit(value.value)

    const updatedData = [...orderlineData];
    let quantity = String(updatedData[rowIndex].Quantity);
    const fromUnit = updatedData[rowIndex].unit.toLowerCase();
    const toUnit = value.value;
    console.log(toUnit);

    console.log(quantity);

    if (quantity == 0) {
      quantity = "1";
      // toastify("🚫 Please Change Quantity for Unit Conversion", {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: true,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      //   transition: Flip,
      // });
    }
    if (toUnit) {
      axios
        .post(
          new URL(`v1/supplier/asn/unitconversion`, themeConfig.backendUrl),
          {
            whichvalue: quantity,
            fromUnit: fromUnit,
            toUnit: toUnit,
          }
        )
        .then((res) => {
          if (res.data.convertedValue === undefined) {
            toast.error("Invalid Unit");
          } else {
            updatedData[rowIndex].convertedValue = res.data.convertedValue;
            console.log(updatedData);
            setOrderLineData(updatedData);
          }
        });
    }
    // console.log("updatedData", updatedData )
    // updatedData[rowIndex].unit = value;
    // setOrderLineData(updatedData);
  };

  // const handleQtyChange = (rowIndex, value) => {
  //   const updatedData = [...orderlineData];
  //   updatedData[rowIndex].Quantity = value;
  //   setOrderLineData(updatedData);
  //   console.log("after update", orderlineDataCopy);
  // };

  const [qrData, setQrData] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [poData, setPOData] = useState();
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
  });

  const columns = [
    {
      name: "No.",
      width: "100px",
      column: "sr",
      sortable: true,
      selector: (row, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      name: "Item",
      width: "200px",
      selector: (row, index) => (
        <Input
          onChange={(e) => handleChange(index, "taxType", e.target.value)}
        />
        // <Select
        //   theme={selectThemeColors}
        //   className="react-select"
        //   classNamePrefix="select"
        //   onChange={(e) => handleChange(index, "taxType", e.value)}
        // />
      ),
      sortable: false,
    },
    {
      name: "Qty",
      width: "200px",
      cell: (row, index) => (
        <Select
          menuPlacement="auto"
          menuPortalTarget={document.body}
          styles={{ width: "100%" }}
          theme={selectThemeColors}
          className="react-select"
          classNamePrefix="select"
          value={{
            label: row.taxCode,
            value: row.taxCode,
          }}
          onChange={(e) => handleChange(index, "taxCode", e.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Unit",
      width: "200px",
      cell: (row, index) => (
        <Select
          menuPlacement="auto"
          menuPortalTarget={document.body}
          styles={{ width: "100%" }}
          theme={selectThemeColors}
          className="react-select"
          classNamePrefix="select"
          value={{
            label: row.recipientType,
            value: row.recipientType,
          }}
          onChange={(e) => handleChange(index, "recipientType", e.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Convert Unit",
      sortable: true,
      width: "200px",
      cell: (row, index) => {
        return (
          <Select
            menuPlacement="auto"
            menuPortalTarget={document.body}
            styles={{ width: "100%" }}
            options={unitsOption}
            value={unitsOption?.find((option) => option.value === row.unit)}
            onChange={(selectedOption) =>
              handleUnitChange(index, selectedOption)
            }
            className="react-select"
            classNamePrefix="select"
          />
        );
      },
    },
    {
      name: "Converted Value",
      width: "200px",
      column: "sr",
      cell: (row, index) => {
        return <span>{row.convertedValue}</span>;
      },
    },
    {
      name: "HSN Code",
      width: "200px",
      selector: (row, index) => (
        <Input
          onChange={(e) => handleChange(index, "hsnCode", e.target.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Material Code",
      width: "200px",
      selector: (row, index) => (
        <Input
          onChange={(e) => handleChange(index, "materialCode", e.target.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Price Per Unit",
      width: "200px",
      selector: (row, index) => (
        <Input
          onChange={(e) => handleChange(index, "pricePerUnit", e.target.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Tax",
      width: "200px",
      selector: (row, index) => (
        <Input onChange={(e) => handleChange(index, "gst", e.target.value)} />
      ),
      sortable: false,
    },
    {
      name: "Price",
      width: "200px",
      selector: (row, index) => (
        <Input onChange={(e) => handleChange(index, "price", e.target.value)} />
      ),
      sortable: false,
    },
    {
      name: "Sub Total",
      width: "200px",
      selector: (row, index) => (
        <Input
          onChange={(e) => handleChange(index, "subTotal", e.target.value)}
        />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <Button
          color="danger"
          className="text-nowrap px-1"
          onClick={() => removeFormFields(index)}
          outline
        >
          Remove
        </Button>
      ),
      sortable: false,
    },
  ];

  function generateASN(purchaseOrderNumber) {
    const asnNumber = "ASN" + `${purchaseOrderNumber}`;
    return asnNumber;
  }
  // Example usage:
  const pOrder = poData ? "PO" + poData?.PO_NUMBER : "";
  //   const supplierCode = poData ? "SUP" + poData?.supplier_id : "";
  const generatedASN = generateASN(pOrder);

  const onFileChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    setInvoiveFileName(files[0].name);
    setInvoice(files[0].name);

    // reader.onload = function () {
    //   setInvoice(files[0]);
    // };
    // reader.readAsDataURL(files[0]);
  };
  const removeFile = () => {
    setInvoiveFileName();
    setInvoice("");
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const onSubmit = (e) => {
    // console.log(poData);
    console.log(orderlineDataCopy, "copy");
    e.preventDefault();
    const DATA = {
      poNo: poData?.PO_HEADER?.PO_NUMBER?.toString(),
      poDate: poData?.order_date,
      asnNo: generatedASN,
      plantId: "1000",
      supplierId: poData?.PO_HEADER.VENDOR,
      dispatchDate: picker[0],
      type: poData?.PO_HEADER?.DOC_TYPE,
      carrier: "",
      status: "materialShipped",
      lineItems: orderlineData,
      gst: supplierData?.gstNo,
      pan: supplierData?.panNo,
      irnNo: form.irnNo ? form.irnNo : "",
      eWayBillNo: form.eWayBillNo ? form.eWayBillNo : "",
      companyPAN: form.companyPAN ? form.companyPAN : "",
      companyGST: form.companyGST ? form.companyGST : "",
      gstInvoiceNumber: form.gstinvoicenum,
      shipToAddress:
        poData?.PO_ADDRESS?.STREET +
        poData?.PO_ADDRESS?.STR_SUPPL1 +
        poData?.PO_ADDRESS?.STR_SUPPL2,
      billToAddress:
        poData?.PO_ADDRESS?.STREET +
        poData?.PO_ADDRESS?.STR_SUPPL1 +
        poData?.PO_ADDRESS?.STR_SUPPL2,
      remarks: form.remarks,
      file: invoice ? invoice : "",
      departmentId: supplierData?.department_id,
    };
    // toast.success("ASN Created");
    const newData = {
      ...DATA,
      lineItems: DATA.lineItems.map((item) => {
        const { remainQty, ...itemWithoutRemainQty } = item;
        return itemWithoutRemainQty;
      }),
    };

    newData.lineItems.forEach((item) => {
      delete item.convertedValue;
      delete item.It_Taxes;
      delete item.type;
    });
    const sendData = {
      DATA: newData,
      orderlineDataCopy: orderlineDataCopy,
    };
    if (picker[0]) {
      axios
        .post(
          new URL("/api/v1/supplier/asn/create", themeConfig.backendUrl),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setIsSubmitted(true);
            console.log(res.data.data[0]);
          }
        })
        .catch((err) => {
          return toast.error(err.message);
        });
    } else {
      setErrorss({
        dispatchDate: true,
      });
      toast.error("Select Dispatch Date");
    }
    const supplier_id = "1";
    axios
      .post(new URL("v1/supplier/printsettings/get", themeConfig.backendUrl), {
        supplier_id: supplier_id,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setPrintsetting(res.data.data);
          console.log(res.data.data, "data for asn print");
          // toast.success("Successfully");
        }
      });
  };
  const SignupSchema = yup.object().shape({
    name: yup.string().required("*Name required"),
    client: yup.string().required("*Client Name required"),
    username: yup.string().required("*Username required"),
    password: yup.string().required("*Password required"),
    url: yup
      .string()
      .matches(
        /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
        "Enter a valid URL starting with http:// or https://"
      )
      .required("Enter proper URL along with http:// or https://"),
    tokenPath: yup.string().required("*Authentication required"),
    cookie: yup.string().required("*Cookie required"),
  });

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

  const onSubmitnew = (data) => {
    axios
      .post(
        new URL("/api/v1/admin/sapcreds/create", themeConfig.backendUrl),
        data
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          return toast.success(res.data.message);
        }
      });
    // }
  };

  const handleReset = () => {
    reset({
      name: "",
      client: "",
      username: "",
      password: "",
      url: "",
      tokenPath: "",
      cookie: "",
    });
  };
  return (
    <>
      <div>
        <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/"> Home </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to="/supplier/PoList"> List PO </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span> Create PO </span>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Card>
          <CardHeader>
            <CardTitle tag="h3">Create Purchase Order</CardTitle>
          </CardHeader>

          <CardBody>
            <Form onSubmit={handleSubmit(onSubmitnew)}>
              <Row>
                <Col md={12}>
                  <div>
                    <Row>
                      <Row>
                        <Col md={4}>
                          <h4 className="invoice-title mt-1">
                            Purchase Order Type{" "}
                            <span className="text-danger"> *</span>
                          </h4>
                          <div className="d-flex align-items-center justify-content-center">
                            <Select
                              theme={selectThemeColors}
                              isClearable={false}
                              id={`nameOfCompany`}
                              className={`react-select w-100 mb-2`}
                              classNamePrefix="select"
                              value={selectedOption}
                              options={[
                                { value: "material", label: "Material" },
                                { value: "service", label: "Service" },
                              ]}
                              onChange={(e) => {
                                console.log(e);
                                setSelectedOption(e);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <h4 className="invoice-title mt-1">
                            Vendor
                            <span className="text-danger"> *</span>
                          </h4>
                          <div className="d-flex align-items-center justify-content-center">
                            <Select
                              theme={selectThemeColors}
                              isClearable={false}
                              id={`nameOfCompany`}
                              className={`react-select w-100 mb-2`}
                              classNamePrefix="select"
                              value={selectedOption}
                              options={[
                                { value: "material", label: "Material" },
                                { value: "service", label: "Service" },
                              ]}
                              onChange={(e) => {
                                console.log(e);
                                setSelectedOption(e);
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <Label className="mt-1">
                            PO Date <span className="text-danger"> *</span>
                          </Label>
                          <Flatpickr
                            value={picker}
                            id="date-time-picker"
                            className="form-control"
                            options={{
                              minDate: "today",
                            }}
                            onChange={(date) => setPicker(date)}
                          />
                        </Col>
                      </Row>

                      <Col md={4}>
                        <div className="mb-1">
                          <Label className="form-label" for="name">
                            PR <span className="text-danger"> *</span>
                          </Label>
                          <Controller
                            id="name"
                            name="name"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                placeholder="Server"
                                invalid={errors.name && true}
                              />
                            )}
                          />
                          {errors.name && (
                            <FormFeedback>{errors.name.message}</FormFeedback>
                          )}
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="mb-1">
                          <Label className="form-label" for="name">
                            Delivery Date{" "}
                            <span className="text-danger"> *</span>
                          </Label>
                          <Controller
                            id="client"
                            name="client"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                invalid={errors.client && true}
                              />
                            )}
                          />
                          {errors.client && (
                            <FormFeedback>{errors.client.message}</FormFeedback>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {/* <Col md={4}>
                        <div className="mb-1">
                          <Label className="form-label" for="name">
                            GST Invoice Number
                          </Label>
                          <Controller
                            id="username"
                            name="username"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                invalid={errors.username && true}
                              />
                            )}
                          />
                          {errors.username && (
                            <FormFeedback>
                              {errors.username.message}
                            </FormFeedback>
                          )}
                        </div>
                      </Col> */}

                      <Col className="mt-2" md={12}>
                        <Row>
                          <Col md={6}>
                            <h4 style={{ fontWeight: "600" }} className="mb-2">
                              {" "}
                              <LocalShippingOutlined /> Vendor Address
                            </h4>

                            <table>
                              <tbody>
                                <tr>
                                  <td className="pe-1">Address:</td>
                                  <td>
                                    <span className="">{"Na"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pe-1">State:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">City:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">Pin No:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">PAN No: </td>
                                  <td>
                                    <div>
                                      <Input className="mb-1 "></Input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pe-1">GST No: </td>
                                  <td>
                                    <div>
                                      <Input className="mb-1"></Input>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>
                          <Col md={6}>
                            <h4 style={{ fontWeight: "600" }} className="mb-2">
                              {" "}
                              <Receipt /> Bill to Address
                            </h4>
                            <table>
                              <tbody>
                                <tr>
                                  <td className="pe-1">Address:</td>
                                  <td>
                                    <span className="">{"Na"}</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pe-1">State:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">City:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">Pin No:</td>
                                  <td>{"Na"}</td>
                                </tr>
                                <tr>
                                  <td className="pe-1">PAN No: </td>
                                  <td>
                                    <div>
                                      <Input className="mb-1 "></Input>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="pe-1">GST No: </td>
                                  <td>
                                    <div>
                                      <Input className="mb-1"></Input>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                  <>
                    {/* {lineItems.map((element, index) => (
                      <div key={index}>
                        <Row className="justify-content-between align-items-center mt-1">
                          <Col md={3} className="mb-md-0 mb-1">
                            <Label>Item</Label>
                            <Select
                              theme={selectThemeColors}
                              className="react-select"
                              classNamePrefix="select"
                              onChange={(e) => {
                                handleChange(index, "taxType", e.value);
                              }}
                            />
                          </Col>
                          <Col md={3} className="mb-md-0 mb-1">
                            <Label>Qty</Label>
                            <Select
                              theme={selectThemeColors}
                              className="react-select"
                              classNamePrefix="select"
                              value={{
                                label: element.taxCode,
                                value: element.taxCode,
                              }}
                              required
                              onChange={(e) =>
                                handleChange(index, "taxCode", e.value)
                              }
                            />
                          </Col>
                          <Col md={3} className="mb-md-0 mb-1">
                            <Label>Unit</Label>
                            <Select
                              theme={selectThemeColors}
                              className="react-select"
                              classNamePrefix="select"
                              required
                              value={{
                                label: element.recipientType,
                                value: element.recipientType,
                              }}
                              onChange={(e) =>
                                handleChange(index, "recipientType", e.value)
                              }
                            />
                          </Col>
                        </Row>
                        {index ? (
                          <Col md={3} className="mb-md-0 mt-1 mb-1">
                            <Button
                              color="danger"
                              className="text-nowrap px-1"
                              onClick={() => removeFormFields(index)}
                              outline
                            >
                              <X size={14} className="me-40" />
                              Remove
                            </Button>
                          </Col>
                        ) : null}
                      </div>
                    ))} */}
                    <div className="button-section mt-1">
                      <Button
                        className="btn-icon"
                        color="primary"
                        onClick={() => addFormFields()}
                      >
                        <Plus size={14} />
                        <span className="align-middle ms-25">Add New</span>
                      </Button>
                    </div>
                  </>
                </Col>
              </Row>
              <div className="react-dataTable mt-2">
                {/* <Datatable
                  title="Line Items"
                  columns={columns}
                  data={lineItems}
                /> */}
                <DataTable
                  noHeader
                  customStyles={customStyles}
                  data={lineItems}
                  columns={columns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                />
              </div>
              <div className="d-flex mt-4">
                <Button
                  onClick={() => {
                    console.log(lineItems);
                  }}
                  className="me-1"
                  color="primary"
                  type="submit"
                >
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

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition: Flip,
      />
    </>
  );
};

export default CreatePO;
