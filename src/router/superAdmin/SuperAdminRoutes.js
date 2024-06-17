import { lazy } from "react";
const Onboarding = lazy(() =>
  import("../../views/forms/wizard/SupplierRegister")
);
const Login = lazy(() => import("../../views/pages/authentication/Login"));
const SuperAdminRoutes = [
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
  }
];

export default SuperAdminRoutes;
