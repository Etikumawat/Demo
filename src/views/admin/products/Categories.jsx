// import { LinearProgress } from "@mui/material";
// import Stack from "@mui/material/Stack";
// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { ChevronDown, Edit, RefreshCw, Trash2 } from "react-feather";
// import {
//   Badge,
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Col,
//   Row,
// } from "reactstrap";
// import { toast } from "react-hot-toast";
// import Spinner from "../../../@core/components/spinner/Loading-spinner";
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// import ReactPaginate from "react-paginate";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import axios from "axios";
// import themeConfig from "../../../configs/themeConfig";
// const MySwal = withReactContent(Swal);


// function Categories() {
//   const [showAddSection, setShowAddSection] = useState(false);
//   const [showEditSection, setShowEditSection] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [total, setTotal] = useState(null);
//   const [data, setData] = useState(null);
//   const [editData, setEditData] = useState({});

//   const [query, setQuery] = useState({
//     offset: 0,
//     limit: 300,
//     sort: "createdAt",
//     order: "desc",
//     search: "",
//   });

//   const request = (reset_offset = true) => {
//     setLoading(true);
//     if (reset_offset) {
//       query.offset = 0;
//       setQuery(query);
//     }

//     axios
//       .post(
//         new URL(
//           "/api/v1/supplier/materialCategory/list",
//           themeConfig.backendUrl
//         ),
//         query
//       )
//       .then((res) => {
//         if (res.data.error) {
//           setLoading(false);
//           toast.error(res.data.message);
//         }
//         setLoading(false);
//         setTotal(res.data.data.total);
//         setData(res.data.data.rows);
//       });
//   };

//   const deleteCategory = (row) => {
//     MySwal.fire({
//       title: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       customClass: {
//         confirmButton: "btn btn-primary",
//         cancelButton: "btn btn-danger ms-1",
//       },

//       buttonsStyling: false,
//     }).then(function (result) {
//       if (result.value) {
//         axios
//           .delete(
//             new URL(
//               `/api/v1/supplier/materialCategory/delete/${row.id}`,
//               themeConfig.backendUrl
//             )
//           )
//           .then((response) => {
//             if (response.data.error) {
//               return toast.error(response.data.message);
//             } else {
//               toast.success(response.data.message);
//               request();
//             }
//           });
//       }
//     });
//   };

//   useEffect(() => {
//     request();
//   }, []);

//   const AddCategory = () => {
//     const [form, setForm] = useState({
//       name: "",
//     });

//     const onSubmit = (e) => {
//       e.preventDefault();
//       setShowAddSection(false);
//       axios
//         .post(
//           new URL(
//             "/api/v1/supplier/materialCategory/create",
//             themeConfig.backendUrl
//           ),
//           {
//             ...form,
//           }
//         )
//         .then((res) => {
//           if (res.data.error) {
//             return toast.error(res.data.message);
//           }
//           request();
//           setShowAddSection(false);
//           return toast.success(res.data.message);
//         });
//     };
//     return (
//       <div className="card">
//         <div className="card-body pb-1">
//           <div className="d-flex justify-content-between align-center">
//             <h3 style={{ color: "#E06522" }}>Categories</h3>
//             <Button
//               onClick={() => setShowAddSection(false)}
//               color="primary"
//               size="sm"
//             >
//               Back
//             </Button>
//           </div>
//           <hr />
//         </div>
//         <Card>
//           <CardHeader style={{ paddingTop: "0rem" }}>
//             <CardTitle tag="h4">Add Category</CardTitle>
//           </CardHeader>
//           <CardBody>
//             <form onSubmit={onSubmit}>
//               <Row>
//                 <Col className="mt-1  mb-1" md="4" sm="12">
//                   <label className="pb-0 mb-1">
//                     Category Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter category name"
//                     name="key"
//                     value={form.name}
//                     onChange={(e) => {
//                       setForm({ ...form, name: e.target.value });
//                     }}
//                     required
//                   />
//                 </Col>
//               </Row>
//               <Button color="success" type="submit" className="mt-2">
//                 Create
//               </Button>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   };

