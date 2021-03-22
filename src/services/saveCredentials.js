import axios from "../api/interceptor";
export const saveCredentials = (res) => {
  axios.defaults.headers.common["Authorization"] = res.data.token;
  try {
    localStorage.setItem("user_rc", res.data.token);
  } catch {
    window.token = res.data.token;
  }
};
