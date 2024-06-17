import { lazy } from "react";
const DashboardAdmin = lazy(() =>
  import("../../views/Analytics/AnalyticsDash")
);
const BusinessGroup = lazy(() =>
  import("../../views/admin/configuration/business-group")
);
const BusinessType = lazy(() =>
  import("../../views/admin/configuration/business-type")
);
const Migration = lazy(() =>
  import("../../views/admin/migration/migrationCreate.js")
);
const ComapnyType = lazy(() =>
  import("../../views/admin/configuration/company-type")
);
const Payment = lazy(() => import("../../views/admin/configuration/payment"));
const Units = lazy(() => import("../../views/admin/configuration/units"));

const FormView = lazy(() => import("../../views/admin/formfields/formview"));
const FieldSettings = lazy(() =>
  import("../../views/admin/formfields/fieldSelection")
);
const PoFields = lazy(() => import("../../views/admin/formfields/poFields"));
const PrFields = lazy(() => import("../../views/admin/formfields/prFields"));
const CreateFormField = lazy(() =>
  import("../../views/admin/formfields/createField")
);
const Profile = lazy(() => import("../../views/admin/settings/profile"));
const Companies = lazy(() => import("../../views/admin/companies/company.jsx"));
const Department = lazy(() =>
  import("../../views/admin/departments/department")
);
const DepartmentApprover = lazy(() =>
  import("../../views/admin/departments/approver")
);
const Plants = lazy(() => import("../../views/admin/plants"));
const Roles = lazy(() => import("../../views/admin/rolespermission/roles"));
const Permissions = lazy(() =>
  import("../../views/admin/rolespermission/permissions")
);
const User = lazy(() => import("../../views/admin/rolespermission/user"));
const ApproverLevel = lazy(() =>
  import("../../views/admin/rolespermission/approverLevel")
);
const Countries = lazy(() => import("../../views/admin/settings/countries"));
const Currency = lazy(() => import("../../views/admin/settings/currency"));
const Onboarding = lazy(() =>
  import("../../views/forms/wizard/SupplierRegister")
);
const Login = lazy(() => import("../../views/pages/authentication/Login"));
const Supplier = lazy(() =>
  import("../../views/admin/supplier/AdminSuppliers")
);
const VendorClass = lazy(() => import("../../views/admin/vendor/vendor-class"));
const VendorSchema = lazy(() =>
  import("../../views/admin/vendor/vendor-schema")
);
const CronJob = lazy(() => import("../../views/admin/cronJob/cronjobList.jsx"));
const PurchaseSchema = lazy(() =>
  import("../../views/admin/vendor/purchase-group")
);
const Tds = lazy(() => import("../../views/admin/vendor/tds"));
const CalSchema = lazy(() => import("../../views/admin/vendor/cal-schema"));
const PaymentTerm = lazy(() => import("../../views/admin/vendor/payment-term"));
const StorageLocation = lazy(() =>
  import("../../views/admin/material/storageLocation")
);
const Materials = lazy(() => import("../../views/admin/material/materials"));
const MaterialGroup = lazy(() =>
  import("../../views/admin/material/materialGroup")
);
const Reconciliation = lazy(() =>
  import("../../views/admin/vendor/reconciliation")
);
const SupplierDetails = lazy(() =>
  import("../../views/supplier_details/SupplierDetails.jsx")
);
const Portalcode = lazy(() =>
  import("../../views/admin/departments/portalcode")
);
const Sap = lazy(() => import("../../views/admin/apiConfiguration/sap"));
const Thirdparty = lazy(() =>
  import("../../views/admin/apiConfiguration/thirdParty")
);
const ActivityLogs = lazy(() =>
  import("../../views/admin/log/activityLogs.jsx")
);
const MailLogs = lazy(() => import("../../views/admin/log/mailLogs.jsx"));
const MailLogView = lazy(() => import("../../views/admin/log/viewMailLog.jsx"));

const ThirdpartyAPI = lazy(() =>
  import("../../views/admin/ThirdpartyAPI/ThirdpartyApiCount.jsx")
);
const GstCompliance = lazy(() =>
  import("../../views/admin/Compliance/GstCompliance")
);
const PanCompliance = lazy(() =>
  import("../../views/admin/Compliance/PanCompliance")
);
const MsmeCompliance = lazy(() =>
  import("../../views/admin/Compliance/MsmeCompliance")
);
const Transactional = lazy(() =>
  import("../../views/admin/log/transactionalLogs.jsx")
);
const QrSettings = lazy(() => import("../../views/asn/Qrsettings"));
const SupplierLogs = lazy(() => import("../../views/admin/log/supplierLogs.jsx"));

