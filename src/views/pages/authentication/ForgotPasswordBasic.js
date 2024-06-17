// ** React Imports
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Button,
  FormFeedback,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import toast from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import logo from "@src/assets/images/logo/logo.png";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";

const ResetPasswordBasic = () => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [tokenExipred, setTokenExipred] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      verifyToken();
    }
  }, [token]);

  const verifyToken = () => {
    axios
      .post(new URL("authorization/link-expired", themeConfig.backendUrl), {
        token: token,
      })
      .then((res) => {
        if (res.data.error) {
          setTokenExipred(true);
        } else {
          setTokenExipred(false);
          setVerified(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setTokenExipred(true);
      });
  };

  const SignupSchema = yup.object().shape({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one numeric digit")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(SignupSchema),
  });

  const changePassword = (data) => {
    console.log(data, "DATA");
    const body = {
      token: token,
      password: data.password,
      confirm_password: data.confirm_password,
    };
    console.log(body, "BODY");

    axios
      .post(
        new URL(`authorization/reset-password`, themeConfig.backendUrl),
        body
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate("/login");
        }
      });
  };
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          {!tokenExipred ? (
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                <img src={logo} style={{ width: "110px" }} alt="" />
                {/* <h2 className="brand-text text-primary ms-1">SupplierX</h2> */}
              </Link>
              {verified ? (
                <div>
                  <CardTitle tag="h4" className="mb-1">
                    Reset Password 🔒
                  </CardTitle>
                  <CardText className="mb-2">
                    Your new password must be different from previously used
                    passwords
                  </CardText>
                  <CardText
                    color="danger"
                    className="mb-2"
                    style={{ fontSize: "12px" }}
                  >
                    Password must be at least 8 characters long, with one
                    lowercase and one uppercase letter, and include a number,
                    symbol, or whitespace.
                  </CardText>
                  <Form
                    className="auth-reset-password-form mt-2"
                    onSubmit={handleSubmit(changePassword)}
                  >
                    <div className="mb-1">
                      <Controller
                        control={control}
                        id="password"
                        name="password"
                        render={({ field }) => (
                          <InputPasswordToggle
                            label="New Password"
                            htmlFor="password"
                            className="input-group-merge"
                            invalid={errors.password && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.password && (
                        <FormFeedback className="d-block">
                          {errors.password.message}
                        </FormFeedback>
                      )}
                    </div>
                    <div className="mb-1">
                      <Controller
                        control={control}
                        id="confirm_password"
                        name="confirm_password"
                        render={({ field }) => (
                          <InputPasswordToggle
                            label="Confirm Password"
                            htmlFor="confirm_password"
                            className="input-group-merge"
                            invalid={errors.confirm_password && true}
                            {...field}
                          />
                        )}
                      />
                      {errors.confirm_password && (
                        <FormFeedback className="d-block">
                          {errors.confirm_password.message}
                        </FormFeedback>
                      )}
                    </div>
                    <Button color="primary" block>
                      Set New Password
                    </Button>
                  </Form>
                  <p className="text-center mt-2">
                    <Link to="/login">
                      <ChevronLeft className="rotate-rtl me-25" size={14} />
                      <span className="align-middle">Back to login</span>
                    </Link>
                  </p>
                </div>
              ) : (
                <div>
                  <ComponentSpinner />
                </div>
              )}
            </CardBody>
          ) : (
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                <img src={logo} style={{ width: "110px" }} alt="" />
                {/* <h2 className="brand-text text-primary ms-1">SupplierX</h2> */}
              </Link>
              <CardTitle tag="h4" className="mb-1 text-center fw-bolder">
                Password Reset Link Expired
              </CardTitle>
              <CardText className="mb-2">
                Please request a new password reset email by clicking below.
              </CardText>
              <Button color="primary" to="/reset-password" block>
                <Link
                  to="/reset-password"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  Forgot Password
                </Link>{" "}
              </Button>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordBasic;
