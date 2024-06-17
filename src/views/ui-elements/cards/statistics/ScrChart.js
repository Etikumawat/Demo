// ** Third Party Components
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import themeConfig from "../../../../configs/themeConfig";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import toast from "react-hot-toast";
import { AlertCircle } from "react-feather";

const ApexRadiarChart = ({ loading, value, valueTotalRef }) => {
  const donutColors = {
    series2: "#f26c13",
    series3: "#7367f0",
    series4: "#ea5455",
    series5: "#28c76f",
  };
  const series = [
    value?.scrRequested,
    value?.scrAccepted,
    value?.scrCancelled,
    value?.scrInvoiced,
  ];
  const options = {
    legend: {
      show: true,
      position: "bottom",
    },
    labels: ["Requested", "Accepted", "Cancelled", "Invoiced"],

    colors: [
      donutColors.series2,
      donutColors.series3,
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
  return (
    <Card
      style={{
        boxShadow: "none",
        marginBottom: "unset",
        // height: "50vh"
      }}
      // style={{ border: "1px solid #00cfe8" }}
    >
      <CardHeader className="d-flex justify-content-between">
        <CardTitle style={{ color: "#00cfe8" }} className="mb-75" tag="h4">
          Service Compliance Request
        </CardTitle>
        <CardTitle style={{ color: "#00cfe8" }} className="mb-75" tag="h4">
          Total : {value?.scrTotal ? value?.scrTotal : "NA"}
        </CardTitle>
      </CardHeader>
      <CardBody>
        {loading ? (
          // Render loading icon or message here
          <div style={{ textAlign: "center" }}>
            <AlertCircle size={50} color="#00cfe8" />
          </div>
        ) : (
          <Chart options={options} series={series} type="donut" height={285} />
        )}
      </CardBody>
    </Card>
  );
};

export default ApexRadiarChart;
