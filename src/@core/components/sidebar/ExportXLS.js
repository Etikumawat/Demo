import React, { useEffect, useState } from "react";
import { Button, Label, Input, FormGroup } from "reactstrap";
import Downloading from "@mui/icons-material/Downloading";
import { X } from "react-feather";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";

function ExportXLS({
  exportAll,
  openSidebar,
  exportFields,
  handleToggle,
  selectedFields,
  setSelectedFields,
  isExportSelectedData,
  handleExportSelectedData,
}) {
  const [isSavePreferencesChecked, setIsSavePreferencesChecked] =
    useState(false);
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const transformedFields = Object.keys(exportFields).map((key) => ({
    value: key,
    label: exportFields[key],
  }));
  useEffect(() => {
    if (isSavePreferencesChecked) {
      localStorage.setItem("selectedFields", JSON.stringify(selectedFields));
    } else {
      localStorage.removeItem("selectedFields");
    }
  }, [isSavePreferencesChecked, selectedFields]);

  const selectField = (value, label) => {
    setSelectedFields((prev) => {
      const updatedFields = { ...prev };
      if (value in updatedFields) {
        delete updatedFields[value];
      } else {
        updatedFields[value] = label;
      }
      console.log(updatedFields, "updatedFields");
      return updatedFields;
    });
  };

  const selectAllFields = () => {
    const newIsSelectedAll = !isSelectedAll;
    setIsSelectedAll(newIsSelectedAll);
    setSelectedFields(newIsSelectedAll ? exportFields : {});
  };

  const handleSaveToLocalStorage = () => {
    setIsSavePreferencesChecked(!isSavePreferencesChecked);
  };

  const fieldsToShow = showAll
    ? transformedFields
    : transformedFields.slice(0, 10);

  return (
    <div
      className={classnames("exportSidebar d-md-block", {
        open: openSidebar,
      })}
    >
      <PerfectScrollbar
        className="customizer-content"
        options={{ wheelPropagation: false }}
      >
        <div className="customizer-header px-2 pt-1 pb-0 position-relative">
          <h4 className="mb-0">Export Settings</h4>
          <a href="/" className="customizer-close" onClick={handleToggle}>
            <X color="red" />
          </a>
        </div>
        <hr />
        <div className="px-2">
          <div className="mb-2 d-flex flex-wrap align-items-center">
            {fieldsToShow?.map((item) => {
              const isSelected = item.value in selectedFields;
              return (
                <span key={item.value}>
                  <Button
                    style={{ margin: "5px", padding: "7px 12px" }}
                    outline={!isSelected}
                    className="rounded-5"
                    color="primary"
                    onClick={() => selectField(item.value, item.label)}
                  >
                    {item.label}
                  </Button>
                </span>
              );
            })}
            {!showAll ? (
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                className="fst-italic"
                onClick={() => setShowAll(true)}
              >
                Show more...
              </span>
            ) : (
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                className="fst-italic"
                onClick={() => setShowAll(false)}
              >
                Show less...
              </span>
            )}
          </div>
          <Label className="m-1 mb-0" check>
            <span style={{ marginRight: "7px" }}>
              <Input
                type="checkbox"
                checked={isSavePreferencesChecked}
                onChange={handleSaveToLocalStorage}
              />
            </span>
            Check the box to save this preferences
          </Label>
          <FormGroup className="m-1" switch>
            <Input
              checked={isSelectedAll}
              type="switch"
              role="switch"
              onChange={selectAllFields}
            />
            <Label check>Select All Fields</Label>
          </FormGroup>
          <hr />
        </div>
        <div className="d-flex gap-1 w-100 justify-content-center mb-1">
          <Button
            onClick={(e) => {
              if (isExportSelectedData) {
                handleExportSelectedData();
              } else {
                exportAll();
              }
              handleToggle(e);
            }}
            color="primary"
            style={{ gap: "4px" }}
            className="d-flex justify-content-center align-items-center w-25 form-control"
          >
            <Downloading size={15} />
            Export
          </Button>
          <Button
            color="primary"
            outline
            className="form-control w-25"
            onClick={handleToggle}
          >
            Cancel
          </Button>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

export default ExportXLS;
