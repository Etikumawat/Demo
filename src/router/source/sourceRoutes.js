import { lazy } from "react";
const DashboardAdmin = lazy(() =>
  import("../../views/Analytics/AnalyticsDash")
);
const PurchaseOrder = lazy(() => import("../../views/PO/CreatePO"));
const RFQ = lazy(() => import("../../views/RFQ/CreateRFQ"));
const PR = lazy(() => import("../../views/PR/CreatePR"));
const SourceRoutes = [
  {
    path: "/source/dashboard",
    element: <DashboardAdmin />,
  },
  {
    path: "/source/pr",
    element: <PR />,
  },
  {
    path: "/source/rfq",
    element: <RFQ />,
  },
  {
    path: "/source/purchaseorder",
    element: <PurchaseOrder />,
  },
];

export default SourceRoutes;
