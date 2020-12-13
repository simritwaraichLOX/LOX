import axios from "axios";
import fileDownload from 'js-file-download';

const url = "http://localhost:8080/api/";
export default {
  upload(formData) {
    console.log(formData);
    return axios
      .post(url + "upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((err) =>{
        console.log(err);
      });
  },
  getFiles(req) {
    console.log(req);
    return axios
      .get(url + "file/" + req)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  },
  search(req){
    return axios
      .get(url + "search/" + req)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
  },
  // getAll(req){
  //   return axios
  //   .get(url + "list/" + req)
  //   .then((res) => res.data)
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // },
  // downloadFiles(req){
  //   return axios
  //     .get(url + "download/" + req)
  //     .then((res) => res.data)
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // },
  
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

};