//   const EditCategory = () => {
//     const [form, setForm] = useState({
//       id: String(editData.id),
//       name: editData.name,
//     });

//     const onSubmitEdit = (e) => {
//       setShowEditSection(false);
//       e.preventDefault();
//       axios
//         .put(
//           new URL(
//             "/api/v1/supplier/materialCategory/update",
//             themeConfig.backendUrl
//           ),
//           {
//             ...form,
//           }
//         )
//         .then((res) => {
//           if (res.data.error) {
//             return toast.error(res.data.message);
//           }
//           request();
//           setShowAddSection(false);
//           return toast.success(res.data.message);
//         });
//     };
//     return (
//       <div className="card">
//         <div className="card-body pb-1">
//           <div className="d-flex justify-content-between align-center">
//             <h3 style={{ color: "#E06522" }}>Categories</h3>
//             <Button
//               onClick={() => setShowEditSection(false)}
//               color="primary"
//               size="sm"
//             >
//               Back
//             </Button>
//           </div>
//           <hr />
//         </div>
//         <Card>
//           <CardHeader style={{ paddingTop: "0rem" }}>
//             <CardTitle tag="h4">Edit Category</CardTitle>
//           </CardHeader>
//           <CardBody>
//             <form onSubmit={onSubmitEdit}>
//               <Row>
//                 <Col className="mt-1  mb-1" md="4" sm="12">
//                   <label className="pb-0 mb-1">
//                     Category Name <span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter category name"
//                     name="key"
//                     value={form.name}
//                     onChange={(e) => {
//                       setForm({ ...form, name: e.target.value });
//                     }}
//                     required
//                   />
//                 </Col>
//               </Row>
//               <Button color="success" type="submit" className="mt-2">
//                 Update
//               </Button>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   };

//   const basicColumns = [
//     {
//       name: "No.",
//       maxWidth: "100px",
//       column: "id",
//       sortable: true,
//       selector: (row) => row.sr,
//     },
//     {
//       name: "Name",
//       column: "name",
//       selector: (row) => row.name,
//     },

//     {
//       name: "Status",
//       maxWidth: "150px",
//       column: "status",
//       selector: (row) => row.status,
//       cell: (row) => {
//         if (row.status == 1) {
//           return <Badge color="success">Active</Badge>;
//         } else {
//           return <Badge color="danger">Deactive</Badge>;
//         }
//       },
//     },
//     {
//       name: "Action",
//       maxWidth: "150px",
//       column: "status",
//       selector: (row) => row.status,
//       cell: (row) => {
//         return (
//           <>
//             <Edit
//               className="me-1"
//               style={{ cursor: "pointer", color: "#7367f0" }}
//               onClick={() => {
//                 setEditData(row);
//                 setShowAddSection(false);
//                 setShowEditSection(true);
//               }}
//             />

//             <Trash2
//               style={{ cursor: "pointer", color: "#D2042D" }}
//               onClick={() => deleteCategory(row)}
//             />
//           </>
//         );
//       },
//     },
//   ];

//   const handlePagination = (page) => {
//     query.offset = page.selected * query.limit;
//     setQuery(query);
//     request(false);
//   };

//   const CustomPagination = () => {
//     const limit = [1, 10, 25, 50, 100];
//     const updateLimit = (e) => {
//       query.limit = parseInt(e.target.value);
//       setQuery({ ...query });
//       request();
//     };

//     return (
//       <div className="mt-2">
//         <div className="container position-absolute">
//           <div className="row">
//             <div className="col-sm-1">
//               <select
//                 className="form-select form-select-sm"
//                 onChange={updateLimit}
//                 value={query.limit}
//               >
//                 {limit.map((value) => (
//                   <option value={value} key={value}>
//                     {value}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="col-sm-1">Total: {total}</div>
//           </div>
//         </div>

