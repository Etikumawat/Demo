/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Gsthide from "../../asn/Qrsettings";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  Row,
  Card,
  CardBody,
  Col,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../../configs/themeConfig";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import "../../asn/CustomInput.css";
import { Link, useLocation } from "react-router-dom";

const ASN = () => {
  let idx = 0;
  const [poType, setPOType] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState(null);
  const [orderlineData, setOrderLineData] = useState();
  const [orderlineDataCopy, setOrderLineDataCopy] = useState();
  const [poData, setPOData] = useState();
  const location = useLocation();
  const { poNumber } = location.state;
  const [loading, setLoading] = useState(false);
  const getPOData = () => {
    setMessage(null);
    const params = {
      PoNumber: poNumber,
    };
    setLoading(true);

    axios
      .post(
        new URL("/api/supplier/po/fetchPODetails", themeConfig.backendUrl),
        params
      )

      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          if (res.data.data.data.PO_HEADER.DOC_TYPE === "ZSER") {
            setPOType("Service PO");
            const QTYCOPY = res.data.data.data.PO_ITEM_SERVICES?.map(
              (item) => ({
                itemName: item.SHORT_TEXT,
                Quantity: item.ORIGINAL_QUANTITY,
                OG_QTY: item.QUANTITY,
              })
            );
            const extractedData = res.data.data.data.PO_ITEM_SERVICES?.map(
              (item) => ({
                type: "ZSER",
                itemName: item.SHORT_TEXT,
                createdAt: item.CREATED_ON,
                Quantity: item.QUANTITY,
                unit: item.BASE_UOM,
                materialCode: item.MATERIAL_LONG ? item.MATERIAL_LONG : "--",
                materialDescription: "",
                pricePerUnit: item.GR_PRICE,
                price: 0,
                gst: item.SUBTOTAL_1 ? item.SUBTOTAL_1 : 0,
                subTotal: item.NET_VALUE,
                hsnCode: item.CTR_KEY_QM ? item.CTR_KEY_QM : "--",
                material: item.MATERIAL,
                storageLocation: item.STORE_LOC,
                batchNo: item.BATCH,
                uom: item.BASE_UOM_ISO,
                specStock: item.SPEC_STOCK,
                poItem: item.PO_ITEM,
                remainQty: item.QUANTITY,
                weight: "",
                dimension: "",
                It_Taxes: null,
              })
            );
            setOrderLineData(extractedData);
            setOrderLineDataCopy(QTYCOPY);
          } else {
            setPOType("Material PO");
            const QTYCOPY = res.data.data.data.PO_ITEMS?.map((item) => ({
              itemName: item.SHORT_TEXT,
              Quantity: item.ORIGINAL_QUANTITY,
              OG_QTY: item.QUANTITY,
            }));
            const extractedData = res.data.data.data.PO_ITEMS?.map(
              (item, index) => {
                return {
                  itemName: item.SHORT_TEXT,
                  Quantity: item.QUANTITY,
                  unit: item.UNIT,
                  materialCode: item.MATERIAL_LONG,
                  materialDescription: "",
                  pricePerUnit: item.NET_PRICE ? item.NET_PRICE : 0,
                  price: 0,
                  gst: item.SUBTOTAL_1 ? +item.SUBTOTAL_1 : 0,
                  subTotal: item.NET_VALUE,
                  hsnCode: item.CTR_KEY_QM,
                  material: item.MATERIAL,
                  storageLocation: item.STORE_LOC,
                  batchNo: item.BATCH,
                  uom: item.BASE_UOM_ISO,
                  specStock: item.SPEC_STOCK,
                  poItem: item.PO_ITEM.toString(),
                  remainQty: item.QUANTITY,
                  weight: "",
                  dimension: "",
                  It_Taxes: res.data.data.data.IT_TAXES,
                };
              }
            );

            setOrderLineData(extractedData);
            setOrderLineDataCopy(QTYCOPY);
          }
          setPOData(res.data.data.data);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (poData?.PO_HEADER?.DOC_TYPE === "ZSER") {
      if (orderlineData) {
        const total = orderlineData.reduce(
          (acc, item) => acc + parseInt(item.subTotal),
          0
        );
        setTotalAmount(total);
      }
    } else {
      if (orderlineData) {
        const total = orderlineData.reduce(
          (acc, item) => acc + parseInt(item.subTotal),
          0
        );
        setTotalAmount(total);
      }
    }
  }, [orderlineData]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
      },
    },
    columns: {
      style: {
        maxWidth: "300px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    cells: {
      style: {
        paddingLeft: "50px",
        paddingRight: "8px",
      },
    },
  };
  const headerMaterial = {
    borderRadius: "10px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "20px",
    backgroundColor: "#f26c13",
    color: "white",
  };
  const headerService = {
    borderRadius: "10px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "20px",
    backgroundColor: "#00cfe8",
    color: "white",
  };
  const basicColumns = [
    {
      name: "No.",
      width: "100px",
      column: "sr",
      sortable: true,
      selector: (row, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      name: "Item",
      column: "itemName",
      width: "300px",
      sortable: true,
      selector: (row) => row.itemName,
    },

    {
      name: "Qty",
      column: "Quantity",
      sortable: true,
      selector: (row) => row.Quantity,
    },
    {
      name: "Unit",
      sortable: true,
      selector: (row) => row.unit,
    },
    {
      name: "HSN Code",
      column: "hsnCode",
      width: "180px",
      sortable: true,
      selector: (row) => {
        return row.hsnCode;
      },
    },
    {
      name: "Mrtl Code",
      column: "materialCode",
      width: "200px",
      sortable: true,
      selector: (row) => row.materialCode,
    },
    {
      name: "Price Per Unit",
      column: "pricePerUnit",
      width: "200px",
      sortable: true,
      selector: (row) => "₹" + row.pricePerUnit,
    },
    {
      name: "Tax",
      column: "IT_TAXES",
      width: "250px",
      selector: (row) => {
        if (row.type === "ZSER") {
          "₹" + row.gst;
          return;
        } else {
          const cgst = Number(row?.It_Taxes[idx]?.TAX_PER);
          const sgst = Number(row?.It_Taxes[idx + 1]?.TAX_PER);
          idx += 2;
          return (
            <div className="d-flex gap-2">
              <div>
                <div>GST {cgst + sgst}%</div>
                <div>CGST {cgst}%</div>
                <div>SGST {sgst}%</div>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                Tax: {"₹" + row.gst}
              </div>
            </div>
          );
        }
      },
    },
    {
      name: "Sub Total",
      column: "subTotal",
      width: "150px",
      sortable: true,
      selector: (row) => {
        return "₹" + row.subTotal;
      },
    },
  ];

  useEffect(() => {
    getPOData();
  }, [Gsthide]);

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/supplier/PoList"> PO List </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> View </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Row className="">
        <Col lg={12} md={12}>
          {loading ? (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner />
            </div>
          ) : (
            <>
              <Card className="poCard">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "18px",
                      marginLeft: "15px",
                      marginBlock: "0px",
                    }}
                  >
                    PO Number :
                    <span
                      style={{
                        color: poData?.PO_HEADER?.PO_NUMBER.startsWith("46")
                          ? "#00cfe8"
                          : "#f26c13",
                        paddingLeft: "5px",
                        fontWeight: "500",
                      }}
                    >
                      {poData?.PO_HEADER?.PO_NUMBER}
                    </span>
                  </p>
                  <h5
                    style={
                      poType === "Material PO" ? headerMaterial : headerService
                    }
                  >
                    {poType}
                  </h5>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingInline: "20px",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "16px" }}>
                      Vendor :
                      <span
                        style={{
                          fontWeight: "500",
                          color: "#666",
                          paddingLeft: "5px",
                        }}
                      >
                        {poData?.PO_HEADER?.VENDOR}
                      </span>
                    </p>
                    <p style={{ fontSize: "16px" }}>
                      Vendor Name :
                      <span style={{ fontWeight: "500", paddingLeft: "5px" }}>
                        {poData?.PO_HEADER?.VEND_NAME}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: "16px" }}>
                      Created At :
                      <span style={{ fontWeight: "500", paddingLeft: "5px" }}>
                        {poData?.PO_HEADER?.CREATED_ON}
                      </span>
                    </p>
                    <p style={{ fontSize: "16px" }}>
                      Created By :
                      <span style={{ fontWeight: "500", paddingLeft: "5px" }}>
                        {poData?.PO_HEADER?.CREATED_BY}
                      </span>
                    </p>
                  </div>
                </div>
                <hr style={{ marginTop: "5px" }} />
                <Form id="form">
                  <CardBody className="invoice-padding pt-0">
                    <label
                      className="mb-1 mt-4"
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      Order Line Items
                    </label>
                    <div className="react-dataTable-wrapper">
                      {message ? (
                        <h5 className="text-danger text-center">{message}</h5>
                      ) : (
                        ""
                      )}
                      <div className="react-dataTable">
                        <DataTable
                          noHeader
                          striped
                          customStyles={customStyles}
                          data={orderlineData}
                          columns={basicColumns}
                          className="react-dataTable"
                          sortIcon={<ChevronDown size={10} />}
                        />
                        <div className="total-section d-flex justify-content-end mt-2">
                          <div>
                            <b>Total : {"₹" + totalAmount} </b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Form>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ASN;
