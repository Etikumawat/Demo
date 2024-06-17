import { Grid, Typography } from "@mui/material";
import React, { Fragment } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "reactstrap";

function EmailConfigurations() {
  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Email Settings</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <Typography variant="subtitle1" className="mb-3">
            Email Configuration and Settings Overview
          </Typography>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              Email:
            </Label>
            <div className="w-75">
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
              />
              <Typography variant="body2" className="text-muted">
                This is the email address that the contact and report emails
                will be sent to, as well as being the from address in signup and
                notifications emails.
              </Typography>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              Password:
            </Label>
            <div className="w-75">
              <Input
                id="password"
                type="text"
                name="password"
                placeholder="fw52 9asf 1ma9"
              />
              <Typography variant="body2" className="text-muted">
                Password for the above email account.
              </Typography>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              SMTP Host:
            </Label>
            <div className="w-75">
              <Input
                id="smtpHost"
                type="text"
                name="smtpHost"
                placeholder="smtp.gmail.com"
              />
              <Typography variant="body2" className="text-muted">
                This is the host address for your SMTP server, this is only
                needed if you are using SMTP as the Email Send Type.
              </Typography>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              SMTP Port:
            </Label>
            <div className="w-75">
              <Input
                id="smtpPort"
                type="text"
                name="smtpPort"
                placeholder="2525"
              />
              <Typography variant="body2" className="text-muted">
                SMTP Port will be provided your service provider.
              </Typography>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              Email Content Type:
            </Label>
            <div className="w-75">
              <Input
                id="emailContentType"
                type="text"
                name="emailContentType"
                placeholder="HTML"
              />
              <Typography variant="body2" className="text-muted">
                Choose HTML for formatted content with HTML tags or Plain Text
                for unformatted text-only content.
              </Typography>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Label className="fw-bolder d-flex align-items-center gap-2">
              SMTP Encryption:
            </Label>
            <div className="w-75">
              <Input
                id="smptEncryption"
                type="text"
                name="smptEncryption"
                placeholder="SSL"
              />
              <Typography variant="body2" className="text-muted">
                If your e-mail service provider supported secured connection,
                you can choose security method.
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default EmailConfigurations;
