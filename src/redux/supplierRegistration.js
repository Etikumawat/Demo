// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "supplierRegistration",
  initialState: {
    companyDetails: {
      // "emailID": "sada@gmail.com",
      // "mobile": "bhuj",
      // "telephone": "bhuj",
      // "designation": "bhuj",
      // "contactPersonName": "bhuj",
      // "cinNo": "bhuj",
      // "aadharNo": "421369084205",
      // "officeDetails": "as",
      // "paymentMethod": {
      //     "value": "option2",
      //     "label": "Option 2"
      // },
      // "website": "www.google.com",
      // "phoneNo": "9898528257",
      // "pin": "370485",
      // "city": "bhuj",
      // "country": {
      //     "value": "IN",
      //     "label": "India"
      // },
      // "address3": "one 1address3",
      // "address2": "one address2",
      // "address1": "one address1",
      // "streetNo": "123",
      // "source": {
      //     "value": "4",
      //     "label": "chandani"
      // },
      // "supplier_name": "Aashapura Ltd",
      // "add": {
      //     "value": 0,
      //     "label": "123, one address1, bhuj, Gujarat",
      //     "data": {
      //         "state": "Gujarat",
      //         "street_no": "123",
      //         "address1": "one address1",
      //         "address2": "one address2",
      //         "address3": "one 1address3",
      //         "city": "bhuj",
      //         "pincode": "370485"
      //     }
      // },
      // "state": {
      //     "label": "Gujarat",
      //     "value": "24"
      // }
    },
    businessDetails: {
      // "detailsOfMajorLastYear": "asdasdasd",
      // "listOfMajorCustomers": "zxczc",
      // "nameOfOtherGroupCompanies": "zxczc",
      // "addressOfPlant": "Dahisara",
      // "businessType": {
      //     "value": "13",
      //     "label": "Trader"
      // },
      // "nameOfBusiness": "EPARMAR",
      // "companyType": {
      //     "value": "11",
      //     "label": "Joint-Venture Company"
      // },
      // "promoterName": "zxczxc",
      // "companyFoundYear": "EPARMAR"
    },
    financialDetails: {
      // "financialDetails": {
      //     "value": "option2",
      //     "label": "Option 2"
      // },
      // "Turnover": "asdasd",
      // "Turnover2": "asdasd",
      // "Turnover3": "asdasd",
      // "first": "asdasd",
      // "second": "asdasd",
      // "third": "asdasd",
      // "afterfirst": "asdasd",
      // "aftersecond": "asdasd",
      // "afterthird": "asdasd",
      // "presentorder": "asdasd",
      // "furtherorder": "asdasd",
      // "market": "asdasd",
      // "networth": "asdasd"
    },
    taxDetails: {
      // "gstNo": "24FCWpp8289M1Z7",
      // "gstRegDate": "2023-08-22",
      // "msme": "supplierx.png",
      // "gst": "supplierx.png",
      // "cancelledCheque": "supplierx.png",
      // "panCard": "supplierx.png"
    },
    additionalDetails: {
      // "supplier_name" : "ttt",
      // "supplier_telephone" :"520",
      // "supplier_city":"bhuj",
      // "supplier_state":"hgg",
      // "created_at":"123456789",
      // "supplier_extra_phone_no":"1234567890"
    },
  },
  reducers: {
    handleCompanyDetails: (state, action) => {
      state.companyDetails = action.payload;
    },
    handleBusinessDetails: (state, action) => {
      state.businessDetails = action.payload;
    },
    handleFinancialDetails: (state, action) => {
      state.financialDetails = action.payload;
    },
    handleTaxDetails: (state, action) => {
      state.taxDetails = action.payload;
    },
    handleAdditionalDetails: (state, action) => {
      state.additionalDetails = action.payload;
    },
  },
});

export const {
  handleCompanyDetails,
  handleBusinessDetails,
  handleFinancialDetails,
  handleTaxDetails,
  handleAdditionalDetails,
} = authSlice.actions;

export default authSlice.reducer;