//         <ReactPaginate
//           previousLabel={""}
//           nextLabel={""}
//           forcePage={Math.floor(query.offset / query.limit)}
//           onPageChange={(page) => handlePagination(page)}
//           pageCount={Math.ceil(total / query.limit)}
//           breakLabel={"..."}
//           pageRangeDisplayed={2}
//           marginPagesDisplayed={2}
//           activeClassName="active"
//           pageClassName="page-item"
//           breakClassName="page-item"
//           nextLinkClassName="page-link"
//           pageLinkClassName="page-link"
//           breakLinkClassName="page-link"
//           previousLinkClassName="page-link"
//           nextClassName="page-item next-item"
//           previousClassName="page-item prev-item"
//           containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1"
//         />
//       </div>
//     );
//   };

//   const handleSort = (column, sortDirection) => {
//     if (column.column) {
//       query.order = sortDirection;
//       query.sort = column.column;
//       setQuery(query);
//       request();
//     }
//   };

//   return (
//     <div>
//       {showAddSection && <AddCategory />}

//       {showEditSection && <EditCategory />}

//       {!showAddSection &&
//         (!showEditSection && (
//         <div className="card">
//           <div className="card-body">
//             <div className="d-flex justify-content-between align-center">
//               <h3 style={{ color: "#E06522" }}>Categories</h3>
//               <Button
//                 color="primary"
//                 size="sm"
//                 onClick={() => {
//                   // setEditModal(false);
//                   setShowAddSection(true);
//                 }}
//               >
//                 Create
//               </Button>
//             </div>
//             <hr />

//             {data !== null ? (
//               <>
//                 {loading ? (
//                   <Stack sx={{ width: "100%", color: "#e06522" }} spacing={2}>
//                     <LinearProgress className="mb-1" color="inherit" />
//                   </Stack>
//                 ) : (
//                   ""
//                 )}
//                 {/* <EditModal /> */}
//                 <div className="d-flex justify-content-between mb-1">
//                   <div></div>
//                   <div className="row">
//                     <div className="col-md">
//                       <div className="form-group">
//                         <label>Status</label>
//                         <select
//                           className="form-select"
//                           onChange={(e) => {
//                             query.status = e.target.value;
//                             setQuery(query);
//                             request();
//                           }}
//                         >
//                           <option value=""> All </option>
//                           <option value="1"> Active </option>
//                           <option value="0"> Deactive </option>
//                         </select>
//                       </div>
//                     </div>
//                     <div className="col-md">
//                       <div className="form-group">
//                         <label>&nbsp;</label>
//                         <input
//                           type="text"
//                           name=""
//                           className="form-control mr-2"
//                           id=""
//                           placeholder="Search"
//                           onChange={(e) => {
//                             query.search = e.target.value;
//                             setQuery(query);
//                             request();
//                           }}
//                         />
//                       </div>
//                     </div>

//                     <div className="col-md-2">
//                       <div className="form-group">
//                         <label>&nbsp;</label>
//                         <button
//                           className="btn btn-primary btn-sm form-control"
//                           onClick={request}
//                         >
//                           <RefreshCw size={15} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="react-dataTable">
//                   <DataTable
//                     noHeader
//                     pagination
//                     data={data}
//                     columns={basicColumns}
//                     className="react-dataTable"
//                     sortIcon={<ChevronDown size={10} />}
//                     onSort={handleSort}
//                     paginationComponent={CustomPagination}
//                     paginationDefaultPage={query.offset + 1}
//                     paginationServer
//                   />
//                 </div>
//               </>
//             ) : (
//               <div
//                 className="d-flex align-items-center justify-content-center"
//                 style={{ minHeight: "400px" }}
//               >
//                 <Spinner />
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Categories;
