/* eslint-disable no-prototype-builtins */
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import {
  Approval,
  Cancel,
  DoorBack,
  InventoryOutlined,
  LocalShippingOutlined,
  LocalShippingRounded,
  Pending,
  Receipt,
  ReceiptLong,
} from "@mui/icons-material";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import CustomAvatar from "../../@core/components/avatar";
import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import MuiTimeline from "@mui/lab/Timeline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import themeConfig from "../../configs/themeConfig";
import toast from "react-hot-toast";
import { useParams, Link } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  CardBody,
  Col,
  Input,
  Row,
} from "reactstrap";
import Spinner from "../../@core/components/spinner/Loading-spinner";
import { ShoppingCart, User } from "react-feather";
import { useNavigate } from "react-router";
import "./asn.scss";
import DataTable from "react-data-table-component";
import moment from "moment";

const ViewAsn = () => {
  const [data, setData] = useState({});
  const [timeline, setTimeline] = useState(null);
  const [status, setStatus] = useState(null);
  const [vehical, setVehical] = useState({});
  const [totalAmount, setTotalAmount] = useState("");
  const [lineItems, setLineItems] = useState([]);
  const [showVehicle, setShowVehicle] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const filteredData = data?.lineItems?.filter((row) => row.Quantity !== 0);
  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);

  const CalcWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:not(:last-of-type)": {
      marginBottom: theme.spacing(2),
    },
  }));
  const headerStyle = {
    borderRadius: "10px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "0px 0px 30px 0px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
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
      case "partiallyReceived":
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
  useEffect(() => {
    setLoading(true);

    axios
      .post(new URL(`v1/supplier/asn/view/` + id, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setLoading(false);

        setData(res.data.data);
        setTimeline(res.data.timeline);
        setLineItems(res.data.data.lineItems);
        setStatus(res.data.data.status);
        if (res.data.vehicleDetails != null) {
          console.log("not null");
          setShowVehicle(true);
          setVehical(res.data.vehicleDetails);
        } else {
          setShowVehicle(false);
          console.log("null");
        }
      });
  }, [id]);
  const cancelAsn = () => {
    axios
      .delete(
        new URL(`v1/supplier/asn/cancelASN/` + id, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigateTo("/supplier/asn");
        }
      });
  };
  useEffect(() => {
    if (lineItems) {
      const total = lineItems.reduce(
        (acc, item) => acc + parseInt(item.subTotal),
        0
      );
      setTotalAmount(total); // Update totalAmount state
    }
  }, [lineItems]);
  const basicColumns = [
    {
      name: "Item",
      minWidth: "250px",
      cell: (row) => (data.type === "ZSER" ? row.serviceName : row.itemName),
    },
    {
      name: "Unit Price",
      minWidth: "150px",
      cell: (row) => row.pricePerUnit,
    },
    {
      name: "Quantity",
      minWidth: "150px",
      selector: (row) => (row.Quantity !== 0 ? row.Quantity : ""),
    },
    {
      name: "Price",
      minWidth: "150px",
      selector: (row) => row.pricePerUnit * row.Quantity,
    },
    {
      name: "Unit",
      Width: "50px",
      selector: (row) => row.unit,
    },
    {
      name: "GST",
      Width: "50px",
      selector: (row) =>
        data.type !== "ZSER" && row.gst
          ? (row.pricePerUnit * row.Quantity * (9 + 9)) / 100
          : "--",
    },
    {
      name: "HSN Code",
      minWidth: "150px",
      selector: (row) =>
        data.type !== "ZSER" && row.hsnCode ? row.hsnCode : "--",
    },

    {
      name: "Sub Total",
      minWidth: "150px",
      selector: (row) => row.subTotal,
    },
  ];
  return (
    <div>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/supplier/asn">List ASN/SCR</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> {data?.asnNo} </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      {console.log(basicColumns)}
      <div className="card-body">
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <Spinner />
          </div>
        ) : (
          <>
            <Card className="p-2 mb-2">
              <div
                style={{ display: "inline", marginBottom: "0.6rem" }}
                className="d-flex custome-block justify-content-between"
              >
                <div>
                  <label style={{ fontSize: "1.5rem", color: "black" }}>
                    Order
                  </label>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: data?.type === "NB" ? "#f26c13" : "#00cfe8",
                    }}
                  >
                    {" "}
                    {`#`}
                    {data?.asnNo}
                  </span>

                  {data.invoiceType ? (
                    <Badge
                      className="m-1"
                      style={{ fontSize: "15px" }}
                      color="success"
                    >
                      {data.invoiceType === "postInvoiced"
                        ? "Invoice Posted"
                        : "Invoice Parked"}
                    </Badge>
                  ) : (
                    <Badge
                      className="m-1"
                      style={{ fontSize: "15px" }}
                      color={getStatusColor(data.status)}
                    >
                      {data?.status?.charAt(0)?.toUpperCase() +
                        data?.status?.slice(1)}
                      {console.log(data.status, "status")}
                    </Badge>
                  )}
                </div>
                {status === "materialShipped" || status === "requested" ? (
                  <Button onClick={cancelAsn} color="danger">
                    {data?.type === "NB" ? "Cancel ASN" : "Cancel SCR"}
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div>
                <div className="mb-1">
                  <label style={{ fontSize: "1.5rem", color: "black" }}>
                    PO No:{" "}
                  </label>
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: data?.type === "NB" ? "#f26c13" : "#00cfe8",
                    }}
                  >
                    {data?.poNo}
                  </span>
                </div>
                <label style={{ color: "black", marginBottom: "0.5rem" }}>
                  Created At:{" "}
                </label>
                <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                  {" "}
                  {moment(data?.createdAt)?.format("DD-MM-YYYY")}
                </span>
              </div>
              <div>
                <label style={{ color: "black", marginBottom: "0.5rem" }}>
                  Dispatch Date:{" "}
                </label>
                <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                  {" "}
                  {moment(data?.dispatchDate)?.format("DD-MM-YYYY")}
                </span>
              </div>
              <div>
                <label style={{ color: "black", marginBottom: "0.5rem" }}>
                  Supplier id:{" "}
                </label>
                <span style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.6)" }}>
                  {" "}
                  {data.supplierId}
                </span>
              </div>
            </Card>

            <Grid container spacing={2}>
              <Grid item lg={8} xs={12}>
                <Card className="mb-2">
                  <DataTable
                    noHeader
                    data={filteredData}
                    columns={basicColumns}
                    className="react-dataTable"
                  />

                  <CardContent
                    sx={{
                      px: [
                        `${theme.spacing(8)} !important`,
                        `${theme.spacing(14)} !important`,
                      ],
                    }}
                  >
                    <Grid container className="d-flex justify-content-end">
                      <Grid
                        item
                        xs={12}
                        sm={5}
                        lg={3}
                        sx={{
                          mb: { sm: 0, xs: 4 },
                          order: { sm: 2, xs: 1 },
                        }}
                      >
                        <CalcWrapper>
                          <Typography
                            sx={{ fontWeight: 600, fontSize: "16px" }}
                          >
                            Total: {totalAmount}
                          </Typography>
                        </CalcWrapper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                {userData.role_name === "Security Executive" ? (
                  <Card
                    style={{
                      backgroundColor: "#f5c6a72e",
                      padding: "30px",
                      borderRadius: "5px",
                      marginBottom: "20px",
                    }}
                  >
                    {console.log(vehical, "vehical details")}
                    <h3 style={headerStyle}>Vehicle Details</h3>
                    <CardBody>
                      <Row>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Vehicle No</label>
                          <Input
                            type="text"
                            name="name"
                            id="nameVertical"
                            value={vehical.vehicalNo}
                          />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Location</label>
                          <Input
                            value={vehical.comeFrom}
                            className={`react-select`}
                            classNamePrefix="select"
                          />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Logistic Name</label>
                          <Input type="text" value={vehical.logisticCoName} />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Driver Name</label>
                          <Input type="text" value={vehical.driverFullName} />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Licence No</label>
                          <Input type="text" value={vehical.driverLicenceNo} />
                        </Col>

                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Gate No.</label>
                          <Input
                            type="text"
                            value={vehical.gateInwardLocation}
                          />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1"></label>
                          Arrival Date
                          <Input
                            type="date"
                            style={{ marginTop: "13px" }}
                            value={vehical.arrivalDate}
                          />
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">
                            Arrival Time{" "}
                            <Input
                              type="time"
                              style={{ marginTop: "13px" }}
                              value={vehical.arrivalTime}
                            />
                          </label>
                        </Col>
                        <Col md="4" className="mb-1">
                          <label className="pb-0 mb-1">Container Sealed</label>
                          <div>
                            <label style={{ marginRight: "20px" }}>
                              <Input
                                type="radio"
                                name="vehicalStatus"
                                value="true"
                                disabled
                                checked={vehical.vehicalStatus === "shield"}
                              />
                              Yes
                            </label>
                            <label className="ml-3">
                              <Input
                                type="radio"
                                name="vehicalStatus"
                                value="false"
                                disabled
                                checked={vehical.vehicalStatus !== "shield"}
                              />
                              No
                            </label>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
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
                                  {moment(item.Time).format(
                                    "DD-MM-YYYY, hh:mm:ss A"
                                  )}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          )
                      )}
                    </Timeline>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item lg={4} xs={12}>
                <Card className="p-2 mb-2">
                  <h4 className="mb-2">Supplier Details</h4>
                  <div className="d-flex gap-1 mb-2">
                    <CustomAvatar
                      style={{
                        backgroundColor: "#7367f0",
                        height: "50px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginRight: "8px",
                        padding: "8px",
                      }}
                      icon={<User style={{ fontSize: "20px" }} />}
                    ></CustomAvatar>
                    <div>
                      <p style={{ fontSize: "14px", margin: 0 }}>
                        {user.firstname}
                      </p>
                      <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
                        Vendor : {data.supplierId}
                      </p>
                    </div>
                  </div>

                  <div
                    className="d-flex gap-1"
                    style={{ alignItems: "center" }}
                  >
                    <CustomAvatar
                      style={{
                        backgroundColor: "#7367f0",
                        height: "50px",
                        width: "50px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        // marginRight: "8px",
                        padding: "8px",
                      }}
                      icon={<ShoppingCart style={{ fontSize: "20px" }} />}
                    ></CustomAvatar>
                    <p style={{ fontSize: "14px", margin: 0 }}>
                      {data.lineItems &&
                      data.lineItems.filter((item) => item.Quantity > 0)
                        .length !== 0
                        ? data.lineItems.filter((item) => item.Quantity > 0)
                            .length + " Line Items"
                        : "NA"}
                    </p>
                  </div>
                </Card>
                <Card className="p-2 mb-2">
                  <div className="d-flex mb-2">
                    <div>
                      <div>
                        <label
                          className="mt-1"
                          style={{ color: "black", marginBottom: "0.5rem" }}
                        >
                          GST No:
                        </label>
                        <span
                          style={{
                            fontSize: "14px",
                            marginLeft: "5px",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {data.gst}
                        </span>
                      </div>
                      {data?.type === "NB" ? (
                        <div>
                          <label
                            className="mt-1"
                            style={{ color: "black", marginBottom: "0.5rem" }}
                          >
                            E-Way Bill:
                          </label>
                          <span
                            style={{
                              fontSize: "14px",
                              marginLeft: "5px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                          >
                            {data.eWayBillNo}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}

                      <div>
                        <label
                          className="mt-1"
                          style={{ color: "black", marginBottom: "0.5rem" }}
                        >
                          IRN No.:
                        </label>
                        <span
                          style={{
                            fontSize: "14px",
                            marginLeft: "5px",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {data.irnNo ? data.irnNo : "NA"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-2 mb-2">
                  <h4 className="mb-2">
                    <CustomAvatar
                      style={{
                        backgroundColor: "#2a62ccbd",
                        marginRight: "4px",
                      }}
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
                            {data?.shipToAddress
                              ? data.shipToAddress
                                  .split(",")
                                  .map((line, index) => (
                                    <div key={index}>{line.trim()}</div>
                                  ))
                              : "278, Jeevan Udyog BuildingMaharastraMumbai400001"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
                <Card className="p-2">
                  <h4 className="mb-1">
                    <CustomAvatar
                      style={{
                        backgroundColor: "#2a62ccbd",
                        marginRight: "4px",
                      }}
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
                            {data?.billToAddress
                              ? data.billToAddress
                                  .split(",")
                                  .map((line, index) => (
                                    <div key={index}>{line.trim()}</div>
                                  ))
                              : "278, Jeevan Udyog BuildingMaharastraMumbai400001"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAsn;
