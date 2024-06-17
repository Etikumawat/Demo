import React, { useEffect, useState } from "react";
import { Card, Button } from "reactstrap";
import axios from "axios";
import themeConfig from "../../../../configs/themeConfig";
import toast from "react-hot-toast";
import {
  ArrowBackIosNewSharp,
  ArrowForwardIosOutlined,
  FiberManualRecordRounded,
} from "@mui/icons-material";

const AllNotificationsPage = () => {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const limitOptions = [1, 10, 25, 50, 100];

  const getNotifications = (page = 1, limit = itemsPerPage) => {
    const query = {
      offset: (page - 1) * limit,
      limit: limit,
      sort: "id",
      order: "asc",
      search: "",
    };

    axios
      .post(
        new URL(
          "/api/v1/notification/getNotifications",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
          setData(null);
        } else {
          setData(res.data.data);
          setTotalPages(res.data.total);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setData(null);
      });
  };

  useEffect(() => {
    getNotifications(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const readNotification = (id) => {
    axios
      .put(
        new URL(
          `/api/v1/notification/readNotification/${id}`,
          themeConfig.backendUrl
        )
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          getNotifications(currentPage, itemsPerPage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        setData(null);
      });
  };

  const handleSelect = () => {
    const allIds = data.map((notification) => notification.id);

    axios
      .put(
        new URL(
          `/api/v1/notification/readAllNotification`,
          themeConfig.backendUrl
        ),
        { ids: allIds }
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSelectRead = () => {
    axios
      .put(
        new URL(
          `/api/v1/notification/readAllNotification`,
          themeConfig.backendUrl
        ),
        { ids: selectedIds }
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setSelectedIds([]);
          getNotifications(currentPage, itemsPerPage);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCheckboxAllChange = (event) => {
    if (event.target.checked) {
      const allIds = data.map((notification) => notification.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(id)) {
        return prevSelectedIds.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelectedIds, id];
      }
    });
  };

  return (
    <div>
      <Card className="p-2">
        <div className="d-flex gap-2">
          <h2 style={{ color: "#f26c13" }}>Notifications</h2>
        </div>
        <hr />
        {data && data.length > 0 ? (
          <>
            <div className="d-flex gap-2 mb-3 form-check">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={handleCheckboxAllChange}
                checked={selectedIds.length === data?.length}
              />
              {selectedIds.length > 0 && (
                <Button
                  className="btn-sm"
                  color="success"
                  outline
                  onClick={handleSelectRead}
                >
                  Mark as read
                </Button>
              )}
              <Button className="btn-sm" color="primary" onClick={handleSelect}>
                Mark all as read
              </Button>
            </div>
            {data &&
              data.map((notification, index) => (
                <div key={index}>
                  {notification.read === "0" ? (
                    <>
                      <h4
                        style={{
                          color: "#f26c13",
                          cursor: "pointer",
                        }}
                        className="list-item-body flex-grow-1"
                        onClick={() => readNotification(notification.id)}
                      >
                        <FiberManualRecordRounded
                          style={{ height: "14px", width: "14px" }}
                        />
                        {notification.heading}
                      </h4>

                      <p className="notification-text">
                        {notification.message}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4
                        style={{
                          color: "grey",
                        }}
                        className="list-item-body flex-grow-1"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={() => handleCheckboxChange(notification.id)}
                          style={{ marginRight: "10px" }}
                          checked={selectedIds.includes(notification.id)}
                        />
                        {notification.heading}
                      </h4>
                      <p className="notification-text">
                        {notification.message}
                      </p>
                    </>
                  )}

                  <hr />
                </div>
              ))}
            <div className="d-flex justify-content-between">
              <div className="d-flex justify-content-between gap-2">
                <div>
                  <select
                    className="form-select form-select-sm"
                    onChange={handleLimitChange}
                    value={itemsPerPage}
                  >
                    {limitOptions.map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>Total: {totalPages}</div>
              </div>

              <div style={{ textAlign: "end" }} className="pagination-controls">
                <Button
                  className="btn-sm"
                  style={{ borderRadius: "50px", height: "40px" }}
                  color="primary"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ArrowBackIosNewSharp
                    style={{ width: "15px", height: "15px" }}
                  />
                </Button>
                <span>{` Page ${currentPage} of ${totalPages} `}</span>
                <Button
                  style={{ borderRadius: "50px", height: "40px" }}
                  className="btn-sm"
                  color="primary"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ArrowForwardIosOutlined
                    style={{ width: "15px", height: "15px" }}
                  />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">No notifications</div>
        )}
      </Card>
    </div>
  );
};

export default AllNotificationsPage;
