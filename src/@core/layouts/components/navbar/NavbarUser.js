// ** Dropdowns Imports
import UserDropdown from "./UserDropdown";
import NavbarSearch from "./NavbarSearch";
import NotificationDropdown from "./NotificationDropdown";
import themeConfig from "../../../../configs/themeConfig";
// ** Third Party Components
import { Sun, Moon } from "react-feather";

// ** Reactstrap Imports
import { NavItem, NavLink } from "reactstrap";
import { RiH3 } from "react-icons/ri";

const NavbarUser = (props) => {
  // ** Props
  const { skin, setSkin } = props;
  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === "dark") {
      return <Sun className="ficon" onClick={() => setSkin("light")} />;
    } else {
      return <Moon className="ficon" onClick={() => setSkin("dark")} />;
    }
  };

  return (
    <>
      {window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1" ? (
        <h6
          style={{
            textAlign: "left",
            backgroundColor: "#36B35F",
            padding: "5px",
            borderRadius: "5px",
            color: "#fff",
          }}
        >
          Running in localhost
          <span style={{ color: "#22292f" }}>
            {" "}
            API Url : {themeConfig.backendUrl}{" "}
          </span>
        </h6>
      ) : (
        ""
      )}
      <ul className="nav navbar-nav align-items-center ms-auto">
        <NavItem className="d-none d-lg-block">
          <NavLink className="nav-link-style">
            <ThemeToggler />
          </NavLink>
        </NavItem>
        <NavbarSearch />
        <NotificationDropdown />
        <UserDropdown />
      </ul>
    </>
  );
};
export default NavbarUser;
