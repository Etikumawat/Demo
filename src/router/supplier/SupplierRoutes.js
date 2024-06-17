import { lazy } from "react";
const InvoiceFieldMap = lazy(() =>
  import("../../views/Invoices/InvoiceFieldMap.jsx")
);
const DashboardSupplier = lazy(() =>
  import("../../views/supplier/dashboard/SupplierDashboard.js")
);
const QrSettings = lazy(() => import("../../views/asn/Qrsettings.jsx"));

// const SupplierPO = lazy(() => import("../../views/supplier/PR/purchaseOrder"));
const PurchaseOrder = lazy(() => import("../../views/PO/CreatePO"));
const Details = lazy(() =>
  import("../../views/supplier/Details/SupplierView.js")
);
const Invoice = lazy(() => import("../../views/Invoices/Invoice.jsx"));
const ASN = lazy(() => import("../../views/asn/ListAsn.jsx"));
const AddASN = lazy(() => import("../../views/asn/CreateAsn.jsx"));
const ViewAsn = lazy(() => import("../../views/asn/ViewAsn.jsx"));
const ScanQr = lazy(() => import("../../views/asn/ScanQr.jsx"));
const Profile = lazy(() => import("../../views/admin/settings/profile"));
const PoView = lazy(() => import("../../views/supplier/PO/PoView.jsx"));
const PoList = lazy(() => import("../../views/supplier/PO/PoList.jsx"));
const Print = lazy(() => import("../../views/asn/print.jsx"));


const GenerateIRN = lazy(() => import("../../views/asn/GenerateIRN.jsx"));

const SupplierRoutes = [
  {
    path: "/supplier/dashboard",
    element: <DashboardSupplier />,
  },
  {
    path: "/supplier/details",
    element: <Details />,
  },
  {
    path: "/supplier/invoice",
    element: <Invoice />,
  },
  {
    path: "/supplier/fieldmap",
    element: <InvoiceFieldMap />,
  },
  {
    path: "/supplier/asn/print",
    element: <Print />,
  },
  {
    path: "/supplier/purchaseorder",
    element: <PurchaseOrder />,
  },
  {
    path: "/supplier/QrSettings",
    element: <QrSettings />,
  },
  {
    path: "/supplier/asn",
    element: <ASN />,
  },
  {
    path: "/supplier/addasn",
    element: <AddASN />,
  },
  {
    path: "/supplier/PoView",
    element: <PoView />,
  },
  {
    path: "/supplier/PoList",
    element: <PoList />,
  },
  {
    path: "/supplier/viewasn/:id",
    element: <ViewAsn />,
  },
  {
    path: "/supplier/scanqr",
    element: <ScanQr />,
  },
  {
    path: "/supplier/generateirn/:id",
    element: <GenerateIRN />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default SupplierRoutes;
