import { lazy } from "react";
const DashboardApprover = lazy(() =>
  import("../../views/Analytics/AnalyticsDash")
);
const Supplier = lazy(() =>
  import("../../views/approver/suppliers/ApproverSuppliers")
);
const SupplierDetails = lazy(() =>
  import("../../views/supplier_details/SupplierDetails")
);

const Profile = lazy(() => import("../../views/admin/settings/profile"));
const ApproverActivityLogs = lazy(() =>
  import("../../views/approver/activity_logs/ApproverLogs")
);
const ApproverRoutes = [
  {
    path: "/dashboard",
    element: <DashboardApprover />,
  },
  {
    path: "/suppliers",
    element: <Supplier />,
  },
  {
    path: "/suppliers-details",
    element: <SupplierDetails />,
  },
  {
    path: "/approverActivitylogs",
    element: <ApproverActivityLogs />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
];

export default ApproverRoutes;
