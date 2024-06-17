// ** React Imports
import { Fragment, useState, useEffect } from "react";
// ** Custom Components
import Repeater from "@components/repeater";
import themeConfig from "../../configs/themeConfig";
// ** Third Party Components
import axios from "axios";
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

const AddCard = ({ data, headerData, tableRowData }) => {
  // ** States
  const [count, setCount] = useState(1);
  const [picker, setPicker] = useState(new Date());
  const [invoiceNumber, setInvoiceNumber] = useState(false);
  const [dueDatepicker, setDueDatePicker] = useState(new Date());

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
                    value={invoiceNumber || 3171}
                    placeholder="53634"
                    disabled
                  />
                </InputGroup>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="title">Date:</span>
                <Flatpickr
                  value={picker}
                  onChange={(date) => setPicker(date)}
                  className="form-control invoice-edit-input date-picker"
                />
              </div>
              <div className="d-flex align-items-center">
                <span className="title">Due Date:</span>
                <Flatpickr
                  value={dueDatepicker}
                  onChange={(date) => setDueDatePicker(date)}
                  className="form-control invoice-edit-input due-date-picker"
                />
              </div>
            </div>
          </div>
        </CardBody>
        {/* /Header */}

        <hr className="invoice-spacing" />
        {/* Product Details */}
        <CardBody className="invoice-padding invoice-product-details">
          <Repeater count={count}>
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
                        {data?.map((item, index) => (
                          <Col
                            key={index}
                            className="my-lg-0 my-2"
                            lg="3"
                            sm="12"
                          >
                            <Label className="mb-md-1 mt-1 mb-0">
                              {item.label}
                            </Label>
                            <Input defaultValue={item.value || ""} />
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                  <hr className="mt-1 mb-0" />
                  <Table striped bordered hover responsive>
                    {headerData?.map((item, index) => (
                      <Table className="mt-2 border-secondary">
                        <thead className="mt-1">
                          <tr key={index}>
                            {item?.map((row, rowIndex) => (
                              <th key={rowIndex}>{row ? row : "Null"}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableRowData[index]?.map((item, ind) => (
                            <tr key={ind}>
                              {item?.map((row, rowIndex) => (
                                <td key={rowIndex}>{row}</td>
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

export default AddCard;
