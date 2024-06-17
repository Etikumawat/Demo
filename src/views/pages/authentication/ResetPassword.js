// ** React Imports
import { Link } from "react-router-dom";
import { useState } from "react";

import axios from "axios";

// ** Icons Imports
import { ChevronLeft } from "react-feather";

// ** Reactstrap Imports
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

// ** Styles
import "@styles/react/pages/page-authentication.scss";
import themeConfig from "../../../configs/themeConfig";
import toast from "react-hot-toast";
import logo from "@src/assets/images/logo/logo.png";

const ResetPassword = () => {
  const [email, setEmail] = useState();
  const [verified, setVerified] = useState(false);

  const verifyEmail = () => {
    axios
      .post(new URL(`authorization/forgot-password`, themeConfig.backendUrl), {
        email: email,
      })
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setVerified(true);
        }
      });
  };
  return (
    <div className="auth-wrapper auth-basic px-2">
      <div className="auth-inner my-2">
        <Card className="mb-0">
          {!verified ? (
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                <img src={logo} style={{ width: "110px" }} alt="" />
                {/* <h2 className="brand-text text-primary ms-1">SupplierX</h2> */}
              </Link>
              <CardTitle tag="h4" className="mb-1">
                Forgot Password? 🔒
              </CardTitle>
              <CardText className="mb-2">
                Enter your email and we'll send you instructions to reset your
                password
              </CardText>
              <Form
                className="auth-forgot-password-form mt-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyEmail();
                }}
              >
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="login-email"
                    required
                    placeholder="john@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button color="primary" block>
                  Send reset link
                </Button>
              </Form>
              <p className="text-center mt-2">
                <Link to="/login">
                  <ChevronLeft className="rotate-rtl me-25" size={14} />
                  <span className="align-middle">Back to login</span>
                </Link>
              </p>
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
                Password Reset Email Sent
              </CardTitle>
              <CardText className="mb-2">
                An Email sent to you to reset your password. Please check your
                mail box.
              </CardText>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
