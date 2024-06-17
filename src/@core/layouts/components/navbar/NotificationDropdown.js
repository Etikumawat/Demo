// ** React Imports
import { Fragment, useEffect } from "react";

// ** Custom Components
// ** Third Party Components
import { useState } from "react";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Bell, X, Check, AlertTriangle } from "react-feather";
import { Link } from "react-router-dom";
// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

// ** Avatar Imports
import avatar3 from "@src/assets/images/portrait/small/avatar-s-3.jpg";
import avatar15 from "@src/assets/images/portrait/small/avatar-s-15.jpg";
import logo from "../../../../assets/images/logo/logo.png";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";
import toast from "react-hot-toast";
import { Avatar } from "@mui/material";

export const notificationsArray = [
  {
    img: avatar3,
    subtitle: "Congratulation Supplier 🎉",
    title: (
      <p className="media-heading">
        <span className="fw-bolder">Supplier Created !</span>
        {/* winner! */}
      </p>
    ),
  },
  {
    img: avatar15,
    subtitle: "You have 10 unread messages.",
    title: (
      <p className="media-heading">
        <span className="fw-bolder">OTP</span>&nbsp;received
      </p>
    ),
  },
  {
    avatarContent: "ASN",
    color: "light-danger",
    subtitle: "....",
    title: (
      <p className="media-heading">
        <span className="fw-bolder">ASN created.. 👋</span>
      </p>
    ),
  },
  {
    title: <h6 className="fw-bolder me-auto mb-0">System Notifications</h6>,
    switch: (
      <div className="form-check form-switch">
        <Input
          type="switch"
          name="customSwitch"
          id="exampleCustomSwitch"
          defaultChecked
        />
      </div>
    ),
  },
  {
    avatarIcon: <X size={14} />,
    color: "light-danger",
    subtitle: "USA Server is down due to hight CPU usage",
    title: (
      <p className="media-heading">
        <span className="fw-bolder">Last Logned in</span>&nbsp;Time
      </p>
    ),
  },
  // {
  //   avatarIcon: <Check size={14} />,
  //   color: "light-success",
  //   subtitle: "Last month sales report generated",
  //   title: (
  //     <p className="media-heading">
  //       <span className="fw-bolder">Sales report</span>&nbsp;generated
  //     </p>
  //   ),
  // },
  {
    avatarIcon: <AlertTriangle size={14} />,
    color: "light-warning",
    subtitle: "Server using high memory",
    title: (
      <p className="media-heading">
        <span className="fw-bolder">High memory</span>&nbsp;usage
      </p>
    ),
  },
];

const NotificationDropdown = () => {
  // ** Notification Array

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false,
        }}
      >
        {data &&
          data.map((item, index) => {
            return (
              <a
                key={index}
                className="d-flex"
                href={item.switch ? "#" : "/"}
                onClick={(e) => {
                  if (!item.switch) {
                    e.preventDefault();
                  }
                }}
              >
                <div
                  className={classnames("list-item d-flex", {
                    "align-items-start": !item.switch,
                    "align-items-center": item.switch,
                  })}
                >
                  <Fragment>
                    <div className="me-1">
                      <Avatar sx={{ bgcolor: "light-success" }}>H</Avatar>
                    </div>
                    <div className="list-item-body flex-grow-1">
                      {item.heading}
                      <br></br>
                      <small className="notification-text">
                        {item.message}
                      </small>
                    </div>
                  </Fragment>
                </div>
              </a>
            );
          })}
      </PerfectScrollbar>
    );
  };
  /*eslint-enable */
  const [clickCount, setClickCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [notificationCount, setNotificationCount] = useState(null);
  const query = {
    offset: 0,
    limit: 5,
    sort: "id",
    order: "asc",
    search: "",
  };
  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount === 1) setClickCount(0);
  };
  const getNotifications = () => {
    setLoading(true);
    axios
      .post(
        new URL(
          "/api/v1/notification/getNotifications",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setData(null);
        } else {
          setLoading(false);
          setData(res.data.data);
          setNotificationCount(res.data.unread);
        }
      });
  };
  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle tag="a" className="nav-link" onClick={handleClick}>
        <Bell size={21} />
        <Badge pill color="danger" className="badge-up">
          {notificationCount ? notificationCount : 0}
        </Badge>
      </DropdownToggle>
      {clickCount === 1 && (
        <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
          <li className="dropdown-menu-header">
            <DropdownItem className="d-flex" tag="div" header>
              <h4 className="notification-title mb-0 me-auto">Notifications</h4>
              <Badge tag="div" color="light-primary" pill>
                {notificationCount ? notificationCount + "new " : 0}
              </Badge>
            </DropdownItem>
          </li>

          {renderNotificationItems()}
          <li className="dropdown-menu-footer">
            <Link to="/all-notifications" onClick={handleClick}>
              <Button color="primary" block>
                Read all notifications
              </Button>
            </Link>
          </li>
        </DropdownMenu>
      )}
    </UncontrolledDropdown>
  );
};

export default NotificationDropdown;
