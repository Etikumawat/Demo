import React, { useState } from "react";
import { Button, Label } from "reactstrap";
import placeHolder from "../assets/images/avatars/images.png";
import { toast } from "react-hot-toast";
import { IoDocumentTextOutline } from "react-icons/io5";

function ImageUpload({
  title,
  defaultImage,
  onChange,
  name,
  text,
  onReset,
  ...props
}) {
  const image = defaultImage || placeHolder;
  const [addImage, setAddImage] = useState(image);

  const fileExtensions = ["/pdf", "/PDF"];
  const isFileExtension = fileExtensions.some((ext) => addImage?.includes(ext));
  const onChangeAdd = (e) => {
    const reader = new FileReader();
    const files = e.target.files;

    if (files && files[0]) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();
      const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];

      if (!allowedExtensions.includes(fileExtension)) {
        toast("Only JPG, JPEG, PNG, and PDF files are allowed.");
        e.target.value = null; // Reset the input field
        return;
      }

      const fileSize = files[0].size;
      if (fileSize > 1024 * 1024) {
        toast("File size must be less than 1MB");
        e.target.value = null; // Reset the input field
        return;
      }

      reader.onload = () => {
        setAddImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }

    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const handleImgReset = () => {
    setAddImage(image);
    onReset();
  };
  return (
    <div className="form-group d-flex">
      <div>
        {isFileExtension ? (
          <div
            style={{
              height: "80px",
              width: "80px",
            }}
            className="d-flex flex-column align-items-center justify-content-center"
          >
            <IoDocumentTextOutline color="gray" size={40} />
          </div>
        ) : (
          <img
            id=""
            className="rounded me-50"
            src={addImage}
            alt=""
            height="80px"
            style={{ maxWidth: "200px" }}
            loading="lazy"
          />
        )}
      </div>
      <div className="d-flex align-items-end mt-75 ms-1">
        <div>
          <Button tag={Label} className="mb-75 me-75" size="sm" color="primary">
            Upload
            <input
              type="file"
              id="editCatImage"
              onChange={onChangeAdd}
              name={name}
              accept="image/jpeg, image/png, application/pdf"
              hidden
              {...props}
            />
          </Button>
          <Button
            className="mb-75"
            color="secondary"
            size="sm"
            outline
            onClick={handleImgReset}
          >
            Reset
          </Button>
          {text || ""}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
