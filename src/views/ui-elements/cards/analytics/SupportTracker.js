// ** React Imports
import { useEffect, useState } from "react";
import themeConfig from "../../../../configs/themeConfig";
// ** Third Party Components
import axios from "axios";
import Chart from "react-apexcharts";

import toast from "react-hot-toast";

// ** Custom CSS
import "../../../Analytics/AnalyticsDash.css";

import { CircularProgress } from "@mui/material";
import { AlertCircle } from "react-feather";

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { GeneralContext } from "../../../../utility/context/GeneralContext";
import { useContext } from "react";
const SupportTracker = (props) => {
  const [loading, setLoading] = useState(false);
  const { analyticsData } = useContext(GeneralContext);
  const value = analyticsData;
  useEffect(() => {
    analyticsData ? setLoading(false) : setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);
  const data = {
    title: "Vendors Status Tracker",
    last_days: ["Last 28 Days", "Last Month", "Last Year"],
    totalVendor: value?.registeredVendors,
    verifiedVendor: value?.verifiedVendors,
    approvedVendor: value?.approvedVendors,
    pendingVendor: value?.pendingVendors,
    queriedVendors: value?.queriedVendors,
  };
  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: "#fff",
            strokeWidth: "100%",
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: "Public Sans",
              fontSize: "1rem",
            },
            value: {
              offsetY: 15,
              fontFamily: "Public Sans",
              fontSize: "1.714rem",
            },
          },
        },
      },
      colors: [props.danger],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Approved Vendors"],
    },
    series = [value?.percentageApprovedVendors];
  // series = [90];
  // const glassEffect1 = {
  //   borderRadius: "10px",
  //   backdropFilter: "blur(5px)",
  //   color: "white",
  //   background: "linear-gradient(135deg, #ff6700,#f08300,#ed9121)",
  // };
  // const headerStyle = {
  //   color: "#f8f8f8",
  // };

  return data !== null ? (
    <Card className="status-tracker">
      <CardHeader className="pb-0">
        <CardTitle tag="h4">{data.title}</CardTitle>
        <UncontrolledDropdown className="chart-dropdown">
          <DropdownToggle
            color=""
            className="bg-transparent btn-sm border-0 p-50"
          >
            {/* Last 7 days */}
          </DropdownToggle>
          <DropdownMenu end>
            {data.last_days.map((item) => (
              <DropdownItem className="w-100" key={item}>
                {item}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader>
      {value ? (
        <CardBody>
          <Row>
            <Col sm="2" className="d-flex flex-column flex-wrap text-center">
              <h1 className="font-large-2 fw-bolder mt-2 mb-0">
                {data.totalVendor}
              </h1>
              <CardText>Vendors</CardText>
            </Col>
            <Col sm="10" className="d-flex justify-content-center">
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={270}
                id="support-tracker-card"
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-between mt-1">
            <div className="text-center">
              <span className="font-large-1 fw-bolder">
                {data.pendingVendor}
              </span>
              <CardText className="mb-50 fw-bold">New Vendor</CardText>
            </div>
            {/* <div className="text-center">
            <CardText className="mb-50" style={headerStyle}>
              Verified Vendor
            </CardText>
            <span className="font-large-1 fw-bold">{data.verifiedVendor}</span>
          </div> */}
            <div className="text-center">
              <span className="font-large-1 fw-bolder">
                {data.queriedVendors}
              </span>
              <CardText className="mb-50 fw-bold">Queried Vendor</CardText>
            </div>
          </div>
        </CardBody>
      ) : // </Card >
      // loading
      loading ? (
        <Card className="mb-50 status-tracker">
          <CircularProgress style={{ color: "#e06522" }} />
        </Card>
      ) : (
        <Card className="mb-50 status-tracker">
          <AlertCircle size={35} style={{ color: "#e06522" }} />
        </Card>
      )}
    </Card>
  ) : null;
};

export default SupportTracker;
