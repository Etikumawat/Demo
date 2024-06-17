// ** Third Party Components
import Chart from "react-apexcharts";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { AlertCircle, Calendar } from "react-feather";
import axios from "axios";
import Stack from "@mui/material/Stack";
import themeConfig from "../../../../configs/themeConfig";
import { CircularProgress, LinearProgress } from "@mui/material";

import {
  Card,
  CardHeader,
  CardBody,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { selectClasses } from "@mui/base";

const ApexColumnCharts = ({ direction }) => {
  let userData = localStorage.getItem("userData");
  const da = JSON.parse(userData);
  const [value, setValue] = useState();
  const [loading, setLoading] = useState();
  const [showing, setShowing] = useState("Last 10 Days");
  const [query, setQuery] = useState({ month: "" });
  const [yearQuery, setYearQuery] = useState({ year: "" });
  const [dateQuery, setDateQuery] = useState({ startDate: "", endDate: "" });
  const [yearKey, setYearKey] = useState(0);
  const columnColors = {
    series1: "#0CAFFF",
    series2: "#705ac7",
    series3: "#0BB35C",
    series4: "#f07532",
    series5: "#EA5455",
    series6: "#3C322C",
    bg: "#EBE9F1",
  };
  const options = {
    chart: {
      height: 400,
      type: "bar",
      stacked: true,
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        colors: {
          backgroundBarColors: [
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
            columnColors.bg,
          ],
          backgroundBarRadius: 10,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "start",
    },
    colors: [
      columnColors.series1,
      columnColors.series2,
      columnColors.series3,
      columnColors.series4,
      columnColors.series5,
      columnColors.series6,
    ],
    stroke: {
      show: true,
      colors: ["transparent"],
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: value?.dates,
    },
    fill: {
      opacity: 1,
    },
    yaxis: {
      opposite: direction === "rtl",
    },
  };
  const series = [
    {
      name: "SAP Registered Vendors",
      data: value?.sap_registered_vendors,
    },
    {
      name: "Pending Vendors",
      data: value?.pending_vendors,
    },
    {
      name: "Approved Vendors",
      data: value?.approved_vendors,
    },
    {
      name: "Queried Vendors",
      data: value?.queried_vendors,
    },
    {
      name: "Rejected Vendors",
      data: value?.rejected_vendors,
    },
    {
      name: "Deactive Vendors",
      data: value?.deactive_vendors,
    },
  ];

  useEffect(() => {
    setLoading(true);
    let yeardata = {};
    if (query.month) {
      yeardata = {
        ...yeardata,
        month: query.month,
      };
    }
    if (yearQuery.year) {
      yeardata = {
        ...yeardata,
        year: yearQuery.year,
      };
    }
    if (dateQuery.endDate) {
      yeardata = {
        ...yeardata,
        startDate: dateQuery.startDate,
        endDate: dateQuery.endDate,
      };
    }

    let path = "v1/admin/dashboard/count-time-bound";

    if (da?.role_name === "Approver") {
      path = "/api/v1/supplier/dashboard/time-bound";
    }

    axios
      .post(new URL(path, themeConfig.backendUrl), yeardata)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setValue(res.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 15000);

    return () => clearTimeout(timeout);
  }, [yearQuery.year, yearKey, dateQuery.endDate, query]);

  // const handleMonthChange = (selectedOption) => {
  //   const newQuery = {
  //     ...query,
  //     selectedOption: true,
  //     month: selectedOption.value,
  //     dataLabels: selectedOption.dataLabels,
  //   };
  //   setQuery(newQuery);
  // };
  const handleYearChange = (selectedOption) => {
    const newQuery = { year: selectedOption.value };
    setYearQuery(newQuery);
    const newQueryWithoutMonth = { ...query, month: undefined };
    setQuery(newQueryWithoutMonth);
    setShowing("Yearly");
  };
  const originalData = () => {
    setQuery({});
    setYearQuery({ year: "" });
    setDateQuery({ startDate: "", endDate: "" });
    setShowing("Last 10 Days");
  };
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (selectedDates) => {
    if (!selectedDates || selectedDates.length !== 2 || !selectedDates[1]) {
      console.error("Please select an end date.");
      return;
    }

    setSelectedDates(selectedDates);
    const newQuery = {
      startDate: selectedDates[0],
      endDate: selectedDates[1],
      month: null,
      year: null,
    };
    setShowing(
      `From ${selectedDates[0].toLocaleDateString()} to ${selectedDates[1].toLocaleDateString()}`
    );

    setQuery(newQuery);
    setYearQuery(newQuery);
    setDateQuery(newQuery);
  };

  return (
    <Card>
      <CardHeader style={{ fontSize: "20px", fontWeight: "600" }}>
        Vendors Data
        {loading ? (
          <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
            <LinearProgress className="mb-1" color="inherit" />
          </Stack>
        ) : (
          ""
        )}
        <div className="demo-inline-spacing">
          <>
            <h5>Showing : {showing} </h5>
            <UncontrolledButtonDropdown>
              <DropdownToggle outline color="primary" onClick={() => originalData()}>
                Last 10 days
              </DropdownToggle>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle
                onClick={() => handleYearChange({ value: "2024" })}
                color="primary"
                outline
              >
                Yearly
              </DropdownToggle>
            </UncontrolledButtonDropdown>
            {/* <UncontrolledButtonDropdown>
                <DropdownToggle color="primary">
                  {query?.selectedOption ? query?.dataLabels : "Monthly"}
                </DropdownToggle>
                <DropdownMenu
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  <DropdownItem
                    tag="a"
                    onClick={() =>
                      handleMonthChange({ value: "1", dataLabels: "January" })
                    }
                  >
                    January
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "2", dataLabels: "February" })
                    }
                    tag="a"
                  >
                    February
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "3", dataLabels: "March" })
                    }
                    tag="a"
                  >
                    March
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "4", dataLabels: "April" })
                    }
                    tag="a"
                  >
                    April
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "5", dataLabels: "May" })
                    }
                    tag="a"
                  >
                    May
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "6", dataLabels: "June" })
                    }
                    tag="a"
                  >
                    June
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "7", dataLabels: "July" })
                    }
                    tag="a"
                  >
                    July
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "8", dataLabels: "August" })
                    }
                    tag="a"
                  >
                    August
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "9", dataLabels: "September" })
                    }
                    tag="a"
                  >
                    September
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "10", dataLabels: "October" })
                    }
                    tag="a"
                  >
                    October
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "11", dataLabels: "November" })
                    }
                    tag="a"
                  >
                    November
                  </DropdownItem>
                  <DropdownItem
                    onClick={() =>
                      handleMonthChange({ value: "12", dataLabels: "December" })
                    }
                    tag="a"
                  >
                    December
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledButtonDropdown> */}
            <div
              style={{
                color:"#f26c13",
                border: "1px solid #f26c13",
                borderRadius: "5px",
                paddingInline: "5px",
              }}
              className="d-flex align-items-center"
            >
              <Calendar size={17} />
              <Flatpickr
                placeholder="Select Date Range"
                style={{ width: "100%",color:"#f26c13" }}
             
                className="form-control flat-picker bg-transparent border-0 shadow-none custom-flatpickr"
                options={{
                  
                  mode: "range",
                  defaultDate: [
                    new Date(),
                    new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
                  ],
                  
                }}
                value={selectedDates}
                onChange={handleDateChange}
              />
            </div>
          </>
        </div>
      </CardHeader>
      {value ? (
        <CardBody>
          <Chart options={options} series={series} type="bar" height={400} />
        </CardBody>
      ) : (
        <Stack
          sx={{
            width: "100%",
            color: "#e06522",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          spacing={2}
        >
          {loading ? (
            <CircularProgress
              className="text-center mt-5 mb-5"
              size={80}
              color="inherit"
            />
          ) : (
            <>
              <AlertCircle size={50} />
              <h2 style={{ color: "#fff" }}>No Data Found</h2>
            </>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default ApexColumnCharts;
