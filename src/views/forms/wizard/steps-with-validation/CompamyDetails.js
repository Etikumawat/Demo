// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Utils
import { isObjEmpty, selectThemeColors } from "@utils";
import toast from "react-hot-toast";
import axios from "axios";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Flip } from "react-toastify";
import themeConfig from "../../../../configs/themeConfig";
// ** Third Party Components
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Spinner } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
//** Use Redux Toolkit */
import { useDispatch } from "react-redux";
import { handleCompanyDetails } from "@store/supplierRegistration";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
// ** Reactstrap Imports
import { PhoneAndroid } from "@mui/icons-material";
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

import func from "../../../../custom/functions";

const CompamyDetails = ({ stepper, data }) => {
  const [config, setConfig] = useState();
  const [required, setRequired] = useState();
  const [processing, setProcessing] = useState(false);
  const [existsMail, setExistsMail] = useState(false);
  const conditionalValidation = func.conditionalValidation;
  const fieldsConfig = data ? data.fieldsConfig : [];
  // const fieldsConfig = data.fieldsConfig;
  const addresses = [];
  if (data.gstRegistered) {
    data.identityResponse.addresses.map((obj, index) => {
      addresses.push({
        value: index,
        label: `${obj.street_no}, ${obj.address1}, ${obj.city}, ${obj.state}`,
        data: obj,
      });
    });
  }
  function extractPanFromGST(gstNo) {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

    if (gstRegex.test(gstNo)) {
      const panNo = gstNo.substr(2, 10);

      return panNo;
    } else {
      return null;
    }
  }
  const [selectdepart, setSelectdepart] = useState("");

  const dispatch = useDispatch();
  const sources = data.sources?.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  const paymentTypes = data.payment_types?.map((obj) => {
    return {
      value: obj.id,
      label: obj.name,
    };
  });

  const countries = data.countries?.map((obj) => {
    return {
      value: obj.country_key,
      label: obj.name,
    };
  });

  const [state, setState] = useState([]);

  const SignupSchema = Yup.object().shape({
    supplier_name: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.supplier_name
    ),

    source: conditionalValidation(
      Yup.object().shape({
        value: Yup.string(),
      }),

      fieldsConfig.companyDetails?.source
    ),

    streetNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.streetNo
    ),

    address1: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.address1
    ),

    address2: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.address2
    ),

    address3: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.address3
    ),

    country: conditionalValidation(
      Yup.object().shape({
        value: Yup.string().optional().min(1),
      }),

      fieldsConfig.companyDetails?.country
    ),

    state: conditionalValidation(
      Yup.object().shape({
        value: Yup.string().optional().min(1),
      }),

      fieldsConfig.companyDetails?.state
    ),

    city: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.city
    ),

    pin: conditionalValidation(Yup.string(), fieldsConfig.companyDetails?.pin),

    phoneNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.phoneNo
    ),

    website: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.website
    ),

    paymentMethod: conditionalValidation(
      Yup.object().shape({
        value: Yup.string().optional().min(1),
      }),

      fieldsConfig.companyDetails?.paymentMethod
    ),

    department: conditionalValidation(
      Yup.object().shape({
        value: Yup.string().optional().min(1),
      }),

      fieldsConfig.companyDetails?.department
    ),

    officeDetails: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.officeDetails
    ),

    aadharNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.aadharNo
    ),

    gstNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.gstNo
    ),

    panNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.panNo
    ),

    cinNo: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.cinNo
    ),
    contactPersonName: conditionalValidation(
      Yup.string().required(),
      fieldsConfig.companyDetails?.contactPersonName
    ),

    designation: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.designation
    ),

    telephone: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.telephone
    ),

    mobile: conditionalValidation(
      Yup.string(),
      fieldsConfig.companyDetails?.mobile
    ),

    emailID: conditionalValidation(
      Yup.string().email(),
      fieldsConfig.companyDetails?.emailID
    ),
  });

  const [open, setOpen] = useState("");

  const [add, setAdd] = useState(addresses[0]);

  const toggle = (id) => {
    open === id ? setOpen() : setOpen(id);
  };

  // ** Hooks
  const defaultValues = {
    source: {
      label: "",
      value: "",
    },
    department: "",
    streetNo: "",
    address1: "",
    address2: "",
    address3: "",
    country: {
      label: data.gstRegistered ? "India" : "",
      value: data.gstRegistered ? "IN" : "",
    },
    state: {
      label: data.gstRegistered ? data.identityResponse.addresses[0].state : "",
      value: data.gstRegistered
        ? data.identityResponse.addresses[0].state_code
        : "",
    },
    city: "",
    pin: "",
    phoneNo: "",
    website: "",
    officeDetails: "",
    aadharNo: "",
    gstNo: data.gstRegistered ? data.identityResponse.gstno : "",
    panNo: data.gstRegistered
      ? extractPanFromGST(data.identityResponse.gstno)
      : data.identityResponse.panNo,
    cinNo: "",
    contactPersonName: "",
    designation: "",
    telephone: "",
    mobile: "",
    emailID: "",
    supplier_name: data.gstRegistered
      ? data.identityResponse.trade_name
      : data.identityResponse.name,
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const getConfiguration = () => {
    const data = {
      module_name: "supplier_registration",
      group_name: "companyDetails",
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

  const onSubmit = (data) => {
    setProcessing(true);
    const params = {
      email: data.emailID,
    };
    // dispatch(handleCompanyDetails(data));
    // if (isObjEmpty(errors)) {
    //   setProcessing(false);
    //   stepper.next();
    // }
    axios
      .post(
        new URL("/api/v1/supplier/supplier/checkmail", themeConfig.backendUrl),
        params
      )
      .then((response) => {
        if (response.data.usedMail) {
          toastify.error(response.data.message, {
            theme: "colored",
          });
          setProcessing(false);
        } else {
          dispatch(handleCompanyDetails(data));
          if (isObjEmpty(errors)) {
            setProcessing(false);
            stepper.next();
          }
        }
      });
  };
  const [department, setDepartment] = useState([]);
  const [mobile, setMobile] = useState([]);
  const [phone, setPhone] = useState("");
  const getApi = () => {
    axios
      .post(
        new URL(
          "/api/v1/admin/departmentPortalCode/list",
          themeConfig.backendUrl
        )
      )
      .then((response) => {
        if (response.data.err) {
          toast.error(response.data.err);
        } else {
          setDepartment(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    getConfiguration();
    getApi();

    if (data.gstRegistered) {
      handleAdd(addresses[0].data);
    }
  }, []);

  const handleAdd = (data) => {
    setValue("streetNo", data.street_no);
    setValue("address1", data.address1);
    setValue("address2", data.address2);
    setValue("address3", data.address3);
    setValue("city", data.city);
    setValue("pin", data.pincode);
  };

  const headerStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "20px 0px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
  return (
    <Fragment>
      {/* <div className="content-header">
        <h5 className="mb-0">Company Details</h5>

        <small className="text-muted">Enter Your Company Details.</small>
      </div> */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="coloured"
        transition={Flip}
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="4" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="streetNo">
              Supplier Name<span className="red">*</span>
            </Label>

            <Controller
              id="streetNo"
              name="supplier_name"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={true}
                  placeholder="Supplier Name"
                  invalid={errors.streetNo && true}
                  {...field}
                />
              )}
            />

            {errors.supplier_name && (
              <FormFeedback style={{ display: "block" }}>
                Supplier name is required
              </FormFeedback>
            )}
          </Col>

          {data.gstRegistered ? (
            <Col md="3" sm="12" className="mb-1 mt-1">
              <Label className="form-label" for="gstNo">
                GST No.
              </Label>

              <Controller
                id="gstNo"
                name="gstNo"
                control={control}
                render={({ field }) => (
                  <Input
                    disabled={true}
                    placeholder="GST No."
                    invalid={errors.gstNo && true}
                    {...field}
                  />
                )}
              />

              {errors.gstNo && (
                <FormFeedback style={{ display: "block" }}>
                  GST No. is required
                </FormFeedback>
              )}
            </Col>
          ) : (
            <Col md="4" sm="12" className="mb-1 mt-1">
              <Label className="form-label" for="panNo">
                PAN No
              </Label>

              <Controller
                id="panNo"
                name="panNo"
                control={control}
                render={({ field }) => (
                  <Input
                    disabled={true}
                    placeholder="PAN No"
                    invalid={errors.panNo && true}
                    {...field}
                  />
                )}
              />

              {errors.panNo && (
                <FormFeedback style={{ display: "block" }}>
                  PAN No. is required
                </FormFeedback>
              )}
            </Col>
          )}
          {data.gstRegistered ? (
            <Col md="4" sm="12" className="mb-1 mt-1">
              <Label className="form-label" for="panNo">
                PAN No.
              </Label>

              <Controller
                id="panNo"
                name="panNo"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="PAN No"
                    disabled={true}
                    invalid={errors.panNo && true}
                    {...field}
                  />
                )}
              />

              {errors.panNo && (
                <FormFeedback style={{ display: "block" }}>
                  PAN No. is required
                </FormFeedback>
              )}
            </Col>
          ) : (
            ""
          )}

          {data.gstRegistered ? (
            <>
              <Col md="12" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="add">
                  Select Address
                </Label>

                <Controller
                  name="add"
                  control={control}
                  defaultValue={add} // Set the default value here if you want
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`add`}
                        // className={`react-select ${errors.source && "is-invalid"}`}

                        classNamePrefix="select"
                        options={addresses}
                        value={add}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);

                          console.log(e);

                          setAdd(e);

                          handleAdd(e.data);
                        }}
                      />

                      {errors.add && (
                        <FormFeedback style={{ display: "block" }}>
                          Please Select Address
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
            </>
          ) : null}

          <Col md="6" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="source">
              Source
            </Label>

            <Controller
              name="source"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Select
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`source`}
                    className={`react-select ${errors.source && "is-invalid"}`}
                    classNamePrefix="select"
                    options={sources}
                    {...field}
                  />

                  {errors.source && (
                    <FormFeedback style={{ display: "block" }}>
                      Please Select source
                    </FormFeedback>
                  )}
                </>
              )}
            />
          </Col>

          <Col md="6" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="source">
              Registering Authority
              {required && required.department === "1" ? (
                <span className="text-danger">*</span>
              ) : (
                ""
              )}
            </Label>

            <Controller
              name="department"
              control={control}
              defaultValue="Default Department Value"
              render={({ field }) => (
                <>
                  <Select
                    theme={selectThemeColors}
                    isClearable
                    id={`department`}
                    className={`react-select ${
                      errors.department && "is-invalid"
                    }`}
                    classNamePrefix="select"
                    value={selectdepart}
                    options={department?.map((option) => {
                      return {
                        label: option.name,
                        value: option.dept_id,
                      };
                    })}
                    {...field}
                  />

                  {errors.department && (
                    <FormFeedback style={{ display: "block" }}>
                      Please Select Registering Authority
                    </FormFeedback>
                  )}
                </>
              )}
            />
          </Col>
          <Col md="3" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="streetNo">
              Street No.
            </Label>

            <Controller
              id="streetNo"
              name="streetNo"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={data.gstRegistered}
                  placeholder="Street No."
                  invalid={errors.streetNo && true}
                  {...field}
                />
              )}
            />

            {errors.streetNo && (
              <FormFeedback style={{ display: "block" }}>
                Street No name is required
              </FormFeedback>
            )}
          </Col>

          <Col md="3" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for={`address1`}>
              Address 1
            </Label>

            <Controller
              control={control}
              id="address1"
              name="address1"
              render={({ field }) => (
                <Input
                  type="text"
                  disabled={data.gstRegistered}
                  placeholder="Address 1"
                  invalid={errors.address1 && true}
                  {...field}
                />
              )}
            />

            {/* {errors.address1 && (
              <FormFeedback style={{ display: "block" }}>
                Address 1 name is required
              </FormFeedback>
            )} */}
          </Col>

          <Col md="3" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="address2">
              Address 2
            </Label>

            <Controller
              id="address2"
              name="address2"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={data.gstRegistered}
                  placeholder="Address 2"
                  invalid={errors.address2 && true}
                  {...field}
                />
              )}
            />

            {errors.address2 && (
              <FormFeedback style={{ display: "block" }}>
                Address 2 name is required
              </FormFeedback>
            )}
          </Col>

          <Col md="3" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for={`address3`}>
              Address 3
            </Label>

            <Controller
              control={control}
              id="address3"
              name="address3"
              render={({ field }) => (
                <Input
                  type="text"
                  disabled={data.gstRegistered}
                  placeholder="Address 3"
                  invalid={errors.address3 && true}
                  {...field}
                />
              )}
            />

            {errors.address3 && (
              <FormFeedback style={{ display: "block" }}>
                Address 3 name is required
              </FormFeedback>
            )}
          </Col>
        </Row>

        <Row>
          <Col md="4" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="country">
              Country
              {required && required.country === "1" ? (
                <span className="text-danger">*</span>
              ) : (
                ""
              )}
            </Label>

            <Controller
              name="country"
              id="country"
              control={control}
              onChange={(e) => {
                // console.log(e)
              }}
              defaultValue="" // Set the default value here if you want
              render={({ field }) => (
                <>
                  <Select
                    isDisabled={data.gstRegistered}
                    theme={selectThemeColors}
                    isClearable={false}
                    defaultValue={"India"}
                    className={`react-select ${errors.country && "is-invalid"}`}
                    classNamePrefix="select"
                    options={countries}
                    {...field}
                    onChange={(e) => {
                      const states = data.states.filter(
                        (val) => val.countryKey == e.value
                      );

                      setState(
                        states.map((val) => ({
                          label: val.stateDesc,

                          value: val.stateKey,
                        }))
                      );

                      field.onChange(e);
                    }}
                  />

                  {errors.country && (
                    <FormFeedback style={{ display: "block" }}>
                      Country is required
                    </FormFeedback>
                  )}
                </>
              )}
            />
          </Col>

          <Col md="4" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="state">
              State/Province/Region
              {required && required.state === "1" ? (
                <span className="text-danger">*</span>
              ) : (
                ""
              )}
            </Label>

            <Controller
              name="state"
              control={control}
              defaultValue="" // Set the default value here if you want
              render={({ field }) => (
                <>
                  <Select
                    isDisabled={data.gstRegistered}
                    theme={selectThemeColors}
                    isClearable={false}
                    id={`state`}
                    className={`react-select ${errors.state && "is-invalid"}`}
                    classNamePrefix="select"
                    options={state}
                    {...field}
                  />

                  {errors.state && (
                    <FormFeedback style={{ display: "block" }}>
                      State is required
                    </FormFeedback>
                  )}
                </>
              )}
            />
          </Col>

          <Col md="4" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="city">
              City
              {required && required.city === "1" ? (
                <span className="text-danger">*</span>
              ) : (
                ""
              )}
            </Label>

            <Controller
              id="city"
              name="city"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={data.gstRegistered}
                  placeholder="City"
                  invalid={errors.city && true}
                  {...field}
                />
              )}
            />

            {errors.city && (
              <FormFeedback style={{ display: "block" }}>
                City is required
              </FormFeedback>
            )}
          </Col>

          <Col md="4" sm="12" className="mb-1 mt-1">
            <Label className="form-label" for="pin">
              Pin/Zip Code
            </Label>

            <Controller
              id="pin"
              name="pin"
              control={control}
              render={({ field }) => (
                <Input
                  disabled={data.gstRegistered}
                  placeholder="---"
                  invalid={errors.pin && true}
                  {...field}
                />
              )}
            />

            {errors.pin && (
              <FormFeedback style={{ display: "block" }}>
                Pin is required
              </FormFeedback>
            )}
          </Col>

          {config ? (
            config.phoneNo === "1" ? (
              <Col md="4" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="phoneNo">
                  Phone No.
                  {required && required.phoneNo === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="phoneNo"
                  name="phoneNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      // defaultCountry="in"
                      placeholder="Phone No."
                      maxLength={10}
                      invalid={errors.phoneNo && true}
                      {...field}
                      inputProps={{
                        style: { width: "100%" },
                      }}
                    />
                  )}
                />
                {errors.phoneNo && (
                  <FormFeedback style={{ display: "block" }}>
                    Phone No. is required
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
            config.website === "1" ? (
              <Col md="4" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="website">
                  Website
                  {required && required.website === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="website"
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Website"
                      invalid={errors.website && true}
                      {...field}
                    />
                  )}
                />

                {errors.website && (
                  <FormFeedback style={{ display: "block" }}>
                    Website is required
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
            config.paymentMethod === "1" ? (
              <Col md="3" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="paymentMethod">
                  Payment Method
                  {required && required.paymentMethod === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  name="paymentMethod"
                  control={control}
                  defaultValue="" // Set the default value here if you want
                  render={({ field }) => (
                    <>
                      <Select
                        theme={selectThemeColors}
                        isClearable
                        id={`paymentMethod`}
                        className={`react-select ${
                          errors.paymentMethod && "is-invalid"
                        }`}
                        classNamePrefix="select"
                        options={paymentTypes}
                        {...field}
                      />

                      {errors.paymentMethod && (
                        <FormFeedback style={{ display: "block" }}>
                          Payment method is required
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
            config.officeDetails === "1" ? (
              <Col md="3" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="officeDetails">
                  Overseas office details(if any)
                  {required && required.officeDetails === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="officeDetails"
                  name="officeDetails"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder=""
                      invalid={errors.officeDetails && true}
                      {...field}
                    />
                  )}
                />

                {errors.officeDetails && (
                  <FormFeedback style={{ display: "block" }}>
                    Office details is required
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
            config.aadharNo === "1" ? (
              <Col md="3" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="aadharNo">
                  Aadhar Card Number
                  {required && required.aadharNo === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="aadharNo"
                  name="aadharNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      minLength={12}
                      maxLength={12}
                      placeholder="Aadhar Card Number"
                      invalid={errors.aadharNo && true}
                      {...field}
                    />
                  )}
                />

                {errors.aadharNo && (
                  <FormFeedback style={{ display: "block" }}>
                    Adharcard No. is required
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
            config.cinNo === "1" ? (
              <Col md="3" sm="12" className="mb-1 mt-1">
                <Label className="form-label" for="cinNo">
                  CIN No.
                  {required && required.cinNo === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="cinNo"
                  name="cinNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="CIN No."
                      invalid={errors.cinNo && true}
                      {...field}
                    />
                  )}
                />

                {errors.cinNo && (
                  <FormFeedback style={{ display: "block" }}>
                    CIN No. is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <div>
            <h4 color="primary" style={headerStyle}>
              <PhoneAndroid /> Contact Details
            </h4>
          </div>

          {config ? (
            config.contactPersonName === "1" ? (
              <Col md="4" className="mb-1">
                <Label className="form-label" for="contactPersonName">
                  Contact Person Name
                  {required && required.contactPersonName === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="contactPersonName"
                  name="contactPersonName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Contact Person Name"
                      invalid={errors.contactPersonName && true}
                      {...field}
                    />
                  )}
                />

                {errors.contactPersonName && (
                  <FormFeedback style={{ display: "block" }}>
                    Person Name is required
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
            config.designation === "1" ? (
              <Col md="4" className="mb-1">
                <Label className="form-label" for="designation">
                  Designation
                  {required && required.designation === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="designation"
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Designation"
                      invalid={errors.designation && true}
                      {...field}
                    />
                  )}
                />

                {errors.designation && (
                  <FormFeedback style={{ display: "block" }}>
                    Designation is required
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
            config.telephone === "1" ? (
              <Col md="4" className="mb-1">
                <Label className="form-label" for="telephone">
                  Telephone
                  {required && required.telephone === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="telephone"
                  name="telephone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Telephone"
                      invalid={errors.telephone && true}
                      {...field}
                    />
                  )}
                />

                {errors.telephone && (
                  <FormFeedback style={{ display: "block" }}>
                    Telephone is required
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
            config.mobile === "1" ? (
              <Col md="4" className="mb-1 mt-1">
                <Label className="form-label" for="mobile">
                  Mobile
                  {required && required.mobile === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  id="mobile"
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <Input
                      inputProps={{
                        style: { width: "100%" },
                      }}
                      // defaultCountry="in"
                      maxLength={10}
                      placeholder="Mobile No."
                      invalid={errors.mobile && true}
                      {...field}
                    />
                  )}
                />

                {errors.mobile && (
                  <FormFeedback style={{ display: "block" }}>
                    Mobile is required
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
            config.emailID === "1" ? (
              <Col md="4" className="mb-1 mt-1">
                <Label className="form-label" for="emailID">
                  Email ID
                  {required && required.emailID === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>

                <Controller
                  id="emailID"
                  name="emailID"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Email ID"
                      invalid={errors.emailID && true}
                      {...field}
                    />
                  )}
                />
                <p>
                  <span className="text-danger">*</span> Credentials will be
                  sent in this Mail
                </p>
                {errors.emailID && (
                  <FormFeedback style={{ display: "block" }}>
                    Email Id is required
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

        <div className="d-flex justify-content-between">
          <Button color="secondary" className="btn-prev" outline disabled>
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

export default CompamyDetails;
