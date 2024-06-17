// ** Icons Import
import { PointOfSale, Settings } from "@mui/icons-material";
import { HiHome } from "react-icons/hi2";
import { BiBarcodeReader } from "react-icons/bi";
import { BiSolidUserDetail } from "react-icons/bi";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { List, User } from "react-feather";
import { MdOutlineListAlt } from "react-icons/md";
const subMenuSize = { width: "17px", height: "17px" };
export default [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <HiHome size={20} />,
    navLink: "/supplier/dashboard",
  },
  {
    id: "Details",
    title: "Details",
    icon: <BiSolidUserDetail />,
    navLink: "/supplier/details",
  },
  {
    id: "Purchase Order",
    title: "PO",
    icon: <RiShoppingBag3Fill />,
    children: [
      {
        id: "Create PO",
        title: "Create PO",
        icon: <MdOutlineListAlt style={subMenuSize} />,
        navLink: "/supplier/purchaseorder",
      },
      {
        id: "PO List",
        title: "List PO",
        icon: <List style={subMenuSize} />,
        navLink: "/supplier/PoList",
      },
    ],
  },
  {
    id: "ASN/SCR",
    title: "ASN/SCR",
    icon: <PointOfSale size={20} />,
    children: [
      {
        id: "ASN",
        title: "Create",
        icon: <MdOutlineListAlt style={subMenuSize} />,
        navLink: "/supplier/addasn",
      },
      {
        id: "ASN",
        title: "List",
        icon: <List style={subMenuSize} />,
        navLink: "/supplier/asn",
      },
    ],
  },

  {
    id: "scanQr",
    title: "Scan",
    icon: <BiBarcodeReader />,
    navLink: "/supplier/scanqr",
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
