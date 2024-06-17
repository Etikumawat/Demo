import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import axios from "axios";
import toast from "react-hot-toast";
import themeConfig from "../../configs/themeConfig";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function Qr() {
  const [printclicked, setPrintClicked] = useState();
  const [updateprint, setUpdateprint] = useState({
    supplier_id: "1",
    asnHide: "",
    gstHide: "",
    supplierHide: "",
    emailHide: "",
    addressHide: "",
    billaddressHide: "",
    supplieraddressHide: "",
    invoiceHide: "",
    panHide: "",
    ewayHide: "",
    inrHide: "",
  });
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const supplier_id = "1";
      const response = await axios.post(
        new URL("v1/supplier/printsettings/get", themeConfig.backendUrl),
        {
          supplier_id: supplier_id,
        }
      );
      if (response.data.error) {
        toast.error(response.data.message);
      } else {
        setPrintClicked(response.data.data);
        setUpdateprint({
          ...updateprint,
          asnHide: response.data.data.asnHide,
          gstHide: response.data.data.gstHide,
          supplierHide: response.data.data.supplierHide,
          emailHide: response.data.data.emailHide,
          addressHide: response.data.data.addressHide,
          panHide: response.data.data.panHide,
          invoiceHide: response.data.data.invoiceHide,
          ewayHide: response.data.data.ewayHide,
          inrHide: response.data.data.inrHide,
          billaddressHide: response.data.data.billaddressHide,
          supplieraddressHide: response.data.data.supplieraddressHide,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("An error occurred while fetching data");
    }
  };
  const submit = () => {
    console.log(updateprint);
    axios
      .post(new URL("v1/supplier/printsettings/set", themeConfig.backendUrl), {
        ...updateprint,
      })
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        } else {
          setUpdateprint(res.data.data);
          console.log(res.data.data, "data for asn print");
          toast.success("Updated Successfully");
          fetchData();
        }
      });
  };
  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>QR Settings </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card
        style={{
          padding: "30px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        <h3>Configurable Fields</h3>
        <CardBody>
          <Row>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                Supplier Name
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.supplierHide === "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    supplierHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                Supplier Email
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.emailHide === "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    emailHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                GST Number
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.gstHide === "1" ? true : false}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    gstHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                PAN Number
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.panHide === "1" ? true : false}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    panHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                ASN Number
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.asnHide == "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    asnHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                GST Invoice Number
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.invoiceHide == "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    invoiceHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                E-Way Bill
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.ewayHide == "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    ewayHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                IRN Number
              </label>
              <Input
                type="checkbox"
                checked={updateprint?.inrHide == "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    inrHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                Ship To Address
              </label>
              {console.log(printclicked)}
              <Input
                color="primary"
                type="checkbox"
                checked={updateprint?.addressHide === "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    addressHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                Supplier To Address
              </label>
              {console.log(printclicked)}
              <Input
                color="primary"
                type="checkbox"
                checked={updateprint?.supplieraddressHide === "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    supplieraddressHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <Col md="4" className="mb-1">
              <label
                className="pb-0 mb-1 me-2"
                style={{ color: "gray", fontWeight: "bold" }}
              >
                Bill To Address
              </label>
              {console.log(printclicked)}
              <Input
                color="primary"
                type="checkbox"
                checked={updateprint?.billaddressHide === "1"}
                onChange={(e) => {
                  setUpdateprint({
                    ...updateprint,
                    billaddressHide: e.target.checked ? "1" : "0",
                  });
                }}
              />
            </Col>
            <div
              style={{
                display: "flex",
                justifyContent: "left",
              }}
            >
              <Button color="primary" className="me-2" onClick={submit}>
                Save
              </Button>
            </div>
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default Qr;
