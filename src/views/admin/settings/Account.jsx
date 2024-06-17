// ** React Imports
import { Fragment, useEffect, useState } from "react";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
// import "cleave.js/dist/addons/cleave-phone.us";
import profileImg from "../../../assets/images/logo/profile.png";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";
import axios from "axios";
import toast from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";

function Account() {
  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);
  const { id } = user;
  const userId = id;
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [userData, setUserData] = useState({});

  const request = () => {
    axios
      .post(new URL(`/api/admin/users/view/${userId}`, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setUserData(res.data.data[0]);
      });
  };
  useEffect(() => {
    request();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const form = {
      id: userId,
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      status: userData.status,
    };
    console.log("DATA", userData);
    axios
      .put(new URL("/api/admin/users/update_profile", themeConfig.backendUrl), {
        ...form,
        role: userData.role,
      })
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          request();
          localStorage.setItem("username", form.username);
        }
      });

    setIsEditAllowed(false);
  };
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Account Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex">
            <div className="me-25">
              <img
                className="rounded me-50"
                src={profileImg}
                alt="user avatar"
                height="100"
                width="100"
              />
            </div>
            {/* <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Button
                  tag={Label}
                  className="mb-75 me-75"
                  size="sm"
                  color="primary"
                >
                  Upload
                  <Input
                    type="file"
                    // onChange={onChange}
                    hidden
                    accept="image/*"
                  />
                </Button>
                <Button
                  className="mb-75"
                  color="secondary"
                  size="sm"
                  outline
                  //   onClick={handleImgReset}
                >
                  Reset
                </Button>
                <p className="mb-0">
                  Allowed JPG, GIF or PNG. Max size of 800kB
                </p>
              </div>
            </div> */}
          </div>
          <Form className="mt-2 pt-50" onSubmit={onSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="firstName">
                  First Name
                </Label>

                <Input
                  id="firstname"
                  placeholder="John"
                  defaultValue={userData.firstname}
                  disabled={!isEditAllowed}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      firstname: e.target.value,
                    }))
                  }
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="lastName">
                  Last Name
                </Label>

                <Input
                  id="lastname"
                  placeholder="Doe"
                  defaultValue={userData.lastname}
                  disabled={!isEditAllowed}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      lastname: e.target.value,
                    }))
                  }
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="emailInput">
                  E-mail
                </Label>
                <Input
                  id="emailInput"
                  type="email"
                  name="email"
                  placeholder="Email"
                  disabled
                  defaultValue={userData.email}
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="company">
                  User Name
                </Label>
                <Input
                  id="username"
                  name="userName"
                  placeholder="User Name"
                  defaultValue={userData.username}
                  disabled={!isEditAllowed}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="phNumber">
                  Role Name
                </Label>
                <Input
                  id="rolename"
                  name="rolename"
                  placeholder="Role Name"
                  disabled
                  defaultValue={userData.role_name}
                />
              </Col>
              <Col className="mt-2" sm="12">
                {isEditAllowed ? (
                  <Button type="submit" className="me-1" color="primary">
                    Save changes
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditAllowed(true);
                    }}
                    className="me-1"
                    color="primary"
                  >
                    Edit
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default Account;
