// ** Router imports
import { lazy, useEffect } from "react";

// ** Router imports
import { useRoutes, Navigate, useNavigate } from "react-router-dom";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout";

// ** Utils
import { getUserData, getHomeRouteForLoggedInUser } from "../utility/Utils";

// ** GetRoutes
// import { getRoutes } from './routes'
import { getAdminRoutes } from "./admin";
import { getSupplierRoutes } from "./supplier";
import { getApproverRoutes } from "./approver";
import { getSourceRoutes } from "./source";
import { getCommonRoutes } from "./commonRoutes";
import { getSuperadminRoutes } from "./superAdmin";
import TermsAndConditions from "../views/components/Terms&Conditions";
import PrivacyPolicy from "../views/components/PrivacyPolicy";

// ** Components
const Error = lazy(() => import("../views/pages/misc/Error"));
const Login = lazy(() => import("../views/pages/authentication/Login"));
const ScanQr = lazy(() => import("../views/asn/ScanQr"));
const NotAuthorized = lazy(() => import("../views/pages/misc/NotAuthorized"));
const Onboarding = lazy(() => import("../views/forms/wizard/SupplierRegister"));
const ResetPassword = lazy(() =>
  import("../views/pages/authentication/ResetPassword")
);
const ForgetPassword = lazy(() =>
  import("../views/pages/authentication/ForgotPasswordBasic")
);

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();
  const navigate = useNavigate();

  const basicRoutes = [
    "/supplier/register",
    "/reset-password",
    "/forgot-password",
    "/auth/not-auth",
    "/terms-conditions",
    "/privacy-policy",
  ];
  // if there is no user data in the localstorage then redirect to /login but allow basic routes
  useEffect(() => {
    const user = getUserData();
    const currentPath = window.location.pathname;
    if (!user && !basicRoutes.includes(currentPath)) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // const allRoutes = getRoutes(layout)
  let allAdminRoutes = null;
  let allSupplierRoutes = null;
  let allApproverRoutes = null;
  let allSourceRoutes = null;
  let allCommonRoutes = null;
  let allSuperadminRoutes = null;

  const user = getUserData();
  if (user) {
    allCommonRoutes = getCommonRoutes(layout);
    if (user.role_name === "Admin") {
      allAdminRoutes = getAdminRoutes(layout);
    } else if (user.role_name === "Supplier") {
      allSupplierRoutes = getSupplierRoutes(layout);
    } else if (user.role_name === "Approver") {
      allApproverRoutes = getApproverRoutes(layout);
    } else if (user.role_name === "Source") {
      allSourceRoutes = getSourceRoutes(layout);
    } else if (
      !["Admin", "Supplier", "Approver", "Source"].includes(user.role_name)
    ) {
      allAdminRoutes = getAdminRoutes(layout);
      allSupplierRoutes = getSupplierRoutes(layout);
      allApproverRoutes = getApproverRoutes(layout);
      allSourceRoutes = getSourceRoutes(layout);
      allSuperadminRoutes = getSuperadminRoutes(layout);
      allCommonRoutes = getCommonRoutes(layout);
    }
  }

  const getHomeRoute = () => {
    if (user) {
      return getHomeRouteForLoggedInUser(user.role_name);
    } else {
      return "/login";
    }
  };

  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: "/login",
      element: <BlankLayout />,
      children: [{ path: "/login", element: <Login /> }],
    },
    {
      path: "/auth/not-auth",
      element: <BlankLayout />,
      children: [{ path: "/auth/not-auth", element: <NotAuthorized /> }],
    },
    {
      path: "*",
      element: <BlankLayout />,
      children: [
        {
          path: "supplier/register",
          element: <Onboarding />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "forgot-password",
          element: <ForgetPassword />,
        },
        {
          path: "terms-conditions",
          element: <TermsAndConditions />,
        },
        {
          path: "privacy-policy",
          element: <PrivacyPolicy />,
        },
        {
          path: "*",
          element: user ? <Error /> : <NotAuthorized />,
        },
      ],
    },
    // ...allRoutes,

    ...(allAdminRoutes ? allAdminRoutes : []),
    ...(allSupplierRoutes ? allSupplierRoutes : []),
    ...(allApproverRoutes ? allApproverRoutes : []),
    ...(allSourceRoutes ? allSourceRoutes : []),
    ...(allCommonRoutes ? allCommonRoutes : []),
    ...(allSuperadminRoutes ? allSuperadminRoutes : []),
  ]);

  return routes;
};

export default Router;
