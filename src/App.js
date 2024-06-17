import React, { Suspense } from "react";

// ** Router Import
import Router from "./router/Router";
import "../src/views/Custome/common.scss";

const App = () => {
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
