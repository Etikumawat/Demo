// ** React Imports
import { Fragment } from "react";
import ImageUpload from "../../../../custom/ImageUpload";
import * as Yup from "yup";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";
// import { LinearProgress } from "@mui/material";
import { CircularProgress, LinearProgress } from "@mui/material";
// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import toast from "react-hot-toast";
//** Use Redux Toolkit */
import { useDispatch } from "react-redux";
import { handleTaxDetails } from "@store/supplierRegistration";
import func from "../../../../custom/functions";
import { AttachFile } from "@mui/icons-material";
import {
  handleCnlChequeFile,
  handleGstFile,
  handleMsmeFile,
  handlePanFile,
  handleAdAttachedFile,
  handlePFAttachedFile,
} from "../../../../redux/attachedFiles";
// ** Utils
import { isObjEmpty } from "@utils";
// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import functions from "../../../../custom/functions";
const TaxDetails = ({ stepper, data }) => {
  const [loading, setLoading] = useState(false);
  const [tempMsme, setTempMsme] = useState({});
  const [tempPan, setTempPan] = useState({});
  const [tempAdAttachment, setTempAdAttachment] = useState({});
  const [tempPFAttachment, setTempPFAttachment] = useState({});
  const [tempGst, setTempGst] = useState({});
  const [tempCheque, setTempCheque] = useState({});
  const [msmeName, setMsmeName] = useState({ msmeName: null });
  const [panName, setPanName] = useState({ panName: null });
  const [pfName, setPFName] = useState({ pfName: null });
  const [adAttachmentName, setAdAttachmentName] = useState({
    adAttachmentName: null,
  });
  const [gstName, setGstName] = useState({ gstName: null });
  const [cnlChequeName, setCnlChequeName] = useState({ cnlChequeName: null });
  const [required, setRequired] = useState();
  const supplierRegistration = useSelector(
    (state) => state.supplierRegistration
  );
  const isMsme = supplierRegistration?.businessDetails?.msme_no;
  const isGst = supplierRegistration?.companyDetails?.gstNo;
  const msmeRequired = isMsme && isMsme.length > 3 ? "1" : "0";
  const gstRequired = isGst && isGst.length > 3 ? "1" : "0";
  const base64Msme = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempMsme(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const base64Pan = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempPan(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const base64Gst = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result, "On Change");
      setTempGst(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const base64Cheque = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempCheque(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const base64AdAttachment = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempAdAttachment(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const base64PFAttachment = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTempPFAttachment(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  const conditionalValidation = func.conditionalValidation;
  const dispatch = useDispatch();
  const fieldsConfig = data.fieldsConfig;
  const schema = Yup.object().shape({});
  const defaultValues = {
    gstRegDate: "",
    msmeImage: "",
    gstImage: "",
    cancelledChequeImage: "",
    panCardImage: "",
    pfAttachment: "",
    otherAttachments: "",
  };
  // ** Hooks
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const areImagesUploaded = (data) => {
    if (required.msmeImage === "1" && data.msmeImage === "") {
      toast.error("Upload MSME Image");
      return false;
    }
    if (msmeRequired === "1" && data.msmeImage === "") {
      toast.error("Upload MSME Image");
      return false;
    }

    if (required.gstImage === "1" && data.gstImage === "") {
      toast.error("Upload GST Image");
      return false;
    }
    if (gstRequired === "1" && data.gstImage === "") {
      toast.error("Upload GST Image");
      return false;
    }

    if (
      required.cancelledChequeImage === "1" &&
      data.cancelledChequeImage === ""
    ) {
      toast.error("Upload Cancelled Cheque Image");
      return false;
    }

    if (required.panCardImage === "1" && data.panCardImage === "") {
      toast.error("Upload PAN Card Image");
      return false;
    }
    if (required.pfAttachment === "1" && data.pfAttachment === "") {
      toast.error("Upload PF Image/Attachment");
      return false;
    }

    return true;
  };
  const getConfiguration = () => {
    const data = {
      module_name: "supplier_registration",
      group_name: "taxDetails",
    };
    axios
      .post(
        new URL(
          "/api/v1/workFlow/fieldConfig/getfieldnames",
          themeConfig.backendUrl
        ),
        data
      )

      .then((res) => {
        const d = res.data.data;
        const requiredObject = {};
        d.forEach((item) => {
          requiredObject[item.key] = item.required;
        });
        setRequired(requiredObject);
        if (res.data.error) {
          toast.error(res.data.message);
        }
      });
  };

  useEffect(() => {
    getConfiguration();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    if (areImagesUploaded(data)) {
      const files = [];
      Object.keys(data).map((key) => {
        if (typeof data[key] == "object" && data[key].size != undefined) {
          files.push(functions.handleFileUpload(data[key], key));
          data[key] = data[key].name;
        }
      });

      const fileNames = (await Promise.all(files)).map((val) => {
        data = { ...data, ...val };
      });
      dispatch(handleMsmeFile(tempMsme));
      dispatch(handlePanFile(tempPan));
      dispatch(handleGstFile(tempGst));
      dispatch(handleCnlChequeFile(tempCheque));
      dispatch(handleAdAttachedFile(tempAdAttachment));
      dispatch(handlePFAttachedFile(tempPFAttachment));
      dispatch(handleTaxDetails(data));
      if (isObjEmpty(errors)) {
        stepper.next();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  const headerStyle = {
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px",
    width: "fit-content",
    padding: "10px 30px 10px 15px",
    margin: "20px 0px",
    backgroundColor: "#e06522",
    color: "rgb(255, 255, 255)",
  };
  return (
    <Fragment>
      <div className="content-header"></div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {loading ? (
          <>
            <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
              <CircularProgress color="inherit" />
              <LinearProgress className="mb-1" color="inherit" />
            </Stack>
            <p>Uploading Files...</p>
          </>
        ) : (
          ""
        )}
        <Row className="align-items-center">
          <div>
            <h4 color="primary" style={headerStyle}>
              <AttachFile /> File Attachments
            </h4>
            <p style={{ color: "red" }}>File size should be less than 1MB</p>
          </div>
          <Col lg="4" md="6" sm="12">
            <Controller
              control={control}
              name={"msmeImage"}
              rules={{ required: "Picture is required" }}
              type="file"
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <>
                    <div>
                      <label className="d-block mt-1">
                        MSME Image
                        {required?.msmeImage === "1" ? (
                          <span className="text-danger">*</span>
                        ) : null}
                        {msmeRequired && msmeRequired === "1" ? (
                          <span className="text-danger">*</span>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>

                    <ImageUpload
                      {...field}
                      text={
                        <>
                          <div>
                            <small className="text-danger">(jpg/png/pdf)</small>
                          </div>
                        </>
                      }
                      onChange={(event) => {
                        onChange(event.target.files[0]),
                          base64Msme(event.target.files[0]);
                        setMsmeName({
                          msmeName: event.target.files[0]
                            ? event.target.files[0].name
                            : null,
                        });
                      }}
                      value={value?.fileName}
                      onReset={() => {
                        onChange();
                        setMsmeName(null);
                        setTempMsme("");
                      }}
                      id="msmeImage"
                    />
                  </>
                );
              }}
            />
            {msmeName?.msmeName && <p>{msmeName.msmeName}</p>}
          </Col>
          {data.gstRegistered ? (
            <Col lg="4" md="6" sm="12">
              <Controller
                control={control}
                name={"gstImage"}
                rules={{ required: "Picture is required" }}
                render={({ field: { value, onChange, ...field } }) => {
                  return (
                    <>
                      <div>
                        <label className="d-block mt-1">
                          GST
                          {required?.gstImage === "1" ? (
                            <span className="text-danger">*</span>
                          ) : null}
                          {gstRequired && gstRequired === "1" ? (
                            <span className="text-danger">*</span>
                          ) : (
                            ""
                          )}
                        </label>
                      </div>

                      <ImageUpload
                        {...field}
                        text={
                          <div>
                            <small className="text-danger">(jpg/png/pdf)</small>
                          </div>
                        }
                        value={value?.fileName}
                        onChange={(event) => {
                          onChange(event.target.files[0]),
                            base64Gst(event.target.files[0]);
                          setGstName({
                            gstName: event.target.files[0]
                              ? event.target.files[0].name
                              : null,
                          });
                        }}
                        onReset={() => {
                          onChange();
                          setGstName(null);
                          setTempGst("");
                        }}
                        type="file"
                        id="gstImage"
                      />
                    </>
                  );
                }}
              />
              {gstName?.gstName && <p>{gstName.gstName}</p>}
            </Col>
          ) : (
            ""
          )}

          <Col lg="4" md="6" sm="12" className="mb-1">
            <Controller
              control={control}
              name={"cancelledChequeImage"}
              rules={{ required: "Picture is required" }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <>
                    <div>
                      <label className="d-block mt-1">
                        Cancelled Cheque
                        {required?.cancelledChequeImage === "1" ? (
                          <span className="text-danger">*</span>
                        ) : null}
                      </label>
                    </div>
                    <ImageUpload
                      {...field}
                      text={
                        <div>
                          <small className="text-danger">(jpg/png/pdf)</small>
                        </div>
                      }
                      value={value?.fileName}
                      onChange={(event) => {
                        onChange(event.target.files[0]),
                          base64Cheque(event.target.files[0]);
                        setCnlChequeName({
                          cnlChequeName: event.target.files[0]
                            ? event.target.files[0].name
                            : null,
                        });
                      }}
                      onReset={() => {
                        onChange();
                        setCnlChequeName(null);
                        setTempCheque("");
                      }}
                      type="file"
                      id="cancelledChequeImage"
                    />
                  </>
                );
              }}
            />
            {cnlChequeName?.cnlChequeName && (
              <p>{cnlChequeName.cnlChequeName}</p>
            )}
          </Col>

          <Col lg="4" md="6" sm="12" className="mb-1">
            <Controller
              control={control}
              name={"panCardImage"}
              rules={{ required: "Picture is required" }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <>
                    <div>
                      <label className="d-block mt-1">
                        Pan Card
                        {required?.panCardImage === "1" ? (
                          <span className="text-danger">*</span>
                        ) : null}
                      </label>
                    </div>
                    <ImageUpload
                      {...field}
                      text={
                        <div>
                          <small className="text-danger">(jpg/png/pdf)</small>
                        </div>
                      }
                      value={value?.fileName}
                      onChange={(event) => {
                        onChange(event.target.files[0]),
                          base64Pan(event.target.files[0]);
                        setPanName({
                          panName: event.target.files[0]
                            ? event.target.files[0].name
                            : null,
                        });
                      }}
                      onReset={() => {
                        onChange();
                        setPanName(null);
                        setTempPan("");
                      }}
                      type="file"
                      id="panCardImage"
                    />
                  </>
                );
              }}
            />
            {panName?.panName && <p>{panName.panName}</p>}
          </Col>

          <Col lg="4" md="6" sm="12" className="mb-1">
            <Controller
              control={control}
              name={"pfAttachment"}
              rules={{ required: "Picture is required" }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <>
                    <div>
                      <label className="d-block mt-1">PF Attachment</label>
                    </div>
                    <ImageUpload
                      {...field}
                      text={
                        <div>
                          <small className="text-danger">(jpg/png/pdf)</small>
                        </div>
                      }
                      value={value?.fileName}
                      onChange={(event) => {
                        onChange(event.target.files[0]),
                          base64PFAttachment(event.target.files[0]);
                        setPFName({
                          pfName: event.target.files[0]
                            ? event.target.files[0].name
                            : null,
                        });
                      }}
                      onReset={() => {
                        onChange();
                        setPFName(null);
                        setTempPFAttachment("");
                      }}
                      type="file"
                      id="pfAttachment"
                    />
                  </>
                );
              }}
            />
            {pfName?.pfName && <p>{pfName.pfName}</p>}
          </Col>

          <Col lg="4" md="6" sm="12" className="mb-1">
            <Controller
              control={control}
              name={"otherAttachments"}
              rules={{ required: "Picture is required" }}
              render={({ field: { value, onChange, ...field } }) => {
                return (
                  <>
                    <div>
                      <label className="d-block mt-1">Other Attachment</label>
                    </div>
                    <ImageUpload
                      {...field}
                      text={
                        <div>
                          <small className="text-danger">(jpg/png/pdf)</small>
                        </div>
                      }
                      value={value?.fileName}
                      onChange={(event) => {
                        onChange(event.target.files[0]),
                          base64AdAttachment(event.target.files[0]);
                        setAdAttachmentName({
                          adAttachmentName: event.target.files[0]
                            ? event.target.files[0].name
                            : null,
                        });
                      }}
                      onReset={() => {
                        onChange();
                        setAdAttachmentName(null);
                        setTempAdAttachment("");
                      }}
                      type="file"
                      id="otherAttachments"
                    />
                  </>
                );
              }}
            />
            {adAttachmentName?.adAttachmentName && (
              <p>{adAttachmentName.adAttachmentName}</p>
            )}
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">
              Previous
            </span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">Next</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
      <div className="mt-5 mb-5"></div>
    </Fragment>
  );
};

export default TaxDetails;
