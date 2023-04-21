import { toast } from "react-toastify";
import axios from "../../appConfig/httpHelper";
import { IS_AUTH, LOGIN } from "../constants";

const setUserDetails = (data) => ({
  type: LOGIN,
  payload: data,
});

const setAuth = (data) => ({
  type: IS_AUTH,
  payload: data,
});

export const login =
  ({ email, password }) =>
    (dispatch) => {
      axios
        .post("/signin", {
          email,
          password,
        })
        .then((res) => {
          if (res?.data?.user?.role === 1) {
            toast.warning(
              "Web CRM is for Admin's only. Please use the mobile app or the Main Web App Instead."
            );
          } else {
            toast.success(res?.data?.message);
            dispatch(setUserDetails(res?.data?.user));
            dispatch(setAuth(true));
            if (window !== undefined) {
              localStorage.setItem("jwt", JSON.stringify(res?.data?.token));
            }
            // window.location.replace("/admin")
          }
        })
        .catch((err) => toast.error(err?.response?.data?.error));
    };

export const logout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(setUserDetails(null));
    dispatch(setAuth(false));
    axios.get("/signout");
    toast.success("User Logged out");
    window.location.replace("/")
  };
};
