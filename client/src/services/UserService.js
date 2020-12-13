import axios from "axios";
import fileDownload from "js-file-download";

const url = `http://localhost:8080/api/`;

export default {
  download(req) {
    console.log(req);
    return axios
      .post(
        url + "download/",
        {
          id: req.id,
          storage_name: req.storage_name,
        },
        {
          responseType: "blob",
        }
      )
      .then((res) => {
        fileDownload(res.data, req.file_name);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  upload(formData) {
    console.log(formData);
    return axios
      .post(url + "upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  getFiles(req) {
    return axios
      .get(url + "file/" + req)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  },
  getAllKeywords() {
    return axios
      .get(url + "keywords/")
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  filterByKeywords(id, keywords) {
    return axios
      .post(url + "filterbykeywords/" + id, keywords)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  // search(req) {
  //   console.log(req);
  //   return axios
  //     .post(url + "search/", req)
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // },
};
