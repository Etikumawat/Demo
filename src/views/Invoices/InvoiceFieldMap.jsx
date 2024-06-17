import { useState, Fragment } from "react";
import axios from "axios";
import { Stack } from "@mui/material";
import "./invoice.css";
import toast from "react-hot-toast";
import { LinearProgress } from "@mui/material";
import { ToastContainer, toast as toastify } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Flip } from "react-toastify";
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
  Input,
  BreadcrumbItem,
  Breadcrumb,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import themeConfig from "../../configs/themeConfig";
import { ArrowBackIosOutlined } from "@mui/icons-material";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";
const myStyle = {
  overflowY: "auto",
  borderRadius: "10px",
  height: "60vh",
  border: "1px solid #DDDDDD",
  backgroundColor: "#FFFFFF",
};
function InvoiceFieldMap() {
  const [loading, setLoading] = useState(false);
  const [extractedSearchTerm, setExtractedSearchTerm] = useState("");
  const [sapSearchTerm, setSapSearchTerm] = useState("");
  const [mappedSearchTerm, setMappedSearchTerm] = useState("");
  const [extractedData, setExtractedData] = useState([]);
  const [sapData, setSapData] = useState([]);
  const [ogSapData, setOGSAP] = useState([]);
  const [files, setFiles] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const [invoiceId, setInvoiceId] = useState();
  // const [data, setData] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });
  const uploadFile = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]);
    axios
      .post(themeConfig.backendUrl + "v1/admin/aws/mapping", formData)
      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
          setFiles([]);
        } else {
          setLoading(false);
          toast.success(res.data.message);
          setExtractedData(res.data.data.extractedKeys);
          setSapData(res.data.data.sapKeys);
          setOGSAP(res.data.data.sapKeys);
          setInvoiceId(res.data.data.id);
          setMappedData([]);
          setFiles([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        toast.error(error.message);
      });
  };
  const sendInvoiceMap = () => {
    if (mappedData.length === 0) {
      toastify.error("Please map the fields first", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });
    } else {
      sendMappedData();
    }
  };
  const sendMappedData = () => {
    const params = {
      id: invoiceId,
      mappedKeys: mappedData,
    };
    axios
      .post(themeConfig.backendUrl + "v1/admin/aws/mappedkeys", params)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setInvoiceId();
          setSapData([]);
          setExtractedData([]);
          setMappedData([]);
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

  const handleSelectExtractedKey = (extractedKey) => {
    const updatedExtractedData = extractedData.filter(
      (d) => d !== extractedKey
    );
    setExtractedData(updatedExtractedData);
    setMappedData([...mappedData, { extractedKey, sapKey: null }]);
  };

  const handleSelectSapKey = (sapKey, extractedKey) => {
    const updatedMappedData = mappedData.map((item) =>
      item.extractedKey === extractedKey ? { ...item, sapKey } : item
    );
    setMappedData(updatedMappedData);
    const updatedSapData = sapData.filter((d) => d !== sapKey);
    setSapData(updatedSapData);
  };

  const handleDeselect = (item) => {
    const updatedMappedData = mappedData.filter(
      (i) => i.extractedKey !== item.extractedKey
    );
    setMappedData(updatedMappedData);
    setExtractedData([...extractedData, item.extractedKey]);
    if (item.sapKey !== null) {
      setSapData([...sapData, item.sapKey]);
    }
  };
  const handleExtractedSearch = (event) => {
    setExtractedSearchTerm(event.target.value);
  };

  const handleSapSearch = (event) => {
    setSapSearchTerm(event.target.value);
  };
  const handleMappedSearch = (event) => {
    setMappedSearchTerm(event.target.value);
  };

  const filteredMappedKeys = mappedData.filter(
    (item) =>
      item.extractedKey
        .toLowerCase()
        .includes(mappedSearchTerm.toLowerCase()) ||
      (item.sapKey &&
        item.sapKey.toLowerCase().includes(mappedSearchTerm.toLowerCase()))
  );

  const filteredExtractedKeys = extractedData.filter((item) =>
    item.toLowerCase().includes(extractedSearchTerm.toLowerCase())
  );

  const filteredSapKeys = sapData.filter((item) =>
    item.toLowerCase().includes(sapSearchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> SAP Invoice </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <ToastContainer />
      <div className="d-flex justify-content-between align-center">
        <h4>Invoice Field Mapping</h4>
      </div>
      <hr />
      <Row className="match-height align-items-center">
        <Col md={5}>
          <Card>
            <CardBody>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="d-flex align-items-center justify-content-center flex-column">
                  <DownloadCloud size={30} />
                  <h5>Drop Files here or click to upload</h5>
                  <p className="text-secondary">
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      Upload invoice to field map it.
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
                    Extract.{" "}
                  </Button>
                </div>
              </Fragment>
            ) : (
              <h5>
                Upload the invoice to extract the keys. To map the keys, first
                select the extraced keys then select the sap keys.
              </h5>
            )}
          </Col>
        </Col>
      </Row>
      <div className="row mt-2">
        <div className="col-md-3">
          <Input
            type="text"
            placeholder="Search"
            value={extractedSearchTerm}
            onChange={handleExtractedSearch}
            className="mb-2"
          />
          <h4 className="mt-1 mb-2">Extracted Keys</h4>
          <div
            style={{
              overflowY: "auto",
              borderRadius: "10px",
              maxHeight: "60vh",
              height: "60vh",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DDDDDD",
            }}
            className="list-group list-group-flush "
          >
            <style>
              {`
            ::-webkit-scrollbar {
              width: 4px;
            }
            ::-webkit-scrollbar-track {
              background: #f1f1f1; 
              color:#000
            }
            ::-webkit-scrollbar-thumb {
              background: #FE9347; 
              border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
              background: #555; 
            }
          `}
            </style>

            {filteredExtractedKeys.length === 0 ? (
              <div className="text-center">
                <h5 className="mt-5">No Data</h5>
              </div>
            ) : (
              filteredExtractedKeys.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  onClick={() => handleSelectExtractedKey(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item}
                </li>
              ))
            )}
          </div>
        </div>
        <div className="col-md-4">
          <Input
            type="text"
            placeholder="Search"
            value={sapSearchTerm}
            onChange={handleSapSearch}
            className="mb-2"
          />
          <h4 className="mt-1 mb-2">Sap Keys</h4>
          <div style={myStyle} className="list-group list-group-flush">
            {filteredSapKeys.length === 0 ? (
              <div className="text-center">
                <h5 className="mt-5">No Data</h5>
              </div>
            ) : (
              filteredSapKeys.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item border"
                  onClick={() =>
                    mappedData.find(
                      (mappedItem) => mappedItem.sapKey === null
                    ) &&
                    handleSelectSapKey(
                      item,
                      mappedData.find(
                        (mappedItem) => mappedItem.sapKey === null
                      ).extractedKey
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {item}
                </li>
              ))
            )}
          </div>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-4">
          <Input
            type="text"
            placeholder="Search"
            value={mappedSearchTerm}
            onChange={handleMappedSearch}
            className="mb-2"
          />
          <h4 className="mt-1 mb-2">Mapped Keys</h4>

          <div style={myStyle} className="list-group list-group-flush p-1">
            {filteredMappedKeys.map((item, index) => (
              <>
                <li
                  key={index}
                  className="list-group-item border"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <span style={{ color: "#F26C13" }}>
                    Extracted - {item.extractedKey}
                  </span>
                  <br />
                  <span style={{ color: "green" }}>
                    SAP - {item.sapKey || "Not mapped yet"}
                  </span>
                  <span>
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      className="btn-icon ms-2"
                      onClick={() => handleDeselect(item)}
                    >
                      <X size={14} />
                    </Button>
                  </span>
                </li>
              </>
            ))}
          </div>
          <Button
            onClick={sendInvoiceMap}
            className="mt-2 flex justify-content-end"
            color="primary"
          >
            Map It
          </Button>
          <Button
            onClick={() => {
              setMappedData([]);
              setSapData(ogSapData);
            }}
            className="mt-2 ms-2"
            color="primary"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFieldMap;
