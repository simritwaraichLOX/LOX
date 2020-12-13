import axios from "axios";

const url = `http://localhost:8080/api/admin/`;
export default {
  getAllUsers() {
    return axios
      .get(url + "users/")
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  getAllFiles() {
    return axios
      .get(url + "files/")
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  createUser(credentials) {
    return axios
      .post(url + "users/", credentials)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  updateUser(credentials) {
    return axios
      .post(url + "update_users/", credentials)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  createKeyword(credentials) {
    return axios
      .post(url + "keywords/", credentials)
      .then((response) => response.data)
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
};
