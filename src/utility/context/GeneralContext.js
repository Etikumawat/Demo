import { createContext, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import themeConfig from "../../configs/themeConfig";
import toast from "react-hot-toast";
const GeneralContext = createContext();

const MyContext = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState();
  const [loading, setLoading] = useState(true);

  let userdata = localStorage.getItem("userData");
  const info = JSON.parse(userdata);
  const id = info?.supplierId;
  // asn chart states
  const [asnChartLoading, seAsnChartLoading] = useState(true);
  const [asnChartValue, setAsnChartValue] = useState();
  const [asnValueTotal, setAsnValueTotal] = useState();
  const asnValueTotalRef = useRef(null);

  // scr chart states
  const [scrChartLoading, setScrChartLoading] = useState(true);
  const [scrChartValue, setScrChartValue] = useState();
  const scrValueTotalRef = useRef(null);

  const getAsnChartData = () => {
    let path = `/api/v1/admin/dashboard/detailedAsnSupplierWise/${id}`;

    if (info?.role_name === "Admin") {
      path = "/api/v1/admin/dashboard/detailedAsn";
    }

    seAsnChartLoading(true);
    axios.post(new URL(path, themeConfig.backendUrl)).then((res) => {
      if (res.data.error) {
        console.log(res.data.message);
        return toast.error(res.data.message);
      } else {
        setAsnChartValue(res.data);
        setAsnValueTotal(res.data.asnTotal);
        asnValueTotalRef.current = res.data.asnTotal;
        seAsnChartLoading(false);
      }
    });
  };

  const getScrChartData = () => {
    let path = `/api/v1/admin/dashboard/detailedScrSupplierWise/${id}`;

    if (info?.role_name === "Admin") {
      path = "/api/v1/admin/dashboard/detailedScr";
    }
    setScrChartLoading(true);
    axios.post(new URL(path, themeConfig.backendUrl)).then((res) => {
      if (res.data.error) {
        console.log(res.data.message);
        return toast.error(res.data.message);
      } else {
        setScrChartValue(res.data);
        scrValueTotalRef.current = res.data.scrTotal;
        setScrChartLoading(false);
      }
    });
  };

  const getAnalytics = () => {
    let path = "/api/admin/dashboard/percentage";
    setLoading(true);
    axios.post(new URL(path, themeConfig.backendUrl)).then((res) => {
      if (res.data.error) {
        toast.error(res.data.message);
        console.log("api error");
        return;
      } else {
        setAnalyticsData(res.data.data);
        setLoading(false);
        return;
      }
    });
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  };
  const value = {
    getScrChartData,
    scrChartLoading,
    scrChartValue,
    scrValueTotalRef,
    getAsnChartData,
    asnChartLoading,
    asnChartValue,
    asnValueTotal,
    asnValueTotalRef,
    getAnalytics,
    analyticsData,
    loading,
  };

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
};

export { GeneralContext, MyContext };
