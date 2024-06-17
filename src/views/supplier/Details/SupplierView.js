// ** React Imports
import axios from "axios";
import { Fragment, useState } from "react";
import NoImage from "@src/assets/images/noImage.jpg";
import classnames from "classnames";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import {
  Table,
  Badge,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  Accordion,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import { Row, Col, Card, Input, Button, CardBody, Label } from "reactstrap";
import themeConfig from "../../../configs/themeConfig";

import { toast } from "react-hot-toast";
import { useEffect } from "react";
import {
  AccountBalance,
  AccountBalanceTwoTone,
  AssignmentInd,
  AttachFile,
  AttachMoney,
  Business,
  BusinessCenterOutlined,
  PhoneAndroid,
  Upgrade,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import DocumentUpdate from "../../../custom/DocumentUpdate";
import { LuTextCursorInput } from "react-icons/lu";
import { RiImageEditLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { display } from "@mui/system";

// resData?
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "light-success";
    case "verified":
      return "light-info";
    case "queried":
      return "light-primary";
    case "completed":
      return "light-info";
    case "pending":
      return "light-warning";
    case "rejected":
      return "light-primary";
    default:
      return "light-secondary";
  }
};
const cardStyle = {
  borderRadius: "5px",
  marginLeft: "5px",
  marginRight: "5px",
  // marginTop: "20px",
  // backgroundColor: "white",
};

const SupplierDetails = () => {
  let user_data = localStorage.getItem("userData");
  const userData = JSON.parse(user_data);
  // const approverLevel = userData.level;
  const [tableData, setTableData] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState(null);
  const storedValue = localStorage.getItem("supplierId");
  const id = storedValue;
  const [supplierData, setSupplierData] = useState();
  const [loadingPoList, setLoadingPoList] = useState(false);

  //
  const msmeImage = supplierData?.tax_details?.msmeImage
    ? supplierData.tax_details.msmeImage
    : NoImage;
  const panImage = supplierData?.tax_details?.panCardImage
    ? supplierData?.tax_details?.panCardImage
    : NoImage;
  const gstImage = supplierData?.tax_details?.gstImage
    ? supplierData.tax_details.gstImage
    : NoImage;
  const chequeImage = supplierData?.tax_details?.cancelledChequeImage
    ? supplierData.tax_details.cancelledChequeImage
    : NoImage;

  const pfAttachment = supplierData?.tax_details?.pfAttachment
    ? supplierData.tax_details.pfAttachment
    : NoImage;

  const otherAttachments = supplierData?.tax_details?.otherAttachments
    ? supplierData.tax_details.otherAttachments
    : NoImage;

  //edit
  const [toggle, setToggle] = useState(false);
  const [filetoggle, setFiletoggle] = useState(false);

  const [editData, setEditData] = useState();
  const [editBusinessData, setEditBusinessData] = useState();
  const [editFinancialData, setEditFinancialData] = useState();
  const [editTaxDetails, setEditTaxDetails] = useState();

  const editedData = {
    id: id,
    companyDetails: {
      aadharNo: editData?.aadharNo,
      address1: editData?.address1,
      address2: editData?.address2,
      address3: editData?.address3,
      cinNo: editData?.cinNo,
      city: editData?.city,
      contactPersonName: editData?.contactPersonName,
      country: {
        label: editData?.country,
      },
      designation: editData?.designation,
      emailID: editData?.emailID,
      mobile: editData?.mobile,
      officeDetails: editData?.officeDetails,
      paymentMethod: { label: editData?.paymentMethod },
      phoneNo: editData?.phoneNo,
      pin: editData?.pin,
      source: { label: editData?.source },
      state: { label: editData?.state },
      streetNo: editData?.streetNo,
      website: editData?.website,
      telephone: editData?.telephone,
    },
    businessDetails: {
      detailsOfMajorLastYear: {
        label: editBusinessData?.detailsOfMajorLastYear,
      },
      listOfMajorCustomers: {
        label: editBusinessData?.listOfMajorCustomers,
      },
      nameOfOtherGroupCompanies: editBusinessData?.nameOfOtherGroupCompanies,
      addressOfPlant: editBusinessData?.addressOfPlant,
      businessType: {
        label: editBusinessData?.businessType,
      },
      nameOfBusiness: editBusinessData?.nameOfBusiness,
      companyType: {
        label: editBusinessData?.companyType,
      },
      msmeType: {
        label: editBusinessData?.msmeType,
      },
      msme_no: editBusinessData?.msme_no,
      promoterName: editBusinessData?.promoterName,

      companyFoundYear: editBusinessData?.companyFoundYear,
    },
    // businessDetails: editBusinessData,
    financialDetails: {
      currency: {
        label: editFinancialData?.currency,
      },
      afterfirst: editFinancialData?.afterfirst || "",
      aftersecond: editFinancialData?.aftersecond || "",
      afterthird: editFinancialData?.afterthird || "",
      first: editFinancialData?.first || "",
      furtherorder: editFinancialData?.furtherorder || "",
      market: editFinancialData?.market || "",
      networth: editFinancialData?.networth || "",
      p_bank_account_holder_name:
        editFinancialData?.p_bank_account_holder_name || "",
      p_bank_account_number: editFinancialData?.p_bank_account_number || "",
      p_bank_address: editFinancialData?.p_bank_address || "",
      p_bank_branch: editFinancialData?.p_bank_branch || "",
      p_bank_guarantee_limit: editFinancialData?.p_bank_guarantee_limit || "",
      p_bank_name: editFinancialData?.p_bank_name || "",
      p_bank_state: editFinancialData?.p_bank_state || "",
      p_ifsc_code: editFinancialData?.p_ifsc_code || "",
      p_micr_code: editFinancialData?.p_micr_code || "",
      p_overdraft_cash_credit_limit:
        editFinancialData?.p_overdraft_cash_credit_limit || "",
      presentorder: editFinancialData?.presentorder || "",
      s_bank_account_holder_name:
        editFinancialData?.s_bank_account_holder_name || "",
      s_bank_account_number: editFinancialData?.s_bank_account_number || "",
      s_bank_address: editFinancialData?.s_bank_address || "",
      s_bank_branch: editFinancialData?.s_bank_branch || "",
      s_bank_guarantee_limit: editFinancialData?.s_bank_guarantee_limit || "",
      s_bank_name: editFinancialData?.s_bank_name || "",
      s_bank_state: editFinancialData?.s_bank_state || "",
      s_ifsc_code: editFinancialData?.s_ifsc_code || "",
      s_micr_code: editFinancialData?.s_micr_code || "",
      s_overdraft_cash_credit_limit:
        editFinancialData?.s_overdraft_cash_credit_limit || "",
      second: editFinancialData?.second || "",
      third: editFinancialData?.third || "",
    },
    additionalDetails: {},
    // financialDetails: editFinancialData,
  };
  const [selectPlants, setSelectPlants] = useState({
    label: editData ? editData.source : "",
    value: editData ? editData.source : "",
  });

  const [selectPayment, setSelectPayment] = useState({
    label: editData ? editData.paymentMethod : "",
    value: editData ? editData.paymentMethod : "",
  });

  const [selectCountries, setSelectCountries] = useState({
    label: editData ? editData.country : "",
    value: editData ? editData.country : "",
  });
  const [selectState, setSelectState] = useState({
    label: editData ? editData.state : "",
    value: editData ? editData.state : "",
  });

  const [selectCompanyType, setSelectCompanyType] = useState({
    label: editBusinessData ? editBusinessData.companyType : "",
    value: editBusinessData ? editBusinessData.companyType : "",
  });

  const [selectBusinessType, setSelectBusinessType] = useState({
    label: editBusinessData ? editBusinessData.businessType : "",
    value: editBusinessData ? editBusinessData.businessType : "",
  });

  const [selectCurrency, setSelectCurrency] = useState({
    label: editFinancialData ? editFinancialData.currencies : "",
    value: editFinancialData ? editFinancialData.currencies : "",
  });
  const [selectMsme, setSelectMsme] = useState({
    label: editBusinessData ? editBusinessData.msmeType : "",
    value: editBusinessData ? editBusinessData.msmeType : "",
  });

  const [plants, setPlants] = useState([]);
  const [paymentmethod, setPaymentmethod] = useState([]);
  const [countries, setCountries] = useState([]);
  const [companyType, setCompanyType] = useState([]);
  const [businessTypestate, setBusinessTypestate] = useState([]);
  const [currencyDropdown, setCurrencyDropdown] = useState([]);
  const [stateDropdown, setStateDropdown] = useState([]);
  const [msmeOptions, setMsmeOptions] = useState([]);

  const Dropdown = (e) => {
    e?.preventDefault();
    axios
      .post(new URL("/api/v1/supplier/onboarding/list", themeConfig.backendUrl))
      .then((response) => {
        setPlants(response?.data?.data?.sources);
        setPaymentmethod(response?.data?.data?.payment_types);
        setCountries(response?.data?.data?.countries);
        setStateDropdown(response?.data?.data?.states);
        setCompanyType(response?.data?.data?.company_types);
        setBusinessTypestate(response?.data?.data?.business_types);
        setCurrencyDropdown(response?.data?.data?.currencies);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const getMsmeList = (e) => {
    e?.preventDefault();
    axios
      .post(
        new URL(
          "/api/v1/supplier/minorityIndicator/list",
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setMsmeOptions(res.data.data.rows);
        }
      });
  };

  const font600 = { fontSize: "600" };
  const headerText = {
    // color: "#637381",
    fontSize: "15px",
    fontWeight: "500",
  };

  const getSupplierData = () => {
    axios
      .post(
        new URL(`/api/v1/supplier/supplier/view/${id}`, themeConfig.backendUrl)
      )
      .then((res) => {
        setSupplierData(res.data.data);
        setEditData(res.data.data);
        setEditBusinessData(res.data.data.business_details);
        setEditFinancialData(res.data.data.finance_details);
        setEditTaxDetails(res.data.data.tax_details);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const getWorkflowInfo = () => {
    const sendData = {
      supplier_id: id,
      // user_id: userData.id,
    };
    axios
      .post(
        new URL(
          "/api/v1/supplier/approver/approvaltimeline",
          themeConfig.backendUrl
        ),
        sendData
      )
      .then((res) => {
        if (res.data.error) {
          setTableData(null);
        }
        setTableData(res.data.data[0]["status"]);
        setIsEditable(res.data.data[0]["isEditable"] === "1" ? true : false);
      });
    // axios
    //   .post(
    //     new URL(
    //       "/api/v1/supplier/supplier/supplierChangeStatusList",
    //       themeConfig.backendUrl
    //     ),
    //     sendData
    //   )
    //   .then((res) => {
    //     if (res.data.error) {
    //       setTableData(null);
    //     }
    //     setTableData(res.data.data);
    //   });
  };
  const [open, setOpen] = useState("");

  const toggles = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const getUpload = () => {
    const formData = new FormData();
    formData.append("supplierId", id);
    formData.append("panCardImage", selectedFile); // Assuming selectedFile corresponds to PAN card image
    formData.append("cancelledChequeImage", selectedCheque);
    formData.append("gstImage", selectedGst);
    formData.append("msmeImage", selectedMsme);
    formData.append("pfAttachment", selectedPfAttachments);
    formData.append("otherAttachments", selectedOtherAttachments);

    axios
      .put(
        new URL(
          "/api/v1/supplier/supplier/update_tax_details",
          themeConfig.backendUrl
        ),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setFile([]);
          toast.success(res.data.message);
          setFiletoggle(false);
          setIsEditable(false);
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getMsmeList();
    Dropdown();
    getSupplierData();
    getWorkflowInfo();
  }, []);
  const headerStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
  const updateHeader = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#28c76f",
    color: "rgb(255, 255, 255)",
  };
  const handleEdit = () => {
    toast("Data Editable Now");
    setToggle(true);
  };
  const Editattachments = () => {
    toast("File Attachments Editable Now");
    setFiletoggle(true);
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };
  const handleBusinessOnChange = (e) => {
    const { name, value } = e.target;
    setEditBusinessData({ ...editBusinessData, [name]: value });
  };
  const handleFinancialOnChange = (e) => {
    const { name, value } = e.target;
    setEditFinancialData({ ...editFinancialData, [name]: value });
  };
  const updatedCompanyDetails = {
    ...editedData,
    companyDetails: {
      ...editedData.companyDetails,
      paymentMethod: {
        label: selectPayment.label ? selectPayment.label : null,
        value: selectPayment.value ? selectPayment.value.toString() : null,
      },
      source: {
        label: selectPlants.label ? selectPlants.label : null,
        value: selectPlants.value ? selectPlants.value.toString() : null,
      },
      country: {
        label: selectCountries.label ? selectCountries.label : null,
        value: selectCountries.value ? selectCountries.value.toString() : null,
      },
      state: {
        label: selectState.label ? selectState.label : null,
        value: selectState.value ? selectState.value.toString() : null,
      },
    },
    businessDetails: {
      ...editedData.businessDetails,
      companyType: {
        label: selectCompanyType.label ? selectCompanyType.label : null,
        value: selectCompanyType.value
          ? selectCompanyType.value.toString()
          : null,
      },
      businessType: {
        label: selectBusinessType.label ? selectBusinessType.label : null,
        value: selectBusinessType.value
          ? selectBusinessType.value.toString()
          : null,
      },
      msmeType: {
        label: selectMsme.label ? selectMsme.label : null,
        value: selectMsme.value ? selectMsme.value.toString() : null,
      },
    },
    financialDetails: {
      ...editedData.financialDetails,
      currency: {
        label: selectCurrency.label ? selectCurrency.label : null,
        value: selectCurrency.value ? selectCurrency.value.toString() : null,
      },
    },
    approverComment: tableData
      ? tableData[tableData.length - 1]?.remarks
      : null,
    // approverComment: "my remakrks",
    supplierComment: value ? value : "",
  };

  const handleUpdate = () => {
    setLoadingPoList(true);
    axios
      .put(
        new URL(
          "/api/v1/supplier/supplier/update_supplier",
          themeConfig.backendUrl
        ),
        {
          ...updatedCompanyDetails,
        }
      )
      .then((res) => {
        if (res.data.error) {
          setLoadingPoList(false);
          toast.error(res.data.message);
        } else {
          setLoadingPoList(false);
          toast.success(res.data.message);
          getSupplierData();
          getWorkflowInfo();
        }
        setToggle(false);
      });
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedGst, setSelectedGst] = useState(null);
  const [selectedMsme, setSelectedMsme] = useState(null);
  const [selectedCheque, setSelectedCheque] = useState(null);
  const [selectedPfAttachments, setSelectedPfAttachments] = useState(null);
  const [selectedOtherAttachments, setSelectedOtherAttachments] =
    useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleGstChange = (event) => {
    const file = event.target.files[0];
    setSelectedGst(file);
  };
  const handleMsmeChange = (event) => {
    const file = event.target.files[0];
    setSelectedMsme(file);
  };
  const handleChequeChange = (event) => {
    const file = event.target.files[0];
    setSelectedCheque(file);
  };
  const handlePfAttachmentChange = (event) => {
    const file = event.target.files[0];
    setSelectedPfAttachments(file);
  };
  const handleOtherAttachmentsChange = (event) => {
    const file = event.target.files[0];
    setSelectedOtherAttachments(file);
  };
  const handleReset = () => {
    setSelectedFile(null);
  };
  const handleResetGst = () => {
    setSelectedGst(null);
  };
  const handleResetMsme = () => {
    setSelectedMsme(null);
  };
  const handleResetCheque = () => {
    setSelectedMsme(null);
  };
  const handleResetPfAttachment = () => {
    setSelectedPfAttachments(null);
  };
  const handleResetOtherAttachments = () => {
    setSelectedOtherAttachments(null);
  };
  return (
    <Fragment>
      <div className="justify-content-start p-1 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Supplier </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {supplierData ? (
        <>
          <CardBody>
            <Row>
              <Col md="12" className="mb-1">
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px",
                      backgroundColor:
                        supplierData && supplierData.status === "approved"
                          ? "#28c76f"
                          : supplierData && supplierData.status === "pending"
                          ? "#7367f0"
                          : supplierData && supplierData.status === "verified"
                          ? "#00cfe8"
                          : supplierData && supplierData.status === "queried"
                          ? "#e06522"
                          : supplierData && supplierData.status === "rejected"
                          ? "#ea5455"
                          : "white",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "5px",
                    }}
                    type="text"
                    name="name"
                    id="nameVertical"
                    value={
                      supplierData
                        ? supplierData.status.charAt(0).toUpperCase() +
                          supplierData.status.slice(1).toLowerCase()
                        : ""
                    }
                  >
                    <div>
                      <p>
                        {supplierData && supplierData.status
                          ? supplierData.status.charAt(0).toUpperCase() +
                            supplierData.status.slice(1).toLowerCase()
                          : ""}
                      </p>
                      {supplierData.status !== "pending" && (
                        <p style={{ marginBlock: "5px" }}>
                          {supplierData && supplierData.comment
                            ? "Remarks : " + supplierData.comment
                            : ""}
                        </p>
                      )}
                    </div>
                    <div>
                      <button
                        style={{
                          display:
                            supplierData?.status === "queried"
                              ? "block"
                              : "none",
                          backgroundColor: "white",
                          color: "#f26c13",
                          border: "2px solid white",
                          padding: "8px 15px",
                          borderRadius: "5px",
                        }}
                        onClick={handleEdit}
                      >
                        <LuTextCursorInput size={14} className="me-75" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>

          <Card
            className="border-primary"
            style={{
              backgroundColor: "",
              borderRadius: "5px",
              marginLeft: "5px",
              marginRight: "5px",
            }}
          >
            <CardBody>
              <Row>
                <Col md="6" className="mb-1">
                  <label className="pb-0 mb-1" style={headerText}>
                    Supplier Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={supplierData ? supplierData.supplier_name : ""}
                    placeholder="---"
                  />
                </Col>

                <Col md="3" className="mb-1">
                  <label className="pb-0 mb-1" style={headerText}>
                    GST No
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={supplierData ? supplierData.gstNo : ""}
                    placeholder="---"
                  />
                </Col>
                <Col md="3" className="mb-1">
                  <label className="pb-0 mb-1" style={headerText}>
                    Pan No.
                  </label>
                  <Input
                    type="text"
                    name="panCard"
                    id="panCardVertical"
                    disabled
                    value={supplierData ? supplierData.panNo : ""}
                    placeholder="---"
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col md={7}>
              <Col md="12" sm="12" className="mb-1">
                <Card className={toggle ? "border-success" : "border-primary"}>
                  <h4
                    color="primary"
                    style={toggle ? updateHeader : headerStyle}
                  >
                    <Business fontSize="large" /> Company Details
                  </h4>
                  <div className="row" style={cardStyle}>
                    <div style={{ paddingTop: "10px" }} className="col-md-4  ">
                      <label className="pb-0" style={headerText}>
                        Source
                      </label>

                      <Select
                        isDisabled={toggle ? false : true}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editData?.source,
                          value: editData?.source,
                        }}
                        options={plants?.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectPlants(e)}
                      />
                    </div>
                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Street Number
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          type="text"
                          name="streetNo"
                          id="streetNoVertical"
                          value={editData ? editData.streetNo : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Address 1
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          // disabled={toggle ? false : true}
                          type="text"
                          name="address1"
                          id="address1Vertical"
                          value={editData ? editData.address1 : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Address 2
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          // disabled={toggle ? false : true}
                          type="text"
                          name="address2"
                          id="address2Vertical"
                          value={editData ? editData.address2 : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Address 3
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          // disabled={toggle ? false : true}
                          type="text"
                          name="address3"
                          id="address3Vertical"
                          value={editData ? editData.address3 : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Country
                      </label>
                      <div style={font600} id="review_country">
                        <Select
                          isDisabled={supplierData.gstNo ? true : false}
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          defaultValue={{
                            label: editData?.country,
                            value: editData?.country,
                          }}
                          option={countries}
                          options={countries?.map((option) => {
                            return {
                              label: option.name,
                              value: option.country_id,
                            };
                          })}
                          onChange={(e) => setSelectCountries(e)}
                        />
                        {/* <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="country"
                        id="countryVertical"
                        value={editData ? editData.country : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      /> */}
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        State
                      </label>
                      <div style={font600} id="review_country">
                        <Select
                          isDisabled={supplierData.gstNo ? true : false}
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          defaultValue={{
                            label: editData?.state,
                            value: editData?.state,
                          }}
                          option={stateDropdown}
                          options={stateDropdown?.map((option) => {
                            return {
                              label: option.stateDesc,
                              value: option.id,
                            };
                          })}
                          onChange={(e) => setSelectState(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        City
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          type="text"
                          name="city"
                          id="cityVertical"
                          value={editData ? editData.city : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4 ">
                      <label className="pb-0" style={headerText}>
                        Pin / Zip Code
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={supplierData.gstNo ? true : false}
                          type="text"
                          name="pin"
                          id="pinVertical"
                          value={editData ? editData.pin : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        Phone Number
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="phoneNo"
                          id="phoneNoVertical"
                          value={editData ? editData.phoneNo : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        Website
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="website"
                          id="websiteVertical"
                          value={editData ? editData.website : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        Payment Method
                      </label>
                      <div style={font600} id="review_country">
                        <Select
                          isDisabled={toggle ? false : true}
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          defaultValue={{
                            label: editData.paymentMethod,
                            value: editData.paymentMethod,
                          }}
                          option={paymentmethod}
                          options={paymentmethod?.map((option) => {
                            return {
                              label: option.name,
                              value: option.id,
                            };
                          })}
                          onChange={(e) => setSelectPayment(e)?.toString()}
                        />
                        {/* <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="paymentMethod"
                        id="paymentMethodVertical"
                        value={editData ? editData.paymentMethod : ""}
                        placeholder="---"
                        onChange={(e) => handleOnChange(e)}
                      /> */}
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        Overseas office details(if any)
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="officeDetails"
                          id="officeDetailsVertical"
                          value={editData ? editData.officeDetails : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        Aadhar Card
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="aadharNo"
                          id="aadharNoVertical"
                          value={editData ? editData.aadharNo : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>

                    <div style={{ paddingTop: "10px" }} className="col-md-4">
                      <label className="pb-0" style={headerText}>
                        CIN Number
                      </label>
                      <div style={font600} id="review_country">
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="cinNo"
                          id="cinNoVertical"
                          value={editData ? editData.cinNo : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                    <h4 className="mt-3" style={{ color: "#E06522" }}>
                      <PhoneAndroid /> Contact Details
                    </h4>

                    <div className="col-md-4 py-1">
                      <label className="pb-0 " style={headerText}>
                        Contact Person Name
                      </label>
                      <div style={font600}>
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="contactPersonName"
                          id="cinNoVertical"
                          value={editData ? editData.contactPersonName : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 py-1">
                      <label className="pb-0 " style={headerText}>
                        Designation
                      </label>
                      <div style={font600}>
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="designation"
                          id="cinNoVertical"
                          value={editData ? editData.designation : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 py-1">
                      <label className="pb-0 " style={headerText}>
                        Telephone
                      </label>
                      <div style={font600}>
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="telephone"
                          id="cinNoVertical"
                          value={editData ? editData.telephone : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-1">
                      <label className="pb-0 " style={headerText}>
                        Mobile
                      </label>
                      <div style={font600}>
                        <Input
                          disabled={toggle ? false : true}
                          type="text"
                          name="mobile"
                          id="cinNoVertical"
                          value={editData ? editData.mobile : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 mb-1">
                      <label className="pb-0 " style={headerText}>
                        Email ID
                      </label>
                      <div style={font600}>
                        <Input
                          disabled
                          type="text"
                          name="emailID"
                          id="cinNoVertical"
                          value={editData ? editData.emailID : ""}
                          placeholder="---"
                          onChange={(e) => handleOnChange(e)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Col>
            <Col md={5}>
              <Card
                className={filetoggle ? "border-success" : "border-primary"}
              >
                <h4
                  color="primary"
                  style={filetoggle ? updateHeader : headerStyle}
                >
                  <AttachFile fontSize="large" /> File Attachments
                </h4>
                {filetoggle && (
                  <p style={{ color: "red", marginLeft: "1rem" }}>
                    File size should be less than 1MB
                  </p>
                )}
                <div className="row" style={cardStyle}>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">PAN Card</label>
                    <br />
                    <DocumentUpdate
                      defaultImg={panImage}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handleFileChange}
                      onReset={handleReset}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="panImage"
                    />

                    {selectedFile && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size: {Math.round(selectedFile.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">GST Certificate</label>
                    <br />
                    <DocumentUpdate
                      defaultImg={gstImage}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handleGstChange}
                      onReset={handleResetGst}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="gstImage"
                    />

                    {selectedGst && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size: {Math.round(selectedGst.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">MSME Image</label>
                    <br />
                    <DocumentUpdate
                      defaultImg={msmeImage}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handleMsmeChange}
                      onReset={handleResetMsme}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="gstImage"
                    />

                    {selectedMsme && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size: {Math.round(selectedMsme.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">Cancelled Cheque </label>
                    <br />
                    <DocumentUpdate
                      defaultImg={chequeImage}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handleChequeChange}
                      onReset={handleResetCheque}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="chequeImage"
                    />

                    {selectedCheque && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size: {Math.round(selectedCheque.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">PF Attachments</label>
                    <br />
                    <DocumentUpdate
                      defaultImg={pfAttachment}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handlePfAttachmentChange}
                      onReset={handleResetPfAttachment}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="pfAttachment"
                    />
                    {selectedPfAttachments && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size:{" "}
                          {Math.round(selectedPfAttachments.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 py-2">
                    <label className="pb-0">Other Attachments</label>
                    <br />
                    <DocumentUpdate
                      defaultImg={otherAttachments}
                      text={
                        <small
                          className="text-danger"
                          style={{ fontSize: "12px" }}
                        >
                          (jpg/pdf)
                        </small>
                      }
                      onChange={handleOtherAttachmentsChange}
                      onReset={handleResetOtherAttachments}
                      type="file"
                      isEditAllowed={filetoggle}
                      id="otherAttachments"
                    />
                    {selectedOtherAttachments && (
                      <div
                        className="d-flex flex-column align-items-center"
                        style={{ fontSize: "12px" }}
                      >
                        <p>
                          File Size:{" "}
                          {Math.round(selectedOtherAttachments.size / 1024)} KB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {filetoggle && (
                  <div className="d-flex justify-content-center">
                    <Button
                      disabled={filetoggle ? false : true}
                      color="success"
                      style={{ margin: "10px", width: "35%" }}
                      onClick={() => getUpload(id)}
                    >
                      <Upgrade size={14} className="me-75" />
                      Update
                    </Button>
                  </div>
                )}
              </Card>
              {supplierData?.status === "queried" && (
                <div className="mb-2 d-flex justify-content-between">
                  <Button
                    // disabled={supplierData?.status !== "queried" ? true : false}
                    disabled={!isEditable ? true : false}
                    className="d-flex justify-content-center align-items-center"
                    // disabled={filetoggle ? true : false}
                    color="success"
                    onClick={Editattachments}
                  >
                    <RiImageEditLine size={16} className="me-50" />
                    Edit Attachments
                  </Button>
                </div>
              )}
            </Col>
          </Row>

          <Row>
            <Col md="12" sm="12" className="mb-1">
              <Card className={toggle ? "border-success" : "border-primary"}>
                <h4 color="primary" style={toggle ? updateHeader : headerStyle}>
                  <BusinessCenterOutlined fontSize="large" /> Business Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div className="col-md-4 py-1">
                    <label className="pb-0 " style={headerText}>
                      MSME No.
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="msme_no"
                        id="msme_no"
                        value={
                          editBusinessData ? editBusinessData?.msme_no : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 py-1">
                    <label className="pb-0" style={headerText}>
                      MSME Type
                    </label>
                    <div style={font600}>
                      <Select
                        isDisabled={toggle ? false : true}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editBusinessData?.msmeType,
                          value: editBusinessData?.msmeType,
                        }}
                        option={msmeOptions}
                        options={msmeOptions?.map((option) => {
                          return {
                            label: option.Description,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectMsme(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 py-1">
                    <label className="pb-0" style={headerText}>
                      Company Founded Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="companyFoundYear"
                        id="companyFoundYearVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.companyFoundYear
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Promoter / Director Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="promoterName"
                        id="promoterNameVertical"
                        value={
                          editBusinessData ? editBusinessData.promoterName : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Company Type
                    </label>
                    <div style={font600}>
                      <Select
                        isDisabled={toggle ? false : true}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editBusinessData?.companyType,
                          value: editBusinessData?.companyType,
                        }}
                        options={companyType?.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectCompanyType(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Name of Business / Corporate Group
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="nameOfBusiness"
                        id="nameOfBusinessVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.nameOfBusiness
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Business Type
                    </label>
                    <div style={font600}>
                      <Select
                        isDisabled={toggle ? false : true}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editBusinessData?.businessType,
                          value: editBusinessData?.businessType,
                        }}
                        option={businessTypestate}
                        options={businessTypestate?.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectBusinessType(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Address of Plant / Workshop
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="addressOfPlant"
                        id="addressOfPlantVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.addressOfPlant
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Name of Other Group Companies / Sister Concern
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="nameOfOtherGroupCompanies"
                        id="nameOfOtherGroupCompaniesVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.nameOfOtherGroupCompanies
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-1" style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      List of Major Customers
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="listOfMajorCustomers"
                        id="listOfMajorCustomersVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.listOfMajorCustomers
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 mb-1" style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Details of Major Orders Undertaken in Last 5 Years
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="detailsOfMajorLastYear"
                        id="detailsOfMajorLastYearVertical"
                        value={
                          editBusinessData
                            ? editBusinessData.detailsOfMajorLastYear
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleBusinessOnChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md="12" sm="12">
              <Card className={toggle ? "border-success" : "border-primary"}>
                <h4 color="primary" style={toggle ? updateHeader : headerStyle}>
                  <AttachMoney fontSize="large" /> Financial Details
                </h4>
                <div className="row" style={cardStyle}>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Currency
                    </label>
                    <div style={font600}>
                      <Select
                        isDisabled={toggle ? false : true}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`nameOfCompany`}
                        className={`react-select`}
                        classNamePrefix="select"
                        defaultValue={{
                          label: editFinancialData?.currency,
                          value: editFinancialData?.currency,
                        }}
                        option={currencyDropdown}
                        options={currencyDropdown?.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        onChange={(e) => setSelectCurrency(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Annual Turnover of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover"
                        id="turnoverVertical"
                        value={
                          editFinancialData ? editFinancialData.turnover : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Annual Turnover of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover2"
                        id="turnover2Vertical"
                        value={
                          editFinancialData ? editFinancialData.turnover2 : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Annual Turnover of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="turnover3"
                        id="turnover3Vertical"
                        value={
                          editFinancialData ? editFinancialData.turnover3 : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit Before Tax of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="first"
                        id="firstVertical"
                        value={editFinancialData ? editFinancialData.first : ""}
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit Before Tax of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="second"
                        id="secondVertical"
                        value={
                          editFinancialData ? editFinancialData.second : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit Before Tax of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="third"
                        id="thirdVertical"
                        value={editFinancialData ? editFinancialData.third : ""}
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit After Tax of 1st Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="afterfirst"
                        id="afterfirstVertical"
                        value={
                          editFinancialData ? editFinancialData.afterfirst : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit After Tax of 2nd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="aftersecond"
                        id="aftersecondVertical"
                        value={
                          editFinancialData ? editFinancialData.aftersecond : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Profit After Tax of 3rd Year
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="afterthird"
                        id="afterthirdVertical"
                        value={
                          editFinancialData ? editFinancialData.afterthird : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Present Order Booking Value
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="presentorder"
                        id="presentorderVertical"
                        value={
                          editFinancialData
                            ? editFinancialData.presentorder
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Further Order Booking Value
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="furtherorder"
                        id="furtherorderVertical"
                        value={
                          editFinancialData
                            ? editFinancialData.furtherorder
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Market Capital
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="market"
                        id="marketVertical"
                        value={
                          editFinancialData ? editFinancialData.market : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>

                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Networth
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="networth"
                        id="networthVertical"
                        value={
                          editFinancialData ? editFinancialData.networth : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="supply-heading mt-2">
                    <h4 className="card-title " style={{ color: "#E06522" }}>
                      <AccountBalance /> Primary Bank Details
                    </h4>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_name"
                        id="p_bank_name"
                        value={
                          editFinancialData ? editFinancialData.p_bank_name : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Account Number
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_account_number"
                        id="p_bank_account_number"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_account_number
                            : ""
                        }
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Holder Name
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_account_holder_name"
                        id="p_bank_account_holder_name"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_account_holder_name
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank state
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_state"
                        id="p_bank_state"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_state
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Address
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_address"
                        id="p_bank_address"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_address
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Branch
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_branch"
                        id="p_bank_branch"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_branch
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      IFSC Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_ifsc_code"
                        id="p_ifsc_code"
                        value={
                          editFinancialData ? editFinancialData.p_ifsc_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      MICR Code
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_micr_code"
                        id="p_micr_code"
                        value={
                          editFinancialData ? editFinancialData.p_micr_code : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Bank Guarantee Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_bank_guarantee_limit"
                        id="p_bank_guarantee_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.p_bank_guarantee_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 " style={{ paddingTop: "10px" }}>
                    <label className="pb-0 " style={headerText}>
                      Over Draft / Cash Credit Limit
                    </label>
                    <div style={font600}>
                      <Input
                        disabled={toggle ? false : true}
                        type="text"
                        name="p_overdraft_cash_credit_limit"
                        id="p_overdraft_cash_credit_limit"
                        value={
                          editFinancialData
                            ? editFinancialData.p_overdraft_cash_credit_limit
                            : ""
                        }
                        placeholder="---"
                        onChange={(e) => handleFinancialOnChange(e)}
                      />
                    </div>
                  </div>
                  <div>
                    <Accordion
                      className="accordion-margin"
                      style={{ marginBlock: "20px" }}
                      open={open}
                      toggle={toggles}
                    >
                      <AccordionItem>
                        <AccordionHeader
                          targetId="1"
                          style={{
                            backgroundColor: "#f26c131c",
                          }}
                        >
                          <div className="supply-heading">
                            <h4 style={{ color: "#E06522" }}>
                              <AccountBalanceTwoTone /> Secondary Bank Details
                            </h4>
                          </div>
                        </AccordionHeader>
                        <AccordionBody accordionId="1">
                          <Row>
                            <Col md={4}>
                              <div className="" style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Name
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_name"
                                    id="s_bank_name"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_name
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="" style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Account Number
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_account_number"
                                    id="s_bank_account_number"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_account_number
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div className="" style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Holder Name
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_account_holder_name"
                                    id="s_bank_account_holder_name"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_account_holder_name
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div className="" style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank state
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_state"
                                    id="s_bank_state"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_state
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Address
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_address"
                                    id="s_bank_address"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_address
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Branch
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_branch"
                                    id="s_bank_branch"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_branch
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <div style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  IFSC Code
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_ifsc_code"
                                    id="s_ifsc_code"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_ifsc_code
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  MICR Code
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_micr_code"
                                    id="s_micr_code"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_micr_code
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                            <Col md={4}>
                              <div style={{ paddingTop: "10px" }}>
                                <label className="pb-0 " style={headerText}>
                                  Bank Guarantee Limit
                                </label>
                                <div style={font600}>
                                  <Input
                                    disabled={toggle ? false : true}
                                    type="text"
                                    name="s_bank_guarantee_limit"
                                    id="s_bank_guarantee_limit"
                                    value={
                                      editFinancialData
                                        ? editFinancialData.s_bank_guarantee_limit
                                        : ""
                                    }
                                    placeholder="---"
                                    onChange={(e) => handleFinancialOnChange(e)}
                                  />
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <div
                            className="col-md-4 "
                            style={{ paddingTop: "10px" }}
                          >
                            <label className="pb-0 " style={headerText}>
                              Over Draft / Cash Credit Limit
                            </label>
                            <div style={font600}>
                              <Input
                                disabled={toggle ? false : true}
                                type="text"
                                name="s_overdraft_cash_credit_limit"
                                id="s_overdraft_cash_credit_limit"
                                value={
                                  editFinancialData
                                    ? editFinancialData.s_overdraft_cash_credit_limit
                                    : ""
                                }
                                placeholder="---"
                                onChange={(e) => handleFinancialOnChange(e)}
                              />
                            </div>
                          </div>
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12" lg="12" className="mb-1">
              <Card className="border-primary">
                <h4 color="primary" style={headerStyle}>
                  <AssignmentInd fontSize="large" />
                  Application Status
                </h4>
                <div className="row" style={cardStyle}>
                  <CardBody>
                    <Table size="sm" responsive>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Approver Level</th>
                          <th>Approver Level Name</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Remarks</th>
                          <th>Respond</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData ? (
                          tableData.map((row, index) => (
                            <tr key={index}>
                              <td>
                                <span className="align-middle fw-bold">
                                  {index + 1}
                                </span>
                              </td>
                              <td>
                                <span className="align-middle fw-bold">
                                  {"Level " + "- " + row.role}
                                </span>
                              </td>
                              <td>
                                <span className="align-middle fw-bold">
                                  {row.username}
                                </span>
                              </td>
                              <td>{row.username}</td>
                              <td>
                                <Badge
                                  pill
                                  color={getStatusColor(row.status)}
                                  className="me-1"
                                >
                                  {row.status.toUpperCase()}
                                </Badge>
                              </td>
                              <td>{row.remarks}</td>
                              <td>{row.respond}</td>
                              <td>
                                {row.createdAt && row.createdAt !== "null"
                                  ? (() => {
                                      const timestamp = row.createdAt;
                                      const date = new Date(timestamp);
                                      const formattedDateTime =
                                        " 🗓️ " +
                                        date.toISOString().slice(8, 10) +
                                        "/" + // Extract dd
                                        date.toISOString().slice(5, 7) +
                                        "/" + // Extract mm
                                        date.toISOString().slice(0, 4);
                                      return formattedDateTime;
                                    })()
                                  : ""}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6">No data available.</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </CardBody>
                </div>
              </Card>
            </Col>
            <Col md="4" lg="5">
              <div
                className="form-floating mb-0 mt-1 mb-2"
                style={{
                  display:
                    supplierData?.status === "queried" ? "block" : "none",
                }}
              >
                <Input
                  name="text"
                  value={value}
                  type="textarea"
                  id="exampleText"
                  placeholder="---"
                  style={{
                    minHeight: "100px",
                  }}
                  onChange={(e) => setValue(e.target.value)}
                  className={classnames({
                    "text-danger": value?.length > 200,
                  })}
                />
                <Label className="form-label" for="textarea-counter">
                  Message
                </Label>
              </div>
              <Button
                disabled={toggle ? false : true}
                style={{
                  display:
                    supplierData?.status === "queried" ? "block" : "none",
                }}
                color="primary"
                onClick={handleUpdate}
              >
                {/* <Upgrade size={14} className="me-75" /> */}
                {loadingPoList ? (
                  <div style={{ paddingLeft: "10px" }}>
                    <CircularProgress
                      style={{
                        width: "1.625rem",
                        height: "1.625rem",
                        color: "#fff",
                      }}
                    />
                  </div>
                ) : (
                  " Update Details"
                )}
              </Button>
            </Col>
          </Row>
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

export default SupplierDetails;
