import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Controller } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import Icon from "../../../@core/components/icon";
import CustomTextField from "../../../@core/components/mui/text-field";
import Box from "@mui/material/Box";

import {
  Button,
  Card,
  Breadcrumb,
  BreadcrumbItem,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import themeConfig from "../../../configs/themeConfig";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Typography from "@mui/material/Typography";

function ChangePassword() {
  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);
  const { id } = user;
  const userId = id;
  const [userData, setUserData] = useState({});
  const [cred, setCred] = useState({
    id: userId,
    email: userData.email,
    password: "",
    confirmPassword: "",
  });

  const request = () => {
    axios
      .post(new URL(`/api/admin/users/view/${userId}`, themeConfig.backendUrl))
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setUserData(res.data.data[0]);
      });
  };
  useEffect(() => {
    request();
  }, []);

  const defaultValues = {
    newPassword: "",
    currentPassword: "",
    confirmNewPassword: "",
  };

  const schema = yup.object().shape({
    currentPassword: yup.string().min(8).required(),
    newPassword: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character"
      )
      .required(),
    confirmNewPassword: yup
      .string()
      .required()
      .oneOf([yup.ref("newPassword")], "Passwords must match"),
  });
  // ** States
  const [values, setValues] = useState({
    showNewPassword: false,
    showCurrentPassword: false,
    showConfirmNewPassword: false,
  });

  // ** Hooks
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: yupResolver(schema) });

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword });
  };

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword });
  };

  const handleClickShowConfirmNewPassword = () => {
    setValues({
      ...values,
      showConfirmNewPassword: !values.showConfirmNewPassword,
    });
  };

  const onPasswordFormSubmit = () => {
    console.log(cred, "CRED");
    const params = {
      id: userId,
      email: userData.email,
      old_password: cred.currentPassword,
      new_password: cred.confirmPassword,
    };
    axios
      .post(
        new URL("/api/admin/users/change_password", themeConfig.backendUrl),
        params
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          reset();
        }
      });
  };

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Security</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="currentPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange } }) => (
                    <CustomTextField
                      fullWidth
                      onChange={(e) => {
                        const newCurrentPassword =
                          control._formValues.currentPassword !== ""
                            ? e.target.value
                            : cred.currentPassword;
                        setCred({
                          ...cred,
                          currentPassword: newCurrentPassword,
                        });
                        onChange(e);
                      }}
                      onPaste={(e) => e.preventDefault()}
                      label="Current Password"
                      placeholder="············"
                      id="input-current-password"
                      error={Boolean(errors.currentPassword)}
                      type={values.showCurrentPassword ? "text" : "password"}
                      {...(errors.currentPassword && {
                        helperText: errors.currentPassword.message,
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={handleClickShowCurrentPassword}
                            >
                              <Icon
                                fontSize="1.25rem"
                                icon={
                                  values.showCurrentPassword
                                    ? "tabler:eye"
                                    : "tabler:eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Grid container spacing={5} sx={{ mt: 0 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      defaultValue={value}
                      onChange={(e) => {
                        setCred({
                          ...cred,
                          newPassword: e.target.value,
                        });
                        onChange(e);
                      }}
                      label="New Password"
                      id="input-new-password"
                      placeholder="············"
                      error={Boolean(errors.newPassword)}
                      type={values.showNewPassword ? "text" : "password"}
                      {...(errors.newPassword && {
                        helperText: errors.newPassword.message,
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowNewPassword}
                              onMouseDown={(e) => e.preventDefault()}
                            >
                              <Icon
                                fontSize="1.25rem"
                                icon={
                                  values.showNewPassword
                                    ? "tabler:eye"
                                    : "tabler:eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid container spacing={5} sx={{ mt: 0 }}></Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="confirmNewPassword"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      defaultValue={value}
                      onChange={(e) => {
                        setCred({
                          ...cred,
                          confirmPassword: e.target.value,
                        });
                        onChange(e);
                      }}
                      placeholder="············"
                      label="Confirm New Password"
                      id="input-confirm-new-password"
                      error={Boolean(errors.confirmNewPassword)}
                      type={values.showConfirmNewPassword ? "text" : "password"}
                      {...(errors.confirmNewPassword && {
                        helperText: errors.confirmNewPassword.message,
                      })}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={handleClickShowConfirmNewPassword}
                            >
                              <Icon
                                fontSize="1.25rem"
                                icon={
                                  values.showConfirmNewPassword
                                    ? "tabler:eye"
                                    : "tabler:eye-off"
                                }
                              />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                <Grid item xs={12}>
                  <br />
                  <Typography variant="h6">Password Requirements:</Typography>
                  <Box
                    component="ul"
                    sx={{
                      pl: 6,
                      mb: 0,
                      "& li": { mb: 1.5, color: "text.secondary" },
                    }}
                  >
                    <li>Minimum 8 characters long - the more, the better</li>
                    <li>At least one lowercase & one uppercase character</li>
                    <li>
                      At least one number, symbol, or whitespace character
                    </li>
                  </Box>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" type="submit" className="me-75">
                  Update
                </Button>
                <Button
                  sx={{ me: 4 }}
                  type="reset"
                  variant="tonal"
                  outline
                  color="secondary"
                  onClick={() => reset()}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default ChangePassword;