const AdminRoutes = [
  {
    element: <Onboarding />,
    path: "/supplier/register",
    meta: {
      layout: "blank",
      publicRoute: true,
    },
  },
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/admin/dashboard",
    element: <DashboardAdmin />,
  },
  {
    path: "/suppliers-details",
    element: <SupplierDetails />,
  },
  {
    path: "/admin/companies",
    element: <Companies />,
  },
  {
    path: "/admin/units",
    element: <Units />,
  },
  {
    path: "/admin/storage-location",
    element: <StorageLocation />,
  },
  {
    path: "/admin/materials",
    element: <Materials />,
  },
  {
    path: "/admin/material-group",
    element: <MaterialGroup />,
  },
  {
    path: "/admin/QrSettings",
    element: <QrSettings />,
  },
  {
    path: "/admin/transactionallogs",
    element: <Transactional />,
  },
  {
    path: "/admin/supplier",
    element: <Supplier />,
  },
  {
    path: "/admin/migration",
    element: <Migration />,
  },
  {
    path: "/admin/gstcompliance",
    element: <GstCompliance />,
  },
  {
    path: "/admin/pancompliance",
    element: <PanCompliance />,
  },
  {
    path: "/admin/msmecompliance",
    element: <MsmeCompliance />,
  },
  {
    path: "/admin/vendor-class",
    element: <VendorClass />,
  },
  {
    path: "/admin/purchase-group",
    element: <PurchaseSchema />,
  },
  {
    path: "/admin/cal-schema",
    element: <CalSchema />,
  },
  {
    path: "/admin/payment-term",
    element: <PaymentTerm />,
  },
  {
    path: "/admin/vendor-schema",
    element: <VendorSchema />,
  },
  {
    path: "/admin/reconciliation",
    element: <Reconciliation />,
  },
  {
    path: "/admin/tds",
    element: <Tds />,
  },
  {
    path: "/admin/business-group",
    element: <BusinessGroup />,
  },
  {
    path: "/admin/business-type",
    element: <BusinessType />,
  },
  {
    path: "/admin/company-type",
    element: <ComapnyType />,
  },
  {
    path: "/admin/payment",
    element: <Payment />,
  },
  {
    path: "/admin/createField",
    element: <CreateFormField />,
  },
  {
    path: "/admin/fieldSelection",
    element: <FieldSettings />,
  },
  {
    path: "/admin/poFields",
    element: <PoFields />,
  },
  {
    path: "/admin/prFields",
    element: <PrFields />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin/formview",
    element: <FormView />,
  },
  {
    path: "/admin/departments/portalcode",
    element: <Portalcode />,
  },
  {
    path: "/admin/departments/department",
    element: <Department />,
  },

  {
    path: "/admin/department/approver",
    element: <DepartmentApprover />,
  },
  {
    path: "/admin/plants",
    element: <Plants />,
  },
  {
    path: "/admin/roles",
    element: <Roles />,
  },
  {
    path: "/admin/sap",
    element: <Sap />,
  },
  {
    path: "/admin/thirdparty",
    element: <Thirdparty />,
  },
  {
    path: "/admin/cronJob",
    element: <CronJob />,
  },
  {
    path: "/admin/activitylogs",
    element: <ActivityLogs />,
  },
  {
    path: "/admin/maillogview/:id",
    element: <MailLogView />,
  },
  {
    path: "/admin/maillogs",
    element: <MailLogs />,
  },
  {
    path: "/admin/3rdPartyApiCounts",
    element: <ThirdpartyAPI />,
  },
  {
    path: "/admin/permissions",
    element: <Permissions />,
  },
  {
    path: "/admin/user",
    element: <User />,
  },
  {
    path: "/admin/approver-level",
    element: <ApproverLevel />,
  },
  {
    path: "/admin/countries",
    element: <Countries />,
  },
  {
    path: "/admin/currency",
    element: <Currency />,
  },
  {
    path: "/admin/supplierlogs",
    element: <SupplierLogs />,
  },
];

export default AdminRoutes;
