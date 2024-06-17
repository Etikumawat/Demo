// ** React Imports
import { Link } from "react-router-dom";
import logo from "@src/assets/images/logo/logo.png";
// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/error.svg";
import illustrationsDark from "@src/assets/images/pages/error-dark.svg";

// ** Styles
import "@styles/base/pages/page-misc.scss";

const Error = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="misc-wrapper">
      <a className="brand-logo" href="/">
        <img src={logo} style={{ width: "120px" }} alt="" />
        {/* <h2 className="brand-text text-primary ms-1">SupplierX</h2> */}
      </a>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 style={{ fontSize: "6rem" }}>404</h2>
          <h1 style={{ fontSize: "3rem" }}>Page Not Found 🕵🏻‍♀️</h1>
          <p className="mb-2 fs-4">
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button
            tag={Link}
            to="/"
            color="primary"
            className="btn-sm-block mb-2"
          >
            Back to home
          </Button>
          {/* <img
            className="img-fluid"
            width={300}
            src={source}
            alt="Not authorized page"
          /> */}
        </div>
      </div>
    </div>
  );
};
export default Error;
