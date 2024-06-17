// ** Icons Import
import {
  Business,
  JoinInner,
  Workspaces,
  Toll,
  ManageAccounts,
  AccountBalance,
  Architecture,
  Inventory2,
  LocalShipping,
  LocalActivityOutlined,
  LocalShippingOutlined,
  Deck,
  Balcony,
  Bungalow,
  HolidayVillageOutlined,
  HomeMax,
  Receipt,
} from "@mui/icons-material";
import {
  Home,
  Settings,
  Tool,
  User,
  Truck,
  Package,
  CreditCard,
  Layers,
  Trello,
} from "react-feather";
import { Form } from "reactstrap";
const subMenuSize = { width: "17px", height: "17px" };
const MenuSize = { width: "22px", height: "22px" };

const menuItems = [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <Home style={MenuSize} />,
    navLink: "/admin/dashboard",
  },
  {
    id: "Suppliers",
    title: "Suppliers",
    icon: <LocalShippingOutlined style={MenuSize} />,
    navLink: "/admin/supplier",
  },
  {
    id: "Master Data",
    title: "Master Data",
    icon: <Layers style={MenuSize} />,
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
      // {
      //   id: "Products",
      //   title: "Products",
      //   icon: <Package style={subMenuSize} />,
      //   navLink: "/admin/vendor",
      //   children: [
      //     {
      //       id: "Categories",
      //       title: "Categories",
      //       icon: <Toll size={12} />,
      //       navLink: "/admin/categories",
      //     },
      //     {
      //       id: "Units",
      //       title: "Units",
      //       icon: <Toll size={12} />,
      //       navLink: "/admin/products-units",
      //     },
      //     {
      //       id: "Products",
      //       title: "Products",
      //       icon: <Toll size={12} />,
      //       navLink: "/admin/products",
      //     },
      //   ],
      // },
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
    id: "invoice",
    title: "Invoice",
    icon: <Receipt style={MenuSize} />,
    navLink: "/admin/invoice",
  },
  {
    id: "Settings",
    title: "Settings",
    icon: <Settings style={MenuSize} />,
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
];

export default menuItems;
