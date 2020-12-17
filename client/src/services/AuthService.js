import axios from "axios";
const url = `http://ec2-3-96-168-166.ca-central-1.compute.amazonaws.com:8080/api/`;
export default {
  login(credentials) {
    return axios
      .post(url + "login/", credentials)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  signUp(credentials) {
    return axios
      .post(url + "sign-up/", credentials)
      .then((response) => response.data)
      .catch((err) => {
        console.log(err);
      });
  },
  // getSecretContent() {
  //   return axios.get(url + "secret-route/").then((response) => response.data);
  // },
};
