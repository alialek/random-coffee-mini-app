import axios from "../interceptor";

export const feedback = (feedback) => {
  return axios.post("feedback", { feedback });
};
