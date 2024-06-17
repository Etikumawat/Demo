// ** React Imports
import { useState, Fragment } from "react";
import { useEffect } from "react";
import axios from "axios";
import { CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { LinearProgress } from "@mui/material";
import withReactContent from "sweetalert2-react-content";
// ** Reactstrap Imports
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Input,
  Modal,
  BreadcrumbItem,
  Breadcrumb,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud, Trash2 } from "react-feather";
import themeConfig from "../../configs/themeConfig";
import ExtractedInvoiceCard from "./ExtractedInvoiceCard";
import { DeleteOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
const MySwal = withReactContent(Swal);

const BulkInvoice = () => {
  const [scrollToInvoice, setScrollToInvoice] = useState(false);
  // ** State
  const [files, setFiles] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [data, setData] = useState();
  const [allData, setAllData] = useState([]);
  const [total, setTotal] = useState(null);
  const [tableHeaderData, setTableHeaderData] = useState();
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [tableRowsData, setTableRowsData] = useState();
  const [poNumbers, setPoNumbers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadloading, setUploadLoading] = useState(false);
  const [query, setQuery] = useState({
    offset: "0",
    limit: "10",
    order: "desc",
    sort: "id",
    search: "",
  });

  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: true,
  //   onDrop: (acceptedFiles) => {
  //     setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
  //   },
  // });
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true, // Allow only single file selection
    onDrop: (acceptedFiles) => {
      // Check if the total number of files plus the newly accepted files exceed 10
      if (files.length + acceptedFiles.length > 10) {
        toast.error("You can only select up to 10 files.");
      } else {
        // Allow adding files if the total number of files is within the limit
        setFiles([
          ...files,
          ...acceptedFiles.map((file) => Object.assign(file)),
        ]);
      }
    },
  });

  const uploadFileS3Buckect = (index) => {
    setUploadLoading(true);
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("file", file);
      formData.append("poNumber", poNumbers[index]);
    });

    axios
      .post(themeConfig.backendUrl + "v1/admin/aws/bulkUpload", formData)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setUploadLoading(false);
        } else {
          setFiles([]);
          setPoNumbers([]);
          setUploadLoading(false);
          toast.success(res.data.message);
          getFilesList();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setUploadLoading(false);
        setFiles([]);
      });
  };

  const getFilesList = (reset_offset = true) => {
    if (reset_offset) {
      query.offset = 0;
      setQuery(query);
    }
    axios
      .post(
        new URL("/api/v1/admin/aws/invoiceList", themeConfig.backendUrl),
        query
      )

      .then((res) => {
        if (res.data.error) {
          setLoading(false);
          toast.error(res.data.message);
        } else {
          setLoading(false);
          setFilesList(res.data.data);
          setTotal(res.data.total);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const resetData = () => {
    setData();
  };
  useEffect(() => {
    getFilesList();
  }, []);
  useEffect(() => {
    if (scrollToInvoice) {
      const element = document.getElementById("invoice-card");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setScrollToInvoice(false); // Reset the state to prevent continuous scrolling
      }
    }
  }, [scrollToInvoice]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedS3Name, setSelectedS3Name] = useState([]);
  const invoiceTextract = () => {
    if (selectedFiles.length) {
      setLoading(true);
      setData();
      setAllData();
      setTableHeaderData();
      setTableRowsData();
      const fileName = {
        invoiceName: selectedS3Name,
      };
      axios
        .post(
          "https://dev.api.supplierx.aeonx.digital/api/v1/admin/aws/invoice",
          fileName
        )
        .then((res) => {
          if (res.data.error) {
            setLoading(false);
            toast.error(res.data.message);
          } else {
            const invoiceData = res.data.sapData;
            const arrayOfObjects = [];
            for (const key in invoiceData) {
              const keyValueObject = {
                label: key,
                value: invoiceData[key],
              };
              arrayOfObjects.push(keyValueObject);
            }
            setScrollToInvoice(true);
            // setData(arrayOfObjects);
            setData(res.data.sapData);
            setAllData(res.data);
            // setTableHeaderData(res.data.sapData.Items);
            setTableRowsData(res.data.sapData);
            setLoading(false);
            setFiles([]);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast(<p>Select a invoice</p>);
    }
    clearSelectedRows();
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
      <div
        style={{ width: "450px" }}
        className="file-details d-flex align-items-center"
      >
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <div>
        <Input
          type="number"
          style={{ width: "130px" }}
          placeholder="PO Number"
          value={poNumbers[index]}
          onChange={(e) => {
            const newPoNumbers = [...poNumbers];
            newPoNumbers[index] = e.target.value;
            setPoNumbers(newPoNumbers);
          }}
        />
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
  const clearSelectedRows = () => {
    setToggleClearRows(!toggledClearRows);
    setSelectedFiles([]);
    setSelectedS3Name([]);
  };
  // const handleRowSelected = (rows) => {
  //   setSelectedFiles(rows?.selectedRows.map((row) => row.fileName));
  //   setSelectedS3Name(rows?.selectedRows.map((row) => row.s3Name));
  // };
  const handleRowSelected = (rows) => {
    // Check if the total number of selected rows plus the newly selected rows exceed 10
    if (rows.selectedCount > 10) {
      toast("You can only select up to 10 invoice");
    } else {
      setSelectedFiles(rows?.selectedRows.map((row) => row.fileName));
      setSelectedS3Name(rows?.selectedRows.map((row) => row.s3Name));
    }
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };
  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "id",
      sortable: true,
      selector: (row) => row.sr,
    },
    {
      name: "Invoice Name",
      minWidth: "200px",
      maxWidth: "250px",
      sortable: true,
      selector: (row) => <Typography>{row.invoiceName}</Typography>,
    },

    {
      name: "Po No",
      width: "145px",
      column: "type",
      selector: (row) => row.poNo,
    },
    {
      name: "Action",
      column: "action",
      width: "150px",
      selector: (row) => row.action,
      cell: (row) => (
        <>
          <div
            className="d-flex justify-content-between align-center"
            style={{ gap: "10px" }}
          >
            <Tooltip title="Delete">
              <Trash2
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() => deleteFile(row.invoiceId, row.s3Name)}
              />
            </Tooltip>
          </div>
        </>
      ),
    },
  ];

  const deleteFile = (id, filename) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .post(
            new URL("/api/v1/admin/aws/deleteInvoice", themeConfig.backendUrl),
            {
              invoiceId: id,
              s3Name: filename,
            }
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            } else {
              toast.success(response.data.message);
              getFilesList();
            }
          });
      }
    });
  };
  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      getFilesList();
    }
  };
  const handlePagination = (page) => {
    query.offset = page.selected * query.limit;
    setQuery(query);
    getFilesList(false);
  };
  const CustomPagination = () => {
    const limit = [1, 10, 25, 50, 100];
    const updateLimit = (e) => {
      query.limit = parseInt(e.target.value);
      setQuery({ ...query });
      getFilesList();
    };

    return (
      <>
        <div className="mt-2">
          <div className="container position-absolute">
            <div className="row custom-width">
              <div className="col-sm-1">
                <select
                  className="form-select form-select-sm"
                  onChange={updateLimit}
                  value={query.limit}
                >
                  {limit.map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-1">Total: {total}</div>
            </div>
          </div>

          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            forcePage={Math.floor(query.offset / query.limit)}
            onPageChange={(page) => handlePagination(page)}
            pageCount={Math.ceil(total / query.limit)}
            breakLabel={"..."}
            pageRangeDisplayed={2}
            marginPagesDisplayed={2}
            activeClassName="active"
            pageClassName="page-item"
            breakClassName="page-item"
            nextLinkClassName="page-link"
            pageLinkClassName="page-link"
            breakLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextClassName="page-item next-item"
            previousClassName="page-item prev-item"
            containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
          />
        </div>
      </>
    );
  };

  return (
    <>
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
      <div className="d-flex justify-content-between align-center">
        <h4>Invoice List</h4>
      </div>
      <hr />
      <Row className="">
        <Col md={5}>
          <Col md={12} className="d-flex flex-column justify-content-end">
            {files.length ? (
              <>
                <Modal
                  scrollable
                  isOpen={files.length > 0 ? true : false}
                  toggle={() => setIsModalOpen(!isModalOpen)}
                  className="modal-dialog-centered modal-lg"
                >
                  <Fragment>
                    <ListGroup className="my-2">{fileList}</ListGroup>
                    {uploadloading ? (
                      <Stack
                        sx={{
                          paddingX: "40px",
                          marginTop: "10px",
                          color: "#e06522",
                        }}
                        spacing={2}
                      >
                        <LinearProgress color="inherit" />
                        Uploading .....
                      </Stack>
                    ) : (
                      ""
                    )}
                    <div className="d-flex justify-content-center mb-2">
                      <Button
                        className="me-1"
                        color="danger"
                        outline
                        onClick={handleRemoveAllFiles}
                      >
                        Remove
                      </Button>
                      <Button
                        disabled={uploadloading ? true : false}
                        onClick={uploadFileS3Buckect}
                        color="primary"
                      >
                        Upload Files{" "}
                      </Button>
                    </div>
                  </Fragment>
                </Modal>
              </>
            ) : (
              ""
              // <h5>Upload the invoice</h5>
              // <img src={invoiceimg} className="img-fluid" width={200} alt="" />
            )}
          </Col>
        </Col>
      </Row>
      <div id="invoice-card" className="invoice-add-wrapper mt-2">
        <Row className="invoice-add match-height">
          <Col className="align-items-start" md={12}>
            <CardBody>
              <input {...getInputProps()} />
              <div className="d-flex flex-column align-items-center mb-1">
                <DownloadCloud color="#FE9347" size={30} />
                <Button
                  outline
                  style={{ cursor: "pointer" }}
                  {...getRootProps({ className: "dropzone" })}
                  color="primary mt-1"
                >
                  Upload Invoice
                </Button>
                <p className="text-secondary"></p>
              </div>
            </CardBody>
          </Col>
        </Row>
        {loading ? (
          <Stack
            sx={{
              width: "100%",
              marginTop: "10px",
              color: "#e06522",
              marginBottom: "10px",
            }}
            spacing={2}
          >
            <LinearProgress color="inherit" />
            Reading .....
          </Stack>
        ) : (
          ""
        )}
        <DataTable
          selectableRows
          clearSelectedRows={toggledClearRows}
          data={filesList}
          columns={basicColumns}
          className="react-dataTable"
          onSelectedRowsChange={handleRowSelected}
          onSort={handleSort}
          paginationComponent={CustomPagination}
          paginationDefaultPage={query.offset + 1}
          paginationServer
          pagination
        />
        <div className="d-flex mt-1">
          <Button
            disabled={selectedFiles.length ? false : true}
            onClick={invoiceTextract}
            className="me-1"
            color="primary"
            type="submit"
          >
            Read Invoice
          </Button>
          <Button
            outline
            color="secondary"
            type="reset"
            onClick={() => {
              setSelectedFiles([]);
              setSelectedS3Name([]);
              setData();
              setAllData();
              setTableHeaderData();
              setTableRowsData();
              clearSelectedRows();
            }}
          >
            Reset
          </Button>
        </div>
        {data?.length > 0 ? (
          <div id="invoice-card" className="invoice-add-wrapper">
            <Row className="invoice-add mt-5">
              <Col xl={12} md={12} sm={12}>
                <ExtractedInvoiceCard
                  data={data}
                  resetData={resetData}
                  headerData={tableHeaderData}
                  tableRowData={tableRowsData}
                />
              </Col>
            </Row>
          </div>
        ) : (
          ""
        )}
        <Modal
          scrollable
          isOpen={loading ? true : false}
          className="modal-dialog-centered modal-sm"
        >
          {loading ? (
            <Stack
              sx={{
                marginTop: "10px",
                color: "#e06522",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              spacing={2}
            >
              <CircularProgress color="inherit" />
              Reading invoices .....
            </Stack>
          ) : (
            ""
          )}
        </Modal>
      </div>
    </>
  );
};

export default BulkInvoice;
