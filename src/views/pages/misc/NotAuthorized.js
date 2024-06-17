// ** React Imports
import { Link } from "react-router-dom";
import logo from "@src/assets/images/logo/logo.png";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "@utils";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/not-authorized.svg";
import illustrationsDark from "@src/assets/images/pages/not-authorized-dark.svg";

// ** Styles
import "@styles/base/pages/page-misc.scss";

const NotAuthorized = () => {
  // ** Hooks
  const { skin } = useSkin();

  // ** Vars
  const user = getUserData();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="misc-wrapper">
      <Link className="brand-logo" to="/">
        <img src={logo} style={{ width: "120px" }} alt="" />
        {/* <h2 className="brand-text text-primary ms-1">SupplierX</h2> */}
      </Link>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h1 className="mb-1">You are not authorized! 🔐</h1>
          <p className="mb-2 fs-4">
            You don&apos;t have the necessary permissions to view this page.
          </p>
          <Button
            tag={Link}
            color="primary"
            className="btn-sm-block mb-1"
            to={user ? getHomeRouteForLoggedInUser(user.role_name) : "/"}
          >
            Back to Home
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  );
};
export default NotAuthorized;
