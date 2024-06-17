// ** React Imports
import { Fragment, useEffect } from "react";
import * as Yup from "yup";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { toast } from "react-hot-toast";
// ** Third Party Components
import { ArrowLeft, ArrowRight } from "react-feather";
import themeConfig from "../../../configs/themeConfig";
import axios from "axios";
import func from "../../../custom/functions";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

const AdditionalDetails = (value) => {
  // const supplierID = localStorage.getItem("supplierId");
  // const supplierRegistration = useSelector(state => state.supplierRegistration)
  const conditionalValidation = func.conditionalValidation;

  const [fieldData, setFieldData] = useState([]);
  const getField = () => {
    axios
      .post(new URL("/api/v1/supplier/onboarding/list", themeConfig.backendUrl))
      .then((res) => {
        setFieldData(res.data.data.fieldsConfig.additionalDetails);
        console.log(res.data.data.fieldsConfig.additionalDetails);
        if (res.data.error) {
          return toast.error(res.data.message);
        }
      });
  };
  // ** Hooks
  const [receivedData, setReceivedData] = useState([]);
  const [sendData, setSendData] = useState({
    // supplier_id: supplierID ? supplierID : '',
    created_at: "123456789",
  });
  const [formData, setFormData] = useState({});
  const handleInputChange = (fieldName, keyName, value) => {
    setFormData({
      ...formData,
      [keyName]: value,
      [fieldName]: value,
    });
    setSendData({
      ...sendData,
      [keyName]: value,
    });
  };

  const getData = () => {
    const list = {
      module_name: "supplier_registration",
      group_name: "additionalDetails",
    };
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
        setReceivedData(res.data.data);
        con;
      });
  };

  if (receivedData != null) {
    receivedData.map((item) => {
      console.log(item);
      const keyName = item.key;
      const check = item.required;
      check === "1" ? true : false;
      const Schema = Yup.object().shape({
        keyName: conditionalValidation(Yup.string(), check),
      });
    });
  }

  const onSubmit = (data) => {
    console.log(sendData);
    const isAllFieldsFilled = Object.values(formData).every(
      (value) => value !== ""
    );
    const hasEmptyField = Object.values(sendData).some((value) => value === "");

    if (hasEmptyField) {
      toast.error("One or more field is empty");
    } else {
      console.log("All fields are filled");
      axios
        .post(
          new URL(
            "/api/v1/workFlow/fieldConfig/create",
            themeConfig.backendUrl
          ),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          }
          console.log(res.data);
          toast.success(res.data.message);
        });
    }
  };

  useEffect(() => {
    getData();
    getField();
  }, []);
  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Additional Details</h5>
        {/* <h5>SupplierID : {supplierID}</h5> */}
      </div>
      <hr />
      <Row>
        <Col md="4" className="mb-1">
          <Label style={{ fontSize: "20px" }} className="form-label">
            Supplier Name
          </Label>
          <Input
            // value={supplierRegistration?.companyDetails?.supplier_name}
            disabled
          />
        </Col>
      </Row>
      <Row>
        {receivedData !== null ? (
          <>
            <Row>
              {receivedData
                .filter((item) => item.display === "1")
                .map((item, index) => (
                  <Col md="4" className="mb-1" key={index}>
                    <Label className="form-label" for={item.key}>
                      {item.display_name}
                    </Label>
                    <Input
                      placeholder={item.display_name}
                      value={formData[item.display_name] || ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.display_name,
                          item.key,
                          e.target.value
                        )
                      }
                    />
                  </Col>
                ))}
            </Row>
          </>
        ) : (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <h4>No Records Fetched</h4>
          </div>
        )}
      </Row>
      <div className="d-flex justify-content-between">
        <Button
          type="submit"
          color="primary"
          onClick={onSubmit}
          className="btn-next"
        >
          <span className="align-middle d-sm-inline-block d-none">Submit</span>
          <ArrowRight
            size={14}
            className="align-middle ms-sm-25 ms-0"
          ></ArrowRight>
        </Button>
      </div>
    </Fragment>
  );
};

export default AdditionalDetails;
