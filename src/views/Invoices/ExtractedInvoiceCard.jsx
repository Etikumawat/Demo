import { Fragment } from "react";
import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Table,
  Label,
  Button,
  CardBody,
} from "reactstrap";
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import toast from "react-hot-toast";
import axios from "axios";
import themeConfig from "../../configs/themeConfig";

const ExtractedInvoiceCard = ({ data, resetData }) => {
  const [loading, setLoading] = useState([]);
  const sendData = {
    sapData: data,
  };
  const invoiceToSAP = () => {
    setLoading(true);
    axios
      .post(themeConfig.backendUrl + "v1/admin/aws/invoiceToSap", sendData)
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setLoading(false);
          resetData();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <Fragment>
      <Card className="invoice-preview-card">
        <div>
          <h2
            style={{ color: "#f26c13", paddingBlock: "10px" }}
            className="text-center "
          >
            Invoice Data
          </h2>
          <Card className="invoice-padding invoice-product-details">
            {data.map((item, index) => (
              <div key={index}>
                <Row>
                  <h3 style={{ color: "#0E98BA" }}>Invoice No: {index + 1}</h3>
                  <h4>Invoice Name: {item.invoice}</h4>
                  <Row className="w-100 pe-lg-0 pe-1 py-2 product-details-border mb-3 border-info">
                    <h4>Header Data</h4>
                    {Object.entries(item.header).map((row, rowIndex) => (
                      <Col
                        key={rowIndex}
                        className="my-lg-0 my-1"
                        lg="3"
                        sm="12"
                      >
                        <Label style={{ marginTop: "5px" }} className="mb-0">
                          {row[0]?.charAt(0).toUpperCase() + row[0]?.slice(1)}
                        </Label>
                        <Input defaultValue={row[1] || ""} />
                      </Col>
                    ))}
                    <h4 className="mt-2">Invoice Items</h4>
                    <div style={{ overflowX: "auto" }} className="mb-2">
                      <Table
                        style={{ border: "1px solid #DDDDDD" }}
                        className="mt-2 responsive"
                      >
                        <thead className="mt-1">
                          <tr>
                            {item.Items &&
                              Object.keys(item.Items[0]).map(
                                (key, rowIndex) => <th key={rowIndex}>{key}</th>
                              )}
                          </tr>
                        </thead>
                        <tbody>
                          {item.Items.map((itemRow, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(itemRow).map((value, colIndex) => (
                                <td key={colIndex}>{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Row>
                </Row>
              </div>
            ))}
          </Card>
          <CardBody className="invoice-padding">
            <div className="d-flex mt-1">
              <Button className="me-1" color="primary" onClick={invoiceToSAP}>
                Submit
              </Button>
              <Button
                outline
                color="secondary"
                type="reset"
                onClick={resetData}
              >
                Reset
              </Button>
            </div>
          </CardBody>
        </div>
      </Card>
    </Fragment>
  );
};

export default ExtractedInvoiceCard;
