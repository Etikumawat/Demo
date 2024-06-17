// ** Reducers Imports
import navbar from "./navbar";
import layout from "./layout";
import auth from "./authentication";
import supplierRegistration from "./supplierRegistration";
import additionalSlice from "./additionalSlice";
import attachedFiles from "./attachedFiles";
const rootReducer = {
  auth,
  navbar,
  layout,
  supplierRegistration,
  additionalSlice,
  attachedFiles,
};

export default rootReducer;
