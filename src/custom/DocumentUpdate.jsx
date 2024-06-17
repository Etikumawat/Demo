import React, { useState } from "react";
import { Button, Label } from "reactstrap";
import { IoDocumentTextOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";

function DocumentUpdate({
  defaultImg,
  text,
  onChange,
  onReset,
  isEditAllowed = false,
  ...props
}) {
  const [addImage, setAddImage] = useState(defaultImg);
  const fileExtensions = [".pdf", ".PDF", ".doc", ".DOC", ".docx", ".DOCX"];

  const isFileExtension = fileExtensions.some((ext) => addImage?.includes(ext));

  const onChangeAdd = (e) => {
    const reader = new FileReader(),
      files = e.target.files;

    if (files && files[0]) {
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
    setAddImage(defaultImg);
    onReset();
  };
  return (
    <div className="form-group d-flex flex-column align-items-center">
      <div>
        {isFileExtension ? (
          <a
            href={addImage}
            rel="noreferrer"
            target="_blank"
            style={{
              height: "80px",
            }}
            className="d-flex flex-column align-items-center justify-content-center"
          >
            <IoDocumentTextOutline color="gray" size={30} />
            Open Document
          </a>
        ) : (
          <img
            id=""
            className="rounded me-50"
            src={addImage}
            alt=""
            height="80px"
            style={{ maxWidth: "150px" }}
            loading="lazy"
          />
        )}
      </div>
      <div className="d-flex align-items-end mt-75 ms-1">
        {isEditAllowed && (
          <div>
            <Button
              tag={Label}
              className="mb-75 me-75"
              size="sm"
              color="primary"
            >
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
            <div className="d-flex justify-content-center">{text || ""}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentUpdate;
