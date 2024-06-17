// ** Third Party Components
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import themeConfig from "../../../../configs/themeConfig";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import toast from "react-hot-toast";
import { Foundation } from "@mui/icons-material";
import { AlertCircle } from "react-feather";

const ApexRadiarChart = ({ loading, value, valueTotalRef }) => {
  const donutColors = {
    series2: "#f26c13",
    series3: "#2b9bf4",
    series1: "#6610f2",
    series4: "#28c76f",
    series5: "#ea5455",
  };

  const options = {
    legend: {
      show: true,
      position: "bottom",
    },
    labels: ["Shipped", "Gate Inward", "Received", "Invoiced", "Cancelled"],

    colors: [
      donutColors.series2,
      donutColors.series3,
      donutColors.series1,
      donutColors.series4,
      donutColors.series5,
    ],
    dataLabels: {
      enabled: true,
      formatter(val, opts) {
        return `${opts.w.globals.series[opts.seriesIndex]}`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: "2rem",
              fontFamily: "Public Sans",
            },
            value: {
              fontSize: "1rem",
              fontFamily: "Public Sans",
              formatter(val) {
                return `${val}`;
              },
            },
            total: {
              show: true,
              fontSize: "1.5rem",
              label: "Total",
              formatter: () => {
                return valueTotalRef.current;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320,
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: "1.5rem",
                  },
                  value: {
                    fontSize: "1rem",
                  },
                  total: {
                    fontSize: "1.5rem",
                  },
                },
              },
            },
          },
        },
      },
    ],
  };
  const series = [
    value?.asnMaterialshipped
      ? value?.asnMaterialshipped
      : value?.asnMaterialShipped,
    value?.asnMaterialGateInward,
    value?.asnMaterialReceived,
    value?.asnInvoiced,
    value?.asnCancelled,
  ];
  return (
    <Card
      style={{
        boxShadow: "none",
        marginBottom: "unset",
        // height: "50vh",
      }}
      //  style={{ border: "1px solid #f26c13" }}
    >
      <CardHeader className="d-flex justify-content-between">
        <CardTitle style={{ color: "#f26c13" }} className="mb-75" tag="h4">
          Advance Shipping Note
        </CardTitle>
        <CardTitle style={{ color: "#f26c13" }} className="mb-75" tag="h4">
          Total : {value?.asnTotal ? value?.asnTotal : "NA"}
        </CardTitle>
      </CardHeader>
      <CardBody>
        {loading ? (
          // Render loading icon or message here
          <div style={{ textAlign: "center" }}>
            <AlertCircle size={50} color="#f26c13" />
          </div>
        ) : (
          <Chart options={options} series={series} type="donut" height={285} />
        )}
      </CardBody>
    </Card>
  );
};

export default ApexRadiarChart;
