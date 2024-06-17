// ** React Imports
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

// ** Icons Imports
import { Disc, X, Circle } from "react-feather";
import { RiMenuAddFill } from "react-icons/ri";
import { LuMenu } from "react-icons/lu";
// ** Config
import themeConfig from "@configs/themeConfig";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const VerticalMenuHeader = (props) => {
  // ** Props
  const {
    menuCollapsed,
    setMenuCollapsed,
    setMenuVisibility,
    setGroupOpen,
    menuHover,
  } = props;

  // ** Vars
  const user = getUserData();

  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <KeyboardDoubleArrowLeft
          size={28}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <KeyboardDoubleArrowRight
          size={28}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };

  return (
    <div className="navbar-header">
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
          <NavLink
            to={user ? getHomeRouteForLoggedInUser(user.role_name) : "/"}
            className="navbar-brand"
          >
            <span>
              <img
                src={themeConfig.app.appLogoImage}
                className="text-center"
                width="53px"
                alt="logo"
              />
            </span>
            <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2>
          </NavLink>
        </li>
        <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
