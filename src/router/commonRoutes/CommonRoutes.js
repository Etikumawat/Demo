import { lazy } from "react";
import GrnList from "../../views/Invoices/GrnList.jsx";
// const DashboardSupplier = lazy(() => import("../../views/supplier/dashboard"));
const ScanQr = lazy(() => import("../../views/asn/ScanQr.jsx"));
const SapInvoice = lazy(() => import("../../views/Invoices/SapInvoice.jsx"));
const ScanHistory = lazy(() => import("../../views/common/ScanedHistory.jsx"));
const JsonView = lazy(() => import("../../views/Invoices/JsonInvoiceView.jsx"));
const Profile = lazy(() => import("../../views/admin/settings/profile.jsx"));
const BulkInvoice = lazy(() => import("../../views/Invoices/BulkInvoice.jsx"));
const GIList = lazy(() => import("../../views/Invoices/GIList.jsx"));

const Notification = lazy(() =>
  import("../../@core/layouts/components/navbar/AllNotificationsPage.js")
);

const CommonRoutes = [
  {
    path: "/scanqr",
    element: <ScanQr />,
  },
  {
    path: "/all-notifications",
    element: <Notification />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/ScannedHistory",
    element: <ScanHistory />,
  },
  {
    path: "/invoiceupload",
    element: <BulkInvoice />,
  },
  {
    path: "/sapinvoice",
    element: <SapInvoice />,
  },
  {
    path: "/jsonview",
    element: <JsonView />,
  },
  {
    path: "/grnlist",
    element: <GrnList />,
  },
  {
    path: "/GIList",
    element: <GIList />,
  },
];

export default CommonRoutes;
