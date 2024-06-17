// ** React Imports
import { Fragment, useEffect } from "react";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-hot-toast";
// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useSelector } from "react-redux";
import themeConfig from "../../../../configs/themeConfig";
import axios from "axios";
import { handleAdditionalDetails } from "@store/supplierRegistration";
import { takeAddDetails } from "@store/additionalSlice";
//** Use Redux Toolkit */
import { useDispatch } from "react-redux";
import func from "../../../../custom/functions";

// ** Utils
import { isObjEmpty } from "@utils";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";

const AdditionalDetails = ({ stepper, data }) => {
  const supplierRegistration = useSelector(
    (state) => state.supplierRegistration
  );
  const conditionalValidation = func.conditionalValidation;
  const dispatch = useDispatch();
  const fieldsConfig = data.fieldsConfig;
  const [receivedData, setReceivedData] = useState([]);
  const [sendData, setSendData] = useState({});
  const [formData, setFormData] = useState({});
  const [displayData, setDisplayData] = useState({});

  const schema = Yup.object().shape(
    receivedData?.reduce((schemaObject, item) => {
      if (item.display === "1") {
        const fieldValue = formData[item.key];

        if (
          fieldValue !== undefined &&
          fieldValue !== null &&
          fieldValue !== ""
        ) {
          schemaObject[item.key] = Yup.string();
        } else {
          schemaObject[item.key] =
            item.required === "1"
              ? Yup.string().required(`${item.display_name} is required`)
              : Yup.string();
        }
      }
      return schemaObject;
    }, {})
  );

  // ** Hooks
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
      });
  };

  const defaultValues = {};
  receivedData?.forEach((item) => {
    defaultValues[item.key] = item.default_value || "";
  });

  const handleInputChange = (fieldName, keyName, value) => {
    setError(keyName, { type: "manual", message: "" });
    setFormData({
      ...formData,
      [keyName]: value,
      [fieldName]: value,
    });
    setDisplayData({
      ...displayData,
      [fieldName]: value,
    });
    setSendData({
      ...sendData,
      [keyName]: value,
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    dispatch(handleAdditionalDetails(sendData));
    dispatch(takeAddDetails(displayData));
    if (errors) {
      stepper.next();
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">Additional Details</h5>
      </div>
      <hr />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {receivedData !== null ? (
            <>
              <Row>
                {receivedData
                  ?.filter((item) => item.display === "1")
                  .map((item, index) => (
                    <Col md="4" className="mb-1" key={index}>
                      <Label className="form-label" for={item.key}>
                        {item.display_name}
                      </Label>
                      <Controller
                        id={item.key}
                        name={item.key}
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <div>
                            <Input
                              placeholder={item.display_name}
                              // invalid={errors[item.key] && true}
                              value={formData[item.display_name] || ""}
                              // {...field}
                              onChange={(e) =>
                                handleInputChange(
                                  item.display_name,
                                  item.key,
                                  e.target.value
                                )
                              }
                            />
                            <p style={{ color: "red", fontSize: "12px" }}>
                              {errors[item.key]?.message}
                            </p>
                          </div>
                        )}
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
            type="button"
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
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default AdditionalDetails;
