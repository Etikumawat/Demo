import { rtlifyKeyframe } from "postcss-rtl/lib/keyframes";
import themeConfig from "../configs/themeConfig";
import axios from "axios";

const handleFileUpload = async (file, objectKey) => {
  return new Promise(async (resolve, reject) => {
    if (file) {
      try {
        const name = `${Date.now()}-${file.name}`;
        const signedUrlResponse = await axios.post(
          `${themeConfig.backendUrl}get-url`,
          {
            fileName: name,
            fileType: file.type,
          }
        );
        if (signedUrlResponse.data.error) {
          return signedUrlResponse.data;
        }
        const { url } = signedUrlResponse.data.data;
        const awsResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        if (objectKey) {
          resolve({
            [objectKey]: name,
          });
        } else {
          resolve(name);
        }
      } catch (error) {
        reject(error);
      }
    }
  });
};

const conditionalValidation = (object, condition) => {
  return condition === true
    ? object.required()
    : object.optional().nullable(true);
};

// const getPlants = async () => {
//     axios.post(new URL("/api/v1/admin/plants/list", themeConfig.backendUrl)).then((res) => {
//       if (res) {
//         try {
//           if (res.data.data.rows) {
//               const data = res.data.data.rows
//               return data
//           }
//         }
//         catch (error) {
//           console.log(error);
//         }
//       }
//     })
// }

async function fetchPlants() {
  const { data } = await axios.post(
    new URL("/api/v1/admin/plants/list", themeConfig.backendUrl)
  );
  return data;
}

export default {
  handleFileUpload,
  conditionalValidation,
  // getPlants,
  fetchPlants,
};
