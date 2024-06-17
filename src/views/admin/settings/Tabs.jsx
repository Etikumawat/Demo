// ** Reactstrap Imports
import { Nav, NavItem, NavLink } from "reactstrap";

// ** Icons Imports
import { User, Lock, Bookmark, Mail } from "react-feather";
import { AiOutlineFileSync, AiOutlineTool } from "react-icons/ai";

const Tabs = ({ activeTab, toggleTab }) => {
  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);
  return (
    <Nav pills vertical className="mb-2">
      <NavItem>
        <NavLink
          style={{ height: "40px", marginBottom: "6px" }}
          className="d-flex align-items-center justify-content-start w-75"
          active={activeTab === "1"}
          onClick={() => toggleTab("1")}
        >
          <User size={18} className="me-50" />
          <span className="fw-bold">Account</span>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          style={{ height: "40px", marginBottom: "6px" }}
          className="d-flex align-items-center justify-content-start w-75"
          active={activeTab === "2"}
          onClick={() => toggleTab("2")}
        >
          <Lock size={18} className="me-50" />
          <span className="fw-bold">Security</span>
        </NavLink>
      </NavItem>
      {user.role_name === "Admin" && (
        <div>
          <NavItem>
            <NavLink
              style={{ height: "40px", marginBottom: "6px" }}
              className="d-flex align-items-center justify-content-start w-75"
              active={activeTab === "3"}
              onClick={() => toggleTab("3")}
            >
              <AiOutlineTool size={18} className="me-50" />
              <span className="fw-bold">General</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ height: "40px", marginBottom: "6px" }}
              className="d-flex align-items-center justify-content-start w-75"
              active={activeTab === "4"}
              onClick={() => toggleTab("4")}
            >
              <Mail size={18} className="me-50" />
              <span className="fw-bold">Email</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ height: "40px", marginBottom: "6px" }}
              className="d-flex align-items-center justify-content-start w-75"
              active={activeTab === "5"}
              onClick={() => toggleTab("5")}
            >
              <AiOutlineFileSync size={18} className="me-50" />
              <span className="fw-bold">Cron Job</span>
            </NavLink>
          </NavItem>
        </div>
      )}
    </Nav>
  );
};

export default Tabs;
