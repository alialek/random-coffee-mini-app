import axios from "../interceptor";

export const type = (type) => {
  return axios.post("type", { type });
};
