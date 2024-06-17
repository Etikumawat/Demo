import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import themeConfig from "../../configs/themeConfig";
// import dumyQr from "../../assets/images/qr.png";
import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  Input,
  Row,
} from "reactstrap";
import { ArrowBack } from "@mui/icons-material";
import html2canvas from "html2canvas";
import { PDFDocument } from "pdf-lib";
import { useLocation } from "react-router-dom";
export default function print() {
  const storedUserDataJSON = localStorage.getItem("userData");
  const storedUserData = storedUserDataJSON
    ? JSON.parse(storedUserDataJSON)
    : null;
  const userName = storedUserData.username;
  const email = storedUserData.email;
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [printsetting, setPrintsetting] = useState();
  const [imageURL, setImageURL] = useState();

  const ViewQrCode = (qrcode) => {
    const params = {
      QrCode: qrcode?.toString(),
    };
    axios
      .post(
        new URL("v1/supplier/asn/getqrcode", themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setImageURL(res.data.data);
        }
      });
  };

  const DownloadAsn = async () => {
    const elementId = "yourDivId"; // Replace with the actual ID of your div
    const margin = 20; // Adjust margin as needed

    // Get the HTML element by ID
    const element = document.getElementById(elementId);

    if (!element) {
      console.error(`Element with ID ${elementId} not found.`);
      return;
    }

    // Apply printing styles
    element.classList.add("printing-styles");

    // Get the dimensions of the HTML element
    const elementRect = element.getBoundingClientRect();

    // Add margin to the dimensions
    const widthWithMargin = elementRect.width + 2 * margin;
    const heightWithMargin = elementRect.height + 2 * margin;

    // Create a canvas with adjusted dimensions
    const canvas = await html2canvas(element, {
      width: widthWithMargin,
      height: heightWithMargin,
      x: -margin,
      y: -margin,
    });

    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([widthWithMargin, heightWithMargin]);
    const { width, height } = page.getSize();

    // Embed the canvas image into the PDF
    const imgBytes = canvas.toDataURL("image/png");
    const img = await pdfDoc.embedPng(imgBytes);
    page.drawImage(img, {
      x: margin,
      y: margin,
      width: width - 2 * margin,
      height: height - 2 * margin,
    });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();

    // Remove printing styles after conversion
    element.classList.remove("printing-styles");

    // Create a blob from the PDF data
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab for viewing
    window.open(pdfUrl, "_blank");
  };
  const Location = useLocation();
  const asnId = Location.state.number;
  const qrCode = Location.state.qrData;
  console.log(qrCode, "qrcode")

  useEffect(() => {
    axios
      .post(new URL(`v1/supplier/asn/view/` + asnId, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setData(res.data.data);
        console.log(res.data.data);
        // toast.success(res.data.message);
      });
    const supplier_id = "1";
    axios
      .post(new URL("v1/supplier/printsettings/get", themeConfig.backendUrl), {
        supplier_id: supplier_id,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setPrintsetting(res.data.data);
        }
      });
  }, []);

  return (
    <>
      <hr />
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/supplier/asn">List ASN/SCR </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Print </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div
            onClick={() => {
              navigate("/supplier/asn");
            }}
            style={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "#f26c13",
              borderRadius: "4px",
            }}
          >
            <ArrowBack size="20px" style={{ color: "#ffffff" }} />
          </div>
        </div>
        <div
          id="yourDivId"
          style={{
            padding: "20px",
            width: "50vw",
            height: "auto",
          }}
        >
          <h2
            style={{
              color: "#f26c13",
              textAlign: "center",
              margin: "30px 0px",
              fontWeight: "600",
            }}
          >
            {data?.type === "NB"
              ? "Advance Shipping Note"
              : "Service Compliance Request"}
            {/* Advance Shipping Note */}
          </h2>
          <Row>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                {printsetting?.asnHide === "1" ? (
                  <>
                    <p>
                      {data?.type === "NB" ? " ASN Number:" : "SCR Number:"}
                      <span style={{ fontWeight: "400" }}>{data?.asnNo}</span>
                    </p>
                    <hr />
                  </>
                ) : null}
                {printsetting?.supplierHide === "1" ? (
                  <>
                    <p>
                      Supplier Name :
                      <span style={{ fontWeight: "400" }}>{userName}</span>{" "}
                    </p>
                    <hr />
                  </>
                ) : null}
                {printsetting?.emailHide === "1" ? (
                  <>
                    <p>
                      Email : <span style={{ fontWeight: "400" }}>{email}</span>{" "}
                    </p>
                    <hr />
                  </>
                ) : null}
                {printsetting?.panHide === "1" ? (
                  <>
                    <p>
                      PAN No:
                      <span style={{ fontWeight: "400" }}>
                        {data?.pan || "Na"}
                      </span>
                    </p>
                    <hr />
                  </>
                ) : null}
                {printsetting?.gstHide === "1" ? (
                  <>
                    <p>
                      GST No:{" "}
                      <span style={{ fontWeight: "400" }}>{data?.gst}</span>
                    </p>
                    <hr />
                  </>
                ) : null}
                {printsetting?.invoiceHide === "1" ? (
                  <>
                    <p>
                      GST Invoice Number{" "}
                      <span style={{ fontWeight: "400" }}>
                        {data?.gstInvoiceNumber}
                      </span>
                    </p>
                    <hr />
                  </>
                ) : null}
              </div>
              <div className="qrcode__container">
                <div>
                  <img
                   src={
                     "data:image/png;base64," + qrCode
                   }
                   alt="Qrcode"
                    style={{
                      maxWidth: "200px",
                      height: "auto",
                    }}
                    aria-disabled
                    className="me-1"
                    onClick={() => {
                      ViewQrCode(data?.qrcode);
                    }}
                  />
                </div>
                <div>
                  {printsetting?.ewayHide === "1" ? (
                    <>
                      {data?.type === "NB" ? (
                        <p>
                          E-Way Bill:
                          <span style={{ fontWeight: "400" }}>
                            {data?.eWayBillNo || "Na"}
                          </span>
                        </p>
                      ) : (
                        ""
                      )}

                      <hr />
                    </>
                  ) : null}
                  {printsetting?.inrHide === "1" ? (
                    <>
                      <p>
                        IRN Number:
                        <span style={{ fontWeight: "400" }}>
                          {data?.irnNo || "Na"}
                        </span>
                      </p>
                      <hr />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
            {printsetting?.addressHide === "1" ? (
              <>
                <div style={{ marginTop: "30px" }} className="w-75">
                  <h4
                    style={{
                      fontWeight: "600",
                      color: "#3872e0",
                    }}
                  >
                    Ship to Address
                    <hr />
                  </h4>

                  <table>
                    <tbody>
                      <tr>
                        <td className="pe-1">Address:</td>
                        <td>
                          <span className="">{data?.shipToAddress}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
            {printsetting?.billaddressHide === "1" ? (
              <>
                <div className="w-75">
                  <h4
                    style={{
                      fontWeight: "600",
                      color: "#3872e0",
                    }}
                    className="mt-2"
                  >
                    Bill to Address
                  </h4>
                  <hr />
                  <table>
                    <tbody>
                      <tr>
                        <td className="pe-1">Address:</td>
                        <td>
                          <span className="">{data?.billToAddress}</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="pe-1">PAN No: </td>
                        <td>
                          <div>
                            <Input
                              disabled
                              className="mb-1 w-75"
                              value={data?.companyPAN}
                              required
                            ></Input>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="pe-1">GST No: </td>
                        <td>
                          <div>
                            <Input
                              disabled
                              required
                              className="mb-1 w-75"
                              value={data?.companyGST}
                            ></Input>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </Row>
        </div>
        <div className="d-flex justify-content-left m-1">
          <Button
            onClick={DownloadAsn}
            color="primary"
            style={{ alignItems: "center", margin: "10px 0px" }}
          >
            Print
          </Button>
        </div>
      </Card>
    </>
  );
}
