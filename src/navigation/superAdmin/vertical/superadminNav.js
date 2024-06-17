// ** Icons Import
import {
  Business,
  Toll,
  ManageAccounts,
  Inventory2,
  Api,
  Security,
  PointOfSale,
  Rotate90DegreesCcw,
  Gradient,
  Receipt,
  ReceiptLong,
} from "@mui/icons-material";
import { MdOutlineListAlt, MdOutlineStackedBarChart } from "react-icons/md";
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
  List,
} from "react-feather";
import { BiBarcodeReader } from "react-icons/bi";
const subMenuSize = { width: "17px", height: "17px" };
const MenuSize = { width: "22px", height: "22px" };

const menuItems = [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <MdOutlineStackedBarChart style={MenuSize} />,
    navLink: "/dashboard",
  },
  {
    id: "Suppliers",
    title: "Suppliers",
    icon: <FaTruckMoving style={MenuSize} />,
    navLink: "/admin/supplier",
  },

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
        id: "Storage Loc",
        title: "Storage Loc",
        icon: <Toll size={12} />,
        navLink: "/admin/storage-location",
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
        id: "GST Compliance",
        title: "GST Compliance",
        icon: <Toll size={12} />,
        navLink: "/admin/gstcompliance",
      },
    ],
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
    id: "Purchase Order",
    title: "PO",
    icon: <MdOutlineListAlt />,
    children: [
      {
        id: "PO List",
        title: "List",
        icon: <List />,
        navLink: "/supplier/PoList",
      },
    ],
  },
  {
    id: "ASN",
    title: "ASN/SCR",
    icon: <PointOfSale size={20} />,
    navLink: "/supplier/asn",
  },
  {
    id: "scanQr",
    title: "Scan Qr",
    icon: <BiBarcodeReader />,
    navLink: "/supplier/scanqr",
  },
  {
    id: "Qr Settings",
    title: "Asn Print Settings",
    icon: <IoMdPrint />,
    navLink: "/supplier/QrSettings",
  },
  {
    id: "sapinvoice",
    title: "Asn/Scr-Invoice",
    icon: <ReceiptLong />,
    navLink: "/sapinvoice",
  },
  {
    id: "Bulk Invoice",
    title: "Bulk Invoice",
    icon: <Receipt />,
    navLink: "/bulkinvoice",
  },
  {
    id: "Extract Invoice",
    title: "Extract Invoice",
    icon: <Gradient size={12} />,
    navLink: "supplier/invoice",
  },
  {
    id: "Invoice Field Mapping",
    title: "Field Mapping",
    icon: <Rotate90DegreesCcw />,
    navLink: "supplier/fieldmap",
  },
  {
    id: "Activity Logs",
    title: "Activity Logs",
    icon: <Activity style={MenuSize} />,
    navLink: "/admin/activitylogs",
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
