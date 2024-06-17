/* eslint-disable react/react-in-jsx-scope */
// ** React Imports
import { useContext, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import themeConfig from "../../../configs/themeConfig";
import logo from "../../../assets/images/logo/logo.png";
import aeonxLogo from "../../../assets/aeonx-logo.png";
import Lottie from "react-lottie";
import animation from "../../../lottie/login.json";
// import animation from "../../../lottie/supply-chain.json";
import Stack from "@mui/material/Stack";
import { useState } from "react";
// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";
import useJwt from "@src/auth/jwt/useJwt";
import {
  getHomeRouteForLoggedInUser,
  getUserData,
} from "../../../utility/Utils";

// ** Third Party Components
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { Coffee, Truck, X } from "react-feather";

// ** Actions
import { handleLogin } from "@store/authentication";

// ** Context
import { AbilityContext } from "@src/utility/context/Can";

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
import { Avatar, LinearProgress } from "@mui/material";
// ** Utils

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  FormFeedback,
} from "reactstrap";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { ErrorOutline, LoginOutlined } from "@mui/icons-material";
import "../../pages/authentication/login.scss";
import Customizer from "../../../@core/components/customizer";
import CookieConsent from "../../components/CookieConsent";

const Login = () => {
  const user = getUserData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();
  const [defaultValues, setDefaultValues] = useState({
    loginEmail: null,
    password: null,
  });
  // const [EMAIL, setEMAIL] = useState();
  // const [PWD, setPWD] = useState();

  // ** Hooks
  useEffect(() => {}, [defaultValues]);
  const dispatch = useDispatch();
  const ability = useContext(AbilityContext);
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  const directLogin = (data) => {
    setDefaultValues({
      loginEmail: data.email,
      password: data.pass,
    });
  };

  const onSubmit = () => {
    if (
      (defaultValues.loginEmail == null || defaultValues.loginEmail === "") &&
      (defaultValues.password == null || defaultValues.password === "")
    ) {
      setMessage("Enter Credentials");
    } else {
      login(defaultValues);
    }
  };

  const login = (data) => {
    setLoading(true);
    useJwt
      .login({ email: data.loginEmail, password: data.password })
      .then((res) => {
        setLoading(true);
        if (res.data.error) {
          // toast.error(res.data.message);
          setMessage(res.data.message);
          setLoading(false);
        } else {
          toast(
            (t) => (
              <div className="d-flex">
                <div className="me-1">
                  <img src={logo} width={50} alt="" className="mt-1" />
                  {/* <Avatar
                    size="sm"
                    color="success"
                    icon={<Coffee size={12} />}
                  /> */}
                </div>
                <div className="d-flex justify-content-between align-items-center gap-1">
                  <span>
                    You have successfully logged in as an{" "}
                    <span className="fw-bolder">
                      {res?.data?.data?.userData?.role_name}
                    </span>{" "}
                    to SupplierX. Now you can start to explore. Enjoy!
                  </span>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* <h6>{name}</h6> */}
                    <X
                      size={16}
                      className="cursor-pointer"
                      onClick={() => toast.dismiss(t.id)}
                    />
                  </div>
                </div>
              </div>
            ),
            {
              duration: 3000,
            }
          );
          setLoading(false);
          const user = res.data.data.userData;
          const vendor_code = user?.sapCode ? user.sapCode : "";
          localStorage.setItem("vendorCode", vendor_code);
          const userdata = {
            id: user.id,
            role: user.role,
            role_name: user.role_name,
            approver_hr_level: user.approver_hr_level,
            approver_level: user.level,
            approver_level_name: user.approver_level_name,
            username: user.username,
            subscriber_id: user.subscriber_id,
            hierarchy_level: user.hierarchy_level,
          };
          localStorage.setItem(userdata, JSON.stringify(userdata));
          const supplierId = user.supplierId;
          localStorage.setItem("supplierId", supplierId);
          res.data.data.userData.ability = [
            {
              action: "manage",
              subject: "all",
            },
          ];
          const data = {
            ...res.data.data.userData,
            accessToken: res.data.data.accessToken,
            refreshToken: res.data.data.refreshToken,
          };
          data.username = `${data.firstname} ${data.lastname}`;
          dispatch(handleLogin(data));
          ability.update(res.data.data.userData.ability);
          let hasSupplierData =
            res.data.data.userData.hasOwnProperty("supplierDetails");
          let supplierDetails = hasSupplierData
            ? res.data.data.userData.supplierDetails
            : null;
          localStorage.setItem(
            "supplierDetails",
            JSON.stringify(supplierDetails)
          );

          if (user && data.role_name == "Source") {
            navigate("/source/dashboard", { replace: true });
          }
          if (user && data.role_name == "Admin") {
            navigate("/admin/dashboard", { replace: true });
          }
          if (user && data.role_name == "SuperAdmin") {
            navigate("/dashboard", { replace: true });
          }
          if (user && data.role_name == "Supplier") {
            navigate("/supplier/dashboard", { replace: true });
          }
          if (
            (user && data.role_name == "Approver") ||
            (user && data.role_name == "Verifier")
          ) {
            navigate("/dashboard", { replace: true });
          }
          if (
            (user && data.role_name == "Accounts Executive") ||
            (user && data.role_name == "Service Department User") ||
            (user && data.role_name == "Quality Incharge") ||
            (user && data.role_name == "Store Keeper") ||
            (user && data.role_name == "Security Executive")
          ) {
            navigate("/supplier/scanqr", { replace: true });
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
        toast.error(err.message + " " + "Server is down");
        setMessage(err.message);
      });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };

  return (
    <div className="">
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle3"></div>
      <div className="circle4"></div>
      <div className="circle5"></div>
      <Link className="" to="/" onClick={(e) => e.preventDefault()}>
        {/* Logo HERE  */}
        {/* <img src={aeonxLogo} className="m-1 logo-img" height="26" /> */}
        <img
          src={themeConfig.app.appLogoImage}
          className="m-3 logo-img"
          height="50"
        />
        {/* <h2 className="brand-text text-primary ms-1">
          Supplierx Panel
        </h2> */}
      </Link>
      <Row className="auth-inner">
        <Col className="d-none d-lg-flex align-items-center p-5" lg="7" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            {/* <img className="img-fluid" src={source} alt="Login Cover" /> */}
            <Lottie options={defaultOptions} height={"auto"} width={"75%"} />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center px-2 p-lg-5 backgroudShape"
          lg="5"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div className="d-flex justify-content-center m-2">
              <img
                className="small-logo"
                src={themeConfig.app.appLogoImage}
                height="50"
              />
            </div>
            <div className="login">Welcome To SupplierX</div>
            <CardText className="mb-2 font text-center">
              Login to the SupplierX Portal for all your supplier needs.
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1 px-5">
                <Label className="form-label font" for="login-email">
                  Email
                </Label>
                <Input
                  autoFocus
                  type="email"
                  value={defaultValues.loginEmail}
                  placeholder="john@example.com"
                  invalid={errors.loginEmail && true}
                  onChange={(e) => {
                    setDefaultValues((prev) => ({
                      ...prev,
                      loginEmail: e.target.value,
                    }));
                    // setEMAIL(e.target.value);
                  }}
                />
                {errors.loginEmail && (
                  <FormFeedback>{errors.loginEmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1 px-5">
                <div className="d-flex justify-content-between">
                  <Label className="form-label font" for="login-password">
                    Password
                  </Label>
                </div>
                <InputPasswordToggle
                  className="input-group-merge"
                  value={defaultValues.password}
                  invalid={errors.password && true}
                  onChange={(e) => {
                    setDefaultValues((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                    // setPWD(e.target.value);
                  }}
                />
                <div
                  className="d-flex justify-content-end"
                  style={{ marginTop: "4px" }}
                >
                  <Link to="/reset-password">
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <div className="form-check mb-1 mt-1">
                  <Input type="checkbox" id="remember-me" />
                  <Label className="font" for="remember-me">
                    Remember Me
                  </Label>
                </div>
              </div>

              {message ? (
                <div
                  className="text-center"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <h6
                    style={{
                      color: "#FF5733",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ErrorOutline style={{ marginRight: "5px" }} />
                    {message}
                  </h6>
                </div>
              ) : (
                ""
              )}

              <div className="px-5">
                <Button
                  type="submit"
                  className="mb-1 btn-2"
                  color="primary"
                  block
                >
                  <LoginOutlined
                    style={{
                      color: "white",
                      marginRight: "15px",
                    }}
                    size={20}
                    className="pr-3"
                  />
                  Sign In
                </Button>
              </div>
              {loading ? (
                <div className="px-5">
                  <Stack
                    className=""
                    sx={{ width: "100%", color: "#e06522" }}
                    spacing={2}
                  >
                    <LinearProgress color="inherit" />
                  </Stack>
                </div>
              ) : (
                ""
              )}
            </Form>
            <p className="or white px-5">Or</p>
            <div className="mb-1 px-5">
              <Button
                tag={Link}
                to="/supplier/register"
                className=" mt-1 btn-2"
                color="primary"
                block
              >
                <Truck
                  style={{
                    color: "white",
                    marginRight: "15px",
                  }}
                  size={20}
                  className="pr-3"
                />
                Register as a Supplier
              </Button>
              <p style={{ color: "#DFDFDF", fontSize: "12px" }}>
                By signing up, you agree to the{" "}
                <a
                  href="terms-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy{" "}
                </a>
                , including Cookie Use.
              </p>
            </div>

            {/* Testing Buttons */}

            {/* <div className="mb-1 mt-2 px-5">
              <Button
                onClick={() => {
                  const data = {
                    email: "admin@gmail.com",
                    pass: "12345678",
                  };
                  directLogin(data);
                }}
                type="submit"
                className="mb-1"
                color="success"
                size="sm"
                block
                outline
              >
                Login as Admin
              </Button>
            </div> */}

            <div className="mb-1 mt-2 px-5">
              <Button
                onClick={() => {
                  const data = {
                    email: "hiten.surti@aeonx.digital",
                    pass: "12345678",
                  };
                  directLogin(data);
                }}
                type="submit"
                className="mb-1"
                color="primary"
                size="sm"
                block
                outline
              >
                Login as Approver
              </Button>
            </div>
            {/* <div className="mb-1 px-5">
              <Button
                onClick={() => {
                  const data = {
                    email: "source@gmail.com",
                    pass: "12345678",
                  };
                  directLogin(data);
                }}
                type="submit"
                className="mb-1"
                color="secondary"
                size="sm"
                block
                outline
              >
                Login as Source
              </Button>
            </div> */}
            <div className="mb-1 px-5">
              <Button
                onClick={() => {
                  const data = {
                    email: "sebastian.vannier@aeonx.digital",
                    pass: "Sebastian@123",
                  };
                  directLogin(data);
                }}
                type="submit"
                className="mb-1"
                color="info"
                outline
                size="sm"
                block
              >
                Login as Supplier
              </Button>
            </div>
          </Col>
        </Col>
        <p className="mb-1 d-flex justify-content-center mt-1">
          SupplierX © {new Date().getFullYear()} Powered By &nbsp;-&nbsp;
          <a
            href="https://www.aeonx.digital/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.aeonx.digital
          </a>
          &nbsp;|&nbsp;
          <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
        </p>
      </Row>
      {themeConfig.layout.customizer === true ? (
        <Customizer themeConfig={themeConfig} />
      ) : null}
      <CookieConsent />
    </div>
  );
};

export default Login;
