// ** Icons Import
import {
  Business,
  Toll,
  ManageAccounts,
  Inventory2,
  Api,
  Security,
  Filter3TwoTone,
  SyncAltOutlined,
} from "@mui/icons-material";
import { HiSquare3Stack3D } from "react-icons/hi2";
import { MdOutlineStackedBarChart } from "react-icons/md";
import { FaTruckMoving } from "react-icons/fa";
import { IoMdPrint, IoMdSettings } from "react-icons/io";
import { RiPagesFill } from "react-icons/ri";
import {
  Tool,
  User,
  Package,
  CreditCard,
  Trello,
  Activity,
} from "react-feather";
import { AiOutlineFileSync } from "react-icons/ai";
const subMenuSize = { width: "17px", height: "17px" };
const MenuSize = { width: "22px", height: "22px" };

const menuItems = [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <MdOutlineStackedBarChart style={MenuSize} />,
    navLink: "/admin/dashboard",
  },
  {
    id: "Suppliers",
    title: "Suppliers",
    icon: <FaTruckMoving style={MenuSize} />,
    navLink: "/admin/supplier",
  },
  {
    id: "Master Data",
    title: "Master Data",
    icon: <HiSquare3Stack3D style={MenuSize} />,
    children: [
      {
        id: "Vendor",
        title: "Vendor",
        icon: <Package style={subMenuSize} />,
        navLink: "/admin/vendor",
        children: [
          {
            id: "Vendor Class",
            title: "Vendor Class",
            icon: <Toll fontSize="20" />,
            navLink: "/admin/vendor-class",
          },
          {
            id: "Vendor Schema",
            title: "Vendor Schema",
            icon: <Toll size={12} />,
            navLink: "/admin/vendor-schema",
          },
          {
            id: "Purchase Group",
            title: "Purchase Group",
            icon: <Toll size={12} />,
            navLink: "/admin/purchase-group",
          },
          {
            id: "Reconciliation",
            title: "Reconciliation",
            icon: <Toll size={12} />,
            navLink: "/admin/reconciliation",
          },
        ],
      },
      {
        id: "Business",
        title: "Business",
        icon: <Trello style={subMenuSize} />,
        children: [
          {
            id: "Business-Partner-Group",
            title: "Bus. Partner Grp",
            icon: <Toll size={12} />,
            navLink: "/admin/business-group",
          },
          {
            id: "Business-Type",
            title: "Business Type",
            icon: <Toll size={12} />,
            navLink: "/admin/business-type",
          },
          {
            id: "Company-Type",
            title: "Company Type",
            icon: <Toll size={12} />,
            navLink: "/admin/company-type",
          },
        ],
      },
      {
        id: "Payment",
        title: "Payment",
        icon: <CreditCard style={subMenuSize} />,
        children: [
          {
            id: "Payment Type",
            title: "Payment Type",
            icon: <Toll size={12} />,
            navLink: "/admin/payment",
          },
          {
            id: "Payment Terms",
            title: "Payment Terms",
            icon: <Toll size={12} />,
            navLink: "/admin/payment-term",
          },
          {
            id: "TDS",
            title: "TDS",
            icon: <Toll size={12} />,
            navLink: "/admin/tds",
          },
        ],
      },
      {
        id: "Configuration",
        title: "Configuration",
        icon: <Tool style={subMenuSize} />,
        navLink: "/admin/vendor",
        children: [
          {
            id: "Countries",
            title: "Countries",
            icon: <Toll size={12} />,
            navLink: "/admin/countries",
          },
          {
            id: "Currency",
            title: "Currency",
            icon: <Toll size={12} />,
            navLink: "/admin/currency",
          },
          {
            id: "Companies",
            title: "Companies",
            icon: <Toll size={12} />,
            navLink: "/admin/companies",
          },
          {
            id: "Units",
            title: "Units",
            icon: <Toll size={12} />,
            navLink: "/admin/units",
          },
        ],
      },
      {
        id: "Materials",
        title: "Materials",
        icon: <Inventory2 style={subMenuSize} />,
        navLink: "/admin/vendor",
        children: [
          {
            id: "Material Group",
            title: "Material Group",
            icon: <Toll size={12} />,
            navLink: "/admin/material-group",
          },
          {
            id: "Material",
            title: "Materials",
            icon: <Toll size={12} />,
            navLink: "/admin/materials",
          },
          {
            id: "Plants",
            title: "Plants",
            icon: <Toll size={12} />,
            navLink: "/admin/plants",
          },
          {
            id: "Storage Loc",
            title: "Storage Loc",
            icon: <Toll size={12} />,
            navLink: "/admin/storage-location",
          },
        ],
      },
    ],
  },
  {
    id: "Departments",
    title: "Departments",
    icon: <Business style={MenuSize} />,
    children: [
      {
        id: "Department",
        title: "Department",
        icon: <Toll size={12} />,
        navLink: "/admin/departments/department",
      },
      {
        id: "Department Approver",
        title: "Dept. Approver",
        icon: <Toll size={12} />,
        navLink: "/admin/department/approver",
      },
    ],
  },
  {
    id: "Compliance",
    title: "Compliance",
    icon: <Security style={MenuSize} />,
    children: [
      {
        id: "PAN Compliance",
        title: "PAN Compliance",
        icon: <Toll size={12} />,
        navLink: "/admin/pancompliance",
      },
      {
        id: "MSME Compliance",
        title: "MSME Compliance",
        icon: <Toll size={12} />,
        navLink: "/admin/msmecompliance",
      },
      {
        id: "GST Compliance",
        title: "GST Compliance",
        icon: <Toll size={12} />,
        navLink: "/admin/gstcompliance",
      },
    ],
  },
  {
    id: "Qr Settings",
    title: "Asn Print Settings",
    icon: <IoMdPrint />,
    navLink: "/admin/QrSettings",
  },
  {
    id: "formField",
    title: "Form Field",
    icon: <RiPagesFill />,
    children: [
      {
        id: "Create Field",
        title: "Create Field",
        icon: <Toll size={12} />,
        navLink: "/admin/createField",
      },
      {
        id: "Field Selection",
        title: "Field Selection",
        icon: <Toll size={12} />,
        navLink: "/admin/fieldSelection",
      },
      {
        id: "PO Field",
        title: "PO Field",
        icon: <Toll size={12} />,
        navLink: "/admin/poFields",
      },
      {
        id: "PR Field",
        title: "PR Field",
        icon: <Toll size={12} />,
        navLink: "/admin/prFields",
      },
    ],
  },
  {
    id: "API Configuration",
    title: "API Configuration",
    icon: <Api style={MenuSize} />,
    children: [
      {
        id: "SAP",
        title: "SAP API",
        icon: <Toll size={12} />,
        navLink: "/admin/sap",
      },
      {
        id: "Third Party",
        title: "Third Party API",
        icon: <Toll size={12} />,
        navLink: "/admin/thirdparty",
      },
    ],
  },
  {
    id: "Roles Permissions",
    title: "Roles & Permissions",
    icon: <ManageAccounts style={MenuSize} />,
    children: [
      {
        id: "Roles",
        title: "Roles",
        icon: <Toll size={12} />,
        navLink: "/admin/roles",
      },
      {
        id: "Permissions",
        title: "Permissions",
        icon: <Toll size={12} />,
        navLink: "/admin/permissions",
      },
      {
        id: "User",
        title: "User",
        icon: <Toll size={12} />,
        navLink: "/admin/user",
      },
      {
        id: "Approval Level",
        title: "Approval Level",
        icon: <Toll size={12} />,
        navLink: "/admin/approver-level",
      },
    ],
  },
  {
    id: "Logs",
    title: "Logs",
    icon: <Activity style={MenuSize} />,
    children: [
      {
        id: "Mail Logs",
        title: "Mail Logs",
        icon: <Toll size={12} />,
        navLink: "/admin/maillogs",
      },
      {
        id: "Activity Logs",
        title: "Activity Logs",
        icon: <Toll size={12} />,
        navLink: "/admin/activitylogs",
      },
      {
        id: "Transactional Logs",
        title: "Transactional Logs",
        icon: <Toll size={12} />,
        navLink: "/admin/transactionallogs",
      },
      // {
      //   id: "Supplier Logs",
      //   title: "Supplier Logs",
      //   icon: <Toll size={12} />,
      //   navLink: "/admin/supplierlogs",
      // },
    ],
  },

  {
    id: "Third Party Counts",
    title: "3rd Party API Counts",
    icon: <Filter3TwoTone style={MenuSize} />,
    navLink: "/admin/3rdPartyApiCounts",
  },
  {
    id: "Cron Job",
    title: "Cron Job",
    icon: <AiOutlineFileSync style={MenuSize} />,
    navLink: "/admin/cronJob",
  },
  {
    id: "Migration",
    title: "Migration",
    icon: <SyncAltOutlined style={MenuSize} />,
    navLink: "/admin/migration",
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <IoMdSettings style={MenuSize} />,
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

export default menuItems;
