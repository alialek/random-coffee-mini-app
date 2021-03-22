import axios from "axios";

const instance = axios.create({
  baseURL: "https://pitchit.club/api/",
  timeout: 9000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    let token;
    try {
      token = localStorage.getItem("user_rc") || null;
    } catch {
      token = window.token || null;
    }
    if (config.method === "get") {
      //delete config.headers.common["Content-Type"];
    } else {
      config.headers.common["Content-Type"] = "application/json";
    }
    if (token) {
      config.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete config.headers.common["Authorization"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      if (error.response.status === 403) {
        axios.defaults.headers.common["Authorization"] =
          localStorage.getItem("user_rc") ?? window.token;
        console.log(error.config);
        return instance.request(error.config);
      }
      return Promise.reject(error);
    } catch (err) {}
    return Promise.reject(error);
  },
);

export default instance;
