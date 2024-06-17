import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form,
  Input,
  Label,
  Modal,
  Row,
} from "reactstrap";
import themeConfig from "../../../configs/themeConfig";
import { CircularProgress, LinearProgress, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function migrationCreate() {
  const [formData, setFormData] = useState({
    host: "",
    port: "",
    user: "",
    password: "",
    database: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      hostAddress: formData.host,
      portNo: formData.port,
      databaseName: formData.database,
      userName: formData.user,
      password: formData.password,
    };
    setLoading(true);
    try {
      const response = await axios.post(
        `${themeConfig.backendUrl}v1/configuration/setmigration/createandrun`,
        payload
      );
      const { data } = response;
      if (data.error) {
        toast.error(data.message);
        setLoading(false);
      } else {
        toast.success(data.message);
        setLoading(false);
        setFormData({
          host: "",
          port: "",
          user: "",
          password: "",
          database: "",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Migration </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    <Card>
      <CardHeader>
        <h2>Database Migration</h2>
      </CardHeader>
      <CardBody>
        <Form onSubmit={handleSubmit} id="form">
          <Row className="mb-2">
            <div className="col-md-8">
              <Label>
                Host
                <span className="text-danger"> *</span>
              </Label>
              <Input
                type="text"
                name="host"
                value={formData.host}
                placeholder="localhost"
                required
                onChange={handleChange}
              />
            </div>
          </Row>
          <Row className="mb-3">
            <div className="col-md-4 mb-2">
              <Label>
                Port No.
                <span className="text-danger"> *</span>
              </Label>
              <Input
                type="number"
                name="port"
                value={formData.port}
                placeholder="3306"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-2">
              <Label>
                User
                <span className="text-danger"> *</span>
              </Label>
              <Input
                type="text"
                name="user"
                value={formData.user}
                placeholder="root"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
              <Label>
                Database
                <span className="text-danger"> *</span>
              </Label>
              <Input
                type="text"
                name="database"
                value={formData.database}
                placeholder="myDb"
                required
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                placeholder=""
                onChange={handleChange}
              />
            </div>
          </Row>
          <Button disabled={loading ? true : false} color="primary">
            Run Migration
          </Button>
        </Form>
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
              Migrating ...
            </Stack>
          ) : (
            ""
          )}
        </Modal>
      </CardBody>
    </Card>
    </>
  );
}
