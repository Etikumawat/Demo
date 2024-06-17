import themeConfig from "../../../configs/themeConfig";
import { kFormatter } from "@utils";
import ScrChart from "../../ui-elements/cards/statistics/ScrChart";
import AsnChart from "../../ui-elements/cards/statistics/AsnChart";
import Avatar from "@components/avatar";
import "@styles/react/libs/charts/apex-charts.scss";
import StatsWithAreaChart from "@components/widgets/stats/StatsWithAreaChart";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import * as Icon from "@mui/icons-material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Card,
  CardText,
  CardBody,
  Col,
  CardHeader,
  Row,
  CardTitle,
} from "reactstrap";
import { Beenhere } from "@mui/icons-material";
import { GeneralContext } from "../../../utility/context/GeneralContext";

const AnalyticsDashboard = () => {
  const vendorCodeJSON = localStorage.getItem("vendorCode");
  const [poData, setPoData] = useState();
  const [deliveryData, setDeliveryData] = useState();
  const [loading, setLoading] = useState(false);
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
  } = useContext(GeneralContext);
  useEffect(() => {
    getScrChartData();
    getAsnChartData();
    const form = {
      supplier: vendorCodeJSON,
    };
    setLoading(true);
    axios
      .post(
        new URL(
          "/api/v1/supplier/po/dashboard/po-service",
          themeConfig.backendUrl
        ),
        {
          ...form,
        }
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          return toast.error(res.data.message);
        }
        setLoading(false);
        setPoData(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    axios
      .post(
        new URL(
          "/api/v1/admin/dashboard/deliveryPerformance",
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          return toast.error(res.data.message);
        } else {
          setLoading(false);
          setDeliveryData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const transactionsArr = [
    {
      title: "Material Shipped",
      color: "light-primary",
      subtitle: "67%",
      amount: deliveryData?.percentage,
      Icon: Icon.LocalShippingOutlined,
      down: true,
    },
    {
      title: "Goods Gate Inward",
      color: "light-warning",
      subtitle: "77%",
      amount: deliveryData?.percentage,
      Icon: Icon.DoorBackOutlined,
      down: true,
    },
    {
      title: "Partially Recieved Goods",
      color: "light-info",
      subtitle: "87%",
      amount: deliveryData?.percentage,
      Icon: Icon.ReceiptOutlined,
      down: true,
    },
    {
      title: "Fully Recieved Goods",
      color: "light-success",
      subtitle: "45%",
      amount: deliveryData?.percentage,
      Icon: Icon.ChecklistOutlined,
      down: true,
    },
  ];
  const renderTransactions = () => {
    return (
      transactionsArr &&
      transactionsArr.map((transactionItem, index) => {
        if (deliveryData && index < deliveryData.length) {
          const deliveryItem = deliveryData[index];
          return (
            <div key={transactionItem.title} className="transaction-item">
              <div className="d-flex" key={deliveryItem.title}>
                <Avatar
                  className="rounded"
                  color={transactionItem.color}
                  icon={<transactionItem.Icon size={18} />}
                />
                <div>
                  <h6 className="transaction-title">{transactionItem.title}</h6>
                  <small>
                    {deliveryItem.count ? deliveryItem.count : "NA"}
                  </small>
                </div>
              </div>
              <p>{deliveryItem.percentage + "%"}</p>
            </div>
          );
        } else {
          return (
            <div key={transactionItem.title} className="transaction-item">
              <div className="d-flex">
                <Avatar
                  className="rounded"
                  color={transactionItem.color}
                  icon={<transactionItem.Icon size={18} />}
                />
                <div>
                  <h6 className="transaction-title">{transactionItem.title}</h6>
                </div>
              </div>
              <p>NA</p>
            </div>
          );
        }
      })
    );
  };

  const total = {
    series: [
      {
        name: "Suppliers",
        data: [15, 40, 36, 40, 39, 55, 60],
        color: "#28c76f",
      },
    ],
    analyticsData: {
      totalPoCount: poData?.totalPo,
    },
  };
  const material = {
    series: [
      {
        name: "Suppliers",
        data: [15, 60, 36, 20, 80, 99],
        color: "#f26c13",
      },
    ],
    analyticsData: {
      materialCount: poData?.material,
    },
  };
  const service = {
    series: [
      {
        name: "Suppliers",
        data: [15, 50, 15, 90, 10, 90],
        color: "#00cfe8",
      },
    ],
    analyticsData: {
      serviceCount: poData?.services,
    },
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };
  return (
    <div className="row">
      <Row>
        <Col md="4">
          <StatsWithAreaChart
            icon={<Beenhere sx={{ fontSize: 40 }} />}
            color="success"
            stats={
              loading ? (
                <CircularProgress style={{ color: "#28c76f" }} />
              ) : (
                <>
                  {total.analyticsData.totalPoCount
                    ? total.analyticsData.totalPoCount
                    : "NA"}
                </>
              )
            }
            statTitle="Total PO"
            series={total.series}
            type="area"
          />
        </Col>
        <Col md="4">
          <StatsWithAreaChart
            icon={<Beenhere sx={{ fontSize: 40 }} />}
            color="primary"
            stats={
              loading ? (
                <CircularProgress style={{ color: "#f26c13" }} />
              ) : (
                <>
                  {material.analyticsData.materialCount
                    ? material.analyticsData.materialCount
                    : "NA"}
                </>
              )
            }
            statTitle="Material PO"
            series={material.series}
            type="area"
          />
        </Col>
        <Col md="4">
          <StatsWithAreaChart
            icon={<Beenhere sx={{ fontSize: 40 }} />}
            color="info"
            stats={
              loading ? (
                <CircularProgress style={{ color: "#00cfe8" }} />
              ) : (
                <>
                  {service.analyticsData && service.analyticsData.serviceCount
                    ? service.analyticsData.serviceCount
                    : "NA"}
                </>
              )
            }
            statTitle="Service PO"
            series={service.series}
            type="area"
          />
        </Col>
      </Row>
      <Row className="match-height mb-3">
        <Col lg="8" md="12">
          <Slider
            className="mb-2"
            style={{
              boxShadow: "0 4px 24px 0 rgba(34, 41, 47, 0.1)",
              borderRadius: "12px",
              minHeight: "55vh",
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
        </Col>
        <Col lg="4" md="12">
          <Card className="card-transaction" style={{ minHeight: "55vh" }}>
            <CardHeader>
              <div>
                <CardTitle className="mb-2" tag="h4">
                  Delivery Performance
                </CardTitle>
              </div>
            </CardHeader>
            {loading ? (
              <CircularProgress
                style={{
                  color: "#f26c13",
                  margin: "auto",
                }}
              />
            ) : (
              <>
                <CardBody className="mb-2">{renderTransactions()}</CardBody>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsDashboard;
