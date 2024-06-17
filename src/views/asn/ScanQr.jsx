import {
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CustomAvatar from "../../@core/components/avatar";
import customTheme from "../Custome/Mui";
import "./CustomInput.css";
import "../../assets/scss/variables/_variables.scss";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import {
  CardBody,
  Row,
  Button,
  Col,
  Table,
  Form,
  FormFeedback,
  Breadcrumb,
  BreadcrumbItem,
  Spinner,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { QrReader } from "react-qr-reader";
import toast from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import { IoCameraReverse } from "react-icons/io5";
import { Badge, Input } from "reactstrap";
import axios from "axios";
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import { Link, useNavigate } from "react-router-dom";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  Approval,
  Cancel,
  DoorBack,
  ErrorOutline,
  InventoryOutlined,
  LocalShippingOutlined,
  LocalShippingRounded,
  Pending,
  QrCode,
  Receipt,
  ReceiptLong,
} from "@mui/icons-material";
import MuiTimeline from "@mui/lab/Timeline";
import MuiCardHeader from "@mui/material/CardHeader";
import { styled, useTheme } from "@mui/material/styles";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";

// import {process} from '.env';
const tabStyle = {
  padding: "5px",
};
const MobileViewScanQr = ({ open, handleError, handleScan, isRearCamera }) => {
  const isMobileScreen = useMediaQuery("(max-width:768px)");
  return (
    <>
      {isMobileScreen && open && (
        <QrReader
          key={isRearCamera ? "environment" : "user"}
          delay={300}
          onError={handleError}
          onResult={handleScan}
          constraints={{
            facingMode: isRearCamera ? "environment" : "user",
          }}
          style={{ width: "80vw" }}
          className="my-2 mt-md-0"
        />
      )}
    </>
  );
};

const ScanQr = () => {
  const navigateTo = useNavigate();
  const [qrdata, setQrdata] = useState({});
  const [remarks, setRemarks] = useState();
  const [value, setValue] = useState("1");
  const [picker, setPicker] = useState(new Date());
  const [baseLineDate, setBaseLineDate] = useState(new Date(null));
  const [files, setFiles] = useState([]);
  const [asnOption, setAsnOption] = useState([]);
  const [plantOption, setPlantsoption] = useState([]);
  const [storageLocationOption, setStorageLocationOption] = useState([]);
  const [subTotal, setSubTotal] = useState([]);
  const [loading, setLoading] = useState();
  const [submitLoading, setSubmitLoading] = useState();
  const [form, setForm] = useState({});
  const [asnData, setAsnData] = useState();
  const [editable, setEditable] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState("");
  const [selectedStorageLocation, setSelectedStorageLocation] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [showVehicle, setShowVehicle] = useState(false);
  const [message, setMessage] = useState(null);
  const [vehical, setVehical] = useState({
    vehicalNo: "",
    // modelName: "",
    arrivalDate: "",
    arrivalTime: "",
    vehicalCameFromLoc: "",
    vehicalStatus: "",
    logisticsCoName: "",
    driverName: "",
    driverLicenceNo: "",
    gateInwardLoc: "",
  });
  const [editableLineItems, setEditableLineItems] = useState([]);
  const [result, setResult] = useState(null);
  const [totalAmount, setTotalAmount] = useState();
  const [asntotalAmount, setAsnTotalAmount] = useState();
  const [open, setOpen] = useState(false);
  const [qrCodeScanned, setQrCodeScanned] = useState(false);
  const [isRearCamera, setIsRearCamera] = useState(true);
  const isMobileScreen = useMediaQuery("(max-width:768px)");

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });

  const theme = useTheme();

  const CalcWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:not(:last-of-type)": {
      marginBottom: theme.spacing(0),
    },
  }));

  const Timeline = styled(MuiTimeline)({
    paddingLeft: 0,
    paddingRight: 0,
    "& .MuiTimelineItem-root": {
      width: "100%",
      "&:before": {
        display: "none",
      },
    },
  });

  const CardHeader = styled(MuiCardHeader)(({ theme }) => ({
    "& .MuiTypography-root": {
      lineHeight: 1.6,
      fontWeight: 500,
      fontSize: "1.125rem",
      letterSpacing: "0.15px",
      [theme.breakpoints.up("sm")]: {
        fontSize: "1.25rem",
      },
    },
  }));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [timeline, setTimeline] = useState(null);
  const handleEditLineItem = (index, field, value) => {
    const updatedLineItems = [...editableLineItems];
    const currentLineItem = { ...editableLineItems[index] };

    console.log(qrdata.lineItems[index].Quantity);
    if (value <= qrdata.lineItems[index].Quantity) {
      currentLineItem[field] = value;

      const subTotal =
        currentLineItem.Quantity > 0
          ? currentLineItem.gst +
            currentLineItem.Quantity * currentLineItem.pricePerUnit
          : 0;
      currentLineItem.subTotal = subTotal;

      const price =
        currentLineItem.Quantity > 0
          ? currentLineItem.Quantity * currentLineItem.pricePerUnit
          : 0;
      currentLineItem.price = price;

      updatedLineItems[index] = currentLineItem;
      setEditableLineItems(updatedLineItems);
    } else {
      toast.error("Max Qty Reached");
    }
  };

  const userData = JSON.parse(localStorage.getItem("userData"));
  const request = () => {
    axios
      .post(new URL("v1/supplier/asn/list", themeConfig.backendUrl), {
        status: "all",
        dropdown: "all",
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          let asnList = [];

          if (userData.role_name === "Security Executive") {
            let materialShippedRows = res.data.data.rows.filter(
              (item) => item.status === "materialShipped"
            );

            asnList = materialShippedRows.map((item) => ({
              label: item.asnNo + " | " + item.status.toUpperCase(),
              value: item.id?.toString(),
            }));
          } else if (userData.role_name === "Store Keeper") {
            let gateInwardRows = res.data.data.rows.filter(
              (item) => item.status === "materialGateInward"
            );
            asnList = gateInwardRows.map((item) => ({
              label: item.asnNo + " | " + item.status.toUpperCase(),
              value: item.id?.toString(),
            }));
          } else if (
            userData.role_name === "Quality Incharge" ||
            userData.role_name === "Accounts Executive"
          ) {
            let filteredRows = res.data.data.rows.filter(
              (item) =>
                item.status === "partiallyReceived" ||
                item.status === "materialReceived" ||
                item.status === "accepted" ||
                item.status === "qualityApproved"
            );

            asnList = filteredRows.map((item) => ({
              label: item.asnNo + " | " + item.status.toUpperCase(),
              value: item.id?.toString(),
            }));
          } else {
            asnList = res.data.data.rows.map((item) => ({
              label: item.asnNo + " | " + item.status.toUpperCase(),
              value: item.id?.toString(),
            }));

            if (userData.role_name === "Service Department User") {
              let filteredRows = res.data.data.rows.filter(
                (item) => item.status === "requested"
              );
              asnList = filteredRows.map((item) => ({
                label: item.asnNo + " | " + item.status.toUpperCase(),
                value: item.id?.toString(),
              }));
            }
            // else if (userData.role_name === "Service Department User") {
            //   asnList = asnList.filter((item) => !item.label.startsWith("ASN"));
            // }
          }

          setAsnOption(asnList);
        }
      });

    // Storage Location Api
  };
  const handleScan = (data) => {
    if (data) {
      const text = data.text.toString();
      setLoading(true);
      try {
        axios
          .post(themeConfig.backendUrl + "v1/supplier/asn/checkqr", {
            text,
          })
          .then((res) => {
            if (res.data.error) {
              console.log(res);
              setResult(res.data.message);
              setLoading(false);
              toast.error(res.data.message);
              setOpen(!open);
            } else {
              toast.success("Data Fetched");
              setQrCodeScanned(true);
              setAsnData(res.data.data);
              setTimeline(res.data.timeline);
              setLoading(false);
              setQrdata(res.data.data);
              setVehical({ ...vehical, asnId: res.data.data.id });
              setEditableLineItems([...res.data.data.lineItems]);
              userData.role_name === "Security Executive"
                ? setShowVehicle(true)
                : setShowVehicle(false);
              // setShowVehicle(res.data.data?.editable === "1" ? true : false);
              setOpen(!open);
              if (res.data.data?.editable === "2") {
                setEditable(true);
              } else {
                setEditable(false);
              }
              getStorageLocation(res.data.data.plantId);
              getPlantList(res.data.data.plantId);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error(error.message);
            setOpen(!open);
            setLoading(false);
          });
      } catch (e) {
        console.log(e);
      }
    }
  };
  const getAsnData = (asnNo) => {
    const params = {
      asn_Id: asnNo,
    };
    axios
      .post(
        new URL(`/api/v1/supplier/asn/checkqr`, themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          setResult(res.data.message);
          setLoading(false);
          toast.error(res.data.message);
          setOpen(!open);
        } else {
          toast.success("Data Fetched");
          setQrCodeScanned(true);
          setAsnData(res.data.data);
          setTimeline(res.data.timeline);
          setLoading(false);
          setQrdata(res.data.data);
          setVehical({ ...vehical, asnNo: res.data.data.asnNo });
          setEditableLineItems([...res.data.data.lineItems]);
          setShowVehicle(res.data.data?.editable === "1" ? true : false);
          setOpen(!open);
          if (res.data.data?.editable === "2") {
            setEditable(true);
          } else {
            setEditable(false);
          }
          getStorageLocation(res.data.data.plantId);
          getPlantList(res.data.data.plantId);
        }
      });
  };
  const sendQrData = (data) => {
    setSubmitLoading(true);
    setMessage("");
    axios
      .post(themeConfig.backendUrl + "v1/supplier/asn/asnMaterialReceived", {
        qrdata: {
          ...qrdata,
          lineItems: editableLineItems,
          invoiceType: selectedInvoiceType?.value,
          storageLocation: selectedStorageLocation
            ? selectedStorageLocation?.value
            : qrdata?.storageLocation,
          baseLineDate: baseLineDate[0],
          remarks: remarks,
        },
        vehical: {
          asn_id: vehical.asnId,
          vehicalNo: data?.vehicalNo,
          arrivalDate: data?.arrivalDate
            ? data?.arrivalDate[0]?.toISOString().split("T")[0]
            : "",
          arrivalTime: data?.arrivalTime,
          comeFrom: asnData ? asnData?.plantId : "",
          vehicalStatus: vehical?.vehicalStatus?.toString(),
          logisticCoName: data?.logisticsCoName,
          driverFullName: data?.driverName,
          driverLicenceNo: data?.driverLicenceNo,
          gateInwardLocation: data?.gateInwardLoc,
        },
      })
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setSubmitLoading(false);
        } else {
          toast.success(res.data.message);
          setSubmitLoading(false);
          navigateTo("/ScannedHistory");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitLoading(false);
      });
  };

  const vehicalDetailsValidator = yup.object().shape({
    vehicalNo: yup
      .string()
      .required("Enter proper Vehical No.")
      .matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, "Enter A Valid Vehical No."),
    logisticsCoName: yup.string().required("Logistic Company Name required"),
    // vehicalCameFromLoc: yup.object().required("Location required"),
    // driverName: yup.string().required("Driver Name required"),
    // driverLicenceNo: yup.string().required("Licence No required"),
    // gateInwardLoc: yup.string().required("Gate No. required"),
    // arrivalDate: yup.string().required("Date required"),
    // arrivalTime: yup.string().required("Time required"),
  });

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(vehicalDetailsValidator),
  });

  const onSubmit = (data) => {
    if (userData.role_name === "Security Executive") {
      if (selectedStorageLocation === "") {
        return toast("Please select storage location");
      }
      console.log(!Object.values(vehical).some((value) => value === ""));
      const keys = Object.keys(vehical);
      console.log(keys, Object.values(vehical));
      if (!Object.values(vehical).some((value) => value === "")) {
        sendQrData();
      } else {
        sendQrData(data);
      }
    } else if (userData.role_name === "Accounts Executive") {
      if (selectedInvoiceType && baseLineDate[0]) {
        sendQrData();
      } else {
        setMessage("Select Invoice Type");
      }
    } else {
      sendQrData();
    }
  };
  const handleRemarksChange = useCallback(
    (event) => {
      const value = event.target.value;
      setRemarks(value);
    },
    [setRemarks]
  );

  const handleError = (error) => {
    console.error(error);
  };

  const handleQrReader = () => {
    setOpen(!open);
  };
  const getColorByIndex = (index) => {
    const colors = [
      "warning",
      "info",
      "secondary",
      "primary",
      "success",
      "error",
    ];
    const colorIndex = index % colors.length;
    return colors[colorIndex];
  };
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const formattedTime = date.toLocaleString();
    return formattedTime;
  };
  const headerStyle = {
    borderRadius: "10px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "0px 0px 30px 0px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
  useEffect(() => {
    let total = 0;
    let asntotal = 0;
    if (qrdata.type !== "ZSER") {
      if (editableLineItems) {
        editableLineItems.forEach((item) => {
          if (parseInt(item.Quantity) !== 0) {
            // total +=
            //   parseInt(9 + 9 / 100) +
            //   parseInt(item.Quantity) * parseInt(item.pricePerUnit);

            total +=
              parseInt(item.pricePerUnit) * parseInt(item.Quantity) +
              (parseInt(item.pricePerUnit) *
                parseInt(item.Quantity) *
                (9 + 9)) /
                100;
          } else {
            total += parseInt(item.Quantity) * parseInt(item.pricePerUnit);
          }
        });
        setTotalAmount(total);
      }
    } else {
      editableLineItems.forEach((item) => {
        total += parseInt(item.Quantity) * parseInt(item.pricePerUnit);
      });
      setTotalAmount(total);
    }

    if (qrdata.type !== "ZSER") {
      if (qrdata.lineItems) {
        qrdata.lineItems.forEach((item) => {
          if (parseInt(item.Quantity) !== 0) {
            asntotal +=
              parseInt(item.pricePerUnit) * parseInt(item.previousQuantity) +
              (parseInt(item.pricePerUnit) *
                parseInt(item.previousQuantity) *
                (9 + 9)) /
                100;
          } else {
            asntotal +=
              parseInt(item.previousQuantity) * parseInt(item.pricePerUnit);
          }
        });
        setAsnTotalAmount(asntotal);
      }
    } else {
      qrdata.lineItems.forEach((item) => {
        asntotal +=
          parseInt(item.previousQuantity) * parseInt(item.pricePerUnit);
      });
      setAsnTotalAmount(asntotal);
    }
  }, [editableLineItems]);

  const getStorageLocation = (plantId) => {
    axios
      .post(
        new URL("v1/supplier/storageLocation/list", themeConfig.backendUrl),
        {
          plantId: plantId,
        }
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          const storageLocationList = res.data.data.rows.map((item) => ({
            label: `${item.code} - ${item.name}`,
            value: item.id,
          }));
          setStorageLocationOption(storageLocationList);
        }
      });
  };
  const getPlantList = (plantId) => {
    console.log(plantId, "plantId");
    axios
      .post(new URL("v1/admin/plants/list", themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          const plantList = res.data.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setPlantsoption(plantList);
          const selectedPlant = plantList.find(
            (plant) => plant.value === plantId
          );
          console.log("selcetdplant", selectedPlant);
          setSelectedPlant(selectedPlant);
        }
      });
  };
  useEffect(() => {
    request();
  }, []);
  const dynamicLabel =
    userData.role_name === "Security Executive"
      ? "ASN Gate Inward"
      : userData.role_name === "Store Keeper"
      ? "ASN Material Receive"
      : userData.role_name === "Quality Incharge"
      ? "ASN Check Quality"
      : userData.role_name === "Accounts Executive"
      ? "Invoice"
      : userData.role_name === "Service Department User"
      ? "Approve SCR"
      : [
          "Security Executive",
          "Store Keeper",
          "Quality Incharge",
          "Accounts Executive",
          "Service Department User",
        ].indexOf(userData.role_name) === -1
      ? "Scan ASN/ASR"
      : undefined; // If userData.role_name doesn't match any condition

  const getIconByStatus = (status) => {
    switch (status) {
      case "materialShipped":
        return <LocalShippingRounded />;
      case "Material Gate Inward":
        return <DoorBack />;
      case "requested":
        return <Pending />;
      case "Invoiced":
        return <InventoryOutlined />;
      case "materialReceived":
        return <ReceiptLong />;
      case "partiallyReceived":
        return <ReceiptLong />;
      case "Quality Approved":
        return <Approval />;
      case "Accepted":
        return <Approval />;
      case "cancelled":
        return <Cancel />;
      default:
        return null;
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "materialshipped":
        return "primary";
      case "materialgateinward":
        return "warning";
      case "requested":
        return "secondary";
      case "invoiced":
        return "success";
      case "accepted":
        return "info";
      case "materialReceived":
        return "primary";
      case "Quality Approved":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "light-secondary";
    }
  };
  return (
    <>
      <div className="justify-content-start p-1 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> ScanQr </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <TabContext value={value}>
        <ThemeProvider theme={customTheme}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange}>
              <Tab
                style={{ fontSize: "1.2rem", color: "#f26c13" }}
                label={dynamicLabel}
                value="1"
              />
              <Tab
                style={{ fontSize: "1.2rem", color: "#f26c13" }}
                label="Fetch ASN/SCR"
                value="2"
              />
            </TabList>
          </Box>
        </ThemeProvider>
        <TabPanel value="2">
          <div>
            <h4 className="invoice-title  mt-2">ASN/SCR No</h4>
            <Select
              isClearable={false}
              value={selectedOption}
              options={asnOption}
              className={`react-select`}
              classNamePrefix="select"
              onChange={(e) => {
                setSelectedOption(e);
                getAsnData(e.value);
                // getPOData("4600000586");
              }}
            />
          </div>
        </TabPanel>
      </TabContext>
      {qrCodeScanned ? (
        <div>
          <Card className="p-2 mb-2 mt-3">
            <div
              style={{ display: "inline" }}
              className="d-flex justify-content-between"
            >
              <div>
                <label style={{ fontSize: "1.5rem", color: "black" }}>
                  Order
                </label>
                <span style={{ fontSize: "1.5rem", color: "#f26c13" }}>
                  {" "}
                  {`#`}
                  {qrdata?.asnNo}
                  <Badge className="m-1" color={getStatusColor(qrdata?.status)}>
                    {qrdata.status.charAt(0).toUpperCase() +
                      qrdata.status.slice(1)}
                  </Badge>
                </span>
              </div>
            </div>
            <div>
              <label
                className="mt-1"
                style={{ color: "black", marginBottom: "0.5rem" }}
              >
                Created At:
              </label>
              <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                {" "}
                {qrdata.createdAt?.slice(0, 10)}
              </span>
            </div>
            <div>
              <label style={{ color: "black", marginBottom: "0.5rem" }}>
                Dispatch Date:{" "}
              </label>
              <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                {" "}
                {qrdata.dispatchDate?.slice(0, 10)}
              </span>
            </div>
            <div>
              <label style={{ color: "black", marginBottom: "0.5rem" }}>
                Supplier id:{" "}
              </label>
              <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                {" "}
                {qrdata.supplierId}
              </span>
            </div>
          </Card>

          <Grid container spacing={2}>
            <Grid item lg={8} xs={12}>
              <Card className="mb-2">
                <TableContainer>
                  <Table>
                    <TableHead
                      sx={{
                        "& .MuiTableHead-root": {
                          letterSpacing: "0.02rem",
                          backgroundColor: "#f26c13",
                          fontWeight: "400",
                          color: "white",
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Item
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Unit Price
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          {qrdata.type == "ZSER"
                            ? "Qty in  SCR"
                            : "Qty in  Asn"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Qty
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Price
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Unit
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          GST
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Hsn Code
                        </TableCell>

                        <TableCell
                          sx={{
                            fontSize: "1rem !important",
                            textTransform: "capitalize",
                          }}
                        >
                          Sub Total
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <>
                      <TableBody
                        sx={{
                          "& .MuiTableCell-root": {
                            py: "1rem !important",
                            fontSize: theme.typography.body1.fontSize,
                          },
                        }}
                      >
                        {editableLineItems?.map((items, index) => {
                          return (
                            <>
                              {items.Quantity !== 0 && (
                                <TableRow key={index}>
                                  <TableCell>
                                    {qrdata.type == "ZSER"
                                      ? items.serviceName
                                      : items.itemName}
                                  </TableCell>
                                  <TableCell>{items.pricePerUnit}</TableCell>
                                  <TableCell>
                                    {items.previousQuantity}
                                  </TableCell>
                                  <TableCell>
                                    <Input
                                      className="show-arrows"
                                      style={{ width: "60px" }}
                                      value={items.Quantity}
                                      disabled={!editable}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        handleEditLineItem(
                                          index,
                                          "Quantity",
                                          newValue
                                        );
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {items.Quantity > 0
                                      ? qrdata.type === "ZSER"
                                        ? items.Quantity * items.pricePerUnit
                                        : items.Quantity * items.pricePerUnit
                                      : 0}
                                  </TableCell>
                                  <TableCell>{items.unit}</TableCell>
                                  <TableCell>
                                    {items.gst
                                      ? (items.Quantity *
                                          items.pricePerUnit *
                                          (9 + 9)) /
                                        100
                                      : "NA"}
                                  </TableCell>

                                  <TableCell>
                                    {items.hsnCode ? items.hsnCode : "NA"}
                                  </TableCell>

                                  {/* Subtotal */}
                                  <TableCell>
                                    {qrdata.type === "ZSER"
                                      ? items.Quantity
                                        ? items.Quantity * items.pricePerUnit
                                        : 0
                                      : items.Quantity
                                      ? items.Quantity > 0
                                        ? items.Quantity * items.pricePerUnit +
                                          items.Quantity *
                                            items.pricePerUnit *
                                            ((9 + 9) / 100)
                                        : 0
                                      : 0}
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          );
                        })}
                      </TableBody>
                    </>
                  </Table>
                </TableContainer>

                <CardContent
                  sx={{
                    px: [
                      `${theme.spacing(8)} !important`,
                      `${theme.spacing(14)} !important`,
                    ],
                  }}
                >
                  <Grid container className="d-flex justify-content-end">
                    {/* <Grid
                      item
                      xs={12}
                      sm={5}
                      lg={3}
                      sx={{
                        mb: { sm: 0, xs: 4 },
                        order: { sm: 2, xs: 1 },
                      }}
                    > */}
                    <CalcWrapper>
                      {(userData.role_name === "Store Keeper" ||
                        userData.role_name === "Accounts Executive") && (
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "16px",
                            marginRight: "80px",
                          }}
                        >
                          Asn Total: {asntotalAmount}
                        </Typography>
                      )}

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: "16px",
                          marginLeft: "50px",
                        }}
                      >
                        Actual Total: {totalAmount}
                      </Typography>
                    </CalcWrapper>
                    {/* </Grid> */}
                  </Grid>
                </CardContent>
              </Card>
              {showVehicle ? (
                <Form onSubmit={onSubmit}>
                  <Card
                    style={{
                      backgroundColor: "#f5c6a72e",
                      padding: "30px",
                      borderRadius: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 style={headerStyle}>Vehicle Details</h3>
                    <CardBody>
                      <Row>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Vehicle No <span className="text-danger">*</span>
                          </label>
                          <Controller
                            id="vehicalNo"
                            name="vehicalNo"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                placeholder="GJ12AB4321"
                                value={field.value.toUpperCase()} // Ensure the value is always uppercased
                                onChange={(e) =>
                                  field.onChange(e.target.value.toUpperCase())
                                }
                                invalid={errors.vehicalNo && true}
                              />
                            )}
                          />
                          {errors.vehicalNo && (
                            <FormFeedback>
                              {errors.vehicalNo.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            {" "}
                            Location
                          </label>
                          <Controller
                            id="vehicalCameFromLoc"
                            name="vehicalCameFromLoc"
                            control={control}
                            // value={selectedPlant}
                            options={plantOption}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isDisabled
                                value={selectedPlant}
                                options={plantOption}
                                className={`react-select`}
                                classNamePrefix="select"
                                invalid={errors.vehicalCameFromLoc && true}
                              />
                            )}
                          />
                          {errors.vehicalCameFromLoc && (
                            <FormFeedback>
                              {errors.vehicalCameFromLoc.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Logistic Company Name{" "}
                            <span className="text-danger">*</span>
                          </label>

                          <Controller
                            id="logisticsCoName"
                            name="logisticsCoName"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                invalid={errors.logisticsCoName && true}
                              />
                            )}
                          />
                          {errors.logisticsCoName && (
                            <FormFeedback>
                              {errors.logisticsCoName.message}
                            </FormFeedback>
                          )}
                        </Col>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Driver Name
                          </label>
                          <Controller
                            id="driverName"
                            name="driverName"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                invalid={errors.driverName && true}
                              />
                            )}
                          />
                          {errors.driverName && (
                            <FormFeedback>
                              {errors.driverName.message}
                            </FormFeedback>
                          )}
                        </Col>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Licence No
                          </label>

                          <Controller
                            id="driverLicenceNo"
                            name="driverLicenceNo"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                invalid={errors.driverLicenceNo && true}
                              />
                            )}
                          />
                          {errors.driverLicenceNo && (
                            <FormFeedback>
                              {errors.driverLicenceNo.message}
                            </FormFeedback>
                          )}
                        </Col>

                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Gate No.
                          </label>

                          <Controller
                            id="gateInwardLoc"
                            name="gateInwardLoc"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                type="text"
                                invalid={errors.gateInwardLoc && true}
                              />
                            )}
                          />
                          {errors.gateInwardLoc && (
                            <FormFeedback>
                              {errors.gateInwardLoc.message}
                            </FormFeedback>
                          )}
                        </Col>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{
                              color: "gray",
                              fontWeight: "bold",
                              width: "100%",
                            }}
                          >
                            Arrival Date
                            <Controller
                              id="date-time-picker"
                              name="arrivalDate"
                              defaultValue=""
                              control={control}
                              render={({ field }) => (
                                <Flatpickr
                                  {...field}
                                  // defaultValue={poData?.delivery_date}
                                  value={picker}
                                  // data-enable-time
                                  id="date-time-picker"
                                  className="form-control mt-1"
                                  placeholder="YYYY-MM-DD"
                                  style={{ backgroundColor: "white" }}
                                  options={{
                                    minDate: qrdata?.dispatchDate, // Set minimum date to today
                                    dateFormat: "Y-m-d",
                                    // Other options...
                                  }}
                                />
                              )}
                            />
                            {errors.arrivalDate && (
                              <FormFeedback>
                                {errors.arrivalDate.message}
                              </FormFeedback>
                            )}
                          </label>
                        </Col>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{
                              color: "gray",
                              fontWeight: "bold",
                              width: "100%",
                            }}
                          >
                            Arrival Time{" "}
                            <Controller
                              id="arrivalTime"
                              name="arrivalTime"
                              defaultValue=""
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="time"
                                  style={{ marginTop: "13px" }}
                                />
                              )}
                            />
                            {errors.arrivalTime && (
                              <FormFeedback>
                                {errors.arrivalTime.message}
                              </FormFeedback>
                            )}
                          </label>
                        </Col>
                        <Col md="4" className="mb-1">
                          <label
                            className="pb-0 mb-1"
                            style={{ color: "gray", fontWeight: "bold" }}
                          >
                            Container Sealed
                          </label>
                          <div>
                            <label style={{ marginRight: "20px" }}>
                              <Input
                                type="radio"
                                name="vehicalStatus"
                                value="true"
                                onChange={(e) => {
                                  setVehical({
                                    ...vehical,
                                    vehicalStatus: "shield",
                                  });
                                }}
                              />{" "}
                              Yes
                            </label>
                            <label className="ml-3">
                              <Input
                                type="radio"
                                name="vehicalStatus"
                                value="true"
                                onChange={(e) => {
                                  setVehical({
                                    ...vehical,
                                    vehicalStatus: "open",
                                  });
                                }}
                              />{" "}
                              No
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Form>
              ) : (
                ""
              )}

              <Card>
                <p
                  style={{
                    textAlign: "center",
                    paddingBlock: "20px",
                    fontSize: "20px",
                    color: "#333",
                  }}
                >
                  Order Timeline
                </p>
                <CardContent sx={{ pt: 0 }}>
                  <Timeline position="alternate">
                    {timeline?.map(
                      (item, index) =>
                        item.Status !== null && (
                          <TimelineItem key={item.id} sx={{ mb: 2 }}>
                            <TimelineOppositeContent
                              variant="caption"
                              color="text.secondary"
                              sx={{ width: "30%", fontSize: "14px" }}
                            >
                              {`By ${item.Name}`}
                              <br />
                              {`Remarks: ${item.Remarks}`}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot
                                color={
                                  item.Status === "cancelled"
                                    ? "error"
                                    : getColorByIndex(index)
                                }
                                sx={{ mt: 1.5 }}
                                style={{ fontSize: "22px" }}
                              >
                                {getIconByStatus(item.Status)}
                              </TimelineDot>
                              {index === timeline.length - 1 ? null : (
                                <TimelineConnector />
                              )}
                            </TimelineSeparator>
                            <TimelineContent sx={{ pt: 0, mt: 0 }}>
                              <Typography
                                variant="h5"
                                style={{ color: "#f26c13" }}
                              >
                                {item.Status.charAt(0).toUpperCase() +
                                  item.Status.slice(1)}
                              </Typography>

                              <Typography sx={{ fontSize: "14px" }}>
                                {formatTime(item.Time)}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        )
                    )}
                  </Timeline>

                  <Row className="mt-3">
                    <Col sm="12" md={6}>
                      <h5 className="invoice-title">Remarks: </h5>
                      <Input
                        type="textarea"
                        defaultValue=""
                        value={remarks}
                        className="mb-1"
                        // onChange={handleRemarksChange}
                        onChange={(event) => {
                          const value = event.target.value;
                          setRemarks(value);
                        }}
                      ></Input>
                    </Col>
                    {userData && userData.role_name === "Accounts Executive" ? (
                      <>
                        <Col md={3}>
                          <h5 className="invoice-title  mt-2">
                            Baseline Date
                            <span className="text-danger">*</span>
                          </h5>
                          <Flatpickr
                            value={baseLineDate}
                            id="date-time-picker"
                            className="form-control"
                            options={{
                              minDate: "today",
                            }}
                            onChange={(date) => setBaseLineDate(date)}
                          />
                          {!baseLineDate[0] && (
                            <FormFeedback style={{ display: "block" }}>
                              Select Baseline Date
                            </FormFeedback>
                          )}
                        </Col>
                        <Col md={3}>
                          <div style={{ display: "block" }}>
                            <div>
                              <h5 className="invoice-title  mt-2">
                                Invoice Type
                                <span className="text-danger">*</span>
                              </h5>
                              <Select
                                isClearable={false}
                                value={selectedInvoiceType}
                                options={[
                                  {
                                    label: "Park Invoice",
                                    value: "parkInvoiced",
                                  },
                                  // {
                                  //   label: "Post Invoice",
                                  //   value: "postInvoiced",
                                  // },
                                ]}
                                className={`react-select`}
                                classNamePrefix="select"
                                onChange={(e) => {
                                  setSelectedInvoiceType(e);
                                }}
                                isRequired
                              />
                              {message ? (
                                <FormFeedback style={{ display: "block" }}>
                                  {message}
                                </FormFeedback>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
                    {userData && userData.role_name === "Security Executive" ? (
                      <>
                        <Col md={3}>
                          <div style={{ display: "block" }}>
                            <div>
                              <h5 className="invoice-title  mt-2">
                                Storage Location
                                <span className="text-danger">*</span>
                              </h5>
                              <Select
                                isClearable={false}
                                value={selectedStorageLocation}
                                options={storageLocationOption}
                                className={`react-select`}
                                classNamePrefix="select"
                                onChange={(e) => {
                                  setSelectedStorageLocation(e);
                                }}
                                isRequired
                              />
                              {message ? (
                                <FormFeedback style={{ display: "block" }}>
                                  {message}
                                </FormFeedback>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </Col>
                      </>
                    ) : (
                      ""
                    )}
                    <Col md={5}>
                      <div className="d-flex justify-content-start mt-4">
                        <Button
                          style={{
                            marginRight: "20px",
                            marginLeft: "10px",
                          }}
                          color="primary"
                          className="btn-prev"
                          onClick={
                            userData.role_name === "Security Executive"
                              ? handleSubmit(onSubmit)
                              : onSubmit
                          }
                        >
                          {submitLoading ? <Spinner size={"sm"} /> : "Submit"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardContent>
              </Card>
            </Grid>
            <Grid item lg={4} xs={12}>
              <Card className="p-2 mb-2">
                {/* <Grid className="p-0 mt-xl-0 mt-2" md="6" xl="4"> */}
                <h4 className="mb-2">
                  <CustomAvatar
                    style={{ backgroundColor: "#2a62ccbd", marginRight: "4px" }}
                    sx={{ width: 62, height: 62 }}
                    icon={<LocalShippingOutlined sx={{ fontSize: 20 }} />}
                  ></CustomAvatar>
                  Ship to Address
                </h4>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span
                          style={{
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {qrdata?.shipToAddress
                            ? qrdata.shipToAddress
                                .split(",")
                                .map((line, index) => (
                                  <div key={index}>{line.trim()}</div>
                                ))
                            : ""}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
              <Card className="p-2">
                <h4 className="mb-1">
                  <CustomAvatar
                    style={{ backgroundColor: "#2a62ccbd", marginRight: "4px" }}
                    sx={{ width: 62, height: 62 }}
                    icon={<Receipt sx={{ fontSize: 20 }} />}
                  ></CustomAvatar>
                  Bill to Address
                </h4>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span
                          style={{
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {qrdata?.billToAddress
                            ? qrdata.billToAddress
                                .split(",")
                                .map((line, index) => (
                                  <div key={index}>{line.trim()}</div>
                                ))
                            : ""}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </Grid>
          </Grid>
        </div>
      ) : (
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <ThemeProvider theme={theme}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                {/* <h4 style={{ fontSize: "1.4rem", color: "#f26c13" }}>
                  Scan QrCode
                </h4> */}
              </Box>
            </ThemeProvider>

            <TabPanel style={{ marginTop: "20px" }} value="1" sx={tabStyle}>
              <Row className="align-items-center">
                <Col sm={12}>
                  <MobileViewScanQr
                    open={open}
                    handleError={handleError}
                    handleScan={handleScan}
                    isRearCamera={isRearCamera}
                  />
                </Col>
                <Col sm={12} md={6} lg={5}>
                  <Card>
                    {/* <h4 className="p-2"></h4> */}
                    <CardBody>
                      <div>
                        <input {...getInputProps()} />
                        <div className="d-flex p-2 align-items-center justify-content-center flex-column">
                          {!isMobileScreen && (
                            <>
                              <QrCode size={64} />
                              <h5 className="px-2 py-1 text-center">
                                Give camera permission and show the Qr Code
                              </h5>
                            </>
                          )}

                          {/* <p className="text-secondary"> */}
                          <div className="d-flex gap-4">
                            <Button color="primary" onClick={handleQrReader}>
                              {userData.role_name === "Security Executive" &&
                                (open ? "Close Qr" : "ASN Gate Inward")}
                              {userData.role_name === "Store Keeper" &&
                                (open ? "Close Qr" : "ASN Material Receive")}
                              {userData.role_name === "Quality Incharge" &&
                                (open ? "Close Qr" : "ASN Check Quality")}
                              {userData.role_name === "Accounts Executive" &&
                                (open ? "Close Qr" : "Invoice")}
                              {userData.role_name ===
                                "Service Department User" &&
                                (open ? "Close Qr" : "Approve SCR")}
                              {[
                                "Security Executive",
                                "Store Keeper",
                                "Quality Incharge",
                                "Accounts Executive",
                                "Service Department User",
                              ].indexOf(userData.role_name) === -1 &&
                                "Qr Reader"}
                            </Button>
                            {isMobileScreen && open && (
                              <Button
                                color="primary"
                                className="d-flex align-items-center justify-content-center"
                                style={{
                                  gap: `10px`,
                                }}
                                onClick={() => {
                                  setIsRearCamera(!isRearCamera);
                                }}
                              >
                                Switch Camera
                                <IoCameraReverse size={20} />
                              </Button>
                            )}
                          </div>
                          {/* </p> */}
                        </div>
                      </div>
                      {loading ? (
                        <Stack
                          sx={{
                            width: "100%",
                            marginTop: "10px",
                            color: "#e06522",
                          }}
                          spacing={2}
                        >
                          <LinearProgress color="inherit" />
                          Scannig Qr .....
                        </Stack>
                      ) : (
                        ""
                      )}
                    </CardBody>
                  </Card>
                </Col>
                <Col sm={12} md={6} lg={5}>
                  {open ? (
                    <>
                      {!isMobileScreen && (
                        <QrReader
                          key="user"
                          delay={300}
                          onError={handleError}
                          onResult={handleScan}
                          constraints={{
                            facingMode: "user",
                          }}
                          style={{ width: "1rem" }}
                          className="mt-2 mt-md-0"
                        />
                      )}

                      {result ? (
                        <h3 style={{ color: "red" }}>Message:{result}</h3>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </TabPanel>
          </TabContext>
        </Box>
      )}
    </>
  );
};

export default ScanQr;
