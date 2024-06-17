// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Custom Components
import Repeater from "@components/repeater";
// ** Third Party Components
import axios from "axios";
import themeConfig from "../../configs/themeConfig";
import Flatpickr from "react-flatpickr";
import { SlideDown } from "react-slidedown";
import { Hash } from "react-feather";

// ** Reactstrap Imports
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Table,
  Label,
  Button,
  CardBody,
  CardText,
  InputGroup,
  InputGroupText,
} from "reactstrap";

// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import toast from "react-hot-toast";
import { LocalShippingOutlined, PinDrop, Receipt } from "@mui/icons-material";

const JsonInvoiceView = () => {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState();
  const [tableRowsData, setTableRowsData] = useState();
  const [loading, setLoading] = useState(false);

  // ** States
  const getData = () => {
    setLoading(true);
    setData();
    setAllData();
    setTableRowsData();
    axios
      .post(themeConfig.backendUrl + "v1/supplier/grn/viewinvoicebyid/2")
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        } else {
          console.log(res.data);
          const invoiceData = res.data.data;
          setAllData(res.data.data);
          setTableHeaderData([res.data.data.header]);
          setTableRowsData(res.data.data.items);
          setLoading(false);
          setFiles([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // ** Deletes form
  return (
    <Fragment>
      <Card className="invoice-preview-card">
        {/* Header */}
        <CardBody className="invoice-padding pb-0">
          <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
            <div>
              <img src={themeConfig.app.appLogoImage} height="50" />
              <p className="card-text mb-25 mt-1">
                278, Jeevan Udyog Building,
              </p>
              <p className="card-text mb-25"> DN Road, Fort</p>
              <p className="card-text mb-0">Mumbai, India-400001</p>
            </div>
            <div className="invoice-number-date mt-md-0 mt-2">
              <div className="d-flex align-items-center justify-content-md-end mb-1">
                <h4 className="invoice-title">Invoice</h4>
                <InputGroup className="input-group-merge invoice-edit-input-group disabled">
                  <InputGroupText>
                    <Hash size={15} />
                  </InputGroupText>
                  <Input
                    type="number"
                    className="invoice-edit-input"
                    value={3171}
                    placeholder="53634"
                    disabled
                  />
                </InputGroup>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="title">Date:</span>
                <Flatpickr
                  // value={picker}
                  // onChange={(date) => setPicker(date)}
                  className="form-control invoice-edit-input date-picker"
                />
              </div>
              <div className="d-flex align-items-center">
                <span className="title">Due Date:</span>
                <Flatpickr
                  // value={dueDatepicker}
                  // onChange={(date) => setDueDatePicker(date)}
                  className="form-control invoice-edit-input due-date-picker"
                />
              </div>
            </div>
          </div>
          <CardBody id="yourContentId" className="invoice-padding p-4">
            {/* <Chip label={poType} color="primary" variant="outlined" /> */}
            {/* <Badge color="success" variant="outlined">
                    {poType}
                  </Badge> */}
            {/* <h5 style={headerStyle}>{poType}</h5> */}
            <hr style={{ marginTop: "5px" }} />
            <Row className="invoice-spacing">
              <Col className="" md="6" xl="7">
                <h4 style={{ fontWeight: "600" }} className="mb-2">
                  {" "}
                  <PinDrop />
                  Supplier Address
                </h4>
                <h6 className="mb-25">{""}</h6>

                <CardText className="mb-25">{"Na"}</CardText>
                {/* <CardText className="mb-25">
                        {supplierData?.address2 || "Na"}
                      </CardText> */}
                <CardText className="mb-0">{"Na"}</CardText>
                <CardText className="mb-0">{"Pin : " + "Na"}</CardText>
                <CardText className="mb-0">{"State : " + "Na"}</CardText>
                <CardText className="mb-0">{"Country : " + "Na"}</CardText>
                <h6 className="mt-3">GST No</h6>
                <Input disabled className="mb-0  w-50" value={"Na"}>
                  {"Na"}
                </Input>
                <h6 className="mt-1">PAN No</h6>
                <Input disabled className="mb-0  w-50" value={"Na"}>
                  {"Na"}
                </Input>
                <h6 className="mt-1">
                  GST Invoice Number <span className="text-danger">*</span>
                </h6>
                <input
                  aria-autocomplete="off"
                  type="text"
                  name="gstInvoiceNum"
                  // value={form.username}
                  // onChange={(e) => {
                  //   setForm({ ...form, username: e.target.value });
                  // }}
                  className="form-control w-50"
                  required
                ></input>
                <Col md="12" lg="7" xl="8">
                  <h6
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    className="mt-2"
                  >
                    Do you have IRN Number?
                    <Input
                      type="checkbox"
                      // onChange={() => setIrnView(!irnView)}
                    />
                  </h6>
                </Col>
              </Col>
              <Col className="p-0 mt-xl-0 mt-2" md="6" xl="5">
                <h4 style={{ fontWeight: "600" }} className="mb-1 mt-2 mb-2">
                  {" "}
                  <LocalShippingOutlined /> Ship to Address
                </h4>

                <table>
                  <tbody>
                    <tr>
                      <td className="pe-1">Address:</td>
                      <td>
                        <span className="">{"Na"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="pe-1">State:</td>
                      <td>{"Na"}</td>
                    </tr>
                    <tr>
                      <td className="pe-1">City:</td>
                      <td>{"Na"}</td>
                    </tr>
                    <tr>
                      <td className="pe-1">Pin No:</td>
                      <td>{"Na"}</td>
                    </tr>
                  </tbody>
                </table>
                <h4 style={{ fontWeight: "600" }} className="mb-1 mt-3 mb-2">
                  {" "}
                  <Receipt /> Bill to Address
                </h4>
                <table>
                  <tbody>
                    <tr>
                      <td className="pe-1">Address:</td>
                      <td>
                        <span className="">{"Na"}</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="pe-1">State:</td>
                      <td>{"Na"}</td>
                    </tr>
                    <tr>
                      <td className="pe-1">City:</td>
                      <td>{"Na"}</td>
                    </tr>
                    <tr>
                      <td className="pe-1">Pin No:</td>
                      <td>{"Na"}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </CardBody>
        </CardBody>
        {/* /Header */}

        <hr className="invoice-spacing" />
        {/* Product Details */}
        <CardBody className="invoice-padding invoice-product-details">
          <Repeater count={1}>
            {(i) => {
              const Tag = i === 0 ? "div" : SlideDown;
              return (
                <Tag key={i} className="repeater-wrapper">
                  <Row>
                    <Col
                      className="d-flex product-details-border position-relative pe-0"
                      sm="12"
                    >
                      <Row className="w-100 pe-lg-0 pe-1 py-2">
                        {tableHeaderData?.map((item, index) =>
                          Object.entries(item)?.map((row, rowIndex) => (
                            <Col
                              key={rowIndex}
                              className="my-lg-0 my-2"
                              lg="3"
                              sm="12"
                            >
                              <Label className="mb-md-1 mt-1 mb-0">
                                {row[0]}
                              </Label>
                              {console.log(row)}
                              <Input defaultValue={row[1] || ""} />
                            </Col>
                          ))
                        )}
                      </Row>
                    </Col>
                  </Row>
                  <hr className="mt-1 mb-0" />
                  <Table striped bordered hover responsive>
                    {tableRowsData?.map((item, index) => (
                      <Table key={index} className="mt-2 border-secondary">
                        <thead className="mt-1">
                          <tr key={index}>
                            {Object.entries(item)?.map((row, rowIndex) => (
                              <th key={rowIndex}>{row ? row[0] : "Null"}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableRowsData?.map((item, ind) => (
                            <tr key={ind}>
                              {Object.entries(item).map((row, rowIndex) => (
                                <td key={rowIndex}>{row[1]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ))}
                  </Table>
                </Tag>
              );
            }}
          </Repeater>
        </CardBody>
        <CardBody className="invoice-padding">
          <Button
            color="primary"
            onClick={() => toast("Work in progress, Coming Soon")}
          >
            Submit
          </Button>
        </CardBody>
        {/* /Invoice Total */}

        <hr className="invoice-spacing mt-0" />
      </Card>
    </Fragment>
  );
};

export default JsonInvoiceView;
