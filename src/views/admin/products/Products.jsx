// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { toast } from "react-hot-toast";
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
// import themeConfig from "../../../configs/themeConfig";
// import { ChevronDown, Edit, RefreshCw, Trash2 } from "react-feather";
// import Spinner from "../../../@core/components/spinner/Loading-spinner";
// import "@styles/react/libs/tables/react-dataTable-component.scss";
// import Select from "react-select";
// import { selectThemeColors } from "@utils";
// import ReactPaginate from "react-paginate";
// import { Stack } from "@mui/system";
// import { LinearProgress } from "@mui/material";
// // import ImageUpload from "../../../custom/ImageUpload";

// function Products() {
//   const [query, setQuery] = useState({
//     offset: 0,
//     limit: 300,
//     sort: "id",
//     order: "desc",
//     search: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(null);
//   const [unitsOption, setUnitsOption] = useState();
//   const [materialsGroupOption, setMaterialsGroupOption] = useState();
//   const [showAddProductSection, setShowAddProductSection] = useState(false);
//   const [showEditProductSection, setShowEditProductSection] = useState(false);

//   const request = (reset_offset = true) => {
//     setLoading(true);
//     if (reset_offset) {
//       query.offset = 0;
//       setQuery(query);
//     }
//     axios
//       .post(
//         new URL("v1/supplier/materials/list", themeConfig.backendUrl),
//         query
//       )
//       .then((res) => {
//         if (res.data.error) {
//           setLoading(false);
//           return toast.error(res.data.message);
//         }
//         setLoading(false);
//         setTotal(res.data.data.total);
//         setData(res.data.data.rows);
//       })
//       .catch((error) => {
//         setLoading(false);
//         console.log(error);
//         console.log(error.response);
//         toast.error(error.message);
//       });
//   };

//   const fetchDropDownOptions = () => {
//     // fetch all units
//     axios
//       .post(new URL("/api/v1/admin/uom/list", themeConfig.backendUrl), {
//         limit: 200,
//       })
//       .then((res) => {
//         if (res.data.error) {
//           return toast.error(res.data.message);
//         }
//         const unitList = res.data.data.rows.map((item) => ({
//           label: item.name,
//           value: item.unit,
//         }));
//         setUnitsOption(unitList);
//       });

//     // fetch materials group
//     axios
//       .post(
//         new URL("/api/v1/supplier/materialGroup/list", themeConfig.backendUrl),
//         {
//           limit: 200,
//         }
//       )
//       .then((res) => {
//         if (res.data.error) {
//           return toast.error(res.data.message);
//         }
//         const materialsGroupList = res.data.data.rows.map((item) => ({
//           label: item.name,
//           value: item.name,
//         }));
//         setMaterialsGroupOption(materialsGroupList);
//       });
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
//       name: "Description",
//       column: "description",
//       selector: (row) => row.description,
//     },
//     {
//       name: "HSN Code",
//       column: "hsnCode",
//       selector: (row) => row.hsnCode,
//     },
//     {
//       name: "Price",
//       column: "price",
//       selector: (row) => row.price,
//     },
//     {
//       name: "Tax",
//       column: "tax",
//       selector: (row) => row.tax,
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
//               // onClick={() => {
//               //   setEditData(row);
//               //   setShowAddSection(false);
//               //   setShowEditSection(true);
//               // }}
//             />

//             <Trash2
//               style={{ cursor: "pointer", color: "#D2042D" }}
//               // onClick={() => deleteCategory(row)}
//             />
//           </>
//         );
//       },
//     },
//   ];

//   useEffect(() => {
//     request();
//   }, []);

//   const AddProduct = () => {
//     const [formData, setFormData] = useState({
//       name: "",
//       code: "",
//       category: "",
//       tax: "",
//       unit: "",
//       material_group: "",
//       material_type: "",
//       plant: "",
//       price: "",
//       description: "",
//     });

//     const selectHandler = (selectedOption, e) => {
//       console.log(selectedOption);
//       const name = e.name;
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: selectedOption,
//       }));
//     };

//     const changeHandler = (e) => {
//       const { name, value } = e.target;
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     };

