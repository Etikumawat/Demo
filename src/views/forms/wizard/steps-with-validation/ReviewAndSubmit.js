// ** React Imports
import { Fragment, useState, useEffect } from "react";
import NoImage from "@src/assets/images/noImage.jpg";
// import Supplier from "../../../../assets/images/logo/logo.png";
// import Supplier from "../../../../assets/images/success1.gif";
// import Success from "../../../../assets/images/successbg.png";
import Supplier from "../../../../assets/images/success.gif";
import themeConfig from "../../../../configs/themeConfig";

import {
  AccountBalance,
  AccountBalanceTwoTone,
  PhoneAndroid,
} from "@mui/icons-material";
import {
  Row,
  Card,
  Col,
  Input,
  Button,
  CardBody,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "reactstrap";
import { ArrowLeft } from "react-feather";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import toast from "react-hot-toast";
import axios from "axios";
const MySwal = withReactContent(Swal);

const defaultValues = {
  google: "",
  twitter: "",
  facebook: "",
  linkedin: "",
};

const ReviewAndSubmit = ({ stepper }) => {
  const navigateTo = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState("");
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const [redirect, setRedirect] = useState(true);
  const [processing, setProcessing] = useState(false);

  const supplierRegistration = useSelector(
    (state) => state.supplierRegistration
  );
  const addDetails = useSelector((state) => state.additionalSlice);
  const filesData = useSelector((state) => state.attachedFiles);
  const msmeImage =
    Object.keys(filesData.msmeFile).length === 0 ? NoImage : filesData.msmeFile;
  const panImage =
    Object.keys(filesData.panFile).length === 0 ? NoImage : filesData.panFile;
  const gstImage =
    Object.keys(filesData.gstFile).length === 0 ? NoImage : filesData.gstFile;
  const chequeImage =
    Object.keys(filesData.cnlChequeFile).length === 0
      ? NoImage
      : filesData.cnlChequeFile;
  const pfImage =
    Object.keys(filesData?.pfAttachedFile)?.length === 0
      ? NoImage
      : filesData.pfAttachedFile;
  const otherImage =
    Object.keys(filesData.adAttachedFile).length === 0
      ? NoImage
      : filesData.adAttachedFile;
  useEffect(() => {
    if (user && user.role_name) {
      if (
        user.role_name === "Approver" ||
        user.role_name === "Admin" ||
        user.role_name == "Verifier"
      ) {
        setRedirect(false);
      } else {
        setRedirect(true);
      }
    }
  }, [user]);

  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });
  const onSubmit = (data) => {
    setProcessing(true);
    axios
      .post(
        new URL("/api/v1/supplier/supplier/register", themeConfig.backendUrl),
        supplierRegistration
      )
      .then((res) => {
        if (res.data.error) {
          setProcessing(false);
          toast.error(res.data.message);
        } else {
          setProcessing(false);
          MySwal.fire({
            imageUrl: `${Supplier}`,
            imageWidth: 200,
            // imageHeight: 200,
            title: `<span style='font-size: 22px;font-weight:500'>Success!</span>`,
            html: "<span style='font-size: 28px;'>Supplier Created Successfully</span>",
            // background: `url(${Success})`,
            showConfirmButton: false,
            timer: 4000,
            width: 600,
            padding: "3em",
            color: "#e06522",
            backdrop: `
            rgba(0,0,123,0.2)
          `,
            // icon: "success",
          });
          setTimeout(() => {
            if (user?.role_name == "Approver") {
              navigateTo("/suppliers");
            } else if (user?.role_name === "Admin") {
              navigateTo("/admin/supplier");
            } else {
              navigateTo("/login");
            }
          }, 4000);
        }
      });
  };

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  const font600 = { fontSize: "600" };

  const headerText = {
    fontSize: "15px",
    fontWeight: "500",
  };
  const headerStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };

  const reviewHeader = {
    color: "#fff",
    backgroundColor: "#E06522",
    borderRadius: "6px",
    textAlign: "center",
    padding: "12px 10px",
    // width: "100%",
  };
  const handlePanPdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = panImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const handleMsmePdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = msmeImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const handleChequePdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = chequeImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const handleGstPdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = gstImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const handlePfPdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = pfImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const handleOtherPdf = (event) => {
    event.preventDefault();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      const iframe = document.createElement("iframe");
      iframe.src = otherImage;
      iframe.width = "100%";
      iframe.height = "100%";
      newWindow.document.body.appendChild(iframe);
    }
  };
  const cardStyle = {
    borderRadius: "5px",
    marginLeft: "5px",
    marginRight: "5px",
    // marginTop: "20px",
    // backgroundColor: "white",
  };

  return (
    <Fragment>
      {/* <div className="content-header">
        <h5 className="mb-0">Review and Submit</h5>
      </div> */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Card
          className="border-primary"
          style={{
            backgroundColor: "",
            borderRadius: "5px",
            marginLeft: "5px",
            marginRight: "5px",
            marginTop: "15px",
          }}
        >
          <CardBody>
            <Row>
              <Col md="6">
                <label className="pb-0" style={headerText}>
                  Supplier Name
                </label>
                <Input
                  type="text"
                  name="name"
                  id="nameVertical"
                  disabled
                  value={supplierRegistration?.companyDetails?.supplier_name}
                  placeholder="---"
                />
              </Col>
              <Col md="3">
                <label className="pb-0 " style={headerText}>
                  PAN No.
                </label>
                <Input
                  type="text"
                  disabled
                  name="panCard"
                  id="panCardVertical"
                  value={supplierRegistration?.companyDetails?.panNo}
                  placeholder="---"
                />
              </Col>
              {supplierRegistration?.companyDetails?.gstNo ? (
                <Col md="3" className="mb-1">
                  <label className="pb-0 mb-1" style={headerText}>
                    GST No.
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    disabled
                    value={supplierRegistration?.companyDetails?.gstNo}
                    placeholder="---"
                  />
                </Col>
              ) : (
                ""
              )}
            </Row>
          </CardBody>
        </Card>
        <Row>
          <Col md="12" sm="12" className="mb-1">
            <Card className="border-primary">
              <h3 color="primary" style={headerStyle}>
                Company Details
              </h3>

              <div className="row" style={cardStyle}>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Source
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    value={supplierRegistration?.companyDetails?.source?.label}
                    placeholder="---"
                  />
                </div>
                <div className="col-md-3  " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Business Partner Group
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameVertical"
                    value={
                      supplierRegistration?.companyDetails?.department?.label
                    }
                    placeholder="---"
                  />
                </div>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Street Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="streetNo"
                      id="streetNoVertical"
                      value={supplierRegistration?.companyDetails?.streetNo}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Address 1
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address1"
                      id="address1Vertical"
                      value={supplierRegistration?.companyDetails?.address1}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Address 2
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address2"
                      id="address2Vertical"
                      value={supplierRegistration?.companyDetails?.address2}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Address 3
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="address3"
                      id="address3Vertical"
                      value={supplierRegistration?.companyDetails?.address3}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Country
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="country"
                      id="countryVertical"
                      value={
                        supplierRegistration?.companyDetails?.country?.label
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    State
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="state"
                      id="stateVertical"
                      value={supplierRegistration?.companyDetails?.state?.label}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    City
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="city"
                      id="cityVertical"
                      value={supplierRegistration?.companyDetails?.city}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Pin / Zip Code
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="pin"
                      id="pinVertical"
                      value={supplierRegistration?.companyDetails?.pin}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Phone Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="phoneNo"
                      id="phoneNoVertical"
                      value={supplierRegistration?.companyDetails?.phoneNo}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Website
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="website"
                      id="websiteVertical"
                      value={supplierRegistration?.companyDetails?.website}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Payment Method
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="paymentMethod"
                      id="paymentMethodVertical"
                      value={
                        supplierRegistration?.companyDetails?.paymentMethod
                          ?.label
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Overseas office details(if any)
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="officeDetails"
                      id="officeDetailsVertical"
                      value={
                        supplierRegistration?.companyDetails?.officeDetails
                      }
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Aadhar Card
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="aadharNo"
                      id="aadharNoVertical"
                      value={supplierRegistration?.companyDetails?.aadharNo}
                      placeholder="---"
                    />
                  </div>
                </div>

                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    CIN Number
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="cinNo"
                      id="cinNoVertical"
                      value={supplierRegistration?.companyDetails?.cinNo}
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Registering Authority
                  </label>
                  <div style={font600} id="review_country">
                    <Input
                      type="text"
                      name="cinNo"
                      id="cinNoVertical"
                      value={
                        supplierRegistration?.companyDetails?.department?.label
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <h4 className="mt-3" style={{ color: "#E06522" }}>
                  <PhoneAndroid /> Contact Details
                </h4>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Contact Person Name
                  </label>
                  <div style={font600}>
                    <Input
                      type="text"
                      name="contactPersonName"
                      id="cinNoVertical"
                      value={
                        supplierRegistration?.companyDetails?.contactPersonName
                      }
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Designation
                  </label>
                  <div style={font600}>
                    <Input
                      type="text"
                      name="designation"
                      id="cinNoVertical"
                      value={supplierRegistration?.companyDetails?.designation}
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Telephone
                  </label>
                  <div style={font600}>
                    <Input
                      type="text"
                      name="telephone"
                      id="cinNoVertical"
                      value={supplierRegistration?.companyDetails?.telephone}
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Mobile
                  </label>
                  <div style={font600}>
                    <Input
                      type="text"
                      name="mobile"
                      id="cinNoVertical"
                      value={supplierRegistration?.companyDetails?.mobile}
                      placeholder="---"
                    />
                  </div>
                </div>
                <div className="col-md-3 mb-1" style={{ paddingTop: "10px" }}>
                  <label className="pb-0 " style={headerText}>
                    Email ID
                  </label>
                  <div style={font600}>
                    <Input
                      type="text"
                      name="emailID"
                      id="cinNoVertical"
                      value={supplierRegistration?.companyDetails?.emailID}
                      placeholder="---"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Col md="12" sm="12" className="">
          <Card className="border-primary">
            <h3 color="primary" style={headerStyle}>
              Business Details
            </h3>

            <div className="row" style={cardStyle}>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Company Founded Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="companyFoundYear"
                    id="companyFoundYearVertical"
                    value={
                      supplierRegistration?.businessDetails?.companyFoundYear
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Promoter / Director Name
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="promoterName"
                    id="promoterNameVertical"
                    value={supplierRegistration?.businessDetails?.promoterName}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Company Type
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="companyType"
                    id="companyTypeVertical"
                    value={
                      supplierRegistration?.businessDetails?.companyType?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Name of Business / Corporate Group
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="nameOfBusiness"
                    id="nameOfBusinessVertical"
                    value={
                      supplierRegistration?.businessDetails?.nameOfBusiness
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Business Type
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="businessType"
                    id="businessTypeVertical"
                    value={
                      supplierRegistration?.businessDetails?.businessType?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Msme No.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="MsmeNo"
                    id="businessTypeVertical"
                    value={supplierRegistration?.businessDetails?.msme_no}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Msme. Type
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="MsmeNo"
                    id="businessTypeVertical"
                    value={
                      supplierRegistration?.businessDetails?.msmeType?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Address of Plant / Workshop
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="addressOfPlant"
                    id="addressOfPlantVertical"
                    value={
                      supplierRegistration?.businessDetails?.addressOfPlant
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Name of Other Group Companies / Sister Concern
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="nameOfOtherGroupCompanies"
                    id="nameOfOtherGroupCompaniesVertical"
                    value={
                      supplierRegistration?.businessDetails
                        ?.nameOfOtherGroupCompanies
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  List of Major Customers
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="listOfMajorCustomers"
                    id="listOfMajorCustomersVertical"
                    value={
                      supplierRegistration?.businessDetails
                        ?.listOfMajorCustomers?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 mb-1" style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Details of Major Orders Undertaken in Last 5 Years
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="detailsOfMajorLastYear"
                    id="detailsOfMajorLastYearVertical"
                    value={
                      supplierRegistration?.businessDetails
                        ?.detailsOfMajorLastYear?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col md="12" sm="12" className="">
          <Card className="border-primary">
            <h3 color="primary" style={headerStyle}>
              Financial Details
            </h3>

            <div className="row" style={cardStyle}>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Currency
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="currency"
                    id="currencyVertical"
                    value={
                      supplierRegistration?.financialDetails?.currency?.label
                    }
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Annual Turnover of First Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="turnover"
                    id="turnoverVertical"
                    value={supplierRegistration?.financialDetails?.Turnover}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Annual Turnover of Second Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="turnover2"
                    id="turnover2Vertical"
                    value={supplierRegistration?.financialDetails?.Turnover2}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Annual Turnover of Third Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="turnover3"
                    id="turnover3Vertical"
                    value={supplierRegistration?.financialDetails?.Turnover3}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit Before Tax of First Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="first"
                    id="firstVertical"
                    value={supplierRegistration?.financialDetails?.first}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit Before Tax of Second Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="second"
                    id="secondVertical"
                    value={supplierRegistration?.financialDetails?.second}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit Before Tax of Third Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="third"
                    id="thirdVertical"
                    value={supplierRegistration?.financialDetails?.third}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit After Tax of First Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="afterfirst"
                    id="afterfirstVertical"
                    value={supplierRegistration?.financialDetails?.afterfirst}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit After Tax of Second Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="aftersecond"
                    id="aftersecondVertical"
                    value={supplierRegistration?.financialDetails?.aftersecond}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Profit After Tax of Third Year
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="afterthird"
                    id="afterthirdVertical"
                    value={supplierRegistration?.financialDetails?.afterthird}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Present Order Booking Value
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="presentorder"
                    id="presentorderVertical"
                    value={supplierRegistration?.financialDetails?.presentorder}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Further Order Booking Value
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="furtherorder"
                    id="furtherorderVertical"
                    value={supplierRegistration?.financialDetails?.furtherorder}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Market Capital
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="market"
                    id="marketVertical"
                    value={supplierRegistration?.financialDetails?.market}
                    placeholder="---"
                  />
                </div>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Networth
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.networth}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="supply-heading">
                <h4 className="card-title mt-2 " style={{ color: "#E06522" }}>
                  <AccountBalance /> Primary Bank Details
                </h4>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Name
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.p_bank_name}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Account No.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.p_bank_account_number
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Account Holder Name.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.p_bank_account_holder_name
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank State.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.p_bank_state}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Address.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails?.p_bank_address
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Branch.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails?.p_bank_branch
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  IFSC Code
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.p_ifsc_code}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  MICR Code
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.p_micr_code}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Guarantee Limit
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.p_bank_guarantee_limit
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Cash Draft/ Cash Credit Limit
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.p_overdraft_cash_credit_limit
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="supply-heading">
                <h4 className="card-title mt-2" style={{ color: "#E06522" }}>
                  <AccountBalanceTwoTone /> Secondary Bank Details
                </h4>
              </div>

              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Name
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.s_bank_name}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Account No.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.s_bank_account_number
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Account Holder Name.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.s_bank_account_holder_name
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank State.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.s_bank_state}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Address.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails?.s_bank_address
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Branch.
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails?.s_bank_branch
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  IFSC Code
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.s_ifsc_code}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  MICR Code
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={supplierRegistration?.financialDetails?.s_micr_code}
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 " style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Bank Guarantee Limit
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.s_bank_guarantee_limit
                    }
                    placeholder="---"
                  />
                </div>
              </div>
              <div className="col-md-3 mb-1" style={{ paddingTop: "10px" }}>
                <label className="pb-0 " style={headerText}>
                  Cash Draft/ Cash Credit Limit
                </label>
                <div style={font600} id="review_country">
                  <Input
                    type="text"
                    name="networth"
                    id="networthVertical"
                    value={
                      supplierRegistration?.financialDetails
                        ?.s_overdraft_cash_credit_limit
                    }
                    placeholder="---"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col md="12" sm="12" className="">
          <div
            className="row"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "20px",
            }}
          ></div>
        </Col>

        <Col md="12" sm="12" className="mb-1">
          <div
            className="row"
            style={{
              backgroundColor: "white",
              borderRadius: "5px",
              marginLeft: "5px",
              marginRight: "5px",
              marginTop: "20px",
            }}
          >
            {/* Addition Details */}

            {Object.keys(addDetails.addDetails).length === 0 ? (
              ""
            ) : (
              <>
                <div className="supply-heading">
                  <h3 className="card-title" style={reviewHeader}>
                    Additional Details
                  </h3>
                </div>
              </>
            )}

            <div className="row">
              {Object.entries(addDetails?.addDetails || {}).map(
                ([fieldName, fieldValue]) => (
                  <div key={fieldName} className="col-md-3 py-2">
                    <label className="pb-0 mb-1" style={headerText}>
                      {fieldName}
                    </label>
                    <div style={font600} id="review_country">
                      <Input
                        type="text"
                        name={fieldName}
                        id="panCardVertical"
                        value={fieldValue}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Col>
        <Col md="12" sm="12" className="mb-1">
          <Card className="border-primary">
            <h3 color="primary" style={headerStyle}>
              File Attachments
            </h3>

            <div className="row" style={cardStyle}>
              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  PAN
                </label>
                <br />
                {typeof panImage === "string" &&
                panImage.includes("data:application/pdf") ? (
                  <a href={panImage} target="_blank" onClick={handlePanPdf}>
                    Open PAN
                  </a>
                ) : (
                  <img
                    src={panImage}
                    style={{ width: "100px", marginTop: "5px" }}
                    alt="Pan card"
                    onClick={() => {
                      setShow(true);
                      setImgSrc(panImage);
                    }}
                  />
                )}
              </div>

              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  MSME
                </label>
                <br />
                {typeof msmeImage === "string" &&
                msmeImage &&
                msmeImage.includes("data:application/pdf") ? (
                  <a
                    href={msmeImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleMsmePdf}
                  >
                    Open MSME
                  </a>
                ) : (
                  <img
                    src={msmeImage}
                    style={{ width: "100px", marginTop: "5px" }}
                    alt="MSME"
                    onClick={() => {
                      setShow(true);
                      setImgSrc(msmeImage);
                    }}
                  />
                )}
              </div>

              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  GST Certificate
                </label>
                <br />
                {typeof gstImage === "string" &&
                gstImage.includes("data:application/pdf") ? (
                  <div>
                    <a href={gstImage} target="_blank" onClick={handleGstPdf}>
                      Open GST
                    </a>
                  </div>
                ) : (
                  <>
                    <img
                      src={gstImage}
                      style={{ width: "100px", marginTop: "5px" }}
                      alt="GST"
                      onClick={() => {
                        setShow(true);
                        setImgSrc(gstImage);
                      }}
                    />
                  </>
                )}
              </div>

              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  Cancelled Cheque
                </label>
                <br />
                {typeof chequeImage === "string" &&
                chequeImage.includes("data:application/pdf") ? (
                  <a
                    href={chequeImage}
                    target="_blankAdditional Details"
                    onClick={handleChequePdf}
                  >
                    Open Cheque
                  </a>
                ) : (
                  <>
                    <img
                      src={chequeImage}
                      style={{ width: "100px", marginTop: "5px" }}
                      alt="Cheque"
                      onClick={() => {
                        setShow(true);
                        setImgSrc(chequeImage);
                      }}
                    />
                  </>
                )}
              </div>

              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  Pf Attachment
                </label>
                <br />
                {typeof pfImage === "string" &&
                pfImage.includes("data:application/pdf") ? (
                  <a href={pfImage} target="_blank" onClick={handlePfPdf}>
                    Open PF
                  </a>
                ) : (
                  <img
                    src={pfImage}
                    style={{ width: "100px", marginTop: "5px" }}
                    alt="Pan card"
                    onClick={() => {
                      setShow(true);
                      setImgSrc(pfImage);
                    }}
                  />
                )}
              </div>

              <div className="col-md-2  py-2">
                <label className="pb-0" style={headerText}>
                  Other Attachment
                </label>
                <br />
                {typeof otherImage === "string" &&
                otherImage.includes("data:application/pdf") ? (
                  <a
                    href={otherImage}
                    target="_blankAdditional Details"
                    onClick={handleOtherPdf}
                  >
                    Open File
                  </a>
                ) : (
                  <>
                    <img
                      src={otherImage}
                      style={{ width: "100px", marginTop: "5px" }}
                      alt="Cheque"
                      onClick={() => {
                        setShow(true);
                        setImgSrc(otherImage);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Modal
          isOpen={show}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered modal-lg"
        >
          <ModalHeader
            className="bg-transparent"
            toggle={() => setShow(!show)}
          ></ModalHeader>
          <ModalBody className="pb-5 px-sm-5 mx-50 text-center">
            <img src={imgSrc} className="img-fluid" alt="" />
          </ModalBody>
        </Modal>
        <div className="d-flex justify-content-between">
          <Button
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button
            type="submit"
            disabled={processing}
            color="success"
            className="btn-submit"
          >
            {processing ? <Spinner size={"sm"} /> : "Submit"}
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default ReviewAndSubmit;
