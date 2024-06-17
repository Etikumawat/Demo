// ** React Imports
import { useState, Fragment } from "react";
import AddCard from "./AddCard";
import invoiceimg from "../../assets/images/invoice2.png";
import { useEffect } from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import toast from "react-hot-toast";
import { LinearProgress } from "@mui/material";
// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import themeConfig from "../../configs/themeConfig";

const Invoice = () => {
  const [scrollToInvoice, setScrollToInvoice] = useState(false);

  useEffect(() => {
    if (scrollToInvoice) {
      const element = document.getElementById("invoice-card");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setScrollToInvoice(false); // Reset the state to prevent continuous scrolling
      }
    }
  }, [scrollToInvoice]);

  // ** State
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState();
  const [tableRowsData, setTableRowsData] = useState();
  let user_data = localStorage.getItem("userData");
  const userData = JSON.parse(user_data);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });
  const uploadFile = () => {
    setLoading(true);
    setData();
    setAllData();
    setTableHeaderData();
    setTableRowsData();
    const formData = new FormData();
    formData.append("supplierId", userData.supplierId);
    formData.append("file", files[0]);
    axios
      .post(themeConfig.backendUrl + "v1/admin/aws/textract", formData)
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        } else {
          const invoiceData = res.data.data;
          const arrayOfObjects = [];
          for (const key in invoiceData) {
            const keyValueObject = {
              label: key,
              value: invoiceData[key],
            };
            arrayOfObjects.push(keyValueObject);
          }
          setScrollToInvoice(true);
          setData(arrayOfObjects);
          setAllData(res.data.data);
          setTableHeaderData(res.data.headers);
          setTableRowsData(res.data.rows);
          setLoading(false);
          setFiles([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <>
      <Row className="match-height">
        <Col md={6}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Upload Invoice</CardTitle>
            </CardHeader>
            <CardBody>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="d-flex align-items-center justify-content-center flex-column">
                  <DownloadCloud size={64} />
                  <h5>Drop Files here or click to upload</h5>
                  <p className="text-secondary">
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      Select Your Invoice
                    </a>{" "}
                  </p>
                </div>
              </div>
              <Row></Row>
              {loading ? (
                <Stack
                  sx={{ width: "100%", marginTop: "10px", color: "#e06522" }}
                  spacing={2}
                >
                  <LinearProgress color="inherit" />
                  Reading invoice .....
                </Stack>
              ) : (
                ""
              )}
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Col md={12} className="d-flex flex-column justify-content-end">
            {files.length ? (
              <Fragment>
                <ListGroup className="my-2">{fileList[0]}</ListGroup>
                <div className="d-flex justify-content-center">
                  <Button
                    className="me-1"
                    color="danger"
                    outline
                    onClick={handleRemoveAllFiles}
                  >
                    Remove
                  </Button>
                  <Button onClick={uploadFile} color="primary">
                    Extract Invoice{" "}
                  </Button>
                </div>
              </Fragment>
            ) : (
              <img src={invoiceimg} className="img-fluid" width={200} alt="" />
            )}
          </Col>
        </Col>
      </Row>
      <div id="invoice-card" className="invoice-add-wrapper">
        <Row className="invoice-add">
          <Col xl={12} md={12} sm={12}>
            <AddCard
              data={data}
              headerData={tableHeaderData}
              tableRowData={tableRowsData}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Invoice;
