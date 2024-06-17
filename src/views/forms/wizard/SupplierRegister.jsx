import { ArrowLeft, Truck } from "react-feather";
import { Label } from "reactstrap";
import WizardHorizontal from "./WizardHorizontal";
import "../wizard/Animation.css";
import themeConfig from "../../../configs/themeConfig";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
import { toast } from "react-hot-toast";
import logo from "../../../assets/images/logo/logo.png";
import Snackbar from "@mui/material/Snackbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";

const MySwal = withReactContent(Swal);
const Wizard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="card mt-2 p-1 ">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img src={themeConfig.app.appLogoImage} height={35} alt="asd" />
            <h4 className="mx-2">Supplier Registration Form</h4>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </button>
          </div>
        </div>
      </div>
      <WizardHorizontal data={data} />
    </div>
  );
};

const ValiDations = () => {
  const [emailData, setEmailData] = useState(null);
  const [centeredModal, setCenteredModal] = useState(true);
  const [modal, setModal] = useState(emailData != null);
  const [showMail, setShowMail] = useState(true);
  const user = JSON.parse(localStorage.getItem("userData"));
  const [page, setPage] = useState(false);

  const EmailVerification = () => {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");

    const [otpDisabled, setOtptpDisabled] = useState(true);
    const [session, setSession] = useState(null);

    const [processing, setProcessing] = useState(false);

    const handleSend = () => {
      setProcessing(true);
      axios
        .post(
          new URL("/api/v1/supplier/supplier/send-otp", themeConfig.backendUrl),
          {
            email,
          }
        )
        .then((res) => {
          setProcessing(false);
          setOtptpDisabled(true);
          if (res.data.error) {
            return toast.error(res.data.message);
          }
          toast.success(res.data.message);
          setSession(res.data.otp);
          setOtptpDisabled(false);
        });
    };
    const handleOtp = () => {
      const params = {
        email: email,
        otp: otp,
      };
      axios
        .post(
          new URL(
            "/api/v1/supplier/supplier/verify-otp",
            themeConfig.backendUrl
          ),
          params
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setCenteredModal(false);
            setEmailData({
              session,
              email,
            });
            setModal(true);
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
      // if (otp == session) {
      //   setCenteredModal(false);
      //   setEmailData({
      //     session,
      //     email,
      //   });
      //   setModal(true);
      // } else {
      //   toast.error("Invalid OTP. Please enter the correct OTP.");
      // }
    };
    useEffect(() => {
      if (user && user.role_name) {
        if (user.role_name === "Approver" || user.role_name === "Admin") {
          setModal(true);
          setShowMail(false);
        }
      }
    }, [user]);
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={centeredModal}
          // isOpen={false}
          toggle={() => setCenteredModal(!centeredModal)}
          className="modal-dialog-centered"
          backdrop={false}
        >
          {/* <ModalHeader className="text-center">
            Registration for Supplier
          </ModalHeader> */}
          <div className="brand-logo-container">
            <img
              className="supplier-logo"
              src={themeConfig.app.appLogoImage}
              alt="logo"
            />
          </div>
          <ModalBody>
            <div className="row">
              <div className="col-md-8">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    style={{ marginTop: "7px" }}
                    className="form-control"
                    placeholder="someone@gmail.com"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <Label>&nbsp; </Label>
                  <Button
                    color="primary"
                    className="form-control"
                    disabled={processing}
                    onClick={handleSend}
                  >
                    {processing ? (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only"></span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </div>
              <div className="col-md-8 mt-1">
                <div className="form-group">
                  <label>OTP</label>
                  <input
                    className="form-control"
                    disabled={otpDisabled}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    minLength={6}
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" disabled={otpDisabled} onClick={handleOtp}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };

  const GstPan = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState(false);
    const handleClose = (reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };
    const [data, setData] = useState(emailData != null);
    const handleClick = () => {
      setSubmit(false);
      setProcessing(true);
      const sendData = {
        gst_no: gst ? gst : "",
        pan_no: pan ? pan : "",
      };
      axios
        .post(
          new URL(
            "/api/v1/supplier/supplier/supplier_validation",
            themeConfig.backendUrl
          ),
          sendData
        )
        .then((res) => {
          setProcessing(false);
          console.log(res.data);
          if (res.data.error) {
            // setOpen(true);
            MySwal.fire({
              icon: "error",
              title: "Oops...",
              text: "Supplier Already Exists!",
            });
            setMessage(res.data.message);
            console.log(res.data.message);
            setSubmit(true);
          } else {
            goToRegister();
          }
        })
        .catch((error) => {
          setProcessing(false);
          console.error("An error occurred:", error);
        });
    };

    const goToRegister = () => {
      if (response != null) {
        axios
          .post(
            new URL("/api/v1/supplier/onboarding/list", themeConfig.backendUrl)
          )
          .then((res) => {
            console.log(res.data);
            if (res.data.error) {
              return toast.error(res.data.message);
            }
            setPage({
              ...res.data.data,
              identityResponse: response,
              gstRegistered: formState.gstRegistered,
            });
            setModal(false);
          });
        return;
      }
      return toast.error("Please Verify before Submitting.");
    };

    const [processing, setProcessing] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [gst, setGst] = useState("");
    const [pan, setPan] = useState("");
    const [formState, setFormState] = useState({
      gstRegistered: true,
    });

    const [response, setResponse] = useState(null);

    let gstRegex = new RegExp(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
    );
    const [gsterrorMessage, setGSTErrorMessage] = useState();

    const handleVerify = (e) => {
      setVerifyLoading(true);
      e.preventDefault();
      if (formState.gstRegistered) {
        if (gst.length != 15) {
          setVerifyLoading(false);
          // toast.error("Please enter a valid GST Number");
          toast(
            (t) => (
              <div className="d-flex">
                <div className="me-1">
                  <img src={logo} width={40} alt="" className="mt-1" />
                </div>
                <div className="d-flex justify-content-between align-items-center gap-1">
                  <span>Please enter a valid GST Number</span>
                  <div className="d-flex justify-content-between align-items-center"></div>
                </div>
              </div>
            ),
            {
              duration: 3000,
            }
          );
          return;
        }
        axios
          .post(
            new URL(
              "/api/v1/services/masterIndia/gst/verify",
              themeConfig.backendUrl
            ),
            {
              gst,
            }
          )
          .then((res) => {
            setVerifyLoading(false);
            if (res.data.error) {
              return toast.error(res.data.message);
            }
            setResponse(res.data.data);
            setSubmit(true);
          })
          .catch((err) => setVerifyLoading(false));
      } else {
        axios
          .post(
            new URL(
              "/api/v1/services/masterIndia/pan/verify",
              themeConfig.backendUrl
            ),
            {
              pan,
            }
          )
          .then((res) => {
            const panName = res.data.data
              ? res.data.data.name
              : "Couldn't fetch";
            const panNo = res.data.data ? res.data.data.panno : "";
            setProcessing(false);
            if (res.data.error) {
              setVerifyLoading(false);
              return toast.error(res.data.message);
            }
            setVerifyLoading(false);
            setResponse({ name: panName, panNo: panNo });
            setSubmit(true);
          })
          .catch((err) => {
            setProcessing(false);
            setVerifyLoading(false);
          });
      }
    };

    return (
      <>
        <div className="vertically-centered-modal">
          <div className="area">
            <div className="circles">
              <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>

            <Modal
              isOpen={modal}
              // isOpen={true}
              className="modal-dialog-centered bg-primary-light"
              backdrop={false}
            >
              <div className="brand-logo-container">
                <img
                  className="supplier-logo"
                  src={themeConfig.app.appLogoImage}
                  alt="logo"
                />
              </div>
              {/* <ModalHeader>Register with SupplierX</ModalHeader> */}
              <ModalBody>
                <div className="row">
                  <div className="col-md-12 mb-1 mt-1">
                    <div className="form-check form-check-inline">
                      <label
                        htmlFor="basic-cb-checked"
                        className="form-check-label form-label"
                      >
                        GST Registered ?
                      </label>
                      <input
                        id="basic-cb-checked"
                        type="checkbox"
                        className="form-check-input"
                        checked={formState.gstRegistered}
                        onChange={(e) => {
                          setFormState({
                            ...formState,
                            gstRegistered: e.target.checked,
                          });
                          setSubmit(false);
                          setResponse(null);
                          setPan("");
                          setGst("");
                        }}
                      />
                    </div>
                  </div>
                  {formState.gstRegistered ? (
                    <div className="col-md-12 mb-1">
                      <div className="form-group">
                        <label htmlFor="gst">GST No.</label>
                        <input
                          type="text"
                          id="gst"
                          maxLength={15}
                          minLength={15}
                          value={gst}
                          onChange={(e) => {
                            const inputGst = e.target.value.toLocaleUpperCase();
                            setGst(inputGst);
                            setSubmit(false);
                            setResponse(null);
                            if (inputGst === "" || gstRegex.test(inputGst)) {
                              setGSTErrorMessage("");
                              if (inputGst.length === 15) {
                                setPan(inputGst.substring(2, 2 + 10));
                              } else {
                                setPan("");
                              }
                            } else {
                              setGSTErrorMessage(
                                "Please enter a valid GST No."
                              );
                              setPan("");
                            }
                          }}
                          className="form-control"
                        />
                        {gsterrorMessage && (
                          <p className="text-danger">{gsterrorMessage}</p>
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="col-md-12 mb-1">
                    <div className="form-group">
                      <label htmlFor="pan">PAN No.</label>
                      <input
                        type="text"
                        id="pan"
                        minLength={10}
                        maxLength={10}
                        disabled={formState.gstRegistered}
                        onChange={(e) => {
                          setPan(e.target.value.toLocaleUpperCase());
                          setResponse(null);
                          setSubmit(false);
                        }}
                        className="form-control"
                        value={pan}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mb-1">
                    <Button outline color="primary" onClick={handleVerify}>
                      {verifyLoading ? (
                        <>
                          {" "}
                          <Spinner size={"sm"} /> Verifying..{" "}
                        </>
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>

                  {!formState.gstRegistered && response != null ? (
                    <div className="col-md-12 mb-1">
                      <Label>Name: </Label> <span>{response.name}</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {formState.gstRegistered && response != null ? (
                    <div className="col-md-12 mb-1">
                      <Label>Trade Name: </Label>{" "}
                      <span>{response.trade_name}</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                {formState.gstRegistered && response != null ? (
                  response?.trade_name ? (
                    <Button
                      color="primary"
                      disabled={!submit}
                      onClick={handleClick}
                    >
                      {processing ? <Spinner size={"sm"} /> : "Submit"}
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      disabled={!submit}
                      onClick={() => {
                        toast.error("Trade name is null");
                      }}
                    >
                      {processing ? <Spinner size={"sm"} /> : "Submit"}
                    </Button>
                  )
                ) : (
                  <Button
                    color="primary"
                    disabled={!submit}
                    onClick={handleClick}
                  >
                    {processing ? <Spinner size={"sm"} /> : "Submit"}
                  </Button>
                )}
                <Snackbar
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: "100%" }}
                  >
                    {message}
                  </Alert>
                </Snackbar>
              </ModalFooter>
            </Modal>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      {/* <Wizard data={page} /> */}
      {page != false ? (
        <Wizard data={page} />
      ) : (
        <>
          {showMail ? (
            <>
              <EmailVerification />
              <GstPan />
            </>
          ) : (
            <>
              <GstPan />
            </>
          )}
        </>
      )}
      ;
    </>
  );
};

export default ValiDations;
