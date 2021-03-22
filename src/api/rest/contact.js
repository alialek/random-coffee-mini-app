import axios from "../interceptor";

export const contact = () => {
  return axios.post("contact");
};
