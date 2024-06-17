import { Row, Col, Card, CardBody, CardText, Badge } from "reactstrap";
import { useContext } from "react";
import React, { useState, useEffect } from "react";
import { ThemeColors } from "@src/utility/context/ThemeColors";
import { kFormatter } from "@utils";
import axios from "axios";
import themeConfig from "../../configs/themeConfig";
import { CircularProgress, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// ** Demo Components
import { useRTL } from "@hooks/useRTL";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "./AnalyticsDash.css";
import toast from "react-hot-toast";
import PanRegistered from "@src/views/ui-elements/cards/statistics/PanRegistered";
import ApexColumnCharts from "../ui-elements/cards/statistics/DataChart";
// ** Styles
import "@styles/react/libs/charts/apex-charts.scss";
import SupportTracker from "../ui-elements/cards/analytics/SupportTracker";
import SapRegisteredCard from "../ui-elements/cards/cards/SapRegisteredCard";
import GstRegistered from "../ui-elements/cards/statistics/GstRegistered";
import ScrChart from "../ui-elements/cards/statistics/ScrChart";
import AsnChart from "../ui-elements/cards/statistics/AsnChart";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Clock, Eye } from "react-feather";
import { GeneralContext } from "../../utility/context/GeneralContext";
import Slider from "react-slick";
// import { borderRadius, height, minHeight } from "@mui/system";
import "../ui-elements/cards/analytics/customecard.scss";
const AnalyticsDashboard = () => {
  const {
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
  } = useContext(GeneralContext);
  const [isRtl] = useRTL();
  const value = analyticsData;
  const [listLoading, setListLoading] = useState(false);
  const { colors } = useContext(ThemeColors);
  const [pendingData, setData] = useState(null);
  const gstpanData = analyticsData;
  const navigate = useNavigate();
  let userData = localStorage.getItem("userData");
  const da = JSON.parse(userData);
  const role = da.role_name;

  const handleEdit = (id) => {
    navigate(`/suppliers-details`, { state: { id: id } });
  };
  const basicColumns = [
    {
      name: "#",
      width: "72px",
      column: "sr",
      sortable: true,
      selector: (row, index) => index + 1,
    },
    {
      name: "Suppliers",
      width: "250px",
      column: "suppliers",
      selector: (row) => row.supplier_name,
      sortable: true,
      cell: (row) => (
        <Typography>
          <Link
            // color="primary"
            onClick={(e) => {
              e.preventDefault();
              handleEdit(row.id);
            }}
          >
            {row.supplier_name}
          </Link>
        </Typography>
      ),
    },
    {
      name: "status",
      column: "status",
      sortable: true,
      // width: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        const badgeStyle = {
          width: "100px",
          padding: "8px",
        };
        if (row.status === "pending") {
          return (
            <Badge style={badgeStyle} color="warning">
              <Clock /> Pending
            </Badge>
          );
        } else {
          return (
            <Badge style={badgeStyle} color="success">
              {row.status}
            </Badge>
          );
        }
      },
    },
    {
      name: "Action",
      width: "100px",
      column: "status",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Eye
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                handleEdit(row.id);
              }}
            />
          </>
        );
      },
    },
  ];
  const suppliersIndex = basicColumns.findIndex(
    (column) => column.name === "Suppliers"
  );

  if (da?.role_name !== "Approver") {
    const approverColumn = {
      name: "Approver",
      width: "200px",
      column: "Approver",
      sortable: true,
      selector: (row) => row.registeryAuthority,
      cell: (row) => <div>{row.registeryAuthority}</div>,
    };

    basicColumns.splice(suppliersIndex + 1, 0, approverColumn);
  }
  const request = async () => {
    setListLoading(true);
    let url = "";
    const queryParams = {
      offset: 0,
      limit: 25,
      search: "",
      status: "pending",
      order: "desc",
      sort: "created_at",
    };

    if (da?.role_name === "Approver") {
      queryParams.user_id = da.id;
      url = new URL("/api/v1/supplier/supplier/filter", themeConfig.backendUrl);
    } else {
      url = new URL(
        "/api/v1/supplier/supplier/listsupplier",
        themeConfig.backendUrl
      );
    }

    return axios
      .post(url.toString(), queryParams)
      .then((response) => {
        const responseData = response.data;
        if (responseData.error) {
          toast.error(responseData.message);
        } else {
          setData(responseData.data);
        }
        setListLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("An error occurred while fetching data.");
        setListLoading(false);
      });
  };

  useEffect(() => {
    request();
    getAnalytics();
    getAsnChartData();
    getScrChartData();
  }, []);
  const data = [
    {
      count: value && value.registeredVendors ? value.registeredVendors : "0",
      text: "Registered Vendors",
      className: "card-orange",
    },
    {
      count: value && value.pendingVendors ? value.pendingVendors : "0",
      text: "Pending Vendors",
      className: "card-purple cursor-pointer",

      onClick: () => {
        const colElement = document.getElementById("scrollToCol");
        if (colElement) {
          colElement.scrollIntoView({ behavior: "smooth" });
        }
      },
    },
    // {
    //   count:
    //     value && value.verifiedVendorCount ? value.verifiedVendorCount : "0",
    //   text: "Verified Vendors",
    //   className: "card-blue",
    // },
    {
      count: value && value.approvedVendors ? value.approvedVendors : "0",
      text: "Approved Vendors",
      className: "card-green",
    },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set autoplay speed (in milliseconds)
    arrows: false, // Hide arrows
  };
  return (
    <div id="dashboard-analytics">
      <Row>
        {data.map((item, index) => (
          <Col lg="4" md="6" sm="12" key={index} className="analytics-card">
            <Card className={item.className}>
              <CardBody className="text-center ">
                {[...Array(20)].map((_, index) => (
                  <div key={index} className="firefly"></div>
                ))}
                <div className="text-center" onClick={item.onClick}>
                  <h1 style={{ fontSize: "40px" }} className="mb-1 text-white">
                    {loading ? (
                      <CircularProgress style={{ color: "white" }} />
                    ) : (
                      <h2
                        style={{ fontSize: "40px" }}
                        className="mb-1 text-white"
                      >
                        {item.count}
                      </h2>
                    )}
                  </h1>
                  <CardText className="m-auto">{item.text}</CardText>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="match-height ">
        <Col lg="6" md="12" xs="12" className="card-hoverEffect">
          <SupportTracker
            primary={colors.primary.main}
            danger={colors.success.main}
          />
        </Col>
        <Col lg="6" md="12" xs="12">
          <Row>
            <Col lg="6" md="6" xs="12" className="card-hoverEffect">
              <GstRegistered kFormatter={kFormatter} gstData={gstpanData} />
            </Col>
            <Col lg="6" md="6" xs="12" className="card-hoverEffect">
              <PanRegistered kFormatter={kFormatter} panData={gstpanData} />
            </Col>
          </Row>
          <Col lg="12" md="12" xs="12" className="card-hoverEffect mb-2">
            <SapRegisteredCard />
          </Col>
        </Col>
      </Row>
      <Row className="match-height">
        <Col lg={role === "Admin" ? "7" : "12"} xs="12" id="scrollToCol">
          {pendingData !== null ? (
            <div>
              <Card
                style={{
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    height: "50vh",
                    overflowY: "auto",
                    overflowX: "hidden !important",
                  }}
                >
                  <style>
                    {`
            ::-webkit-scrollbar {
              width: 4px;
              height:4px;
              display:none !important;
            }
            ::-webkit-scrollbar-track {
              background: #f1f1f1; 
              color:#000
            }
            ::-webkit-scrollbar-thumb {
              background: gray; 
              border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #555; 
            }
          `}
                  </style>
                  {listLoading ? (
                    <div style={{ textAlign: "center" }}>
                      <AlertCircle size={50} color="#f26c13" />
                    </div>
                  ) : pendingData.length > 0 ? (
                    <DataTable
                      noHeader
                      data={pendingData}
                      columns={basicColumns}
                      className="react-dataTable table-radius"
                    />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <AlertCircle size={50} color="#f26c13" />
                      <h4>No vendors are pending</h4>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : loading ? (
            <>
              <Card className="status-tracker">
                <CircularProgress style={{ color: "#f26c13" }} />
              </Card>
            </>
          ) : (
            <Card className="status-tracker">
              <h3>No Data Available</h3>
              <AlertCircle size={35} style={{ color: "#e06522" }} />
            </Card>
          )}
        </Col>
        <Col lg="5" xs="12" className="d-flex">
          {role === "Admin" && (
            <>
              <Slider
                style={{
                  boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.1)",
                  borderRadius: "12px",
                  height: "50vh",
                  backgroundColor: "rgba(255, 255, 255)",
                }}
                {...settings}
              >
                <div className="col-md-6 col-xs-12">
                  <AsnChart
                    kFormatter={kFormatter}
                    loading={asnChartLoading}
                    value={asnChartValue}
                    valueTotal={asnValueTotal}
                    valueTotalRef={asnValueTotalRef}
                  />
                </div>
                <div className="col-md-6 col-xs-12">
                  <ScrChart
                    kFormatter={kFormatter}
                    loading={scrChartLoading}
                    value={scrChartValue}
                    valueTotalRef={scrValueTotalRef}
                  />
                </div>
              </Slider>
            </>
          )}
        </Col>
      </Row>
      <Row className="match-height mt-2">
        <Col lg="12" md="12" sm="12">
          <ApexColumnCharts direction={isRtl ? "rtl" : "ltr"} />
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
