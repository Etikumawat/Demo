import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { selectThemeColors } from "@utils";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";

import { Controller, useForm } from "react-hook-form";
import {
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  ModalBody,
  ModalFooter,
  Row,
  Button,
  Card,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import axios from "axios";
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function GeneratIRN() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();
  const [datepicker, setDateicker] = useState(new Date(null));
  const [irnresponse, setIrnresponse] = useState();
  const [irnresponseview, setIrnresponseview] = useState(false);

  const [loadingIrn, setLoadingIrn] = useState(false);
  const [errordocument, setErrordocument] = useState({
    document_date: false,
  });
  const SignupSchema = yup.object().shape({
    legal_name: yup.string().required("*Buyer Name required"),
    location: yup.string().required("*Buyer Location required"),
    place_of_supply: yup.object().shape({
      value: yup.string().min(1).required("*Place of supply required"),
    }),
    pincode: yup
      .string()
      .matches(/^\d{6}$/, "Must be exactly 6 digits")
      .required("*Buyer Pincode required"),

    shiplegal_name: yup.string().required("*Shiping legal Name required"),
    shipaddress1: yup.string().required("*Shiping Address required"),
    shiplocation: yup.string().required("*Shiping Location required"),
    shippincode: yup
      .string()
      .matches(/^\d{6}$/, "Must be exactly 6 digits")
      .required("*Shiping Pincode required"),
    shipstatecode: yup.object().shape({
      value: yup.string().optional().min(1).required("*State required"),
    }),
    transportation_mode: yup.object().shape({
      value: yup
        .string()
        .optional()
        .min(1)
        .required("*Transportation required"),
    }),
    transportation_distance: yup
      .string()
      .required("*Transportation distance is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
    total_assessable_value: yup
      .string()
      .required("*Total Assessable value is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
    total_invoice_value: yup
      .string()
      .required("*Total invoice value is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
  });
  const defaultValues = {
    // gstin: form.companyGST,
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });
  const indianStates = [
    { value: "1", label: "Andaman and Nicobar Islands" },
    { value: "2", label: "Andhra Pradesh" },
    { value: "3", label: "Arunachal Pradesh" },
    { value: "4", label: "Assam" },
    { value: "5", label: "Bihar" },
    { value: "6", label: "Chandigarh" },
    { value: "7", label: "Chhattisgarh" },
    { value: "8", label: "Dadra and Nagar Haveli" },
    { value: "9", label: "Daman and Diu" },
    { value: "10", label: "Delhi" },
    { value: "11", label: "Goa" },
    { value: "12", label: "Gujarat" },
    { value: "13", label: "Haryana" },
    { value: "14", label: "Himachal Pradesh" },
    { value: "15", label: "Jammu and Kashmir" },
    { value: "16", label: "Jharkhand" },
    { value: "17", label: "Karnataka" },
    { value: "18", label: "Kerala" },
    { value: "19", label: "Ladakh" },
    { value: "20", label: "Lakshadweep" },
    { value: "21", label: "Madhya Pradesh" },
    { value: "22", label: "Maharashtra" },
    { value: "23", label: "Manipur" },
    { value: "24", label: "Meghalaya" },
    { value: "25", label: "Mizoram" },
    { value: "26", label: "Nagaland" },
    { value: "27", label: "Odisha" },
    { value: "28", label: "Puducherry" },
    { value: "29", label: "Punjab" },
    { value: "30", label: "Rajasthan" },
    { value: "31", label: "Sikkim" },
    { value: "32", label: "Tamil Nadu" },
    { value: "33", label: "Telangana" },
    { value: "34", label: "Tripura" },
    { value: "35", label: "Uttar Pradesh" },
    { value: "36", label: "Uttarakhand" },
    { value: "37", label: "West Bengal" },
  ];
  useEffect(() => {
    axios
      .post(new URL(`v1/supplier/asn/view/` + id, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        console.log(res.data.data);
        setData(res.data.data);
      });
  }, [id]);
  const gnerateIrn = (item) => {
    // const sendData = {
    //   asnNo: "ASN410000305600123",
    //   user_gstin: "05AAAPG7885R002",
    //   transaction_details: {
    //     supply_type: "B2B",
    //   },
    //   document_details: {
    //     document_type: "INV",
    //     document_number: "TATA/99024",
    //     document_date: "2024-03-19T18:30:00.000Z",
    //   },
    //   buyer_details: {
    //     gstin: "07AAACN0372R1Z5",
    //     legal_name: "tester",
    //     address1:
    //       "19:ASHIRWAD BUNGLOWS-PART 2, B/H AUDA GARDEPRAHALAD NAGAR, AMBAWADI P.O.",
    //     location: "ahmedabad",
    //     pincode: "121002",
    //     place_of_supply: "13",
    //     state_code: "07",
    //   },
    //   ship_details: {
    //     legal_name: "Dell and Co.",
    //     address1: "new Station road",
    //     location: "Bhuj",
    //     pincode: "370001",
    //     state_code: "07",
    //   },
    //   export_details: {
    //     country_code: "IN",
    //   },
    //   ewaybill_details: {
    //     transportation_mode: "Ship",
    //     transportation_distance: "296",
    //   },
    //   value_details: {
    //     total_assessable_value: "4",
    //     total_invoice_value: "4.2",
    //   },
    // };

    const sendData = {
      asnNo: data?.asnNo,
      user_gstin: data?.gst,
      transaction_details: {
        supply_type: "B2B",
      },
      document_details: {
        document_type: "INV",
        document_number: "TATA/99024",
        document_date: datepicker[0],
      },
      buyer_details: {
        gstin: data?.gst,
        legal_name: item.legal_name,
        address1: data?.billToAddress,
        location: item.location,
        pincode: item.pincode,
        place_of_supply: item?.place_of_supply?.value,
        state_code: data?.gst?.substring(0, 2),
      },
      ship_details: {
        legal_name: item.shiplegal_name,
        address1: item.shipaddress1,
        location: item.shiplocation,
        pincode: item.shippincode,
        state_code: item?.shipstatecode?.value,
      },
      export_details: {
        country_code: "IN",
      },

      ewaybill_details: {
        transportation_mode: item?.transportation_mode?.value,
        transportation_distance: item.transportation_distance,
      },
      value_details: {
        total_assessable_value: item.total_assessable_value,
        total_invoice_value: item.total_invoice_value,
      },
    };
    if (datepicker[0]) {
      setLoadingIrn(true);
      axios
        .post(
          new URL(
            "/api/v1/services/masterIndia/generateIrn",
            themeConfig.backendUrl
          ),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            const errorMessage = `${res.data.message} ${res.data.data}`;
            toast.error(errorMessage);
            setLoadingIrn(false);
          } else {
            setLoadingIrn(false);
            setIrnresponseview(true);
            setIrnresponse(res.data.data.results);
            console.log(res.data.data.results.message, "irn response");
            toast.success(res.data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      setErrordocument({
        document_date: true,
      });
      toast.error("Select Document Date");
    }
  };
  return (
    <>
     <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb >
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/supplier/asn">List ASN/SCR </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> IRN </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>

        <div style={{ display: "flex", justifyContent: "end" }}>
          <div
            onClick={() => {
              navigate("/supplier/asn");
            }}
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "#f26c13",
              borderRadius: "4px",
            }}
          >
            <ArrowBack size="20px" style={{ color: "#ffffff" }} />
          </div>
        </div>
        <Form style={{ padding: "20px 40px" }} id="form">
          <ModalBody>
            <h2 style={{ textAlign: "center" }}>Generate IRN</h2>
            <div>
              <Row>
                <h4 style={{ color: "#f26c13", paddingBlock: "10px" }}>
                  Document Details
                </h4>
                <Col md={6}>
                  <div className="mb-1">
                    <Label className="form-label" for="username">
                      Document Date:
                    </Label>
                    <Flatpickr
                      value={datepicker}
                      id="date-time-picker"
                      className="form-control"
                      options={{
                        minDate: "today",
                      }}
                      onChange={(date) => setDateicker(date)}
                    />
                    {errordocument.document_date && (
                      <FormFeedback style={{ display: "block" }}>
                        Select Document Date
                      </FormFeedback>
                    )}
                    {/* {errors.document_date && (
                              <FormFeedback>
                                {errors.document_date.message}
                              </FormFeedback>
                            )} */}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div>
                    <h4 style={{ color: "#f26c13", paddingBlock: "10px" }}>
                      Buyer Details
                    </h4>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        GST Number:
                      </Label>
                      <Controller
                        control={control}
                        name="gstin"
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={data?.gst}
                            placeholder="INV"
                            invalid={errors.gstin ? true : false}
                            disabled
                          />
                        )}
                      />
                      {errors.gstin && (
                        <FormFeedback>{errors.gstin.message}</FormFeedback>
                      )}
                    </div>

                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Legal Name:
                      </Label>
                      <Controller
                        control={control}
                        name="legal_name"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="XIAOMI TECHNOLOGY"
                            invalid={errors.legal_name ? true : false}
                          />
                        )}
                      />
                      {errors.legal_name && (
                        <FormFeedback>{errors.legal_name.message}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Address :
                      </Label>
                      <Controller
                        control={control}
                        name="address1"
                        render={({ field }) => (
                          <Input
                            disabled
                            {...field}
                            value={data?.billToAddress}
                            placeholder="Mumbai/Ahmedabad/Dehradun"
                            invalid={errors.address1 ? true : false}
                          />
                        )}
                      />

                      {errors.address1 && (
                        <FormFeedback>{errors.address1.message}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Location:
                      </Label>
                      <Controller
                        control={control}
                        name="location"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ahmedabad"
                            invalid={errors.location ? true : false}
                          />
                        )}
                      />
                      {errors.location && (
                        <FormFeedback>{errors.location.message}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Pincode:
                      </Label>
                      <Controller
                        type="number"
                        control={control}
                        name="pincode"
                        render={({ field }) => (
                          <Input
                            maxLength={6}
                            type="number"
                            {...field}
                            placeholder="370001"
                            invalid={errors.pincode ? true : false}
                          />
                        )}
                      />

                      {errors.pincode && (
                        <FormFeedback>{errors.pincode.message}</FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Place to Supply:
                      </Label>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="place_of_supply"
                        render={({ field }) => (
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            {...field}
                            options={indianStates}
                          />
                        )}
                      />
                      {errors.place_of_supply && (
                        <FormFeedback>
                          {errors.place_of_supply.value &&
                            errors.place_of_supply.value.message}
                        </FormFeedback>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <h4 style={{ color: "#f26c13", paddingBlock: "10px" }}>
                      Ship Details
                    </h4>

                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Legal Name:
                      </Label>
                      <Controller
                        control={control}
                        name="shiplegal_name"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Burger King"
                            invalid={errors.shiplegal_name ? true : false}
                          />
                        )}
                      />
                      {errors.shiplegal_name && (
                        <FormFeedback>
                          {errors.shiplegal_name.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Address 1:
                      </Label>
                      <Controller
                        control={control}
                        name="shipaddress1"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Mumbai"
                            invalid={errors.shipaddress1 ? true : false}
                          />
                        )}
                      />
                      {errors.shipaddress1 && (
                        <FormFeedback>
                          {errors.shipaddress1.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Location:
                      </Label>
                      <Controller
                        control={control}
                        name="shiplocation"
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Ahmedabad"
                            invalid={errors.shiplocation ? true : false}
                          />
                        )}
                      />
                      {errors.shiplocation && (
                        <FormFeedback>
                          {errors.shiplocation.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Pincode:
                      </Label>
                      <Controller
                        control={control}
                        name="shippincode"
                        render={({ field }) => (
                          <Input
                            maxLength={6}
                            type="number"
                            {...field}
                            placeholder="370001"
                            invalid={errors.shippincode ? true : false}
                          />
                        )}
                      />
                      {errors.shippincode && (
                        <FormFeedback>
                          {errors.shippincode.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        State:
                      </Label>
                      <Controller
                        control={control}
                        name="shipstatecode"
                        render={({ field }) => (
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            {...field}
                            options={indianStates}
                          />
                        )}
                      />
                      {errors.shipstatecode && (
                        <FormFeedback>
                          {errors.shipstatecode.value &&
                            errors.shipstatecode.value.message}
                        </FormFeedback>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div>
                    <h4 style={{ color: "#e74c3c", paddingBlock: "10px" }}>
                      E-Waybill Details
                    </h4>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Transportation Mode:
                      </Label>
                      <Controller
                        control={control}
                        name="transportation_mode"
                        render={({ field }) => (
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`nameOfCompany`}
                            className={`react-select`}
                            classNamePrefix="select"
                            {...field}
                            // onChange={(e) => {
                            //   console.log(e.value);
                            // }}
                            options={[
                              { value: "Road", label: "Road" },
                              { value: "Rail", label: "Rail" },
                              { value: "Ship", label: "Ship" },
                              { value: "Air", label: "Air" },
                            ]}
                          />
                        )}
                      />
                      {errors.transportation_mode && (
                        <FormFeedback>
                          {errors.transportation_mode.value &&
                            errors.transportation_mode.value.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Transportation Distance:
                      </Label>
                      <Controller
                        control={control}
                        name="transportation_distance"
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            placeholder="200 KM"
                            invalid={
                              errors.transportation_distance ? true : false
                            }
                          />
                        )}
                      />
                      {errors.transportation_distance && (
                        <FormFeedback>
                          {errors.transportation_distance.message}
                        </FormFeedback>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <h4 style={{ color: "#e74c3c", paddingBlock: "10px" }}>
                      Value Details
                    </h4>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Total Assessable Value:
                      </Label>
                      <Controller
                        control={control}
                        name="total_assessable_value"
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="40000"
                            invalid={
                              errors.total_assessable_value ? true : false
                            }
                          />
                        )}
                      />
                      {errors.total_assessable_value && (
                        <FormFeedback>
                          {errors.total_assessable_value.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Label className="form-label" for="username">
                        Total Invoice Value:
                      </Label>
                      <Controller
                        control={control}
                        name="total_invoice_value"
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            placeholder="2000"
                            invalid={errors.total_invoice_value ? true : false}
                          />
                        )}
                      />
                      {errors.total_invoice_value && (
                        <FormFeedback>
                          {errors.total_invoice_value.message}
                        </FormFeedback>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </ModalBody>

          <ModalFooter className="d-flex justify-content-start mt-2">
            <Button color="primary" onClick={handleSubmit(gnerateIrn)}>
              Submit
              {loadingIrn && (
                <div style={{ paddingLeft: "10px" }}>
                  <CircularProgress
                    style={{
                      width: "1.625rem",
                      height: "1.625rem",
                      color: "#ffffff",
                    }}
                  />
                </div>
              )}
            </Button>
          </ModalFooter>
        </Form>
      </Card>
      {irnresponseview && (
        <div
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            display: "flex",
            borderRadius: "5px",
            backgroundColor: "rgb(242 108 19 / 8%)",
          }}
        >
          <Row className="p-2">
            <div>
              <h6 className="mt-1">E-Way Bill:</h6>
            </div>
            <Col md={6}>
              <Input value={irnresponse?.message?.EwbNo} />
            </Col>
            <div>
              <h6 className="mt-1">IRN Number:</h6>
            </div>
            <Col md={6}>
              <Input
                style={{ minHeight: "50px" }}
                value={irnresponse?.message?.Irn}
              />
            </Col>
          </Row>

          <div>
            <img
              src={irnresponse?.message?.QRCodeUrl}
              alt=""
              className="img-fluid p-1"
              width={180}
            />
          </div>
        </div>
      )}
    </>
  );
}
