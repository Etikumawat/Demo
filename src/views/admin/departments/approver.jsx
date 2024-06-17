import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "reactstrap";
import ReactPaginate from "react-paginate";
import axios from "axios";
import themeConfig from "../../../configs/themeConfig";
import { toast } from "react-hot-toast";
import Spinner from "../../../@core/components/spinner/Loading-spinner";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "@styles/base/plugins/extensions/ext-component-sweet-alerts.scss";
import { RefreshCw, ChevronDown, Edit, Trash2 } from "react-feather";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";

const MySwal = withReactContent(Swal);

const Approver = () => {
  const params = useParams();

  let userData = localStorage.getItem("userData");
  const userdata = JSON.parse(userData);
  const hierarchyLevel = userdata.hierarchy_level;
  const [addModal, setAddModal] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [hierarchyData, setHierarchyData] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [id, setId] = useState();
  const [data, setData] = useState(null);
  const [total, setTotal] = useState(null);
  const [query, setQuery] = useState({
    offset: "0",
    limit: "25",
    order: "desc",
    sort: "id",
    search: "",
    status: "",
  });

  const request = () => {
    axios
      .post(
        new URL(
          "/api/v1/supplier/approver/list",
          themeConfig.backendUrl
          // query
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        } else {
          setTotal(res.data.data.total);
          setData(res.data.data.rows);
        }
      });
  };

  const getPortalCode = (d) => {
    axios
      .post(
        new URL(
          `/api/v1/admin/departmentPortalCode/filter/` + d,
          themeConfig.backendUrl
        )
      )
      .then((response) => {
        console.log(response.data);
        setPortalCodeOption(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const getHierarchyData = () => {
    axios
      .post(
        new URL(
          "/api/v1/workFlow/approvalHierarchy/list",
          themeConfig.backendUrl
        ),
        query
      )
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.message);
        }
        setHierarchyData(res.data.data.rows[0].approval_level_name);
      });
  };

  const deleteCategory = (row) => {
    MySwal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-danger ms-1",
      },

      buttonsStyling: false,
    }).then(function (result) {
      if (result.value) {
        axios
          .delete(
            new URL(
              `/api/v1/supplier/approver/delete/${row.id}`,
              themeConfig.backendUrl
            )
          )
          .then((response) => {
            if (response.data.error) {
              return toast.error(response.data.message);
            }
            else {
              toast.success(response.data.message)
              request();
            }
          });
      }
    });
  };

  const [users, setUsers] = useState([]);
  const [depttGroup, setDepttGroup] = useState([]);
  const [portalCodeOption, setPortalCodeOption] = useState([]);
  const [selectedValues, setSelectedValues] = useState({});
  const [selectedgroup, setSelectedgroup] = useState("");
  const [selectedPortalCode, setSelectedPortalCode] = useState("");
  const [form, setForm] = useState({});
  const handleSelectChange = (e, level) => {
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [level]: {
        value: e.value,
        label: e.label,
      },
    }));
    const updatedUsers = users.filter((user) => user.id !== e.value);
    setUsers(updatedUsers);
    const key = `level_${level}_user_id`;
    setForm({ ...form, [key]: [e.value] });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        new URL("/api/v1/supplier/approver/create", themeConfig.backendUrl),
        {
          ...form,
          department_id: selectedgroup.value,
          approval_hierarchy_id: 2,
        }
      )
      .then((res) => {
        if (res.data.error) {
          return toast.error(res.data.message);
        }
        request();
        setAddModal(false);
        setShowCreate(false);
        return toast.success(res.data.message);
      });
  };

  useEffect(() => {
    request();
    // getPortalCode();
    getHierarchyData();
    axios
      .post(new URL("/api/v1/admin/department/list", themeConfig.backendUrl))
      .then((response) => {
        setDepttGroup(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    axios
      .post(new URL("/api/admin/users/list", themeConfig.backendUrl))
      .then((response) => {
        setUsers(response.data.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // const AddModal = () => {

  //   const onSubmit = (e) => {
  //     e.preventDefault();

  //     axios
  //       .post(
  //         new URL(
  //           "/api/v1/configuration/approvers/create",
  //           themeConfig.backendUrl
  //         ),
  //         {
  //           ...form,
  //           department_id: selectedgroup.value,
  //         }
  //       )
  //       .then((res) => {
  //         if (res.data.error) {
  //           return toast.error(res.data.message);
  //         }
  //         request();
  //         setAddModal(false);
  //         return toast.success(res.data.message);
  //       });
  //   };

  //   return (
  //     <div className="vertically-centered-modal ">
  //       <Modal
  //         isOpen={addModal}
  //         toggle={() => setAddModal(!addModal)}
  //         className="modal-dialog-centered"
  //       >
  //         <ModalHeader toggle={() => setAddModal(!addModal)}>
  //           Create
  //         </ModalHeader>
  //         <Form onSubmit={onSubmit} id="form">
  //           <ModalBody>
  //             <div className="row">
  //               <div className="col-md-12 me-1 mt-1">
  //                 <div className="form-group">
  //                   <label>
  //                     Department Name<span className="text-danger"> *</span>
  //                   </label>
  //                   <Select
  //                     theme={selectThemeColors}
  //                     isClearable={false}
  //                     id={`DepartmentOfCompany`}
  //                     className={`react-select`}
  //                     classNamePrefix="select"
  //                     option={depttGroup[2]}
  //                     value={selectedgroup}
  //                     options={depttGroup
  //                       .filter((option) => option.status === "1")
  //                       .map((option) => ({
  //                         label: option.name,
  //                         value: option.id,
  //                       }))}
  //                     onChange={(e) => setSelectedgroup(e).toString()}
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="row">
  //               {hierarchyData.map((item) => (
  //                 <div key={item.level} className="col-md-6 mt-1">
  //                   <div className="form-group">
  //                     <label>
  //                       {item.name}
  //                       <span className="text-danger"> *</span>
  //                     </label>
  //                     <Select
  //                       theme={selectThemeColors}
  //                       isClearable={false}
  //                       id={`HierarchyLevel${item.level}`}
  //                       className="react-select"
  //                       classNamePrefix="select"
  //                       option={users}
  //                       value={selectedValues[item.level] || null}
  //                       options={users.map((option) => ({
  //                         label: option.username,
  //                         value: option.id,
  //                       }))}
  //                       onChange={(e) => handleSelectChange(e, item.level)}
  //                     />
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           </ModalBody>
  //           <ModalFooter>
  //             <Button color="primary" type="submit">
  //               Create
  //             </Button>
  //           </ModalFooter>
  //         </Form>
  //       </Modal>
  //     </div>
  //   );
  // };

  const EditModal = () => {
    const [selectedUpdatedValues, setSelectedUpdatedValues] = useState({});
    const [updatedForm, setUpdatedForm] = useState({});
    const handleSelectChange = (e, level) => {
      setSelectedUpdatedValues((prevSelectedValues) => ({
        ...prevSelectedValues,
        [level]: {
          value: e.value,
          label: e.label,
        },
      }));
      const key = `level_${level}_user_id`;
      setUpdatedForm({ ...updatedForm, [key]: [e.value] });
    };
    const [selectedgroup, setSelectedgroup] = useState({
      label: editData.department_name,
      value: editData.department_id,
    });
    const [selectedOption, setSelectedOption] = useState(
      Array.isArray(editData.approver_1_user_id)
        ? editData.approver_1_user_id.map((id) => {
            const user = users.find((user) => user.id === id);
            return user ? { label: user.username, value: id } : null;
          })
        : []
    );

    const [selectedUser, setSelectedUser] = useState(
      Array.isArray(editData.approver_2_user_id)
        ? editData.approver_2_user_id.map((id) => {
            const user = users.find((user) => user.id === id);
            return user ? { label: user.username, value: id } : null;
          })
        : []
    );
    const onSubmitEdit = (e) => {
      e.preventDefault();
      axios
        .put(
          new URL(
            "/api/v1/configuration/approvers/update",
            themeConfig.backendUrl
          ),
          {
            ...updatedForm,
            id: id,
            department_id: selectedgroup?.value?.toString() || "",
            // approver_1_user_id: Array.isArray(selectedOption)
            //   ? selectedOption.map((option) => option?.value || null)
            //   : [],
            // approver_2_user_id: Array.isArray(selectedUser)
            //   ? selectedUser.map((option) => option?.value || null)
            //   : [],
          }
        )
        .then((res) => {
          if (res.data.error) {
            return toast.error(res.data.message);
          }

          request();
          setEditModal(false);
          return toast.success(res.data.message);
        });
    };

    return (
      <div className="vertically-centered-modal">
        <Modal
          isOpen={editModal}
          toggle={() => setEditModal(!editModal)}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setEditModal(!editModal)}>
            Edit
          </ModalHeader>
          <Form onSubmit={onSubmitEdit} id="form">
            <ModalBody>
              <div className="row">
                <div className="col-md-9 me-1 mt-1">
                  <div className="form-group">
                    <label>
                      Department Group Name
                      <span className="text-danger"> *</span>
                    </label>
                    <Select
                      theme={selectThemeColors}
                      isClearable={false}
                      id={`DepartmentOfCompany`}
                      className={`react-select`}
                      classNamePrefix="select"
                      isDisabled
                      option={depttGroup}
                      value={selectedgroup}
                      options={depttGroup
                        .filter((option) => option.status === "1")
                        .map((option) => ({
                          label: option.name,
                          value: option.id,
                        }))}
                      onChange={(e) => setSelectedgroup(e).toString()}
                    />
                  </div>
                </div>
                <div className="row">
                  {hierarchyData.map((item) => (
                    <div key={item.level} className="col-md-6 mt-1">
                      <div className="form-group">
                        <label>
                          {item.name}
                          <span className="text-danger"> *</span>
                        </label>
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`HierarchyLevel${item.level}`}
                          className="react-select"
                          classNamePrefix="select"
                          option={users}
                          value={selectedUpdatedValues[item.level] || null}
                          options={users.map((option) => ({
                            label: option.username,
                            value: option.id,
                          }))}
                          onChange={(e) => handleSelectChange(e, item.level)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Update
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  };

  const basicColumns = [
    {
      name: "No.",
      maxWidth: "50px",
      column: "sr",
      selector: (row) => row.sr,
    },
    {
      name: "Department Name",
      maxWidth: "300px",
      column: "department_name",
      selector: (row) => row.department_name,
    },
    {
      name: "Portal Code",
      maxWidth: "300px",
      column: "portal_code",
      selector: (row) => row.portal_code,
    },
    {
      name: "Approver Name",
      column: "approvers",
      maxWidth: "300px",
      style: {
        minHeight: "80px", // Set the maximum height here
      },
      cell: (row) => {
        if (
          Array.isArray(row.level_1_usernames) &&
          row.level_1_usernames.length > 0
        ) {
          const capitalizeFirstLetter = (str) => {
            return str?.charAt(0)?.toUpperCase() + str?.slice(1);
          };
          const level1FormattedNames = row.level_1_usernames?.join(", ");
          const level2FormattedNames =
            capitalizeFirstLetter(row.level_2_name) +
            " - " +
            row.level_2_usernames?.join(", ");
          const level3FormattedNames =
            capitalizeFirstLetter(row.level_3_name) +
            " - " +
            row.level_3_usernames?.join(", ");
          const level4FormattedNames =
            capitalizeFirstLetter(row.level_4_name) +
            " - " +
            row.level_4_usernames?.join(", ");
          return (
            <div>
              <span>{level1FormattedNames}</span>
              <br />
              {/* <span>{level2FormattedNames}</span>
              <br /> */}
              {/* <span>{level3FormattedNames}</span>
              <br />
              <span>{level4FormattedNames}</span> */}
            </div>
          );
        } else {
          return <span className="text-danger">No Verifiers</span>;
        }
      },
    },
    // {
    //   name: "Approver Name ",
    //   column: "approver_2_user_names",
    //   cell: (row) => {
    //     if (
    //       Array.isArray(row.approver_2_user_names) &&
    //       row.approver_1_user_names.length > 0
    //     ) {
    //       const formattedNames = row.approver_2_user_names.join(", ");
    //       return <span>{formattedNames}</span>;
    //     } else {
    //       return <span className="text-danger">No Approvers</span>;
    //     }
    //   },
    // },
    {
      name: "Action",
      column: "status",
      maxWidth: "150px",
      selector: (row) => row.status,
      cell: (row) => {
        return (
          <>
            <Edit
              className="me-1"
              style={{ cursor: "pointer", color: "#7367f0" }}
              onClick={() => {
                setEditData(row);
                setId(row.id), setEditModal(true);
              }}
            />

            <Trash2
              className="text-danger"
              onClick={() => deleteCategory(row)}
            />
          </>
        );
      },
    },
  ];

  const handlePagination = (page) => {
    query.offset = page.selected * query.limit;
    setQuery(query);
    request(false);
  };

  const CustomPagination = () => {
    const limit = [1, 10, 25, 50, 100];
    const updateLimit = (e) => {
      query.limit = parseInt(e.target.value);
      setQuery({ ...query });
      request();
    };

    return (
      <div className="mt-2">
        <div className="container position-absolute">
          <div className="row">
            <div className="col-sm-1">
              <select
                className="form-select form-select-sm"
                onChange={updateLimit}
                value={query.limit}
              >
                {limit.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-1">Total: {total}</div>
          </div>
        </div>

        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={Math.floor(query.offset / query.limit)}
          onPageChange={(page) => handlePagination(page)}
          pageCount={Math.ceil(total / query.limit)}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName="active"
          pageClassName="page-item"
          breakClassName="page-item"
          nextLinkClassName="page-link"
          pageLinkClassName="page-link"
          breakLinkClassName="page-link"
          previousLinkClassName="page-link"
          nextClassName="page-item next-item"
          previousClassName="page-item prev-item"
          containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
        />
      </div>
    );
  };

  const handleSort = (column, sortDirection) => {
    if (column.column) {
      query.order = sortDirection;
      query.sort = column.column;
      setQuery(query);
      request();
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
            <span> Department Approver </span>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="card">
        {/* <AddModal /> */}
        <div className="card-body">
          <div className="d-flex justify-content-between align-center">
            <h4>Department Approver</h4>
            <Button
              color="primary"
              size="sm"
              onClick={() => {
                setAddModal(!addModal), setShowCreate(true);
              }}
            >
              Create
            </Button>
          </div>
          <hr />

          {data !== null ? (
            <>
              <EditModal />
              {showCreate ? (
                <Form onSubmit={onSubmit} id="form">
                  <div className="row">
                    <div className="col-md-6 me-1 mt-1">
                      <div className="form-group">
                        <label>
                          Department Name<span className="text-danger"> *</span>
                        </label>
                        <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`DepartmentOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          option={depttGroup[2]}
                          value={selectedgroup}
                          options={depttGroup
                            .filter((option) => option.status === "1")
                            .map((option) => ({
                              label: option.name,
                              value: option.id,
                            }))}
                          onChange={(e) => {
                            setSelectedgroup(e)?.toString(); // Update the selected group
                            getPortalCode(e.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Map through the hierarchyData and create select inputs */}
                  <div className="row">
                    {hierarchyData.map((item) => (
                      <div key={item.level} className="col-md-6 mt-1">
                        <div className="form-group">
                          <label>
                            {item.name}
                            <span className="text-danger"> *</span>
                          </label>
                          <Select
                            theme={selectThemeColors}
                            isClearable={false}
                            id={`HierarchyLevel${item.level}`}
                            className="react-select"
                            classNamePrefix="select"
                            option={users}
                            value={selectedValues[item.level] || null}
                            options={users.map((option) => ({
                              label: option.username,
                              value: option.id,
                            }))}
                            onChange={(e) => handleSelectChange(e, item.level)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-6 me-1 mt-1">
                    <div className="form-group">
                      <label>
                        Portal Code<span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        name="portal_code"
                        value={form.portal_code}
                        onChange={(e) => {
                          setForm({ ...form, portal_code: e.target.value });
                        }}
                        className="form-control"
                        placeholder="---"
                      />
                      {/* <Select
                          theme={selectThemeColors}
                          isClearable={false}
                          id={`DepartmentOfCompany`}
                          className={`react-select`}
                          classNamePrefix="select"
                          // option={depttGroup[2]}
                          value={selectedPortalCode}
                          options={portalCodeOption?.map((option) => ({
                            label: option.name,
                            value: option.name,
                          }))}
                          onChange={(e) => setSelectedPortalCode(e).toString()}
                        /> */}
                    </div>
                  </div>
                  <Button className="mt-1 mb-3" color="primary" type="submit">
                    Create
                  </Button>
                </Form>
              ) : (
                ""
              )}

              <div className="react-dataTable">
                <DataTable
                  noHeader
                  pagination
                  data={data}
                  // selectableRows
                  columns={basicColumns}
                  className="react-dataTable"
                  sortIcon={<ChevronDown size={10} />}
                  onSort={handleSort}
                  // selectableRowsComponent={BootstrapCheckbox}
                  paginationComponent={CustomPagination}
                  paginationDefaultPage={query.offset + 1}
                  paginationServer
                />
              </div>
            </>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ minHeight: "400px" }}
            >
              <Spinner />
              {/* <h4>No Records Found</h4> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Approver;
