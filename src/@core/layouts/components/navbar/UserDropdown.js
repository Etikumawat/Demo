// ** React Imports
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwtDefaultConfig from "../../../../@core/auth/jwt/jwtDefaultConfig";

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Button,
  Row,
  Col,
} from "reactstrap";

// ** Custom Components
import Avatar from "@components/avatar";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";
// ** Utils

// ** Store & Actions
import { useDispatch } from "react-redux";
import { handleLogout } from "@store/authentication";

// ** Third Party Components
import { User, Power, Key } from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/avatars/avatar-blank.png";
export const getUserData = () => JSON.parse(localStorage.getItem("userData"));

const UserDropdown = (jwtOverrideConfig) => {
  const jwtDefaultConfig = {
    storageTokenKeyName: "storageTokenKeyName", // replace with your actual key
  };
  const jwtConfig = { ...jwtDefaultConfig, ...jwtOverrideConfig };
  const [editModal, setEditModal] = useState(false);
  const [pwdModal, setPwdModal] = useState(false);
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
  // console.log(userData.role_name)
  const dispatch = useDispatch();
  // const getToken = () => {
  //   return localStorage.getItem(jwtConfig.storageTokenKeyName);
  // };
  useEffect(() => {
    const expirationTimeInMilliseconds = 72 * 60 * 60 * 1000;
    const logoutTimer = setTimeout(() => {
      dispatch(handleLogout());
      toast.error("Token Expire");
    }, expirationTimeInMilliseconds);

    request();
    return () => clearTimeout(logoutTimer);
  }, []);

  const EditModal = () => {
    const [form, setForm] = useState({
      id: userId,
      username: userData?.username,
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      email: userData?.email,
      status: userData?.status,
    });

    const [cred, setCred] = useState({
      id: userId,
      email: userData?.email,
      password: "",
      confirmPassword: "",
    });
    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(
          new URL("/api/admin/users/update_profile", themeConfig.backendUrl),
          {
            ...form,
            role: userData.role,
          }
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            request();
          }
          setEditModal(false);
        });
    };
    const ChangePassword = (e) => {
      e.preventDefault();

      if (cred.password !== cred.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const params = {
        id: cred.id,
        email: cred.email,
        old_password: cred.oldpassword,
        new_password: cred.password,
      };
      axios
        .post(
          new URL("/api/admin/users/change_password", themeConfig.backendUrl),
          params
        )
        .then((res) => {
          if (res.data.error) {
            toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            request();
          }
          setPwdModal(false);
        });
    };
    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <Row>
                <Col lg="6" className="mt-1" md="6">
                  {" "}
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      defaultValue={userData?.username}
                      value={form.username}
                      onChange={(e) => {
                        setForm({ ...form, username: e.target.value });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      disabled
                      defaultValue={userData?.email}
                      value={form.email}
                      // onChange={(e) => {
                      //   setForm({ ...form, name: e.target.value });
                      // }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Firstname</label>
                    <input
                      type="text"
                      name="firstname"
                      defaultValue={userData?.firstname}
                      value={form.firstname}
                      onChange={(e) => {
                        setForm({ ...form, firstname: e.target.value });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Lastname</label>
                    <input
                      type="text"
                      name="lastname"
                      defaultValue={userData?.lastname}
                      value={form.lastname}
                      onChange={(e) => {
                        setForm({ ...form, lastname: e.target.value });
                      }}
                      className="form-control"
                      placeholder="---"
                      required
                    />
                  </div>
                </Col>
                <Col lg="6" className="mt-1" md="6">
                  <div className="form-group">
                    <label>Role Name</label>
                    <input
                      type="text"
                      name="roleName"
                      value={userData?.role_name}
                      // onChange={(e) => {
                      //   setForm({ ...form, name: e.target.value });
                      // }}
                      disabled
                      className="form-control"
                      placeholder="---"
                    />
                  </div>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
        <Modal
          isOpen={pwdModal}
          toggle={() => setPwdModal(!pwdModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setPwdModal(!pwdModal)}>Edit</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    name="email"
                    disabled
                    defaultValue={userData?.email}
                    value={cred.email}
                    onChange={(e) => {
                      setCred({ ...cred, email: e.target.value });
                    }}
                    className="form-control"
                    placeholder="---"
                    required
                  />
                </div>
              </Col>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Old Password</label>
                  <input
                    type="password"
                    name="password"
                    value={cred.oldpassword}
                    onChange={(e) => {
                      setCred({ ...cred, oldpassword: e.target.value });
                    }}
                    className="form-control"
                    placeholder="******"
                  />
                </div>
              </Col>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={cred.password}
                    onChange={(e) => {
                      setCred({ ...cred, password: e.target.value });
                    }}
                    className="form-control"
                    placeholder="Password"
                  />
                </div>
              </Col>
              <Col lg="12" className="mt-1" md="12">
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={cred.confirmPassword}
                    onChange={(e) => {
                      setCred({ ...cred, confirmPassword: e.target.value });
                    }}
                    className="form-control"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={ChangePassword}>
              Update Password
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };
  // ** Store Vars

  // ** State
  let userdata = localStorage.getItem("userData");
  const d = JSON.parse(userdata);
  const userId = d?.id ? d.id : "";

  //** Vars
  const userAvatar = (userData && userData.avatar) || defaultAvatar;

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {userData && userData?.username}
          </span>
          {/* <span className="user-status">
            {(userData && userData.role) || "Admin"}
          </span> */}
        </div>
        <Avatar img={userAvatar} imgHeight="40" imgWidth="40" status="online" />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile">
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        {/* <DropdownItem
          onClick={() => {
            setPwdModal(true);
          }}
        >
          <EditModal />
          <Key size={14} className="me-75" />
          <span className="align-middle">Change Password</span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
