// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";

// import Breadcrumbs from "@components/breadcrumbs";
import Tabs from "./Tabs";
import Account from "./Account";
import ChangePassword from "./ChangePassword";
import General from "./General";
import CronJob from "./CronJob";
import EmailConfigurations from "./EmailConfigurations";

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link } from "react-router-dom";

const profile = () => {
  // ** States
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const items = localStorage.getItem("userData");
  const user = JSON.parse(items);

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> Account Settings</span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Fragment>
        <Card>
          <CardBody>
            <Row>
              <Col xs={12} md={3}>
                <div style={{ borderRight: "1px solid #ccc", height: "100%" }}>
                  <Tabs activeTab={activeTab} toggleTab={toggleTab} />
                </div>
              </Col>
              <Col xs={12} md={9}>
                {user.role_name === "Admin" ? (
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Account />
                    </TabPane>
                    <TabPane tabId="2">
                      <ChangePassword />
                    </TabPane>
                    <TabPane tabId="3">
                      <General />
                    </TabPane>
                    <TabPane tabId="4">
                      <EmailConfigurations></EmailConfigurations>
                    </TabPane>
                    <TabPane tabId="5">
                      <CronJob />
                    </TabPane>
                  </TabContent>
                ) : (
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Account />
                    </TabPane>
                    <TabPane tabId="2">
                      <ChangePassword />
                    </TabPane>
                    <TabPane tabId="3">
                      <General />
                    </TabPane>
                  </TabContent>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    </>
  );
};

export default profile;
