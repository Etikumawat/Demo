import { useState, useEffect } from "react";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import User from "../../../../src/assets/images/user.png";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";

const ActivityLogs = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const request = () => {
    setLoading(true);
    axios

      .post(
        new URL(`/api/v1/admin/emailLogs/view/` + id, themeConfig.backendUrl)
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setLoading(false);
        setData(res.data.data);
      });
  };

  useEffect(() => {
    request();
  }, []);

  return (
    <>
      <div className="justify-content-start pb-2 d-flex breadcrumb-wrapper">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/"> Home </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/admin/maillogs"> Mail log </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span> View </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="card p-4">
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "400px" }}
          >
            <Spinner />
          </div>
        ) : (
          <>
            <p>
              <img src={User} alt="" height={30} width={30} />
              <span
                style={{
                  color: "#333",
                  fontWeight: "500",
                  paddingLeft: "10px",
                }}
              >
                <a href={`mailto:${data?.toemail}`}>{data?.fromemail}</a>
              </span>{" "}
            </p>
            <p>
              To :{" "}
              <span style={{ color: "#333", fontWeight: "500" }}>
                {data?.toemail}
              </span>
            </p>
            <p>
              Subject :{" "}
              <span style={{ color: "#333", fontWeight: "500" }}>
                {data?.subject}
              </span>
            </p>
            <p>
              <span dangerouslySetInnerHTML={{ __html: data?.body }} />
            </p>
          </>
        )}
      </div>
    </>
  );
};

export default ActivityLogs;
