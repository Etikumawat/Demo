import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  Input,
  Label,
} from "reactstrap";
import themeConfig from "../../../configs/themeConfig";
import toast from "react-hot-toast";
import Select from "react-select";
import { selectThemeColors } from "@utils";
import placeHolder from "../../../assets/images/avatars/images.png";

const UploadLogo = ({
  text,
  onUpload,
  handleImgReset,
  defaultImage = placeHolder,
  setSrcImage,
  srcImage,
}) => {
  const handleImageChange = (e) => {
    const reader = new FileReader();
    const files = e.target.files;

    if (files && files[0]) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png"];

      if (!allowedExtensions.includes(fileExtension)) {
        toast("Only JPG, JPEG, PNG are allowed.");
        e.target.value = null;
        return;
      }

      const fileSize = files[0].size;
      if (fileSize > 512 * 1024) {
        toast(`File size must be less than 500Kbs`);
        e.target.value = null;
        return;
      }
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (img.width !== 512 || img.height !== 512) {
            toast("Image dimensions must be 512x512 pixels");
            e.target.value = null;
            return;
          } else {
            setSrcImage(reader.result);
          }
        };
        img.src = event.target.result;
      };

      reader.readAsDataURL(files[0]);
    }

    if (typeof onUpload === "function") {
      onUpload(e);
    }
  };

  const handleReset = (e) => {
    setSrcImage(defaultImage);
    if (typeof handleImgReset === "function") {
      handleImgReset(e);
    }
  };

  return (
    <div className="form-group d-flex">
      <div>
        <img
          className="rounded me-50"
          src={srcImage}
          alt="Logo"
          height="80px"
          style={{ maxWidth: "200px" }}
          loading="lazy"
        />
      </div>
      <div className="d-flex align-items-end mt-75 ms-1">
        <div>
          <Button tag={Label} className="mb-75 me-75" size="sm" color="primary">
            Upload
            <input
              type="file"
              id="editCatImage"
              onChange={handleImageChange}
              name="fileUpload"
              accept="image/jpeg, image/png, image/jpg"
              hidden
            />
          </Button>
          <Button
            className="mb-75"
            color="secondary"
            size="sm"
            outline
            onClick={handleReset}
          >
            Reset
          </Button>
          {text || ""}
        </div>
      </div>
    </div>
  );
};

