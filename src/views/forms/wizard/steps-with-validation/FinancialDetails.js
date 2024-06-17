// ** React Imports
import { Fragment, useState } from "react";

// ** Utils
import { isObjEmpty, selectThemeColors } from "@utils";

// ** Third Party Components
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import func from "../../../../custom/functions";
import { useEffect } from "react";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";

//** Use Redux Toolkit */
import { useDispatch } from "react-redux";
import { handleFinancialDetails } from "@store/supplierRegistration";
import { AccountBalance, Cancel, Verified } from "@mui/icons-material";
// ** Reactstrap Imports
import {
  Form,
  Label,
  Input,
  Row,
  Col,
  Button,
  FormFeedback,
  Spinner,
} from "reactstrap";
import { beginMarkedContent } from "pdf-lib";

const FinancialDetails = ({ stepper, data }) => {
  const ttt = "etiiii";
  const [config, setConfig] = useState();
  const [required, setRequired] = useState();
  const conditionalValidation = func.conditionalValidation;
  const dispatch = useDispatch();
  const [bankMsg, setBankMsg] = useState();
  const [bankResponse, setBankResponse] = useState({});
  const [beneficiearyName, setBeneficiearyName] = useState();
  const [validationMsg, setValidationMsg] = useState({
    acnumbermsg: "",
    ifscmsg: "",
  });
  const [bankError, setBankError] = useState();
  const [verifyLoading, setVerifyLoading] = useState();
  const [tick, setTick] = useState();
  const fieldsConfig = data.fieldsConfig;
  const [defaultValues, setDefaultValues] = useState({
    Turnover: "",
    Turnover2: "",
    Turnover3: "",
    first: "",
    second: "",
    third: "",
    afterfirst: "",
    aftersecond: "",
    afterthird: "",
    presentorder: "",
    furtherorder: "",
    market: "",
    networth: "",
    p_bank_name: "",
    p_bank_account_number: "",
    p_bank_account_holder_name: beneficiearyName,
    p_bank_state: "",
    p_bank_address: "",
    p_bank_branch: "",
    p_ifsc_code: "",
    p_micr_code: "",
    p_bank_guarantee_limit: "",
    p_overdraft_cash_credit_limit: "",
    s_bank_name: "",
    s_bank_account_number: "",
    s_bank_account_holder_name: "",
    s_bank_state: "",
    s_bank_address: "",
    s_bank_branch: "",
    s_ifsc_code: "",
    s_micr_code: "",
    s_bank_guarantee_limit: "",
    s_overdraft_cash_credit_limit: "",
  });
  const SignupSchema = Yup.object().shape({
    currency: conditionalValidation(
      Yup.object()
        .shape({
          value: Yup.string().optional().min(1),
          label: Yup.string().optional(), // Assuming label is also optional
        })
        .default({
          label: "INR",
          value: "47",
        }), // Replace 'yourDefaultValue' and 'Your Default Label' with the default values you want
      fieldsConfig?.financialDetails?.currency
    ),

    Turnover: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.Turnover
    ),
    Turnover2: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.Turnover2
    ),
    Turnover3: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.Turnover3
    ),
    first: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.first
    ),
    second: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.second
    ),
    third: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.third
    ),
    afterfirst: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.afterfirst
    ),
    aftersecond: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.aftersecond
    ),
    afterthird: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.afterthird
    ),
    presentorder: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.presentorder
    ),
    furtherorder: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.furtherorder
    ),
    market: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.market
    ),
    networth: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.networth
    ),
    //primary bank details
    p_bank_name: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_name
    ),
    p_bank_account_number: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_account_number
    ),
    p_bank_account_holder_name: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_account_holder_name
    ),
    p_bank_state: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_state
    ),
    p_bank_address: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_address
    ),
    p_bank_branch: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_branch
    ),
    p_ifsc_code: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_ifsc_code
    ),
    p_micr_code: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_micr_code
    ),

    p_bank_guarantee_limit: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_bank_guarantee_limit
    ),
    p_overdraft_cash_credit_limit: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.p_overdraft_cash_credit_limit
    ),
    //secondary bank details
    s_bank_name: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_name
    ),
    s_bank_account_number: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_account_number
    ),
    s_bank_account_holder_name: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_account_holder_name
    ),
    s_bank_state: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_state
    ),
    s_bank_address: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_address
    ),
    s_bank_branch: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_branch
    ),
    s_ifsc_code: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_ifsc_code
    ),
    s_micr_code: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_micr_code
    ),

    s_bank_guarantee_limit: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_bank_guarantee_limit
    ),
    s_overdraft_cash_credit_limit: conditionalValidation(
      Yup.string(),
      fieldsConfig?.financialDetails?.s_overdraft_cash_credit_limit
    ),
  });
  // ** Hooks
  const verifyBank = (data) => {
    const isValidIFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc_code);
    const isValidaccountnumber = /^[0-9]{9,18}$/.test(data.account_number);
    if (isValidIFSC && isValidaccountnumber) {
      setBankError(true);
      setTick();
      setBankMsg();
      setValidationMsg();
      setBankError(false);
      setVerifyLoading(true);
      const sendData = {
        account_number: data.account_number,
        ifsc_code: data.ifsc_code,
      };
      console.log(sendData);
      axios
        .post(
          new URL(
            "/api/v1/services/zoop/bank/verifyAccount",
            themeConfig.backendUrl
          ),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            console.log(res.data);
            toast.error(res.data.message);
            if (typeof res?.data?.data === "object") {
              // res?.data?.data is an object
              console.log("res?.data?.data is an object");
            } else {
              // res?.data?.data is not an object
              setBankMsg(res?.data?.data || "");
              console.log("res?.data?.data is not an object");
            }
            setVerifyLoading(false);
            setTick(0);
          } else {
            toast.success(res.data.message);
            setBankMsg(res?.data?.data?.beneficiary_name);
            setBeneficiearyName(res.data.data.beneficiary_name);
            setDefaultValues({
              ...defaultValues,
              p_bank_account_holder_name: res.data.data.beneficiary_name,
            });
            setTick(1);
            setVerifyLoading(false);
          }
        })
        .catch((error) => {
          setVerifyLoading(false);
          toast.error("Network Error");
          console.error("Error fetching data:", error);
        });
    } else {
      setValidationMsg({
        ...validationMsg,
        ifscmsg: isValidIFSC ? "" : "Invalid IFSC format",
        acnumbermsg: isValidaccountnumber ? "" : "Invalid A/C No format",
      });
      setBankMsg("Enter A/C Number and IFSC Code to Verify");
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });
  const [currency, setCurrency] = useState([]);
  const getCurrency = () => {
    axios
      .post(new URL("/api/v1/admin/currency/get", themeConfig.backendUrl))
      .then((response) => {
        setCurrency(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const getConfiguration = () => {
    const data = {
      module_name: "supplier_registration",
      group_name: "financialDetails",
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

  useEffect(() => {
    getConfiguration();
    getCurrency();
  }, []);

  useEffect(() => {}, [defaultValues, beneficiearyName]);

  const onSubmit = (data) => {
    data.p_bank_account_holder_name = beneficiearyName ? beneficiearyName : "";
    console.log(data, "dataa");
    dispatch(handleFinancialDetails(data));
    if (isObjEmpty(errors)) {
      stepper.next();
    }
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
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          {config ? (
            config.currency === "1" ? (
              <Col md="6" sm="12" className="mb-1">
                <Label className="form-label" for="currency">
                  Currency
                  {required && required.currency === "1" ? (
                    <span className="text-danger">*</span>
                  ) : (
                    ""
                  )}
                </Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Select
                        defaultValue={{
                          label: "INR",
                          value: "47",
                        }}
                        theme={selectThemeColors}
                        isClearable={false}
                        id={`currency`}
                        className={`react-select ${
                          errors.currency && "is-invalid"
                        }`}
                        classNamePrefix="select"
                        options={currency.map((option) => {
                          return {
                            label: option.name,
                            value: option.id,
                          };
                        })}
                        {...field}
                      />
                      {errors.currency && (
                        <FormFeedback style={{ display: "block" }}>
                          Please Select Currency
                        </FormFeedback>
                      )}
                      {/* {console.log(currency, "currency")} */}
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
          <Col md="12"></Col>

          {config ? (
            config.Turnover3 === "1" ? (
              <>
                <Col md="3" sm="12" className="mb-1">
                  <Label className="form-label" for="Turnover">
                    Annual Turnover of last 3 years
                    {required && required.Turnover3 === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="Turnover"
                    name="Turnover"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="First Year Turnover"
                        invalid={errors.Turnover && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.Turnover && (
                    <FormFeedback style={{ display: "block" }}>
                      Turnover is required
                    </FormFeedback>
                  )}
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    id="Turnover2"
                    name="Turnover2"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Second Year Turnover"
                        invalid={errors.Turnover2 && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.Turnover2 && (
                    <FormFeedback style={{ display: "block" }}>
                      Turnover 2 is required
                    </FormFeedback>
                  )}
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="Turnover3"
                    name="Turnover3"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Third Year Turnover"
                        invalid={errors.Turnover3 && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.Turnover3 && (
                    <FormFeedback style={{ display: "block" }}>
                      Turnover 3 is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>

        <Row>
          {config ? (
            config.Turnover2 === "1" ? (
              <>
                <Col md="3" sm="12" className="mb-1">
                  <Label className="form-label" for="Turnover">
                    Profit before tax of last 3 years
                    {required && required.Turnover2 === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="first"
                    name="first"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="First Year Profit"
                        invalid={errors.first && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.first && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit before tax is required
                    </FormFeedback>
                  )}
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    id="second"
                    name="second"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Second Year Profit"
                        invalid={errors.second && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.second && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit before tax is required
                    </FormFeedback>
                  )}
                </Col>

                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="third"
                    name="third"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Third Year Profit"
                        invalid={errors.third && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.third && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit before tax is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>

        <Row>
          {config ? (
            config.Turnover === "1" ? (
              <>
                {" "}
                <Col md="3" sm="12" className="mb-1">
                  <Label className="form-label" for="Turnover">
                    Profit after tax of last 3 years
                    {required && required.Turnover === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                </Col>
                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="afterfirst"
                    name="afterfirst"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="First Year Profit"
                        invalid={errors.afterfirst && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.afterfirst && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit after tax is required
                    </FormFeedback>
                  )}
                </Col>
                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    id="aftersecond"
                    name="aftersecond"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Second Year Profit"
                        invalid={errors.aftersecond && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.aftersecond && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit after tax is required
                    </FormFeedback>
                  )}
                </Col>
                <Col md="3" sm="12" className="mb-1">
                  <Controller
                    control={control}
                    id="afterthird"
                    name="afterthird"
                    render={({ field }) => (
                      <Input
                        type="text"
                        placeholder="Third Year Profit"
                        invalid={errors.afterthird && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.afterthird && (
                    <FormFeedback style={{ display: "block" }}>
                      Profit after tax is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>

        <Row>
          {config ? (
            config.presentorder === "1" ? (
              <Col md="6" sm="12" className="mb-1">
                <Controller
                  id="presentorder"
                  name="presentorder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Present order booking value"
                      invalid={errors.presentorder && true}
                      {...field}
                    />
                  )}
                />
                {errors.presentorder && (
                  <FormFeedback style={{ display: "block" }}>
                    Present order booking is required
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
            config.furtherorder === "1" ? (
              <Col md="6" sm="12" className="mb-1">
                <Controller
                  id="furtherorder"
                  name="furtherorder"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Further order booking value"
                      invalid={errors.furtherorder && true}
                      {...field}
                    />
                  )}
                />
                {errors.furtherorder && (
                  <FormFeedback style={{ display: "block" }}>
                    Further order booking is required
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
            config.market === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Controller
                  id="market"
                  name="market"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Market Capital"
                      invalid={errors.market && true}
                      {...field}
                    />
                  )}
                />
                {errors.market && (
                  <FormFeedback style={{ display: "block" }}>
                    market is required
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
            config.networth === "1" ? (
              <Col md="4" sm="12" className="mb-1">
                <Controller
                  id="networth"
                  name="networth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Networth"
                      invalid={errors.networth && true}
                      {...field}
                    />
                  )}
                />
                {errors.networth && (
                  <FormFeedback style={{ display: "block" }}>
                    Networth is required
                  </FormFeedback>
                )}
              </Col>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          {/* <Col md="4" sm="12" className="mb-1">
            <Label className="form-label" for="country">
              Listed with any stock exchange
            </Label>
            <div class="demo-inline-spacing">
              <div class="form-check">
                <input
                  id="ex1-active"
                  name="ex1"
                  type="radio"
                  class="form-check-input"
                  checked=""
                />
                <label for="ex1-active" class="form-check-label form-label">
                  Yes
                </label>
              </div>
              <div class="form-check">
                <input
                  id="ex1-active"
                  name="ex1"
                  type="radio"
                  class="form-check-input"
                  checked=""
                />
                <label for="ex1-active" class="form-check-label form-label">
                  No
                </label>
              </div>
            </div>
          </Col> */}
        </Row>

        <div>
          <h4 color="primary" style={headerStyle}>
            <AccountBalance /> Primary Bank Details
          </h4>
        </div>
        <Row>
          {config ? (
            config.p_bank_account_number === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="bankAcNo">
                    Account No.
                    {required && required.p_bank_account_number === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                    {tick === 1 ? <Verified color="success" /> : ""}
                    {tick === 0 ? <Cancel color="error" /> : ""}
                  </Label>
                  <Controller
                    id="p_bank_account_number"
                    name="p_bank_account_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="635802010014976"
                        invalid={errors.p_bank_account_number && true}
                        {...field}
                      />
                    )}
                  />
                  {validationMsg?.acnumbermsg ? (
                    <FormFeedback style={{ display: "block" }}>
                      {validationMsg?.acnumbermsg}
                    </FormFeedback>
                  ) : (
                    ""
                  )}
                  {errors.p_bank_account_number && (
                    <FormFeedback style={{ display: "block" }}>
                      Account No. is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_ifsc_code === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="">
                    IFSC Code:
                    {required && required.p_ifsc_code === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                    {tick === 1 ? <Verified color="success" /> : ""}
                    {tick === 0 ? <Cancel color="error" /> : ""}
                  </Label>
                  <Controller
                    id="p_ifsc_code"
                    name="p_ifsc_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="SBIN0125620"
                        invalid={errors.p_ifsc_code && true}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        value={field?.value?.toUpperCase()}
                        // {...field}
                      />
                    )}
                  />
                  {validationMsg?.ifscmsg ? (
                    <FormFeedback style={{ display: "block" }}>
                      {validationMsg?.ifscmsg}
                    </FormFeedback>
                  ) : (
                    ""
                  )}
                  {errors.p_ifsc_code && (
                    <FormFeedback style={{ display: "block" }}>
                      IFSC Code is required
                    </FormFeedback>
                  )}
                </Col>
                {bankMsg ? (
                  tick === 1 ? (
                    <>
                      <p>{bankMsg}</p>
                      {/* <p>{bankResponse}</p> */}
                    </>
                  ) : (
                    <FormFeedback style={{ display: "block" }}>
                      {bankMsg}
                    </FormFeedback>
                  )
                ) : (
                  ""
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <Button
                    onClick={() => {
                      const data = {
                        account_number:
                          control._formValues.p_bank_account_number,
                        ifsc_code: control._formValues.p_ifsc_code,
                      };
                      verifyBank(data);
                    }}
                    className="mt-1"
                    color="primary"
                    outline
                    disabled={verifyLoading ? true : false}
                  >
                    Verify Account
                  </Button>
                  {verifyLoading ? (
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
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_name === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_bank_name">
                    Bank Name
                    {required && required.p_bank_name === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_bank_name"
                    name="p_bank_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="SBI"
                        invalid={errors.p_bank_name && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_bank_name && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Name is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_account_holder_name === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label
                    className="form-label"
                    for="p_bank_account_holder_name"
                  >
                    Account Holder Name
                    {required && required.p_bank_account_holder_name === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  {/* <Controller
                    id="p_bank_account_holder_name"
                    name="p_bank_account_holder_name"
                    control={control}
                    defaultValue={holderName ? holderName : "etiiiiii"}
                    render={({ field }) => (
                      <Input
                        placeholder="Ac Holder Name"
                        invalid={errors.p_bank_account_holder_name && true}
                        {...field}
                      />
                    )}
                  /> */}
                  <Input
                    value={beneficiearyName}
                    onChange={(e) => setBeneficiearyName(e.target.value)}
                    placeholder="Ac Holder Name"
                    invalid={errors.p_bank_account_holder_name && true}
                  />
                  {errors.p_bank_account_holder_name && (
                    <FormFeedback style={{ display: "block" }}>
                      Account Holder Name is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_state === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_bank_state">
                    State:
                    {required && required.p_bank_state === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_bank_state"
                    name="p_bank_state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="state"
                        invalid={errors.p_bank_state && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_bank_state && (
                    <FormFeedback style={{ display: "block" }}>
                      State is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_address === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_bank_address">
                    Address:
                    {required && required.p_bank_address === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_bank_address"
                    name="p_bank_address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="address"
                        invalid={errors.p_bank_address && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_bank_address && (
                    <FormFeedback style={{ display: "block" }}>
                      Address is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_branch === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_bank_branch">
                    Bank Branch:
                    {required && required.p_bank_branch === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_bank_branch"
                    name="p_bank_branch"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Branch"
                        invalid={errors.p_bank_branch && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_bank_branch && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Branch is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_micr_code === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_micr_code">
                    MICR Code:
                    {required && required.p_micr_code === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_micr_code"
                    name="p_micr_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="MICR Code"
                        invalid={errors.p_micr_code && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_micr_code && (
                    <FormFeedback style={{ display: "block" }}>
                      MICR Code is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_bank_guarantee_limit === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="p_bank_guarantee_limit">
                    Bank Guarantee Limit:
                    {required && required.p_bank_guarantee_limit === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_bank_guarantee_limit"
                    name="p_bank_guarantee_limit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Bank guarantee limit"
                        invalid={errors.p_bank_guarantee_limit && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_bank_guarantee_limit && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Guarantee Limit is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.p_overdraft_cash_credit_limit === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="overDraft">
                    Over Draft / Cash Credit Limit:
                    {required &&
                    required.p_overdraft_cash_credit_limit === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="p_overdraft_cash_credit_limit"
                    name="p_overdraft_cash_credit_limit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Over Draft / Cash Credit Limit:"
                        invalid={errors.p_overdraft_cash_credit_limit && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.p_overdraft_cash_credit_limit && (
                    <FormFeedback style={{ display: "block" }}>
                      Over Draft is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </Row>
        <div>
          <h4 color="primary" style={headerStyle}>
            <AccountBalance /> Secondary Bank Details
          </h4>
        </div>

        <Row>
          {" "}
          {config ? (
            config.s_bank_name === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_name">
                    Bank Name:
                    {required && required.s_bank_name === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_name"
                    name="s_bank_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Bank Name"
                        invalid={errors.s_bank_name && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_name && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Name is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_account_number === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_account_number">
                    Account No.
                    {required && required.s_bank_account_number === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_account_number"
                    name="s_bank_account_number"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Account No."
                        invalid={errors.s_bank_account_number && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_account_number && (
                    <FormFeedback style={{ display: "block" }}>
                      Account No. is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_account_holder_name === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label
                    className="form-label"
                    for="s_bank_account_holder_name"
                  >
                    Account Holder Name
                    {required && required.s_bank_account_holder_name === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_account_holder_name"
                    name="s_bank_account_holder_name"
                    control={control}
                    value="seb"
                    render={({ field }) => (
                      <Input
                        placeholder="Ac Holder Name "
                        invalid={errors.s_bank_account_holder_name && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_account_holder_name && (
                    <FormFeedback style={{ display: "block" }}>
                      Account Holder Name is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_state === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_state">
                    State:
                    {required && required.s_bank_state === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_state"
                    name="s_bank_state"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="state"
                        invalid={errors.s_bank_state && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_state && (
                    <FormFeedback style={{ display: "block" }}>
                      State is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_address === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_address">
                    Address:
                    {required && required.s_bank_address === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_address"
                    name="s_bank_address"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="address"
                        invalid={errors.s_bank_address && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_address && (
                    <FormFeedback style={{ display: "block" }}>
                      Address is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_branch === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_branch">
                    Bank Branch:
                    {required && required.s_bank_branch === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_branch"
                    name="s_bank_branch"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Branch"
                        invalid={errors.s_bank_branch && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_branch && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Branch is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_ifsc_code === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_ifsc_code">
                    IFSC Code:
                    {required && required.s_ifsc_code === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_ifsc_code"
                    name="s_ifsc_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="IFSC Code"
                        invalid={errors.s_ifsc_code && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_ifsc_code && (
                    <FormFeedback style={{ display: "block" }}>
                      IFSC Code is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_micr_code === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_micr_code">
                    MICR Code:
                    {required && required.s_micr_code === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_micr_code"
                    name="s_micr_code"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="MICR Code"
                        invalid={errors.s_micr_code && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_micr_code && (
                    <FormFeedback style={{ display: "block" }}>
                      MICR Code is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_bank_guarantee_limit === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label className="form-label" for="s_bank_guarantee_limit">
                    Bank Guarantee Limit:
                    {required && required.s_bank_guarantee_limit === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_bank_guarantee_limit"
                    name="s_bank_guarantee_limit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Bank guarantee limit"
                        invalid={errors.s_bank_guarantee_limit && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_bank_guarantee_limit && (
                    <FormFeedback style={{ display: "block" }}>
                      Bank Guarantee Limit is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
          )}
          {config ? (
            config.s_overdraft_cash_credit_limit === "1" ? (
              <>
                <Col md="4" sm="12" className="mb-1">
                  <Label
                    className="form-label"
                    for="s_overdraft_cash_credit_limit"
                  >
                    Over Draft / Cash Credit Limit:
                    {required &&
                    required.s_overdraft_cash_credit_limit === "1" ? (
                      <span className="text-danger">*</span>
                    ) : (
                      ""
                    )}
                  </Label>
                  <Controller
                    id="s_overdraft_cash_credit_limit"
                    name="s_overdraft_cash_credit_limit"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Over Draft / Cash Credit Limit:"
                        invalid={errors.s_overdraft_cash_credit_limit && true}
                        {...field}
                      />
                    )}
                  />
                  {errors.s_overdraft_cash_credit_limit && (
                    <FormFeedback style={{ display: "block" }}>
                      Over Draft is required
                    </FormFeedback>
                  )}
                </Col>
              </>
            ) : (
              ""
            )
          ) : (
            ""
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

export default FinancialDetails;
