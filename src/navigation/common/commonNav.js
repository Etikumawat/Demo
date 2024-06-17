// ** Icons Import
import {
  CameraAlt,
  Gradient,
  Receipt,
  ReceiptLong,
  Rotate90DegreesCcw,
  Scanner,
  Settings,
  Toll,
} from "@mui/icons-material";
import { User } from "react-feather";
const subMenuSize = { width: "17px", height: "17px" };
const MenuSize = { width: "22px", height: "22px" };

// Function to dynamically add routes based on user role

const getRoutes = (userRoleName) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  let routes = [
    {
      id: "scanQr",
      title: "Scan",
      icon: <CameraAlt size={20} />,
      navLink: "/scanqr",
    },
    {
      id: "Scanned History",
      title: "Scanned History",
      icon: <Scanner size={20} />,
      navLink: "/ScannedHistory",
    },
  
    {
      id: "settings",
      title: "Settings",
      icon: <Settings size={20} />,
      children: [
        {
          id: "accountSettings",
          title: "Account Settings",
          icon: <User size={12} />,
          navLink: "/profile",
        },
      ],
    },
  ];

  if (
    userRoleName === "Accounts Executive" ||
    userData?.role_name === "Accounts Executive"
  ) {
    routes.splice(
      -1,
      0,
      {
        id: "invoice",
        title: "Invoice",
        icon: <Gradient size={12} />,
        children: [
          {
            id: "sapinvoice",
            title: "Asn/Scr-Invoice",
            icon: <ReceiptLong style={subMenuSize} />,
            navLink: "/sapinvoice",
          },
          {
            id: "Invoice Invoice",
            title: "Upload Invoice",
            icon: <Receipt style={subMenuSize} />,
            navLink: "/invoiceupload",
          },
          {
            id: "Invoice Field Mapping",
            title: "Invoice Field Map",
            icon: <Rotate90DegreesCcw style={subMenuSize} />,
            navLink: "supplier/fieldmap",
          },
        ],
      }

      // {
      //   id: "Extract Invoice",
      //   title: "Extract Invoice",
      //   icon: <Gradient size={12} />,
      //   navLink: "supplier/invoice",
      // },
      // {
      //   id: "Json Invoice",
      //   title: "Json Invoice",
      //   icon: <Gradient size={12} />,
      //   navLink: "/jsonview",
      // },
    );
  }
  if (
    userRoleName === "Store Keeper" ||
    userData?.role_name === "Store Keeper"
  ) {
    routes.splice(-1, 0, {
      id: "sapinvoice",
      title: "GRN List",
      icon: <ReceiptLong style={subMenuSize} />,
      navLink: "/grnlist",
    });
  }
  if (
    userRoleName === "Security Executive" ||
    userData?.role_name === "Security Executive"
  ) {
    routes.splice(-1, 0, {
      id: "GI List",
      title: "GI List",
      icon: <ReceiptLong style={subMenuSize} />,
      navLink: "/GIList",
    });
  }
  return routes;
};

// Export default routes array
export default getRoutes; // Pass the role name here dynamically
