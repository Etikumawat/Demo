import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, Button, Card } from "reactstrap";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { Link } from "react-router-dom";

function permissions() {
  const [modulePermissions, setModulePermissions] = useState();
  const [isSelectAllText, setIsSelectAllText] = useState([
    true,
    true,
    true,
    true,
  ]);

  const [data, setData] = useState({
    role_id: undefined,
    key: 1,
    module_permissions: [],
  });

  const [roleNameList, setRoleNameList] = useState();

  useEffect(() => {
    const fetchRoles = () => {
      axios
        .post(new URL(`v1/admin/roles/list`, themeConfig.backendUrl))
        .then((response) => {
          // setRoleNameList(response)
          const roleNames = response.data.data.rows.map((item) => ({
            label: item.role_name,
            value: item.id,
          }));
          setRoleNameList(roleNames);
        })
        .catch((error) => console.log(error));
    };
    fetchRoles();
  }, []);

  const fetchRolePermissions = (selectedOption) => {
    axios
      .get(
        new URL(
          `v1/admin/rolesAndPermissions/view/${selectedOption.value}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        console.log(res.data.data);
        setData({
          role_id: res.data.data.role_id,
          module_permissions: res.data.data.module_permission,
        });
        setModulePermissions(res.data.data.module_permission);
      })
      .catch((error) => console.log(error));
  };

  const selectAll = (index) => {
    const newCheckedItems = [...isSelectAllText];
    newCheckedItems[index] = !newCheckedItems[index];
    setIsSelectAllText(newCheckedItems);

    if (isSelectAllText[index]) {
      setModulePermissions((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 1 : p)),
          };
        });
      });
    } else if (!isSelectAllText[index]) {
      setModulePermissions((prev) => {
        return prev.map((module) => {
          return {
            ...module,
            permission: module.permission.map((p, i) => (i === index ? 0 : p)),
          };
        });
      });
    }
  };

  const submitData = () => {
    console.log(modulePermissions);

    axios
      .post(
        new URL(`v1/admin/rolesAndPermissions/update`, themeConfig.backendUrl),
        data
      )
      .then((response) => {
        console.log(response);
        if (response.data.error) {
          toast.error(response.data.message);
        } else {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        console.error("Error while setting the data", error);
      });
  };

  const togglePermission = (moduleId, permissionIndex) => {
    setModulePermissions((prevPermissions) => {
      return prevPermissions.map((prevModule) => {
        if (prevModule.id === moduleId) {
          const updatedPermission = [...prevModule.permission]; // Copy the permission array
          updatedPermission[permissionIndex] =
            updatedPermission[permissionIndex] === 1 ? 0 : 1; // Toggle the permission
          return { ...prevModule, permission: updatedPermission }; // Return updated module object
        }
        return prevModule; // Return unchanged module object
      });
    });
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      module_permissions: modulePermissions,
    }));
    console.log(data);
  }, [modulePermissions]);

  return (
    <div>
    <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span>Permissions </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Card sx={{ my: 4 }}>
        <FormControl fullWidth className="px-2 py-1">
          {/* <CustomTextField fullWidth label='Role Name' placeholder='Enter Role Name' /> */}
          <Typography variant="h5">Select Role Name</Typography>

          <Select
            styles={{ width: "50%" }}
            options={roleNameList}
            value={roleNameList?.value}
            onChange={(selectedOption) => fetchRolePermissions(selectedOption)}
          />
        </FormControl>
      </Card>
      {/* <Typography variant="h4">Role Permissions</Typography> */}
      {modulePermissions && (
        <Card>
          <TableContainer className="p-2">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <Typography variant="h5">Role Permissions</Typography>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Select All Buttons */}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>
                    <FormControlLabel
                      label={
                        isSelectAllText[0] === true
                          ? "Select All"
                          : "Deselect All"
                      }
                      sx={{
                        "& .MuiTypography-root": { color: "text.secondary" },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          id={`0`}
                          defaultChecked={false}
                          onChange={() => selectAll(0)}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      label={
                        isSelectAllText[1] === true
                          ? "Select All"
                          : "Deselect All"
                      }
                      sx={{
                        "& .MuiTypography-root": { color: "text.secondary" },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          id={`1`}
                          // checked={module.permission[0] === 1 ? true : false}
                          onChange={() => selectAll(1)}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      label={
                        isSelectAllText[2] === true
                          ? "Select All"
                          : "Deselect All"
                      }
                      sx={{
                        "& .MuiTypography-root": { color: "text.secondary" },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          id={`2`}
                          // checked={module.permission[0] === 1 ? true : false}
                          onChange={() => selectAll(2)}
                        />
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <FormControlLabel
                      label={
                        isSelectAllText[3] === true
                          ? "Select All"
                          : "Deselect All"
                      }
                      sx={{
                        "& .MuiTypography-root": { color: "text.secondary" },
                      }}
                      control={
                        <Checkbox
                          size="small"
                          id={`3`}
                          // checked={module.permission[0] === 1 ? true : false}
                          onChange={() => selectAll(3)}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>

                {modulePermissions?.map((module, index) => {
                  const id = module.id;
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "& .MuiTableCell-root:first-of-type": {
                          pl: "0 !important",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          fontSize: (theme) => theme.typography.h6.fontSize,
                        }}
                      >
                        {module.name}
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Create"
                          sx={{
                            "& .MuiTypography-root": {
                              color: "text.secondary",
                            },
                          }}
                          control={
                            <Checkbox
                              size="small"
                              id={`${id}-create`}
                              checked={
                                module.permission[0] === 1 ? true : false
                              }
                              onChange={() => togglePermission(module.id, 0)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Read"
                          sx={{
                            "& .MuiTypography-root": {
                              color: "text.secondary",
                            },
                          }}
                          control={
                            <Checkbox
                              size="small"
                              id={`${id}-read`}
                              checked={
                                module.permission[1] === 1 ? true : false
                              }
                              onChange={() => togglePermission(module.id, 1)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Update"
                          sx={{
                            "& .MuiTypography-root": {
                              color: "text.secondary",
                            },
                          }}
                          control={
                            <Checkbox
                              size="small"
                              id={`${id}-update`}
                              checked={
                                module.permission[2] === 1 ? true : false
                              }
                              onChange={() => togglePermission(module.id, 2)}
                            />
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          label="Delete"
                          sx={{
                            "& .MuiTypography-root": {
                              color: "text.secondary",
                            },
                          }}
                          control={
                            <Checkbox
                              size="small"
                              id={`${id}-delete`}
                              checked={
                                module.permission[3] === 1 ? true : false
                              }
                              onChange={() => togglePermission(module.id, 3)}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="d-flex justify-content-center align-items-center w-100 mb-2">
            <Button onClick={submitData} color="primary" className="w-25">
              Submit
            </Button>
          </div>
        </Card>
      )}

      {/* </Grid> */}
      {/* </Grid> */}
    </div>
  );
}

export default permissions;
