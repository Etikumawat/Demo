// ** Icons Import
import { PointOfSale } from "@mui/icons-material";
import { HiHome } from "react-icons/hi2";
import { LuShoppingBag } from "react-icons/lu";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoReceiptSharp } from "react-icons/io5";
import { RiShoppingBag3Fill } from "react-icons/ri";
const MenuSize = { width: "22px", height: "22px" };

const menuItems = [
  {
    id: "dashboards",
    title: "Dashboard",
    icon: <HiHome />,
    navLink: "/source/dashboard",
  },
  {
    id: "Purchase Requisition",
    title: "PR",
    icon: <BiSolidPurchaseTag />,
    navLink: "/source/pr",
  },
  {
    id: "RFQ",
    title: "RFQ",
    icon: <IoReceiptSharp />,
    navLink: "/source/rfq",
  },
  {
    id: "Purchase Order",
    title: "Purchase Order",
    icon: <RiShoppingBag3Fill />,
    navLink: "/source/purchaseorder",
  },
];

export default menuItems;
