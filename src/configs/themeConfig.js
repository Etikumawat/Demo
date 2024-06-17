// Logo Import
import logo from "../assets/logo.png";
// You can customize the template with the help of this file
//Template config options

const apiUrl = localStorage.getItem("apiUrl");
const onLocal = window.location.hostname === "localhost" ? true : false;
const themeConfig = {
  app: {
    appName: "SupplierX",
    appLogoImage: logo,
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "boxed", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: "white", // BS color options [primary, success, etc]
    },
    footer: {
      type: "static", // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-right", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right,
  },

  backendUrl: `${"https://dev.api.supplierx.aeonx.digital/api/"}`,
  // backendUrl: `${"http://10.201.0.198:4000/api/"}`,
  // backendUrl: `${"http://10.201.0.176:3000/api/"}`,
  // backendUrl: `${"http://10.201.0.38:3000/api/"}`,
};

export default themeConfig;
