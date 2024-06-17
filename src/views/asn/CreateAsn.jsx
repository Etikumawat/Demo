/* eslint-disable react/react-in-jsx-scope */
import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRef } from "react";
import moment from "moment";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  Form,
  Input,
  Button,
  Row,
  Card,
  CardBody,
  CardText,
  Label,
  Col,
  FormFeedback,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import axios from "axios";
import { toast } from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { ChevronDown } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { LocalShippingOutlined, PinDrop, Receipt } from "@mui/icons-material";
import "./CustomInput.css";
import { CircularProgress, LinearProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
const MySwal = withReactContent(Swal);
const vendorCodeJSON = localStorage.getItem("vendorCode");
const vendorCode = vendorCodeJSON ? JSON.parse(vendorCodeJSON) : null;

const ASN = () => {
  const navigate = useNavigate();
  const [qrIsVisible, setQrIsVisible] = useState(false);
  const [picker, setPicker] = useState(new Date(null));
  const [datepicker, setDateicker] = useState(new Date(null));
  const [selectedOption, setSelectedOption] = useState("");
  const [errorsdispatch, setErrors] = useState({
    dispatchDate: false,
  });
  const [errordocument, setErrordocument] = useState({
    document_date: false,
  });
  const storedValue = localStorage.getItem("supplierId");
  const id = storedValue;
  let idx = 0;
  const [form, setForm] = useState({});
  const [poType, setPOType] = useState();
  const [printsetting, setPrintsetting] = useState();
  const [supplierData, setSupplierData] = useState(null);
  const [invoice, setInvoice] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState(null);
  const [loadingPoList, setLoadingPoList] = useState(false);
  const [loadingPoDetails, setLoadingPoDetails] = useState(false);
  const [invoiceFileName, setInvoiveFileName] = useState("");
  const [unitsOption, setUnitsOption] = useState();
  const [orderlineData, setOrderLineData] = useState();
  const [orderlineDataCopy, setOrderLineDataCopy] = useState();
  const [currentUnit, setCurrentUnit] = useState(1);
  const [irnView, setIrnView] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const handleQtyChange = (rowIndex, value) => {
  //   const updatedData = [...orderlineData];
  //   updatedData[rowIndex].Quantity = value;
  //   setOrderLineData(updatedData);
  //   console.log("after update", orderlineDataCopy);
  // };

  const handleQtyChange = (rowIndex, value) => {
    const updatedData = [...orderlineData];
    const pricePerUnit = updatedData[rowIndex].pricePerUnit;
    const tax = updatedData[rowIndex].gst;
    if (value > orderlineDataCopy[rowIndex].OG_QTY) {
      setMessage(`Qty Limit : ${orderlineDataCopy[rowIndex].OG_QTY}`);
      // toast(
      //   `Qty cannot be more than PO Qty:${orderlineDataCopy[rowIndex].Quantity}`
      // );
    } else {
      setMessage(null);
      const initialQty = orderlineDataCopy[rowIndex].OG_QTY;
      const remainQty = initialQty - value;

      updatedData[rowIndex].Quantity = value;
      updatedData[rowIndex].price = pricePerUnit * value;
      const tax_amount = (updatedData[rowIndex].price * 18) / 100;
      updatedData[rowIndex].subTotal =
        updatedData[rowIndex].price === 0
          ? "0"
          : updatedData[rowIndex].price + tax_amount;

      updatedData[rowIndex].remainQty = remainQty;

      setOrderLineData(updatedData);
    }
  };

  const handleIrnChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      irnNo: value,
    });
  };
  const handleEWayChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      eWayBillNo: value,
    });
  };
  const handlePanChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      companyPAN: value,
    });
  };
  const handleGstChange = (event) => {
    const value = event.target.value.toLocaleUpperCase();
    setForm({
      ...form,
      companyGST: value,
    });
    if (value === "" || gstRegex.test(value)) {
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a valid GST No.");
      setForm({
        ...form,
        companyGST: "",
      });
    }
    setForm({
      ...form,
      companyGST: value,
    });
  };
  const handleRemarksChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      remarks: value,
    });
  };
  const handleGstInvoiceNumChange = (event) => {
    const value = event.target.value;
    setForm({
      ...form,
      gstinvoicenum: value,
    });
  };
  // const handleUnitChange = (rowIndex, selectedOption) => {
  //   const updatedData = [...orderlineData];
  //   updatedData[rowIndex].unit = selectedOption.value;
  //   setOrderLineData(updatedData);
  // };

  const handleClear = () => {
    setPOData();
  };
  const [qrData, setQrData] = useState("");
  const [purchaseOrder, setPurchaseOrder] = useState([]);
  const [poData, setPOData] = useState();
  const [query, setQuery] = useState({
    offset: 0,
    limit: 25,
    search: "",
    order: "desc",
    sort: "id",
  });
  const request = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    const params = {
      SUPPLIER: vendorCode?.toString(),
    };
    setLoadingPoList(true);
    axios
      .post(
        new URL("/api/supplier/po/fetchPOList", themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          setLoadingPoList(false);
          toast.error("Couldn't Fetch PO List");
          return toast.error(res.data.message);
        }
        const mappedPurchaseOrders = res.data.data.data.map((item) => ({
          label: item.PO_NUMBER.startsWith(46)
            ? item.PO_NUMBER + " | " + "Service"
            : item.PO_NUMBER + " | " + "Material",
          value: item.PO_NUMBER,
        }));

        setPurchaseOrder(mappedPurchaseOrders);
        setLoadingPoList(false);
      })
      .catch((error) => {
        toast.error("Couldn't Fetch PO List");
        console.error(error);
      });
    setTimeout(() => {
      setLoadingPoList(false);
      // toast.error("Request timed out");
    }, 15000);
  };
  const getPOData = (Id) => {
    setLoadingPoDetails(true);
    setMessage(null);
    const params = {
      PoNumber: Id,
    };
    axios
      .post(
        new URL(`/api/supplier/po/fetchPODetails`, themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          setLoadingPoDetails(false);
          return toast.error(res.data.message);
        } else {
          // console.log(res.data.data.data.IT_TAXES);
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
                Quantity: 0,
                unit: item.BASE_UOM,
                materialCode: item.MATERIAL_LONG,
                materialDescription: "",
                pricePerUnit: item.GR_PRICE,
                // price: item.GROSS_VAL,
                price: 0,
                gst: item.SUBTOTAL_1 ? item.SUBTOTAL_1 : 0,
                // subTotal: item.NET_VALUE,
                subTotal: 0,
                hsnCode: item.CTR_KEY_QM,
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
                const subtotal3 = item.SUBTOTAL_3 || 0;
                const subtotal1 = item.SUBTOTAL_1 || 0;

                return {
                  itemName: item.SHORT_TEXT,
                  Quantity: 0,
                  unit: item.UNIT,
                  materialCode: item.MATERIAL_LONG,
                  materialDescription: "",
                  pricePerUnit: item.NET_PRICE ? item.NET_PRICE : 0,
                  // price: item.GROS_VALUE ? +item.GROS_VALUE : 0,
                  price: 0,
                  gst: item.SUBTOTAL_1 ? +item.SUBTOTAL_1 : 0,
                  // subTotal: subtotal3 + subtotal1,
                  subTotal: 0,
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
          console.log(res.data.data.data.PO_ITEMS, "Po Items");
          setPOData(res.data.data.data);
        }
        setLoadingPoDetails(false);
      });
  };
  const [selectPlants, setSelectPlants] = useState("");
  const [plants, setPlants] = useState([]);

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
      selector: (row, index) => {
        return (
          <Input
            type="number"
            min={0}
            value={row.Quantity}
            style={{ paddingRight: `4px` }}
            className="show-arrows"
            onChange={(e) => handleQtyChange(index, e.target.value)}
          />
        );
      },
    },
    {
      name: "Remain Qty",
      column: "remain Qty",
      width: "150px",
      sortable: true,
      selector: (row) => row.remainQty,
    },
    {
      name: "Unit",
      sortable: true,
      selector: (row) => row.unit,
    },
    // {
    //   name: "Convert Unit",
    //   sortable: true,
    //   width: "200px",
    //   cell: (row, index) => {
    //     return (
    //       <Select
    //         menuPlacement="auto"
    //         menuPortalTarget={document.body}
    //         styles={{ width: "100%" }}
    //         options={unitsOption}
    //         value={unitsOption?.find((option) => option.value === row.unit)}
    //         onChange={(selectedOption) =>
    //           handleUnitChange(index, selectedOption)
    //         }
    //         className="react-select"
    //         classNamePrefix="select"
    //       />
    //     );
    //   },
    // },
    // {
    //   name: "Converted Value",
    //   width: "200px",
    //   column: "sr",
    //   cell: (row, index) => {
    //     return <span>{row.convertedValue}</span>;
    //   },
    // },
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
    // {
    //   name: "Mrtl Desc",
    //   column: "unit",
    //   width: "200px",
    //   sortable: true,
    //   selector: (row) => row.materialDescription,
    // },
    {
      name: "Price Per Unit",
      column: "pricePerUnit",
      width: "200px",
      sortable: true,
      selector: (row) => "₹" + row.pricePerUnit,
    },
    // {
    //   name: "Tax",
    //   column: "gst",
    //   width: "200px",
    //   sortable: true,
    //   selector: (row) => "₹" + row.gst,
    // },
    {
      name: "Tax",
      column: "IT_TAXES",
      width: "250px",
      // sortable: true,
      selector: (row) => {
        if (row.type === "ZSER") {
          "₹" + row.gst;
          return;
        } else {
          const cgst = Number(row?.It_Taxes[idx]?.TAX_PER);
          const sgst = Number(row?.It_Taxes[idx + 1]?.TAX_PER);
          idx += 2;
          // console.log(row);
          return (
            <div className="d-flex gap-2">
              <div>
                <div>GST {cgst + sgst}%</div>
                <div>CGST {cgst}%</div>
                <div>SGST {sgst}%</div>
              </div>
              {/* <div style={{width: '1px', height: "auto",  backgroundColor: "#808080"}} className=""></div> */}
              <div className="d-flex align-items-center justify-content-center">
                Tax: {"₹" + (row.price * (cgst + sgst)) / 100}
              </div>
            </div>
          );
        }
      },
    },
    {
      name: "Price",
      column: "price",
      width: "200px",
      sortable: true,
      selector: (row) => "₹" + row.price,
    },
    {
      name: "Sub Total",
      column: "subTotal",
      width: "150px",
      sortable: true,
      selector: (row) => {
        return "₹" + row.subTotal; // Returning the subTotal value for the table column
      },
    },
    // {
    //   name: "Weight",
    //   column: "NET_WEIGHT",
    //   sortable: true,
    //   selector: (row, index) => {
    //     return (
    //       <Input
    //         type="text"
    //         value={row.NET_WEIGHT}
    //         onChange={(e) => handleWeightChange(index, e.target.value)}
    //       />
    //     );
    //   },
    // },
    // {
    //   name: "Dimensions",
    //   column: "dimension",
    //   sortable: true,
    //   selector: (row, index) => {
    //     return (
    //       <Input
    //         type="text"
    //         value={row.dimension}
    //         onChange={(e) => handleDimensionChange(index, e.target.value)}
    //       />
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    request();
    axios
      .post(new URL("/api/v1/admin/plants/list", themeConfig.backendUrl))
      .then((response) => {
        setPlants(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(
        new URL(`/api/v1/supplier/supplier/view/${id}`, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setSupplierData(res.data.data);
        }
      });
    axios
      .post(new URL("/api/v1/admin/uom/list", themeConfig.backendUrl), {
        limit: 200,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        const unitList = res.data.data.rows.map((item) => ({
          label: item.name,
          value: item.unit,
        }));
        setUnitsOption(unitList);
      });
  }, []);
  function generateASN(purchaseOrderNumber) {
    const asnNumber = `${purchaseOrderNumber}`;
    return asnNumber;
  }
  // Example usage:
  const pOrder = poData ? "PO" + poData?.PO_NUMBER : "";
  //   const supplierCode = poData ? "SUP" + poData?.supplier_id : "";
  const generatedASN = generateASN(pOrder);

  const onFileChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    setInvoiveFileName(files[0].name);
    setInvoice(files[0].name);

    // reader.onload = function () {
    //   setInvoice(files[0]);
    // };
    // reader.readAsDataURL(files[0]);
  };
  const removeFile = () => {
    setInvoiveFileName();
    setInvoice("");
  };

  const getQrCode = (number) => {
    console.log(number, "number");
    const num = number?.toString();
    console.log(num, "qrid");
    // if(number ==! ""){
    axios
      .post(
        new URL(`/api/v1/supplier/asn/qrcode/${number}`, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setQrData(res.data.QrCodeBase64);
          const qrData = res.data.QrCodeBase64;
          toast.success("Qrcode Generated Successfully");
          const passData = {
            number,
            qrData,
          };
          {
            poType === "Material PO"
              ? irngenerateModal(passData)
              : redirect(passData);
          }
        }
      });
    // }
    // else{
    //   toast.error("Something went wrong Qrcode is not fetched")
    // }
  };
  const redirect = (passData) => {
    setTimeout(() => {
      navigate("/supplier/asn/print", {
        state: passData,
      });
    }, 2000);
  };
  const irngenerateModal = (passData) => {
    MySwal.fire({
      title: "Do you want to generate IRN?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Skip",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.isConfirmed) {
        setSupplierView(false);
        setPOData(false);
        setGenerateIrn(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        redirect(passData);
      }
    });
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const onSubmit = (e) => {
    e.preventDefault();
    const DATA = {
      poNo: poData?.PO_HEADER?.PO_NUMBER?.toString(),
      poDate: poData?.order_date,
      asnNo: generatedASN,
      plantId: selectPlants.value,
      supplierId: poData?.PO_HEADER.VENDOR,
      dispatchDate: moment(picker[0]).format("DD-MM-YYYY"),
      type: poData?.PO_HEADER?.DOC_TYPE,
      carrier: "",
      status: "materialShipped",
      lineItems: orderlineData,
      gst: supplierData?.gstNo,
      pan: supplierData?.panNo,
      irnNo: form.irnNo ? form.irnNo : "",
      eWayBillNo: form.eWayBillNo ? form.eWayBillNo : "",
      companyPAN: form.companyPAN ? form.companyPAN : "",
      companyGST: form.companyGST ? form.companyGST : "",
      gstInvoiceNumber: form.gstinvoicenum,
      shipToAddress:
        poData?.PO_ADDRESS?.STREET +
        poData?.PO_ADDRESS?.STR_SUPPL1 +
        poData?.PO_ADDRESS?.STR_SUPPL2,
      billToAddress:
        poData?.PO_ADDRESS?.STREET +
        poData?.PO_ADDRESS?.STR_SUPPL1 +
        poData?.PO_ADDRESS?.STR_SUPPL2,
      remarks: form.remarks,
      file: invoice ? invoice : "",
      departmentId: supplierData?.department_id,
      // totalAmount: totalAmount,
    };
    const newData = {
      ...DATA,
      lineItems: DATA.lineItems.map((item) => {
        const { remainQty, ...itemWithoutRemainQty } = item;
        return itemWithoutRemainQty;
      }),
    };

    newData.lineItems.forEach((item) => {
      delete item.convertedValue;
      delete item.It_Taxes;
      delete item.type;
    });
    const sendData = {
      DATA: newData,
      orderlineDataCopy: orderlineDataCopy,
    };
    if (picker[0]) {
      axios
        .post(
          new URL("/api/v1/supplier/asn/create", themeConfig.backendUrl),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          } else {
            toast.success(res.data.message);
            setIsSubmitted(true);
            if (res.data.data[0] != "") {
              const asnId = res.data.data[0];
              getQrCode(asnId);
            } else {
              toast.error("Something went wrong Qrcode is not fetched");
            }
          }
        })
        .catch((err) => {
          return toast.error(err.message);
        });
    } else {
      setErrors({
        dispatchDate: true,
      });
      toast("Select Dispatch Date");
    }
  };
  // const MaterialStyle = {
  //   borderRadius: "10px",
  //   width: "fit-content",
  //   padding: "10px 30px 10px 15px",
  //   margin: "20px 0px",
  //   backgroundColor: "#f26c13",
  //   color: "rgb(255, 255, 255)",
  // };
  // const ServiceStyle = {
  //   borderRadius: "10px",
  //   width: "fit-content",
  //   padding: "10px 30px 10px 15px",
  //   margin: "20px 0px",
  //   backgroundColor: "#00cfe8",
  //   color: "rgb(255, 255, 255)",
  // };

  const MaterialPoStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#f26c13",
    color: "rgb(255, 255, 255)",
  };
  const ServicePoStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#00cfe8",
    color: "rgb(255, 255, 255)",
  };

  const [printClicked, setPrintClicked] = useState(false);

  const defaultValues = {
    gstin: form.companyGST,
  };
  const SignupSchema = yup.object().shape({
    legal_name: yup.string().required("*Buyer Name required"),
    location: yup.string().required("*Buyer Location required"),
    place_of_supply: yup.object().shape({
      value: yup.string().min(1).required("*Place of supply required"),
    }),
    pincode: yup
      .string()
      .matches(/^\d{6}$/, "Must be exactly 6 digits")
      .required("*Buyer Pincode required"),

    shiplegal_name: yup.string().required("*Shiping legal Name required"),
    shipaddress1: yup.string().required("*Shiping Address required"),
    shiplocation: yup.string().required("*Shiping Location required"),
    shippincode: yup
      .string()
      .matches(/^\d{6}$/, "Must be exactly 6 digits")
      .required("*Shiping Pincode required"),
    shipstatecode: yup.object().shape({
      value: yup.string().optional().min(1).required("*State required"),
    }),
    transportation_mode: yup.object().shape({
      value: yup
        .string()
        .optional()
        .min(1)
        .required("*Transportation required"),
    }),
    transportation_distance: yup
      .string()
      .required("*Transportation distance is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
    total_assessable_value: yup
      .string()
      .required("*Total Assessable value is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
    total_invoice_value: yup
      .string()
      .required("*Total invoice value is required")
      .test(
        "is-length",
        "Transportation distance must be between 2 and 7 characters",
        (value) => {
          if (!value) return true;
          const length = value.trim().length;
          return length >= 2 && length <= 8;
        }
      ),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });
  const [generateIrn, setGenerateIrn] = useState(false);
  const [irnresponse, setIrnresponse] = useState();
  const [irnresponseview, setIrnresponseview] = useState(false);
  const onSubmitIrnEdit = (data) => {
    // const sendData = {
    //   asnNo: "ASN410000305600123",
    //   user_gstin: "05AAAPG7885R002",
    //   transaction_details: {
    //     supply_type: "B2B",
    //   },
    //   document_details: {
    //     document_type: "INV",
    //     document_number: "TATA/99024",
    //     document_date: "2024-03-19T18:30:00.000Z",
    //   },
    //   buyer_details: {
    //     gstin: "07AAACN0372R1Z5",
    //     legal_name: "tester",
    //     address1:
    //       "19:ASHIRWAD BUNGLOWS-PART 2, B/H AUDA GARDEPRAHALAD NAGAR, AMBAWADI P.O.",
    //     location: "ahmedabad",
    //     pincode: "121002",
    //     place_of_supply: "13",
    //     state_code: "07",
    //   },
    //   ship_details: {
    //     legal_name: "Dell and Co.",
    //     address1: "new Station road",
    //     location: "Bhuj",
    //     pincode: "370001",
    //     state_code: "07",
    //   },
    //   export_details: {
    //     country_code: "IN",
    //   },
    //   ewaybill_details: {
    //     transportation_mode: "Ship",
    //     transportation_distance: "296",
    //   },
    //   value_details: {
    //     total_assessable_value: "4",
    //     total_invoice_value: "4.2",
    //   },
    // };

    const sendData = {
      asnNo: "ASN410000305600123",
      user_gstin: "05AAAPG7885R002",
      transaction_details: {
        supply_type: "B2B",
      },
      document_details: {
        document_type: "INV",
        document_number: "TATA/99024",
        document_date: datepicker[0],
      },
      buyer_details: {
        gstin: form.companyGST,
        legal_name: data.legal_name,
        address1: data.address1,
        location: data.location,
        pincode: data.pincode,
        place_of_supply: data?.place_of_supply?.value,
        state_code: form?.companyGST?.substring(0, 2),
      },
      ship_details: {
        legal_name: data.shiplegal_name,
        address1: data.shipaddress1,
        location: data.shiplocation,
        pincode: data.shippincode,
        state_code: data?.shipstatecode?.value,
      },
      export_details: {
        country_code: "IN",
      },
      ewaybill_details: {
        transportation_mode: data?.transportation_mode?.value,
        transportation_distance: data.transportation_distance,
      },
      value_details: {
        total_assessable_value: data.total_assessable_value,
        total_invoice_value: data.total_invoice_value,
      },
    };

    if (datepicker[0]) {
      axios
        .post(
          new URL(
            "/api/v1/services/masterIndia/generateIrn",
            themeConfig.backendUrl
          ),
          sendData
        )
        .then((res) => {
          if (res.data.error) {
            const errorMessage = `${res.data.message} ${res.data.data}`;
            toast.error(errorMessage);
          } else {
            toast.success(res.data.message);
            setIrnresponse(res.data.data.results);
            console.log(res.data.data.results.message, "irn response");
            setIrnresponseview(true);
          }
        })
        .catch((err) => {
          toast.error(err.message);
          console.log(err);
        });
    } else {
      setErrordocument({
        document_date: true,
      });
      toast.error("Select Document Date");
    }
  };
  const indianStates = [
    { value: "1", label: "Andaman and Nicobar Islands" },
    { value: "2", label: "Andhra Pradesh" },
    { value: "3", label: "Arunachal Pradesh" },
    { value: "4", label: "Assam" },
    { value: "5", label: "Bihar" },
    { value: "6", label: "Chandigarh" },
    { value: "7", label: "Chhattisgarh" },
    { value: "8", label: "Dadra and Nagar Haveli" },
    { value: "9", label: "Daman and Diu" },
    { value: "10", label: "Delhi" },
    { value: "11", label: "Goa" },
    { value: "12", label: "Gujarat" },
    { value: "13", label: "Haryana" },
    { value: "14", label: "Himachal Pradesh" },
    { value: "15", label: "Jammu and Kashmir" },
    { value: "16", label: "Jharkhand" },
    { value: "17", label: "Karnataka" },
    { value: "18", label: "Kerala" },
    { value: "19", label: "Ladakh" },
    { value: "20", label: "Lakshadweep" },
    { value: "21", label: "Madhya Pradesh" },
    { value: "22", label: "Maharashtra" },
    { value: "23", label: "Manipur" },
    { value: "24", label: "Meghalaya" },
    { value: "25", label: "Mizoram" },
    { value: "26", label: "Nagaland" },
    { value: "27", label: "Odisha" },
    { value: "28", label: "Puducherry" },
    { value: "29", label: "Punjab" },
    { value: "30", label: "Rajasthan" },
    { value: "31", label: "Sikkim" },
    { value: "32", label: "Tamil Nadu" },
    { value: "33", label: "Telangana" },
    { value: "34", label: "Tripura" },
    { value: "35", label: "Uttar Pradesh" },
    { value: "36", label: "Uttarakhand" },
    { value: "37", label: "West Bengal" },
  ];

  const [supplierView, setSupplierView] = useState(true);
  const buttonColor = printClicked ? "success" : "secondary";
  const buttonText = printClicked ? "Print ASN" : "View ASN";
  return (
    <>
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
        // transition: Flip,
      />
      <Alert color="primary">
        <div className="alert-body d-flex align-items-center justify-content-between flex-wrap p-2">
          <div className="me-1">
            <h4 className="fw-bolder text-primary">
              Create your ASN/SCR from Purchase Order 👩🏻‍💻
            </h4>
          </div>
          {/* <Button color="primary">Contact Us</Button> */}
        </div>
      </Alert>
      <Row className="">
        <Col lg={12} md={12}>
          <Card id="yourContentId" className="poCard invoice-preview-card p-1">
            {supplierView && (
              <Card
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardBody className=" invoice-padding">
                  {vendorCode ? (
                    ""
                  ) : (
                    <h3 className="text-danger">
                      Sap Code not assigned yet. Cant create ASN/SCR
                    </h3>
                  )}
                  <h4
                    className="invoice-title text-end"
                    style={{ width: "100" }}
                  >
                    {poData?.PO_NUMBER.startsWith("41") ? (
                      <span
                        style={{ color: "#e9630b" }}
                        className="invoice-number"
                      >
                        {poData ? "ASN No: PO" + poData?.PO_NUMBER : ""}
                      </span>
                    ) : (
                      <span
                        style={{ color: "#00cfe8" }}
                        className="invoice-number"
                      >
                        {poData ? "SCR No: PO" + poData?.PO_NUMBER : ""}
                      </span>
                    )}
                  </h4>
                  <div className="d-flex align-items-md-end justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                    <div>
                      <h4 className="invoice-title mt-2">
                        Supplier{""}
                        <span className="invoice-number">
                          <Input
                            disabled
                            className="mt-1"
                            value={vendorCode}
                            type="text"
                            name="orderQuantity"
                          />
                        </span>
                      </h4>
                      <h4 className="invoice-title  mt-2">
                        Purchase Order <span className="text-danger"> *</span>
                      </h4>
                      <div className="d-flex align-items-center justify-content-center">
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`nameOfCompany`}
                          className={`react-select w-100`}
                          classNamePrefix="select"
                          value={selectedOption}
                          options={purchaseOrder}
                          onChange={(e) => {
                            setSelectedOption(e);
                            getPOData(e.value);
                            // getPOData("4600000586");
                          }}
                        />
                        {loadingPoList && (
                          <div style={{ paddingLeft: "10px" }}>
                            <CircularProgress
                              style={{
                                width: "1.625rem",
                                height: "1.625rem",
                                color: "#f26c13",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-md-0 mt-2">
                      <div className="invoice-date-wrapper">
                        <h4 className="invoice-date-title">
                          PO Date:{" "}
                          <span>
                            <Input
                              className="mt-1"
                              disabled
                              value={
                                poData ? poData?.PO_HEADER?.CREATED_ON : ""
                              }
                            />
                          </span>
                        </h4>
                      </div>
                      <div className="invoice-date-wrapper">
                        <h4 className="invoice-date-title mt-1">
                          Dispatch Date:<span className="text-danger"> *</span>
                          <Flatpickr
                            value={picker}
                            id="date-time-picker"
                            className="form-control mt-1"
                            options={{
                              minDate: "today",
                            }}
                            onChange={(date) => setPicker(date)}
                          />
                          {errorsdispatch.dispatchDate && (
                            <FormFeedback style={{ display: "block" }}>
                              Select Dispatch Date
                            </FormFeedback>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {loadingPoDetails ? (
              <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
                <LinearProgress className="mb-1" color="inherit" />
              </Stack>
            ) : (
              ""
            )}

            {poData ? (
              <>
                <Form onSubmit={onSubmit} id="form">
                  <Card
                    className={`${
                      poType === "Material PO"
                        ? "border-primary"
                        : "border-info"
                    }`}
                  >
                    <h4
                      color="primary"
                      style={
                        poType === "Material PO"
                          ? MaterialPoStyle
                          : ServicePoStyle
                      }
                    >
                      {poType}
                    </h4>
                    <CardBody id="yourContentId" className="invoice-padding">
                      <Row className="invoice-spacing px-2">
                        <Col className="" sm="12" md="7" xl="7">
                          <h4 style={{ fontWeight: "600" }} className="mb-2">
                            {" "}
                            <PinDrop />
                            Supplier Address
                          </h4>
                          <h6 className="mb-25 fs-5">
                            {supplierData?.streetNo}
                          </h6>

                          <CardText className="mb-25 fs-5">
                            {supplierData?.address1 +
                              "," +
                              supplierData?.address2 +
                              "," +
                              supplierData?.address3 || ""}
                          </CardText>
                          {/* <CardText className="mb-25">
                            {supplierData?.address2 || ""}
                          </CardText> */}
                          <CardText className="mb-0 fs-5">
                            {supplierData?.city || ""}
                          </CardText>
                          <CardText className="mb-0 fs-5">
                            {"Pin : " + supplierData?.pin || ""}
                          </CardText>
                          <CardText className="mb-0 fs-5">
                            {"State : " + supplierData?.state || ""}
                          </CardText>
                          <CardText className="mb-0 fs-5">
                            {"Country : " + supplierData?.country || ""}
                          </CardText>
                          <h6 className="mt-3 fs-5">GST No</h6>
                          <Input
                            disabled
                            className="mb-0 w-50"
                            value={supplierData?.gstNo || ""}
                          >
                            {supplierData?.gstNo || ""}
                          </Input>
                          <h6 className="mt-1 fs-5">PAN No</h6>
                          <Input
                            disabled
                            className="mb-0 w-50"
                            value={supplierData?.panNo || ""}
                          >
                            {supplierData?.panNo || ""}
                          </Input>
                          <h6 className="mt-1 fs-5">
                            GST Invoice Number{" "}
                            <span className="text-danger">*</span>
                          </h6>
                          <input
                            aria-autocomplete="off"
                            type="text"
                            name="gstInvoiceNum"
                            value={form.username}
                            onChange={handleGstInvoiceNumChange}
                            className="form-control w-50"
                            required
                          ></input>
                          <div className="form-group col-md-6 mt-1">
                            <label className="fs-5">
                              Plant <span className="text-danger">*</span>
                            </label>
                            <Select
                              theme={selectThemeColors}
                              isClearable={true}
                              id={`nameOfCompany`}
                              className={`react-select`}
                              classNamePrefix="select"
                              option={plants}
                              value={selectPlants}
                              options={plants?.map((option) => {
                                return {
                                  label: option.code + " - " + option.name,
                                  value: option.id,
                                };
                              })}
                              onChange={(e) => setSelectPlants(e)}
                              required
                            />
                          </div>

                          <Col md="12" lg="7" xl="8">
                            <h6
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                              className="mt-2 fs-5"
                            >
                              Do you have IRN Number?
                              <Input
                                type="checkbox"
                                onChange={() => setIrnView(!irnView)}
                              />
                            </h6>
                            {irnView && (
                              <>
                                <div
                                  style={{
                                    marginTop: "10px",
                                    padding: "15px",
                                    borderRadius: "5px",
                                    backgroundColor: "rgb(242 108 19 / 8%)",
                                  }}
                                >
                                  <div
                                    style={{
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      display: "flex",
                                    }}
                                  >
                                    <div>
                                      <h6 className="mt-1">IRN Number:</h6>
                                    </div>
                                    <div>
                                      <Input
                                        className="mb-1"
                                        value={form.irnNo}
                                        onChange={handleIrnChange}
                                      >
                                        {supplierData?.irnnum || "Na"}
                                      </Input>

                                      {/* <IrneditModal /> */}
                                    </div>
                                  </div>
                                  <div
                                    style={{
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      display: "flex",
                                    }}
                                  >
                                    <div>
                                      <h6 className="mt-1">E-Way Bill:</h6>
                                    </div>
                                    <div>
                                      <Input
                                        className="mb-1"
                                        value={form.eWayBillNo}
                                        onChange={handleEWayChange}
                                      ></Input>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </Col>
                        </Col>
                        <Col></Col>
                        <Col className="mt-xl-0" md="4" xl="4">
                          <h4 style={{ fontWeight: "600" }} className="mb-2">
                            {" "}
                            <LocalShippingOutlined /> Ship to Address
                          </h4>

                          <table className="fs-5">
                            <tbody>
                              <tr>
                                <td className="pe-1">Address:</td>
                                <td>
                                  <span className="">
                                    {poData?.PO_ADDRESS?.STREET +
                                      "," +
                                      poData?.PO_ADDRESS?.STR_SUPPL1 +
                                      "," +
                                      poData?.PO_ADDRESS?.STR_SUPPL2 || ""}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="pe-1">State:</td>
                                <td>{poData?.buyerState || ""}</td>
                              </tr>
                              <tr>
                                <td className="pe-1">City:</td>
                                <td>{poData?.PO_ADDRESS?.CITY1 || ""}</td>
                              </tr>
                              <tr>
                                <td className="pe-1">Pin No:</td>
                                <td>{poData?.PO_ADDRESS?.POST_CODE1 || ""}</td>
                              </tr>
                            </tbody>
                          </table>
                          <h4
                            style={{ fontWeight: "600" }}
                            className="mb-1 mt-3 mb-2"
                          >
                            {" "}
                            <Receipt /> Bill to Address
                          </h4>

                          <table className="fs-5">
                            <tbody>
                              <tr>
                                <td className="pe-1">Address:</td>
                                <td>
                                  <span className="">
                                    {poData?.PO_ADDRESS?.STREET +
                                      "," +
                                      poData?.PO_ADDRESS?.STR_SUPPL1 +
                                      "," +
                                      poData?.PO_ADDRESS?.STR_SUPPL2 || ""}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="pe-1">State Code:</td>
                                <td>{poData?.PO_ADDRESS?.REGION || ""}</td>
                                {console.log(poData, "state")}
                              </tr>
                              <tr>
                                <td className="pe-1">City:</td>
                                <td>{poData?.PO_ADDRESS?.CITY1 || ""}</td>
                              </tr>
                              <tr>
                                <td className="pe-1">Pin No:</td>
                                <td>{poData?.PO_ADDRESS?.POST_CODE1 || ""}</td>
                              </tr>
                              <tr>
                                <p className="pe-1 mt-1">
                                  GST No:
                                  <span className="text-danger">*</span>
                                </p>
                                <td>
                                  <div>
                                    <Input
                                      required
                                      maxLength={15}
                                      className="w-100"
                                      value={form.companyGST}
                                      onChange={handleGstChange}
                                    >
                                      {supplierData?.companyGST || "Na"}
                                    </Input>
                                    {errorMessage && (
                                      <p className="text-danger">
                                        {errorMessage}
                                      </p>
                                    )}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="pe-1">PAN No: </td>
                                <td>
                                  <div>
                                    <Input
                                      maxLength={10}
                                      className="mb-1 mt-1 w-100"
                                      // value={form.eWayBillNo}
                                      onChange={handlePanChange}
                                    >
                                      {supplierData?.companyPAN || "Na"}
                                    </Input>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <Col md={12}>
                            <Card className="invoice-action-wrapper">
                              <CardBody className="p-0 mt-2">
                                {!invoiceFileName && (
                                  <Button
                                    tag={Label}
                                    className="mb-75 me-75 "
                                    size="md"
                                    block
                                    color="primary"
                                  >
                                    Attach Invoice
                                    <Input
                                      type="file"
                                      onChange={onFileChange}
                                      hidden
                                      accept="image/*"
                                    />
                                  </Button>
                                )}

                                <p className="text-center fw-semibold">
                                  {invoiceFileName
                                    ? `Invoice: ${invoiceFileName}`
                                    : ""}
                                </p>

                                {invoiceFileName && (
                                  <>
                                    <Button
                                      color="danger"
                                      block
                                      className="mb-75"
                                      onClick={removeFile}
                                    >
                                      Remove
                                    </Button>
                                    {/* Add your "X" button view here */}
                                  </>
                                )}
                              </CardBody>
                            </Card>
                          </Col>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardBody className="invoice-padding pt-0">
                      <label
                        className="mb-1"
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
                              <Label>Total</Label>
                              <Input value={"₹" + totalAmount} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Row className=" justify-content-between">
                        <Col sm="12" md={5}>
                          <span className="fw-bold">Remarks: </span>
                          <Input
                            type="textarea"
                            value={form.remarks}
                            className="mb-1"
                            onChange={handleRemarksChange}
                          ></Input>
                          <div className="d-flex justify-content-start">
                            <Button
                              style={{
                                marginRight: "20px",
                                marginLeft: "10px",
                              }}
                              color="primary"
                              type="submit"
                              className="btn-prev"
                              // onClick={onSubmit}
                              disabled={isSubmitted}
                            >
                              Submit
                            </Button>
                            <Button
                              type="reset"
                              onClick={handleClear}
                              disabled={isSubmitted}
                              outline
                              color="secondary"
                              className="btn-submit"
                            >
                              Reset
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Form>
              </>
            ) : (
              ""
            )}
            {generateIrn && (
              <>
                <Form style={{ padding: "20px 40px" }} id="form">
                  <ModalBody>
                    <h2 style={{ textAlign: "center" }}>Generate IRN</h2>
                    <div>
                      <Row>
                        <h4 style={{ color: "#e74c3c", paddingBlock: "10px" }}>
                          Document Details
                        </h4>

                        <Col md={6}>
                          <div className="mb-1">
                            <Label className="form-label" for="username">
                              Document Date:
                              <span className="text-danger">*</span>
                            </Label>
                            <Flatpickr
                              value={datepicker}
                              id="date-time-picker"
                              className="form-control"
                              options={{
                                minDate: "today",
                              }}
                              onChange={(date) => setDateicker(date)}
                            />
                            {errordocument.document_date && (
                              <FormFeedback style={{ display: "block" }}>
                                Select Document Date
                              </FormFeedback>
                            )}
                            {/* {errors.document_date && (
                              <FormFeedback>
                                {errors.document_date.message}
                              </FormFeedback>
                            )} */}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <div>
                            <h4
                              style={{ color: "#e74c3c", paddingBlock: "10px" }}
                            >
                              Buyer Details
                            </h4>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                GST Number
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="gstin"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    defaultValue={form.companyGST || "Na"}
                                    placeholder="INV"
                                    invalid={errors.gstin ? true : false}
                                    disabled
                                  />
                                )}
                              />
                              {errors.gstin && (
                                <FormFeedback>
                                  {errors.gstin.message}
                                </FormFeedback>
                              )}
                            </div>

                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Legal Name
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="legal_name"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="XIAOMI TECHNOLOGY"
                                    invalid={errors.legal_name ? true : false}
                                  />
                                )}
                              />
                              {errors.legal_name && (
                                <FormFeedback>
                                  {errors.legal_name.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Address
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="address1"
                                render={({ field }) => (
                                  <Input
                                    // defaultValue={
                                    //   poData?.PO_ADDRESS?.STREET +
                                    //     "," +
                                    //     poData?.PO_ADDRESS?.STR_SUPPL1 +
                                    //     "," +
                                    //     poData?.PO_ADDRESS?.STR_SUPPL2 || "Na"
                                    // }
                                    {...field}
                                    placeholder="Mumbai/Ahmedabad/Dehradun"
                                    invalid={errors.address1 ? true : false}
                                  />
                                )}
                              />

                              {errors.address1 && (
                                <FormFeedback>
                                  {errors.address1.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Location
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="location"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Ahmedabad"
                                    invalid={errors.location ? true : false}
                                  />
                                )}
                              />
                              {errors.location && (
                                <FormFeedback>
                                  {errors.location.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Pincode
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                type="number"
                                control={control}
                                name="pincode"
                                render={({ field }) => (
                                  <Input
                                    maxLength={6}
                                    type="number"
                                    {...field}
                                    // defaultValue={
                                    //   poData?.PO_ADDRESS?.POST_CODE1 || "Na"
                                    // }
                                    placeholder="370001"
                                    invalid={errors.pincode ? true : false}
                                  />
                                )}
                              />

                              {errors.pincode && (
                                <FormFeedback>
                                  {errors.pincode.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Place to Supply
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                defaultValue=""
                                name="place_of_supply"
                                render={({ field }) => (
                                  <Select
                                    theme={selectThemeColors}
                                    isClearable={false}
                                    id={`nameOfCompany`}
                                    className={`react-select`}
                                    classNamePrefix="select"
                                    {...field}
                                    options={indianStates}
                                  />
                                )}
                              />
                              {errors.place_of_supply && (
                                <FormFeedback>
                                  {errors.place_of_supply.value &&
                                    errors.place_of_supply.value.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <h4
                              style={{ color: "#e74c3c", paddingBlock: "10px" }}
                            >
                              Ship Details
                            </h4>

                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Legal Name:
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="shiplegal_name"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Burger King"
                                    invalid={
                                      errors.shiplegal_name ? true : false
                                    }
                                  />
                                )}
                              />
                              {errors.shiplegal_name && (
                                <FormFeedback>
                                  {errors.shiplegal_name.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Address
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="shipaddress1"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Mumbai"
                                    invalid={errors.shipaddress1 ? true : false}
                                  />
                                )}
                              />
                              {errors.shipaddress1 && (
                                <FormFeedback>
                                  {errors.shipaddress1.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Location
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="shiplocation"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    placeholder="Ahmedabad"
                                    invalid={errors.shiplocation ? true : false}
                                  />
                                )}
                              />
                              {errors.shiplocation && (
                                <FormFeedback>
                                  {errors.shiplocation.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Pincode
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="shippincode"
                                render={({ field }) => (
                                  <Input
                                    maxLength={6}
                                    type="number"
                                    {...field}
                                    placeholder="370001"
                                    invalid={errors.shippincode ? true : false}
                                  />
                                )}
                              />
                              {errors.shippincode && (
                                <FormFeedback>
                                  {errors.shippincode.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                State
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="shipstatecode"
                                render={({ field }) => (
                                  <Select
                                    theme={selectThemeColors}
                                    isClearable={false}
                                    id={`nameOfCompany`}
                                    className={`react-select`}
                                    classNamePrefix="select"
                                    {...field}
                                    options={indianStates}
                                  />
                                )}
                              />
                              {errors.shipstatecode && (
                                <FormFeedback>
                                  {errors.shipstatecode.value &&
                                    errors.shipstatecode.value.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <div>
                            <h4
                              style={{ color: "#e74c3c", paddingBlock: "10px" }}
                            >
                              E-Waybill Details
                            </h4>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Transportation Mode
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="transportation_mode"
                                render={({ field }) => (
                                  <Select
                                    theme={selectThemeColors}
                                    isClearable={false}
                                    id={`nameOfCompany`}
                                    className={`react-select`}
                                    classNamePrefix="select"
                                    {...field}
                                    // onChange={(e) => {
                                    //   console.log(e.value);
                                    // }}
                                    options={[
                                      { value: "Road", label: "Road" },
                                      { value: "Rail", label: "Rail" },
                                      { value: "Ship", label: "Ship" },
                                      { value: "Air", label: "Air" },
                                    ]}
                                  />
                                )}
                              />
                              {errors.transportation_mode && (
                                <FormFeedback>
                                  {errors.transportation_mode.value &&
                                    errors.transportation_mode.value.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Transportation Distance
                                <span className="text-danger">*</span>
                              </Label>
                              {/* <InputGroup className="input-group-merge mb-2"> */}
                              <Controller
                                control={control}
                                name="transportation_distance"
                                render={({ field }) => (
                                  <Input
                                    type="number"
                                    {...field}
                                    placeholder="200 KM"
                                    invalid={
                                      errors.transportation_distance
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                              />
                              {/* <InputGroupText>KM</InputGroupText> */}
                              {/* </InputGroup> */}
                              {errors.transportation_distance && (
                                <FormFeedback>
                                  {errors.transportation_distance.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            <h4
                              style={{ color: "#e74c3c", paddingBlock: "10px" }}
                            >
                              Value Details
                            </h4>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Total Assessable Value
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="total_assessable_value"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="4000"
                                    invalid={
                                      errors.total_assessable_value
                                        ? true
                                        : false
                                    }
                                  />
                                )}
                              />
                              {errors.total_assessable_value && (
                                <FormFeedback>
                                  {errors.total_assessable_value.message}
                                </FormFeedback>
                              )}
                            </div>
                            <div className="mb-1">
                              <Label className="form-label" for="username">
                                Total Invoice Value
                                <span className="text-danger">*</span>
                              </Label>
                              <Controller
                                control={control}
                                name="total_invoice_value"
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="3200"
                                    invalid={
                                      errors.total_invoice_value ? true : false
                                    }
                                  />
                                )}
                              />
                              {errors.total_invoice_value && (
                                <FormFeedback>
                                  {errors.total_invoice_value.message}
                                </FormFeedback>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      onClick={handleSubmit(onSubmitIrnEdit)}
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Form>
              </>
            )}
            {irnresponseview && (
              <>
                <div
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    display: "flex",
                    borderRadius: "5px",
                    backgroundColor: "rgb(242 108 19 / 8%)",
                  }}
                >
                  <Row className="p-2">
                    <div>
                      <h6 className="mt-1">E-Way Bill:</h6>
                    </div>
                    <Col md={6}>
                      <Input value={irnresponse?.message?.EwbNo} />
                    </Col>
                    <div>
                      <h6 className="mt-1">IRN Number:</h6>
                    </div>
                    <Col md={6}>
                      <Input
                        style={{ minHeight: "50px" }}
                        value={irnresponse?.message?.Irn}
                      />
                    </Col>
                  </Row>

                  <div>
                    <img
                      src={irnresponse.message.QRCodeUrl}
                      alt=""
                      className="img-fluid p-1"
                      width={180}
                    />
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ASN;
