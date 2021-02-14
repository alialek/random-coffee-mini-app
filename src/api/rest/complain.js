import axios from "../interceptor";

export const complain = (id, text) => {
  return axios.post("complain", { id, text });
};
