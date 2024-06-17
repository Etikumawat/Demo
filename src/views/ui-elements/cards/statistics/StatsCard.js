// ** Third Party Components
import classnames from "classnames";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";
import {
  TrendingUp,
  User,
  Box,
  DollarSign,
  Truck,
  Check,
  AlertCircle,
  Clock,
  MinusCircle,
  X,
  ArrowUpRight,
} from "react-feather";
// ** Custom Components
import Avatar from "@components/avatar";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
} from "reactstrap";
import { useEffect, useState } from "react";

const StatsCard = ({ cols }) => {
  const [value, setValue] = useState();
  useEffect(() => {
    getAnalytics();
  }, []);
  const getAnalytics = () => {
    axios
      .post(
        new URL("v1/admin/dashboard/supplier-analytics", themeConfig.backendUrl)
      )
      .then((res) => {
        console.log(res.data.data);
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        setValue(res.data.data);
      });
  };
  const data = [
    {
      title: value?.approved,
      subtitle: "Approved",
      color: "light-success",
      icon: <Check size={24} />,
    },
    {
      title: value?.verified,
      subtitle: "Verified",
      color: "light-warning",
      icon: <ArrowUpRight size={24} />,
    },
    {
      title: value?.pending,
      subtitle: "Pending",
      color: "light-info",
      icon: <Clock size={24} />,
    },
    {
      title: value?.queried,
      subtitle: "Queried",
      color: "light-danger",
      icon: <AlertCircle size={24} />,
    },
    {
      title: value?.rejected,
      subtitle: "Rejected",
      color: "light-danger",
      icon: <X size={24} />,
    },
  ];

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1,
          })}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2 mt-1" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">Vendor Statistics</CardTitle>
        {/* <CardText className="card-text font-small-2 me-25 mb-0">
          Updated 1 month ago
        </CardText> */}
      </CardHeader>
      <CardBody className="statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default StatsCard;