function General() {
  const [data, setData] = useState(null);
  const [countryOptions, setCountryOptions] = useState(null);
  const [stateOptions, setStateOptions] = useState(null);
  const [defaultLogo, setDefaultLogo] = useState();
  const [companyLogo, setCompanyLogo] = useState();

  const request = async () => {
    let dataFromApi;
    // fetching general info
    await axios
      .post(
        new URL("v1/envConfiguration/viewGenSettings", themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setCompanyLogo(placeHolder);
          // setData({
          //   CO_SHORT_NAME: "AeonX",
          //   CO_FULL_NAME: "AeonX Digital Solution",
          //   CO_ADD_1: "203-206, JV Bussiness Park",
          //   CO_ADD_2: "Nr. Smrutivan Memorial",
          //   CO_STATE: "Gujarat",
          //   CO_PIN: "370001",
          //   CO_COUNTRY: "India",
          //   CO_URL: "https://aeonx.digital",
          //   CO_LOGO:
          //     "https://supplierx.aeonx.digital/static/media/logo.9020fb0c27147fa2cf82.png",
          // });
          // setDefaultLogo(
          //   "https://supplierx.aeonx.digital/static/media/logo.9020fb0c27147fa2cf82.png"
          // );
          // setCompanyLogo(
          //   "https://supplierx.aeonx.digital/static/media/logo.9020fb0c27147fa2cf82.png"
          // );
          // dataFromApi = {
          //   CO_SHORT_NAME: "AeonX",
          //   CO_FULL_NAME: "AeonX Digital Solution",
          //   CO_ADD_1: "203-206, JV Bussiness Park",
          //   CO_ADD_2: "Nr. Smrutivan Memorial",
          //   CO_STATE: "Gujarat",
          //   CO_PIN: "370001",
          //   CO_COUNTRY: "India",
          //   CO_URL: "https://aeonx.digital",
          //   CO_LOGO:
          //     "https://supplierx.aeonx.digital/static/media/logo.9020fb0c27147fa2cf82.png",
          // };
        } else {
          dataFromApi = res.data.data;
          setData(res.data.data);
          setDefaultLogo(res.data.data.CO_LOGO);
          setCompanyLogo(res.data.data.CO_LOGO);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));

    // fetching country list
    await axios
      .post(new URL("/api/v1/admin/country/list", themeConfig.backendUrl), {
        key: "all",
      })
      .then((response) => {
        const selected_option = response.data.data.rows?.find(
          (item) => item.name === dataFromApi?.CO_COUNTRY
        );
        const options = response.data?.data?.rows?.map((item) => ({
          label: item.name,
          value: item.country_key,
        }));
        setCountryOptions(options);
        if (selected_option) {
          handleCountry({ value: selected_option?.country_key }, true);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    request();
  }, []);

  const handleCountry = (event, isInitialCall = false) => {
    if (event) {
      // fetching states for the selected country
      axios
        .post(new URL("/api/v1/supplier/states/view", themeConfig.backendUrl), {
          countryKey: event.value,
        })
        .then((response) => {
          const options = response.data?.data?.map((item) => ({
            label: item.stateDesc,
            value: item.stateDesc,
          }));
          setStateOptions(options);
        })
        .catch((error) => {
          console.error("Error fetching regions:", error);
        });
    } else {
      console.log("Fetching regions");
    }

    // setting the country data
    if (!isInitialCall) {
      setData((prev) => ({
        ...prev,
        CO_COUNTRY: event.label ? event.label : data?.CO_COUNTRY,
      }));
    }
  };

  const handleChange = (e) => {
    if (e.target) {
      const { name, value } = e.target;
      setData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("CO_SHORT_NAME", data?.CO_SHORT_NAME);
    formData.append("CO_FULL_NAME", data?.CO_FULL_NAME);
    formData.append("CO_ADD_1", data?.CO_ADD_1);
    formData.append("CO_ADD_2", data?.CO_ADD_2);
    formData.append("CO_STATE", data?.CO_STATE);
    formData.append("CO_PIN", data?.CO_PIN);
    formData.append("CO_COUNTRY", data?.CO_COUNTRY);
    formData.append("CO_URL", data?.CO_URL);

    if (data?.CO_LOGO instanceof File) {
      formData.append("CO_LOGO", data.CO_LOGO);
    }

    axios
      .put(
        new URL("v1/envConfiguration/genSettings", themeConfig.backendUrl),
        formData
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        toast.success("General info updated successfully");
      })
      .catch((error) => console.error(error));
  };

  const resetImage = () => {
    setData((prev) => ({ ...prev, CO_LOGO: "" }));
    // setCompanyLogo("");
  };

  const onUpload = (event) => {
    setData((prev) => ({
      ...prev,
      CO_LOGO: event.target.files[0],
    }));
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">General Settings</CardTitle>
        </CardHeader>
        <CardBody>
          <Form
            className="py-2 my-25 d-flex flex-column gap-2"
            onSubmit={onSubmit}
          >
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Company Name:<span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Input
                  id="CO_SHORT_NAME"
                  type="text"
                  name="CO_SHORT_NAME"
                  defaultValue={data?.CO_SHORT_NAME}
                  placeholder="Your Company Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Full Name:<span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Input
                  id="CO_FULL_NAME"
                  defaultValue={data?.CO_FULL_NAME}
                  type="text"
                  name="CO_FULL_NAME"
                  placeholder="Your Company Full Name"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Address Line 1: <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Input
                  id="CO_ADD_1"
                  type="address"
                  defaultValue={data?.CO_ADD_1}
                  name="CO_ADD_1"
                  placeholder="Address Line 1 (e.g., 1023 Building Name)"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">Address Line 2:</Label>
              <div className="w-75">
                <Input
                  id="CO_ADD_2"
                  type="subaddress"
                  defaultValue={data?.CO_ADD_2}
                  name="CO_ADD_2"
                  placeholder="Address Line 2 (e.g., Maple Street)"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Country: <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Select
                  id={`countries`}
                  placeholder="Select a country"
                  theme={selectThemeColors}
                  // value={{ label: data?.CO_COUNTRY }}
                  value={
                    data?.CO_COUNTRY
                      ? { label: data.CO_COUNTRY, value: data.CO_COUNTRY }
                      : null
                  }
                  menuPosition="fixed"
                  className={`react-select`}
                  classNamePrefix="select"
                  options={countryOptions}
                  onChange={(e) => {
                    setData((prev) => ({ ...prev, CO_STATE: null }));
                    handleCountry(e);
                  }}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                State: <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Select
                  id={`countries`}
                  placeholder="Select a state"
                  theme={selectThemeColors}
                  menuPosition="fixed"
                  value={
                    data?.CO_STATE
                      ? { label: data?.CO_STATE, value: data?.CO_STATE }
                      : null
                  }
                  // value={{ label: data?.CO_STATE }}
                  className={`react-select`}
                  classNamePrefix="select"
                  options={stateOptions}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      CO_STATE: e.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Pin Code: <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Input
                  id="CO_PIN"
                  type="NUMBER"
                  defaultValue={data?.CO_PIN}
                  name="CO_PIN"
                  placeholder="Your Pin Code (e.g., 432100)"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Company Website:
                <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <Input
                  id="CO_URL"
                  type="url"
                  defaultValue={data?.CO_URL}
                  name="CO_URL"
                  placeholder="https://www.example.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Label className="fw-bolder w-25">
                Company Logo: <span className="text-danger">*</span>
              </Label>
              <div className="w-75">
                <UploadLogo
                  onUpload={onUpload}
                  defaultImage={defaultLogo}
                  setSrcImage={setCompanyLogo}
                  srcImage={companyLogo}
                  handleImgReset={resetImage}
                  text={
                    <>
                      <div>
                        <small className="text-danger">(jpg/jpeg/png)</small>
                      </div>
                      <div>
                        <small className="text-danger">
                          Image must be 512x512 pixels.
                        </small>
                      </div>
                    </>
                  }
                />
              </div>
            </div>
            <div className="d-flex flex-row-reverse mt-2">
              <Button color="primary">Save</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default General;
