// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Stack from "@mui/material/Stack";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { FormGroup, Spinner } from "reactstrap";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight } from "react-feather";
//** Use Redux Toolkit */
import { useDispatch } from "react-redux";
import { handleBusinessDetails } from "@store/supplierRegistration";
import func from "../../../../custom/functions";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";

// ** Utils
import { isObjEmpty, selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import { Cancel, Verified } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const BusinessDetails = ({ stepper, data }) => {
  const [config, setConfig] = useState();
  const [tick, setTick] = useState();
  const [msmeMsg, setMsmeMsg] = useState();
  const [required, setRequired] = useState();
  const [processing, setProcessing] = useState(false);
  const [isMSME, setIsMSME] = useState(false);
  const [msmeError, setMsmeError] = useState(false);
  const [msmeType, setMsmeType] = useState();

  const defaultValues = {
    companyFoundYear: "",
    promoterName: "",
    // companyType: {
    //   label: "",
    //   value: "",
    // },
    nameOfBusiness: "",
    // businessType: {
    //   label: "",
    //   value: "",
    // },
    addressOfPlant: "",
    nameOfOtherGroupCompanies: "",
    // listOfMajorCustomers: {
    //   label: "",
    //   value: "",
    // },
    // msmeType: {
    //   label: msmeType ? msmeType : "",
    //   value: msmeType ? msmeType : "",
    // },
    msmeType: msmeType,
    msme_no: "",
  };
  const conditionalValidation = func.conditionalValidation;
  const [fieldsConfig, setFieldConfig] = useState(data.fieldsConfig);
  const businessTypeOptions = data.business_types?.map((val) => ({
    value: val.id,
    label: val.name,
  }));
  const companyTypeOptions = data.company_types?.map((val) => ({
    value: val.id,
    label: val.name,
  }));
  console.log(`::: ${fieldsConfig.businessDetails?.companyType} :::`);
  const dispatch = useDispatch();
  // const msmeTypeValidation = isMSME
  //   ? Yup.object().shape({
  //       label: Yup.string().required(),
  //       value: Yup.string().required(),
  //     })
  //   : Yup.object().shape({
  //       label: Yup.string(),
  //       value: Yup.string(),
  //     });
  // console.log(msmeTypeValidation);
  const SignupSchema = Yup.object().shape({
    companyFoundYear: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.companyFoundYear
    ),
    promoterName: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.promoterName
    ),
    msme_no: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.msme_no
    ),
    // msmeType: conditionalValidation(
    //   msmeTypeValidation,
    //   fieldsConfig.businessDetails?.msmeType
    // ),
    companyType: conditionalValidation(
      Yup.object().shape({
        value: Yup.string(),
      }),
      fieldsConfig.businessDetails?.companyType
    ),
    nameOfBusiness: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.nameOfBusiness
    ),
    businessType: conditionalValidation(
      Yup.object().shape({
        value: Yup.string(),
      }),
      fieldsConfig.businessDetails?.businessType
    ),
    addressOfPlant: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.addressOfPlant
    ),
    nameOfOtherGroupCompanies: conditionalValidation(
      Yup.string(),
      fieldsConfig.businessDetails?.nameOfOtherGroupCompanies
    ),
    listOfMajorCustomers: conditionalValidation(
      Yup.object().shape({
        value: Yup.string(),
      }),
      fieldsConfig.businessDetails?.listOfMajorCustomers
    ),
    detailsOfMajorLastYear: conditionalValidation(
      Yup.object().shape({
        value: Yup.string(),
      }),
      fieldsConfig.businessDetails?.detailsOfMajorLastYear
    ),
  });
  // ** Hooks
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const [customer, setCustomer] = useState([]);
  const [msmeLoading, setmsmeLoading] = useState(false);
  const [order, setOrder] = useState([]);
  const [msmeOptions, setMsmeOptions] = useState([]);

  const getCustomer = () => {
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/major_customer_list",
          themeConfig.backendUrl
        )
      )
      .then((response) => {
        setCustomer(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(
        new URL(
          "/api/v1/supplier/supplier/details_of_major_order_list",
          themeConfig.backendUrl
        )
      )
      .then((response) => {
        setOrder(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const verifyMsme = (msmeNumber) => {
    const isValidFormat = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(msmeNumber);
    if (!isValidFormat) {
      setMsmeError(true);
      setTick();
      setMsmeMsg();
    } else {
      setMsmeError(false);
      setmsmeLoading(true);
      const sendData = {
        msmeNo: msmeNumber,
      };
      axios
        .post(
          new URL("/api/v1/admin/msme/getMsmeDetails", themeConfig.backendUrl),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res?.data?.message);
            setmsmeLoading(false);
            setMsmeMsg(res?.data?.message);
            if (res?.data?.message == "Invalid UAN") {
              setTick(0);
            }
          } else {
            toast.success(res.data.message);
            setMsmeMsg(res?.data?.data?.main_details?.name_of_enterprise);
            console.log(res?.data?.data?.main_details?.name_of_enterprise);
            setMsmeType(
              res?.data?.data?.main_details?.enterprise_type_list[0]
                ?.enterprise_type
            );
            setmsmeLoading(false);
            setTick(1);
          }
        })
        .catch((error) => {
          setmsmeLoading(false);
          console.error("Error fetching data:", error);
        });
    }
  };

  const getConfiguration = () => {
    const data = {
      module_name: "supplier_registration",
      group_name: "businessDetails",
    };
    axios
      .post(
        new URL(
          "/api/v1/workFlow/fieldConfig/getfieldnames",
          themeConfig.backendUrl
        ),
        data
      )

      .then((res) => {
        const d = res.data.data;
        const configObject = {};
        d?.forEach((item) => {
          configObject[item.key] = item.display;
        });
        setConfig(configObject);
        if (res.data.error) {
          toast.error(res.data.message);
        }
        const requiredObject = {};
        d?.forEach((item) => {
          requiredObject[item.key] = item.required;
        });
        setRequired(requiredObject);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };
  const getMsmeList = () => {
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
  const handleChange = (event) => {
    reset({ ...getValues(), msme_no: "", msmeType: {} });
    setTick();
    setMsmeMsg();
    setIsMSME(event.target.checked);
    if (event.target.value === "yes") {
      setRequired((prev) => ({
        ...prev,
        msme_no: "1",
        msmeType: "1",
      }));
      setFieldConfig((prevFormData) => ({
        ...prevFormData,
        businessDetails: {
          ...prevFormData.businessDetails,
          msme_no: true,
          msmeType: true,
        },
      }));
    } else {
      setRequired((prev) => ({
        ...prev,
        msme_no: "0",
        msmeType: "0",
      }));
      setFieldConfig((prevFormData) => ({
        ...prevFormData,
        businessDetails: {
          ...prevFormData.businessDetails,
          msme_no: false,
          msmeType: false,
        },
      }));
    }
  };

  useEffect(() => {
    getMsmeList();
    getConfiguration();
    getCustomer();
    console.log("page rendered");
  }, []);
  useEffect(() => {}, [msmeType]);

  const onSubmit = (data) => {
    if (msmeType) {
      data.msmeType = { label: msmeType, value: msmeType };
    }
    console.log(data, "submit");
    dispatch(handleBusinessDetails(data));

    if (isObjEmpty(errors)) {
      stepper.next();
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {config ? (
            config.companyFoundYear === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="companyFoundYear">
                  Company Founded Year
                  {required && required.companyFoundYear === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="companyFoundYear"
                  name="companyFoundYear"
                  control={control}
                  render={({ field }) => (
                    <Input
                      minLength={4}
                      maxLength={4}
                      type="number"
                      placeholder="Company Founded Year"
                      invalid={errors.companyFoundYear && true}
                      {...field}
                    />
                  )}
                />
                {errors.companyFoundYear && (
                  <FormFeedback style={{ display: "block" }}>
                    Comapny Found Year is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.promoterName === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="promoterName">
                  Promoter / Director Name
                  {required && required.promoterName === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="promoterName"
                  name="promoterName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Director Name"
                      invalid={errors.promoterName && true}
                      {...field}
                    />
                  )}
                />
                {errors.promoterName && (
                  <FormFeedback style={{ display: "block" }}>
                    Promoter Name is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.companyType === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="companyType">
                  Company Type
                  {required && required.companyType === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  name="companyType"
                  control={control} // Set the default value here if you want
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        isClearable
                        id={`nameOfBusiness`}
                        className={`react-select ${
                          errors.source && "is-invalid"
                        }`}
                        classNamePrefix="select"
                        options={companyTypeOptions}
                        {...field}
                      />
                      {errors.nameOfBusiness && (
                        <FormFeedback style={{ display: "block" }}>
                          Company type is required
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>

        <Row>
          {config ? (
            config.nameOfBusiness === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="nameOfBusiness">
                  Name of the Business / Corporate Group
                  {required && required.nameOfBusiness === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="nameOfBusiness"
                  name="nameOfBusiness"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Name of Business"
                      invalid={errors.nameOfBusiness && true}
                      {...field}
                    />
                  )}
                />
                {errors.nameOfBusiness && (
                  <FormFeedback style={{ display: "block" }}>
                    Business Name is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.businessType === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="businessType">
                  Business Type
                  {required && required.businessType === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  name="businessType"
                  control={control} // Set the default value here if you want
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        isClearable
                        id={`nameOfBusiness`}
                        className={`react-select ${
                          errors.source && "is-invalid"
                        }`}
                        classNamePrefix="select"
                        options={businessTypeOptions}
                        {...field}
                      />
                      {errors.nameOfBusiness && (
                        <FormFeedback style={{ display: "block" }}>
                          Business Type is required
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.addressOfPlant === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="addressOfPlant">
                  Address
                  {required && required.addressOfPlant === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="addressOfPlant"
                  name="addressOfPlant"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Address of Plant / Workshop"
                      invalid={errors.addressOfPlant && true}
                      {...field}
                    />
                  )}
                />
                {errors.addressOfPlant && (
                  <FormFeedback style={{ display: "block" }}>
                    Address of Plant is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>
        <Row>
          {config ? (
            config.nameOfOtherGroupCompanies === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="nameOfOtherGroupCompanies">
                  Name of Other Group Companies
                  {required && required.nameOfOtherGroupCompanies === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="nameOfOtherGroupCompanies"
                  name="nameOfOtherGroupCompanies"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Name of Other Group Companies"
                      invalid={errors.nameOfOtherGroupCompanies && true}
                      {...field}
                    />
                  )}
                />
                {errors.nameOfOtherGroupCompanies && (
                  <FormFeedback style={{ display: "block" }}>
                    Comapny name is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.listOfMajorCustomers === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="listOfMajorCustomers">
                  List of Major Customers
                  {required && required.listOfMajorCustomers === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="listOfMajorCustomers"
                  name="listOfMajorCustomers"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable
                      classNamePrefix="select"
                      options={customer.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      invalid={errors.listOfMajorCustomers && true}
                      {...field}
                    />
                  )}
                />
                {errors.listOfMajorCustomers && (
                  <FormFeedback style={{ display: "block" }}>
                    Major customers are required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {config ? (
            config.detailsOfMajorLastYear === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="detailsOfMajorLastYear">
                  Details of Major Order undertaken in last 5 Years
                  {required && required.detailsOfMajorLastYear === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="detailsOfMajorLastYear"
                  name="detailsOfMajorLastYear"
                  control={control}
                  render={({ field }) => (
                    <Select
                      theme={selectThemeColors}
                      isClearable
                      classNamePrefix="select"
                      options={order?.map((option) => {
                        return {
                          label: option.name,
                          value: option.id,
                        };
                      })}
                      placeholder="Select"
                      invalid={errors.detailsOfMajorLastYear && true}
                      {...field}
                    />
                  )}
                />
                {errors.detailsOfMajorLastYear && (
                  <FormFeedback style={{ display: "block" }}>
                    Details are required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <Col md={12} className="mb-md- mb-1">
            <div className="d-flex gap-1">
              <Label style={{ marginRight: "10px" }}>MSME Required ? </Label>
              {/* <Input
              id="subject"
              name="subject"
              type="checkbox"
              checked={isMSME}
              onChange={(event) => {
                setMsmeType(null)
                handleChange(event)}}
            /> */}
              <FormGroup check>
                <Input
                  name="msmeRadioBtn"
                  type="radio"
                  value="yes"
                  required
                  onChange={(event) => {
                    setMsmeType(null);
                    handleChange(event);
                  }}
                />
                <Label check>Yes</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  name="msmeRadioBtn"
                  type="radio"
                  value="no"
                  required
                  onChange={(event) => {
                    setMsmeType(null);
                    handleChange(event);
                  }}
                />
                <Label check>No</Label>
              </FormGroup>
            </div>
          </Col>
          {config ? (
            config.msme_no === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Label className="form-label" for="msme_no">
                  MSME No
                  {required && required.msme_no === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                  {tick === 1 ? <Verified color="success" /> : ""}
                  {tick === 0 ? <Cancel color="error" /> : ""}
                </Label>
                <Controller
                  id="msme_no"
                  name="msme_no"
                  control={control}
                  render={({ field }) => (
                    <Input
                      maxLength={19}
                      minLength={19}
                      disabled={required.msme_no === "1" ? false : true}
                      placeholder="UDYAM-DL-02-1234567"
                      invalid={errors.msme_no && true}
                      {...field}
                    />
                  )}
                />
                {msmeError ? (
                  <FormFeedback style={{ display: "block" }}>
                    Enter a proper MSME number in the correct format (e.g.,
                    UDYAM-XX-00-0000000)
                  </FormFeedback>
                ) : (
                  ""
                )}
                {msmeMsg ? (
                  tick === 1 ? (
                    <p>{msmeMsg}</p>
                  ) : (
                    <FormFeedback style={{ display: "block" }}>
                      {msmeMsg}
                    </FormFeedback>
                  )
                ) : (
                  ""
                )}
                {errors.msme_no && (
                  <FormFeedback style={{ display: "block" }}>
                    MSME No is required
                  </FormFeedback>
                )}
                {required.msme_no === "1" ? (
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <Button
                      disabled={msmeLoading ? true : false}
                      onClick={() => {
                        verifyMsme(control._formValues.msme_no);
                      }}
                      className="mt-1"
                      color="primary"
                      outline
                    >
                      Verify MSME
                    </Button>
                    {msmeLoading ? (
                      <div
                        style={{
                          marginLeft: "10px",
                          display: "flex",
                          marginTop: "8px",
                          alignItems: "center",
                        }}
                      >
                        <Spinner size={"sm"} color="primary" />
                        <span style={{ marginLeft: "5px" }}>Verifying...</span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <Col md="4" sm="12" className="mb-1">
            <Label className="form-label" for="msmeType">
              MSME Type
              {required && required.msmeType === "1" ? (
                <span className="text-danger">*</span>
              ) : (
                ""
              )}
            </Label>
            {/* <Input name="msmeType" value={msmeType} /> */}
            {/* <Controller
              name="msmeType"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    value={{ label: msmeType, value: msmeType }}
                    theme={selectThemeColors}
                    menuPlacement="top"
                    isClearable
                    isDisabled={required?.msmeType === "1" ? false : true}
                    id={`msmeType`}
                    className={`react-select ${
                      errors.msmeType && "is-invalid"
                    }`}
                    classNamePrefix="select"
                    options={msmeOptions?.map((option) => {
                      return {
                        label: option.min_ind + "-" + option.Description,
                        value: option.id,
                      };
                    })}
                    {...field}
                  />
                  {errors.msmeType && (
                    <FormFeedback style={{ display: "block" }}>
                      Select MSME Type
                    </FormFeedback>
                  )}
                </>
              )}
            /> */}
            <Input
              defaultValue={msmeType}
              theme={selectThemeColors}
              menuPlacement="top"
              // isDisabled={required?.msmeType !== "1"}
              disabled={true}
              id="msmeType"
              className={`react-select ${errors.msmeType ? "is-invalid" : ""}`}
              classNamePrefix="select"
              // options={msmeOptions?.map((option) => ({
              //   label: `${option.min_ind}-${option.Description}`,
              //   value: option.id,
              // }))}
              // onChange={(selectedOption) => {
              //   setMsmeType(selectedOption ? selectedOption : null);
              //   {
              //     console.log(selectedOption);
              //   }
              // }}
            />
            {/* {errors.msmeType && (
              <FormFeedback style={{ display: "block" }}>
                Select MSME Type
              </FormFeedback>
            )}  */}

            {/* <Input
              theme={selectThemeColors}
              menuPlacement="top"
              isClearable
              isDisabled={required?.msmeType === "1" ? false : true}
              id={`msmeType`}
              className={`react-select ${errors.msmeType && "is-invalid"}`}
              classNamePrefix="select"
              defaultValue={msmeType}
            /> */}
          </Col>
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
            {processing ? (
              <Spinner size={"sm"} />
            ) : (
              <span className="align-middle d-sm-inline-block d-none">
                Next
              </span>
            )}

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

export default BusinessDetails;