//     const onSubmit = () => {
//       console.log("Submit Clicked");
//     };
//     return (
//       <div className="card">
//         <div className="card-body pb-1">
//           <div className="d-flex justify-content-between align-center">
//             <h3 style={{ color: "#E06522" }}>Products</h3>
//             <Button
//               color="primary"
//               size="sm"
//               onClick={() => {
//                 setShowAddProductSection(false);
//                 // setAllFieldsDataDefault();
//               }}
//             >
//               Back
//             </Button>
//           </div>
//           <hr />
//         </div>
//         <Card>
//           <CardHeader style={{ paddingTop: "0rem" }}>
//             <CardTitle tag="h4">Add New Product</CardTitle>
//           </CardHeader>
//           <CardBody>
//             <form onSubmit={onSubmit}>
//               <Row>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="name">
//                     Product Name<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter product name"
//                     id="name"
//                     name="name"
//                     onChange={(e) => changeHandler(e)}
//                     value={formData.name}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="code">
//                     HSN Code<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Enter HSN Code"
//                     id="hsnCode"
//                     name="hsnCode"
//                     onChange={(e) => changeHandler(e)}
//                     value={formData.hsnCode}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="code">
//                     Product Code<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="code"
//                     name="code"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     // value={selectedOption}
//                     // options={purchaseOrder}
//                     // onChange={(e) => {}}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="category">
//                     Category<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="category"
//                     name="category"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     // value={selectedOption}
//                     // options={purchaseOrder}
//                     // onChange={(e) => {}}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="tax">
//                     Unit<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="unit"
//                     name="unit"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     options={unitsOption}
//                     value={formData.unit}
//                     onChange={(selectedOption, e) => {
//                       selectHandler(selectedOption, e);
//                     }}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="material_group">
//                     Material Group<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="material_group"
//                     name="material_group"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     options={materialsGroupOption}
//                     value={formData.material_group}
//                     onChange={(selectedOption, e) => {
//                       selectHandler(selectedOption, e);
//                     }}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="material_type">
//                     Material Type<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="material_type"
//                     name="material_type"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     // value={selectedOption}
//                     // options={purchaseOrder}
//                     // onChange={(e) => {}}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="plant">
//                     Plant<span className="text-danger">*</span>
//                   </label>
//                   <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     isMulti
//                     closeMenuOnSelect={false}
//                     id="plant"
//                     name="plant"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     // value={selectedOption}
//                     // options={purchaseOrder}
//                     // onChange={(e) => {}}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="price">
//                     Price (₹)<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Enter price"
//                     id="price"
//                     name="price"
//                     min="1"
//                     onChange={changeHandler}
//                     value={formData.price}
//                   />
//                 </Col>
//                 <Col className="mb-1" md="3" sm="12">
//                   <label htmlFor="tax">
//                     Tax (%)<span className="text-danger">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     className="form-control"
//                     placeholder="Enter tax"
//                     id="tax"
//                     name="tax"
//                     onChange={(e) => changeHandler(e)}
//                     value={formData.tax}
//                   />
//                   {/* <Select
//                     theme={selectThemeColors}
//                     isClearable={false}
//                     id="tax"
//                     name="tax"
//                     className={`react-select w-100`}
//                     classNamePrefix="select"
//                     // value={selectedOption}
//                     // options={purchaseOrder}
//                     // onChange={(e) => {}}
//                   /> */}
//                 </Col>
//                 <Row>
//                   <Col className="mb-1" md="4" sm="12">
//                     <label htmlFor="description">
//                       Description<span className="text-danger">*</span>
//                     </label>
//                     <textarea
//                       className="form-control"
//                       placeholder="Enter description"
//                       id="description"
//                       name="description"
//                       cols="30"
//                       onChange={changeHandler}
//                       value={formData.description}
//                     ></textarea>
//                   </Col>
//                   {/* <Col className="mb-1" md="3" sm="12">
//                     <label>
//                       Upload Product Image<span className="text-danger">*</span>
//                       <ImageUpload />
//                     </label>
//                   </Col> */}
//                 </Row>
//               </Row>
//               <Button
//                 color="success"
//                 onClick={() => {
//                   onSubmit();
//                   setShowAddProductSection(false);
//                 }}
//                 className="mt-2"
//               >
//                 Add
//               </Button>
//             </form>
//           </CardBody>
//         </Card>
//       </div>
//     );
//   };

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
//       {showAddProductSection && <AddProduct />}
//       {!showAddProductSection && !showAddProductSection && (
//         <div className="card">
//           <div className="card-body">
//             <div className="d-flex justify-content-between align-center">
//               <h3 style={{ color: "#E06522" }}>Products</h3>

//               <Button
//                 color="primary"
//                 size="sm"
//                 onClick={() => {
//                   setShowAddProductSection(true);
//                   fetchDropDownOptions();
//                 }}
//               >
//                 Add Product
//               </Button>
//             </div>
//             <hr />

//             {data !== null ? (
//               <>
//                 <div className="react-dataTable">
//                   <Card>
//                     <DataTable
//                       noHeader
//                       pagination
//                       data={data}
//                       columns={basicColumns}
//                       className="react-dataTable"
//                       sortIcon={<ChevronDown size={10} />}
//                       onSort={handleSort}
//                       paginationComponent={CustomPagination}
//                       paginationDefaultPage={query.offset + 1}
//                       paginationServer
//                     />
//                   </Card>
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
//       )}
//     </div>
//   );
// }

// export default Products;
