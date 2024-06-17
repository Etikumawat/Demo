// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/admin/vertical";
import suppliernavigation from "@src/navigation/supplier/vertical";
import superAdminNavigation from "@src/navigation/superAdmin/vertical";
import commonNavigation from "@src/navigation/common/";
import approvernavigation from "@src/navigation/approver/vertical";
import sourcenavigation from "@src/navigation/source/vertical";

const VerticalLayout = (props) => {
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])
  const user = JSON.parse(localStorage.getItem("userData"));

  if (
    (user && user.role_name == "Approver") ||
    (user && user.role_name == "Verifier")
  ) {
    return (
      <Layout menuData={approvernavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "Admin") {
    return (
      <Layout menuData={navigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "Source") {
    return (
      <Layout menuData={sourcenavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "SuperAdmin") {
    return (
      <Layout menuData={superAdminNavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (user && user.role_name === "Supplier") {
    return (
      <Layout menuData={suppliernavigation} {...props}>
        <Outlet />
      </Layout>
    );
  }
  if (
    (user && user.role_name == "Accounts Executive") ||
    (user && user.role_name == "Service Department User") ||
    (user && user.role_name == "Quality Incharge") ||
    (user && user.role_name == "Store Keeper") ||
    (user && user.role_name == "Security Executive")
  ) {
    return (
      <Layout menuData={commonNavigation(user?.role_name)} {...props}>
        <Outlet />
      </Layout>
    );
  }
};

export default VerticalLayout;
