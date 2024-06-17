// ** Icons Import
import { LocalShippingOutlined, Toll } from "@mui/icons-material";
import {
  Activity,
  FileText,
  GitPullRequest,
  Home,
  Maximize2,
  Settings,
  Truck,
  User,
} from "react-feather";
export default [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/dashboard",
  },
  {
    id: "supplier",
    title: "Suppliers",
    icon: <LocalShippingOutlined size={20} />,
    navLink: "/suppliers",
  },
  {
    id: "Approver Activity Logs",
    title: "Activity Logs",
    icon: <Activity />,
    navLink: "/approverActivitylogs",
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <Settings size={20} />,
    children: [
      {
        id: "accountSettings",
        title: "Account Settings",
        icon: <User size={12} />,
        navLink: "profile",
      },
    ],
  },
  // {
  //   id: "purchaseRequisitions",
  //   title: "Purchase Req",
  //   icon: <GitPullRequest size={20} />,
  //   navLink: "/purchase_requisitions",
  // },
  // {
  //   id: "Req.. Quotation",
  //   title: "Req.. Quotation",
  //   icon: <Maximize2 size={20} />,
  //   navLink: "/rfq",
  // },
];
